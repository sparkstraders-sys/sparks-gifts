import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, productImages } from "@/db/schema";
import { requireAdmin } from "@/lib/adminAuth";
import { slugify } from "@/lib/utils";
import { eq, and, ne } from "drizzle-orm";

interface Props { params: Promise<{ id: string }> }

export async function GET(_: NextRequest, { params }: Props) {
  const { error } = await requireAdmin(); if (error) return error;
  const { id } = await params;
  const [p] = await db.select().from(products).where(eq(products.id, id));
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const imgs = await db.select().from(productImages).where(eq(productImages.productId, id));
  return NextResponse.json({ ...p, images: imgs });
}

export async function PUT(request: NextRequest, { params }: Props) {
  const { error } = await requireAdmin(); if (error) return error;
  const { id } = await params;
  try {
    const body = await request.json();
    const [existing] = await db.select().from(products).where(eq(products.id, id));
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    let slug = existing.slug;
    if (body.name && body.name !== existing.name) {
      slug = slugify(body.name);
      const conflict = await db.select().from(products).where(and(eq(products.slug, slug), ne(products.id, id)));
      if (conflict.length) slug = `${slug}-${Date.now()}`;
    }
    if (body.images) {
      await db.delete(productImages).where(eq(productImages.productId, id));
      if (body.images.length) {
        await db.insert(productImages).values(body.images.map((img: { url: string; altText?: string; sortOrder: number }) => ({ productId: id, url: img.url, altText: img.altText ?? null, sortOrder: img.sortOrder })));
      }
    }
    const [updated] = await db.update(products).set({
      name: body.name ?? existing.name, slug, brand: body.brand || null,
      description: body.description || null, sku: body.sku || null,
      costPrice: String(body.costPrice ?? existing.costPrice), sellPrice: String(body.sellPrice ?? existing.sellPrice),
      discount: String(body.discount ?? existing.discount), stock: body.stock ?? existing.stock,
      categoryId: body.categoryId ?? existing.categoryId, isActive: body.isActive ?? existing.isActive,
      updatedAt: new Date(),
    }).where(eq(products.id, id)).returning();
    return NextResponse.json(updated);
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed to update" }, { status: 500 }); }
}

export async function DELETE(_: NextRequest, { params }: Props) {
  const { error } = await requireAdmin(); if (error) return error;
  const { id } = await params;
  await db.delete(products).where(eq(products.id, id));
  return NextResponse.json({ success: true });
}
