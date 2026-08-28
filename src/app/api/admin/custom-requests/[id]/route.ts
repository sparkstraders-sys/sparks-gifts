import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { customRequests } from "@/db/schema";
import { requireAdmin } from "@/lib/adminAuth";
import { eq } from "drizzle-orm";

interface Props { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Props) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const { status, adminNotes } = await request.json();
  const [updated] = await db.update(customRequests)
    .set({ status, adminNotes, updatedAt: new Date() })
    .where(eq(customRequests.id, id))
    .returning();
  return NextResponse.json(updated);
}
