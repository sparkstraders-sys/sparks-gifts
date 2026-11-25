import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, productImages } from "@/db/schema";
import { requireAdmin } from "@/lib/adminAuth";
import { slugify } from "@/lib/utils";
import { eq } from "drizzle-orm";
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin(); if (error) return error;
  try {
    const b = await req.json();
    let slug = slugify(b.name);
    if ((await db.select().from(products).where(eq(products.slug, slug))).length) slug = `${slug}-${Date.now()}`;
    const [p] = await db.insert(products).values({ name: b.name, slug, brand: b.brand||null, description: b.description||null, sku: b.sku||null, costPrice: String(b.costPrice), sellPrice: String(b.sellPrice), discount: String(b.discount??0), stock: b.stock??0, categoryId: b.categoryId, isActive: b.isActive??true, isFeatured: b.isFeatured??false }).returning();
    if (b.images?.length) await db.insert(productImages).values(b.images.map((i:{url:string;sortOrder:number}) => ({ productId: p.id, url: i.url, sortOrder: i.sortOrder })));
    return NextResponse.json(p, { status: 201 });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
