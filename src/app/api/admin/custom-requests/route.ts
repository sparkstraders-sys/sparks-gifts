import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { customRequests } from "@/db/schema";
import { requireAdmin } from "@/lib/adminAuth";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const requests = await db.select().from(customRequests).orderBy(desc(customRequests.createdAt));
  return NextResponse.json(requests);
}
