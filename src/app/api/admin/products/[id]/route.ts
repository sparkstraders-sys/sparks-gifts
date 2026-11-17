import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, productImages } from "@/db/schema";
import { requireAdmin } from "@/lib/adminAuth";
import { slugify } from "@/lib/utils";
import { eq, and, ne } from "drizzle-orm";
interface P { params: Promise<{ id: string }> }
export async function PUT(req: NextRequest, { params }: P) {
  const { error } = await requireAdmin(); if (error) return error;
  const { id } = await params; const b = await req.json();
  const [ex] = await db.select().from(products).where(eq(products.id, id));
  if (!ex) return NextResponse.json({ error: "Not found" }, { status: 404 });
  let slug = ex.slug;
  if (b.name && b.name !== ex.name) { slug = slugify(b.name); if ((await db.select().from(products).where(and(eq(products.slug, slug), ne(products.id, id)))).length) slug = `${slug}-${Date.now()}`; }
  if (b.images !== undefined) { await db.delete(productImages).where(eq(productImages.productId, id)); if (b.images.length) await db.insert(productImages).values(b.images.map((i:{url:string;sortOrder:number}) => ({ productId: id, url: i.url, sortOrder: i.sortOrder }))); }
  const [u] = await db.update(products).set({ name: b.name??ex.name, slug, brand: b.brand||null, description: b.description||null, sku: b.sku||null, costPrice: String(b.costPrice??ex.costPrice), sellPrice: String(b.sellPrice??ex.sellPrice), discount: String(b.discount??ex.discount), stock: b.stock??ex.stock, categoryId: b.categoryId??ex.categoryId, isActive: b.isActive??ex.isActive, isFeatured: b.isFeatured??ex.isFeatured, updatedAt: new Date() }).where(eq(products.id, id)).returning();
  return NextResponse.json(u);
}
export async function DELETE(_: NextRequest, { params }: P) {
  const { error } = await requireAdmin(); if (error) return error;
  const { id } = await params;
  await db.delete(products).where(eq(products.id, id));
  return NextResponse.json({ success: true });
}
