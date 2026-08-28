import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { requireAdmin } from "@/lib/adminAuth";
import { eq } from "drizzle-orm";
interface Props { params: Promise<{ id: string }> }
export async function PATCH(request: NextRequest, { params }: Props) {
  const { error } = await requireAdmin(); if (error) return error;
  const { id } = await params; const { isActive } = await request.json();
  const [p] = await db.update(products).set({ isActive, updatedAt: new Date() }).where(eq(products.id, id)).returning();
  return NextResponse.json(p);
}
