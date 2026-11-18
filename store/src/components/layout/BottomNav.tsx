"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, ShoppingBag, PackageSearch } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();
  const total = useCartStore(s => s.getTotalItems());
  const items = [
    { href: "/", label: "Home", icon: Home },
    { href: "/shop", label: "Shop", icon: Store },
    { href: "/cart", label: "Cart", icon: ShoppingBag },
    { href: "/track", label: "Track", icon: PackageSearch },
  ];
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-dark-100 bottom-nav" aria-label="Quick navigation">
      <div className="grid grid-cols-4">
        {items.map(i => {
          const active = i.href === "/" ? pathname === "/" : pathname.startsWith(i.href);
          return (
            <Link key={i.href} href={i.href} className={cn("relative flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold tracking-wider", active ? "text-gold-500" : "text-dark-500")}>
              <i.icon className="w-5 h-5" />
              {i.label}
              {i.href === "/cart" && total > 0 && <span className="absolute top-1 left-1/2 ml-2 w-4 h-4 rounded-full bg-gold-500 text-white text-[9px] flex items-center justify-center">{total > 9 ? "9+" : total}</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
