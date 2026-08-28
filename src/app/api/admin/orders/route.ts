import { NextRequest, NextResponse } from "next/server";
import { getAdminOrders } from "@/db/queries";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin(); if (error) return error;
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? undefined;
  const page = parseInt(searchParams.get("page") ?? "1");
  const result = await getAdminOrders({ status, limit: 20, offset: (page - 1) * 20 });
  return NextResponse.json({ ...result, page, pages: Math.ceil(result.total / 20) });
}
