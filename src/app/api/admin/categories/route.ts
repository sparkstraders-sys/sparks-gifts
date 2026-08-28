import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { requireAdmin } from "@/lib/adminAuth";
import { slugify } from "@/lib/utils";
import { eq, asc, sql } from "drizzle-orm";

export async function GET() {
  const { error } = await requireAdmin(); if (error) return error;
  const cats = await db.select().from(categories).orderBy(asc(categories.sortOrder));
  const counts = await db.select({ categoryId: products.categoryId, count: sql<number>`count(*)::int` }).from(products).groupBy(products.categoryId);
  const countMap = Object.fromEntries(counts.map((c) => [c.categoryId, c.count]));
  return NextResponse.json(cats.map((c) => ({ ...c, _count: { products: countMap[c.id] ?? 0 } })));
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin(); if (error) return error;
  try {
    const body = await request.json();
    if (!body.name) return NextResponse.json({ error: "Name required" }, { status: 400 });
    let slug = slugify(body.name);
    const existing = await db.select().from(categories).where(eq(categories.slug, slug));
    if (existing.length) slug = `${slug}-${Date.now()}`;
    const [cat] = await db.insert(categories).values({ name: body.name, slug, description: body.description || null, imageUrl: body.imageUrl || null, sortOrder: body.sortOrder ?? 0, isActive: body.isActive ?? true }).returning();
    return NextResponse.json(cat, { status: 201 });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
