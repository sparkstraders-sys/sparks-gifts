import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
export default auth((req) => { if (req.nextUrl.pathname.startsWith("/admin") && req.nextUrl.pathname !== "/admin/login") { if (!req.auth || (req.auth.user as { role?: string })?.role !== "admin") return NextResponse.redirect(new URL("/admin/login", req.url)); } return NextResponse.next(); });
export const config = { matcher: ["/admin/:path*"] };
