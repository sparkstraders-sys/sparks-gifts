import { NextRequest, NextResponse } from "next/server";
import { getSettingsMap, upsertSetting } from "@/db/queries";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET() {
  const { error } = await requireAdmin(); if (error) return error;
  const map = await getSettingsMap();
  return NextResponse.json(map);
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin(); if (error) return error;
  const body = await request.json();
  await Promise.all(Object.entries(body).map(([k, v]) => upsertSetting(k, String(v))));
  return NextResponse.json({ success: true });
}
