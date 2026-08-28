import { NextRequest, NextResponse } from "next/server";
import { getOrderByNumber } from "@/db/queries";
export async function GET(request: NextRequest) {
  const orderNumber = new URL(request.url).searchParams.get("order");
  if (!orderNumber) return NextResponse.json({ error: "Order number required" }, { status: 400 });
  try {
    const order = await getOrderByNumber(orderNumber);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ order });
  } catch { return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 }); }
}
