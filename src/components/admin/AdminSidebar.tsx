"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tag, ShoppingBag, Settings, Store, Sparkles, FileText, Users, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";

export const nav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/custom-requests", label: "Custom Requests", icon: Sparkles },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/content", label: "Website Content", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/account", label: "My Account", icon: UserCog },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 bg-dark-900 text-white flex-col flex-shrink-0 hidden lg:flex">
      <div className="px-5 py-4 border-b border-white/10">
        <Image src="/logo-white.png" alt="Sparks Gifts" width={130} height={52} className="h-12 w-auto object-contain" />
        <div className="text-[9px] tracking-[0.3em] uppercase text-gold-400 mt-1">Admin Panel</div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}
              className={cn("flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-gold-500 text-white" : "text-dark-400 hover:text-white hover:bg-white/5"
              )}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/10">
        <Link href="/" target="_blank" className="flex items-center gap-2 px-3 py-2 text-xs text-dark-500 hover:text-dark-300 transition-colors">
          <Store className="w-3.5 h-3.5" /> View Store
        </Link>
      </div>
    </aside>
  );
}

export function AdminMobileNav() {
  const pathname = usePathname();
  return (
    <nav className="lg:hidden flex gap-1 overflow-x-auto bg-dark-900 px-3 py-2">
      {nav.map(item => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link key={item.href} href={item.href}
            className={cn("flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap", active ? "bg-gold-500 text-white" : "text-dark-300")}>
            <item.icon className="w-3.5 h-3.5" />{item.label}
          </Link>
        );
      })}
    </nav>
  );
}
