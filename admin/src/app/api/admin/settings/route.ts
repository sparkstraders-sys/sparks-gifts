import{NextRequest,NextResponse}from"next/server";import{getSettingsMap,upsertSetting}from"@/db/queries";import{requireAdmin}from"@/lib/adminAuth";
export async function GET(){const{error}=await requireAdmin();if(error)return error;return NextResponse.json(await getSettingsMap());}
export async function POST(req:NextRequest){const{error}=await requireAdmin();if(error)return error;const b=await req.json();await Promise.all(Object.entries(b).map(([k,v])=>upsertSetting(k,String(v))));return NextResponse.json({success:true});}
