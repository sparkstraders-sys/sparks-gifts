import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { getOrderById } from "@/db/queries";
import { requireAdmin } from "@/lib/adminAuth";
import { eq } from "drizzle-orm";

interface Props { params: Promise<{ id: string }> }

export async function GET(_: NextRequest, { params }: Props) {
  const { error } = await requireAdmin(); if (error) return error;
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const { error } = await requireAdmin(); if (error) return error;
  const { id } = await params;
  const { status, notes } = await request.json();
  const valid = ["PENDING","PROCESSING","GIFT_WRAPPED","SHIPPED","DELIVERED","CANCELLED"];
  if (status && !valid.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (status) updates.status = status;
  if (notes !== undefined) updates.notes = notes;
  const [updated] = await db.update(orders).set(updates as never).where(eq(orders.id, id)).returning();
  return NextResponse.json(updated);
}
