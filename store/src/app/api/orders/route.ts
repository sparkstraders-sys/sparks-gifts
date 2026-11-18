import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, orders, orderItems } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { generateOrderNumber } from "@/lib/utils";
import { z } from "zod";
const schema = z.object({
  senderName: z.string().min(2), senderPhone: z.string().min(10), senderEmail: z.string().email().optional().or(z.literal("")),
  recipientName: z.string().min(2), recipientPhone: z.string().min(10), recipientCity: z.string().min(2), recipientAddress: z.string().min(5),
  giftMessage: z.string().optional(), giftWrapping: z.boolean(), orderType: z.enum(["SELF","GIFT"]).default("GIFT"),
  items: z.array(z.object({ productId: z.string(), name: z.string(), price: z.number(), quantity: z.number().int().min(1), imageUrl: z.string().optional() })).min(1),
  subtotal: z.number(), deliveryCharge: z.number(), wrappingCharge: z.number(), total: z.number(), paymentMethod: z.string().default("COD"),
});
export async function POST(req: NextRequest) {
  try {
    const data = schema.parse(await req.json());
    const prods = await db.select().from(products).where(inArray(products.id, data.items.map(i => i.productId)));
    if (prods.length !== data.items.length) return NextResponse.json({ error: "Some products unavailable" }, { status: 400 });
    for (const item of data.items) { const p = prods.find(x => x.id === item.productId); if (!p || p.stock < item.quantity) return NextResponse.json({ error: `Insufficient stock` }, { status: 400 }); }
    const orderNumber = generateOrderNumber();
    const [order] = await db.insert(orders).values({ orderNumber, orderType: data.orderType, senderName: data.senderName, senderPhone: data.senderPhone, senderEmail: data.senderEmail || null, recipientName: data.recipientName, recipientPhone: data.recipientPhone, recipientCity: data.recipientCity, recipientAddress: data.recipientAddress, giftMessage: data.giftMessage || null, giftWrapping: data.giftWrapping, deliveryCharge: String(data.deliveryCharge), wrappingCharge: String(data.wrappingCharge), subtotal: String(data.subtotal), total: String(data.total), paymentMethod: data.paymentMethod }).returning();
    await db.insert(orderItems).values(data.items.map(item => { const p = prods.find(x => x.id === item.productId)!; return { orderId: order.id, productId: item.productId, name: item.name, price: String(item.price), costPrice: String(p.costPrice), quantity: item.quantity, imageUrl: item.imageUrl ?? null }; }));
    for (const item of data.items) { const p = prods.find(x => x.id === item.productId)!; await db.update(products).set({ stock: p.stock - item.quantity }).where(eq(products.id, item.productId)); }
    return NextResponse.json({ orderNumber: order.orderNumber }, { status: 201 });
  } catch (e) { if (e instanceof z.ZodError) return NextResponse.json({ error: "Invalid data" }, { status: 422 }); console.error(e); return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
