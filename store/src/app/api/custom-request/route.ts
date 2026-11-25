import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { customRequests } from "@/db/schema";
import { z } from "zod";

const ONLINE_METHODS = ["JAZZCASH", "EASYPAISA", "RAAST", "BANK_TRANSFER"] as const;

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  city: z.string().min(2),
  description: z.string().min(10),
  budget: z.string().optional(),
  occasion: z.string().optional(),
  isGift: z.boolean().default(false),
  recipientName: z.string().optional(),
  paymentMethod: z.string().optional(),
  paymentReference: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const d = schema.parse(await req.json());

    let paymentMethod = "COD";
    let paymentStatus = "NOT_REQUIRED";
    let paymentReference: string | null = null;

    if (d.isGift) {
      // Gifts for someone else: sender pays online, COD is never allowed.
      if (!d.recipientName || d.recipientName.trim().length < 2) {
        return NextResponse.json({ error: "Recipient name is required for gifts" }, { status: 422 });
      }
      if (!d.paymentMethod || !(ONLINE_METHODS as readonly string[]).includes(d.paymentMethod)) {
        return NextResponse.json({ error: "Online payment method required for gifts" }, { status: 422 });
      }
      paymentMethod = d.paymentMethod;
      paymentStatus = d.paymentReference?.trim() ? "AWAITING_VERIFICATION" : "AWAITING_PAYMENT";
      paymentReference = d.paymentReference?.trim() || null;
    }

    await db.insert(customRequests).values({
      name: d.name, phone: d.phone, city: d.city, description: d.description,
      budget: d.budget || null, occasion: d.occasion || null,
      isGift: d.isGift, recipientName: d.recipientName || null,
      paymentMethod, paymentStatus, paymentReference, status: "NEW",
    });
    return NextResponse.json({ success: true, paymentMethod, paymentStatus }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: "Invalid data" }, { status: 422 });
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
