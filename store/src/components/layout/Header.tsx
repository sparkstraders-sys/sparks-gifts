"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

export default function Header({ announcement }: { announcement?: { enabled: boolean; text: string } }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const totalItems = useCartStore(s => s.getTotalItems());

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const nav = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/categories", label: "Occasions" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/track", label: "Track Order" },
  ];

  return (
    <>
      {/* Topbar */}
      {announcement?.enabled && announcement.text && (
        <div className="bg-dark-900 text-white text-center text-[11px] py-2 px-3 tracking-[0.15em] font-medium">
          {announcement.text}
        </div>
      )}

      {/* Main header */}
      <header className={cn(
        "sticky top-0 z-50 bg-cream-50/90 backdrop-blur-xl transition-all duration-300",
        scrolled ? "shadow-[0_10px_30px_-12px_rgba(13,13,15,.2)]" : "shadow-[0_1px_0_rgba(13,13,15,.06)]"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image src="/logo.png" alt="Sparks Gifts" width={240} height={182}
                className="h-14 lg:h-[72px] w-auto object-contain" priority />
            </Link>

            {/* Nav */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {nav.map(l => (
                <Link key={l.href} href={l.href}
                  className={cn("text-[11px] font-semibold tracking-widest uppercase transition-colors duration-200",
                    pathname === l.href ? "text-gold-500" : "text-dark-700 hover:text-gold-500"
                  )}>
                  {l.label}
                </Link>
              ))}
              <Link href="/custom-gift"
                className="text-[11px] font-semibold tracking-widest uppercase text-gold-500 border border-gold-300 rounded-full px-4 py-1.5 hover:bg-gold-500 hover:text-white transition-all duration-200">
                ✨ Custom Gift
              </Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-2">
              <Link href="/search" className="p-2 text-dark-600 hover:text-gold-500 transition-colors">
                <Search className="w-5 h-5" />
              </Link>
              <Link href="/cart" className="relative p-2 text-dark-600 hover:text-gold-500 transition-colors">
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>
              <a href="https://wa.me/923001432502" target="_blank" rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-dark-900 text-white rounded-full text-[10px] font-semibold tracking-wider hover:bg-gold-500 transition-colors ml-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
              <button className="lg:hidden p-2 text-dark-600" onClick={() => setOpen(!open)}>
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        {open && (
          <div className="lg:hidden border-t border-dark-100 bg-cream-50">
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col">
              {nav.map(l => (
                <Link key={l.href} href={l.href}
                  className={cn("px-2 py-3 text-sm font-semibold tracking-wider uppercase border-b border-dark-50 transition-colors",
                    pathname === l.href ? "text-gold-500" : "text-dark-700 hover:text-gold-500"
                  )}>
                  {l.label}
                </Link>
              ))}
              <Link href="/custom-gift" className="mt-3 px-4 py-3 rounded-full bg-gold-500 text-white text-sm font-semibold text-center tracking-wider">
                ✨ Custom Gift Request
              </Link>
              <a href="https://wa.me/923001432502" target="_blank" rel="noopener noreferrer"
                className="mt-2 px-4 py-3 rounded-full bg-dark-900 text-white text-sm font-semibold text-center tracking-wider">
                📱 WhatsApp: 0300-143-2502
              </a>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
