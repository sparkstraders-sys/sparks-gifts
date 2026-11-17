import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getAdminByEmail } from "@/db/queries";
export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [Credentials({ name: "credentials", credentials: { email: {}, password: {} }, async authorize(credentials) { if (!credentials?.email || !credentials?.password) return null; try { const admin = await getAdminByEmail(credentials.email as string); if (!admin) return null; const ok = await bcrypt.compare(credentials.password as string, admin.password); if (!ok) return null; return { id: admin.id, email: admin.email, name: admin.name, role: "admin" }; } catch { return null; } } })],
  callbacks: { async jwt({ token, user }) { if (user) token.role = (user as { role?: string }).role; return token; }, async session({ session, token }) { if (session.user) (session.user as { role?: string }).role = token.role as string; return session; } },
});
