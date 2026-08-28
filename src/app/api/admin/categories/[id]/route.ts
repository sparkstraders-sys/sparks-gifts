import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { requireAdmin } from "@/lib/adminAuth";
import { slugify } from "@/lib/utils";
import { eq, and, ne, sql } from "drizzle-orm";

interface Props { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Props) {
  const { error } = await requireAdmin(); if (error) return error;
  const { id } = await params;
  try {
    const body = await request.json();
    const [existing] = await db.select().from(categories).where(eq(categories.id, id));
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    let slug = existing.slug;
    if (body.name && body.name !== existing.name) {
      slug = slugify(body.name);
      const conflict = await db.select().from(categories).where(and(eq(categories.slug, slug), ne(categories.id, id)));
      if (conflict.length) slug = `${slug}-${Date.now()}`;
    }
    const [updated] = await db.update(categories).set({
      name: body.name ?? existing.name, slug,
      description: body.description !== undefined ? (body.description || null) : existing.description,
      imageUrl: body.imageUrl !== undefined ? (body.imageUrl || null) : existing.imageUrl,
      sortOrder: body.sortOrder ?? existing.sortOrder, isActive: body.isActive ?? existing.isActive, updatedAt: new Date(),
    }).where(eq(categories.id, id)).returning();
    return NextResponse.json(updated);
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function DELETE(_: NextRequest, { params }: Props) {
  const { error } = await requireAdmin(); if (error) return error;
  const { id } = await params;
  const [count] = await db.select({ count: sql<number>`count(*)::int` }).from(products).where(eq(products.categoryId, id));
  if (count.count > 0) return NextResponse.json({ error: `Cannot delete: ${count.count} product(s) use this category.` }, { status: 400 });
  await db.delete(categories).where(eq(categories.id, id));
  return NextResponse.json({ success: true });
}
