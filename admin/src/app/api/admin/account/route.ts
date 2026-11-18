import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { requireAdmin } from "@/lib/adminAuth";
import { getAdminByEmail } from "@/db/queries";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "New password must be at least 8 characters").optional(),
  newEmail: z.string().email().optional(),
  name: z.string().min(2).optional(),
});

export async function POST(req: NextRequest) {
  const { error, session } = await requireAdmin();
  if (error || !session) return error!;
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 422 });
  const { currentPassword, newPassword, newEmail, name } = parsed.data;
  const admin = await getAdminByEmail(session.user?.email ?? "");
  if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  if (!(await bcrypt.compare(currentPassword, admin.password))) return NextResponse.json({ error: "Current password is wrong" }, { status: 403 });
  const update: Partial<typeof admins.$inferInsert> = { updatedAt: new Date() };
  if (newPassword) update.password = await bcrypt.hash(newPassword, 12);
  if (newEmail) update.email = newEmail.toLowerCase();
  if (name) update.name = name;
  await db.update(admins).set(update).where(eq(admins.id, admin.id));
  return NextResponse.json({ success: true, relogin: !!(newPassword || newEmail) });
}
