import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { customRequests } from "@/db/schema";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  city: z.string().min(2),
  description: z.string().min(10),
  budget: z.string().optional(),
  occasion: z.string().optional(),
  isGift: z.boolean().default(false),
  recipientName: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    await db.insert(customRequests).values({
      name: data.name,
      phone: data.phone,
      city: data.city,
      description: data.description,
      budget: data.budget || null,
      occasion: data.occasion || null,
      isGift: data.isGift,
      recipientName: data.recipientName || null,
      status: "NEW",
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: "Invalid data" }, { status: 422 });
    console.error(e);
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }
}
