"use client";

import { signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";

interface Props {
  user?: { name?: string | null; email?: string | null };
}

export default function AdminHeader({ user }: Props) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <h1 className="text-sm font-medium text-gray-500 tracking-wider uppercase">Admin Panel</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="w-4 h-4 text-gray-400" />
          <span>{user?.name ?? user?.email ?? "Admin"}</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>
    </header>
  );
}
