import{NextResponse}from"next/server";import{db}from"@/db";import{customRequests}from"@/db/schema";import{requireAdmin}from"@/lib/adminAuth";import{desc}from"drizzle-orm";
export async function GET(){const{error}=await requireAdmin();if(error)return error;return NextResponse.json(await db.select().from(customRequests).orderBy(desc(customRequests.createdAt)));}
