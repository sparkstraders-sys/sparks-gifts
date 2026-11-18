import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/adminAuth";
import { getCms, mergeCms, DEFAULT_CMS } from "@/lib/content";
import { upsertSetting } from "@/db/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  return NextResponse.json(await getCms());
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  const clean = mergeCms(DEFAULT_CMS, body); // drops unknown keys, fixes wrong types
  // page slugs must be simple and unique
  const seen = new Set<string>();
  clean.pages = clean.pages
    .map(p => ({ ...p, slug: p.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/^-+|-+$/g, "") }))
    .filter(p => p.slug && !seen.has(p.slug) && seen.add(p.slug));
  const json = JSON.stringify(clean);
  if (json.length > 200_000) return NextResponse.json({ error: "Content too large" }, { status: 413 });
  await upsertSetting("cms", json);
  revalidatePath("/", "layout");
  return NextResponse.json({ success: true });
}

// Reset everything back to the built-in defaults
export async function DELETE() {
  const { error } = await requireAdmin();
  if (error) return error;
  await upsertSetting("cms", JSON.stringify(DEFAULT_CMS));
  revalidatePath("/", "layout");
  return NextResponse.json({ success: true });
}
