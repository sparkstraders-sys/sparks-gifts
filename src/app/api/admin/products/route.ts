import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, productImages } from "@/db/schema";
import { requireAdmin } from "@/lib/adminAuth";
import { slugify } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1), brand: z.string().optional(), description: z.string().optional(),
  sku: z.string().optional(), costPrice: z.number().min(0), sellPrice: z.number().min(0),
  discount: z.number().min(0).max(100).default(0), stock: z.number().int().min(0).default(0),
  categoryId: z.string(), isActive: z.boolean().default(true),
  images: z.array(z.object({ url: z.string(), altText: z.string().optional(), sortOrder: z.number() })).optional(),
});

export async function GET() {
  const { error } = await requireAdmin(); if (error) return error;
  const prods = await db.select().from(products);
  return NextResponse.json(prods);
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin(); if (error) return error;
  try {
    const body = await request.json(); const data = schema.parse(body);
    let slug = slugify(data.name);
    const existing = await db.select().from(products).where(eq(products.slug, slug));
    if (existing.length) slug = `${slug}-${Date.now()}`;
    const [product] = await db.insert(products).values({
      name: data.name, slug, brand: data.brand || null, description: data.description || null,
      sku: data.sku || null, costPrice: String(data.costPrice), sellPrice: String(data.sellPrice),
      discount: String(data.discount), stock: data.stock, categoryId: data.categoryId, isActive: data.isActive,
    }).returning();
    if (data.images?.length) {
      await db.insert(productImages).values(data.images.map((img) => ({ productId: product.id, url: img.url, altText: img.altText ?? null, sortOrder: img.sortOrder })));
    }
    return NextResponse.json(product, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: "Validation error" }, { status: 422 });
    console.error(e); return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
