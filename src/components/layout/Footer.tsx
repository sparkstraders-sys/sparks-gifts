import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image src="/logo-white.png" alt="Sparks Gifts" width={150} height={60} className="h-11 w-auto object-contain" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Thoughtful Gifts, Delivered with Love.<br />
              You choose the gift. You write the message. We deliver the surprise.
            </p>
            <div className="flex flex-wrap gap-2">
              {["COD", "JazzCash", "EasyPaisa", "Raast"].map((m) => (
                <span key={m} className="text-[10px] px-2 py-1 bg-white/10 text-gray-300 font-medium tracking-wider">{m}</span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-medium tracking-widest uppercase text-gold-400 mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[{href:"/shop",label:"Shop All Gifts"},{href:"/categories",label:"Categories"},{href:"/about",label:"About Us"},{href:"/track",label:"Track Order"},{href:"/contact",label:"Contact"}].map((l) => (
                <li key={l.href}><Link href={l.href} className="text-sm text-gray-400 hover:text-gold-400 transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Occasions */}
          <div>
            <h4 className="text-xs font-medium tracking-widest uppercase text-gold-400 mb-5">Occasions</h4>
            <ul className="space-y-3">
              {["Birthdays","Anniversaries","Eid Gifts","Weddings","Baby Showers","Corporate Gifts"].map((o) => (
                <li key={o}><Link href="/shop" className="text-sm text-gray-400 hover:text-gold-400 transition-colors">{o}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-medium tracking-widest uppercase text-gold-400 mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li>
                <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">WhatsApp / Call</div>
                <a href="https://wa.me/923001432502" className="flex items-center gap-2 text-sm text-gray-300 hover:text-green-400 transition-colors">
                  <Phone className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" /> 0300-143-2502
                </a>
                <a href="https://wa.me/923001432007" className="flex items-center gap-2 text-sm text-gray-300 hover:text-green-400 transition-colors mt-1">
                  <Phone className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" /> 0300-143-2007
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
                <a href="mailto:hello@sparksgifts.pk" className="text-sm text-gray-400 hover:text-gold-400 transition-colors">hello@sparksgifts.pk</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-gold-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">Pakistan-wide Delivery</span>
              </li>
              <li className="text-xs text-gray-500">Mon–Sat · 10 AM – 8 PM</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="gold-divider opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-gray-500 text-xs tracking-wider">© {year} Sparks Gifts · Thoughtful Gifts, Delivered with Love.</p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="text-gray-500 text-xs hover:text-gold-400 transition-colors">Privacy</Link>
          <Link href="/terms" className="text-gray-500 text-xs hover:text-gold-400 transition-colors">Terms</Link>
          <Link href="/track" className="text-gray-500 text-xs hover:text-gold-400 transition-colors">Track Order</Link>
        </div>
      </div>
    </footer>
  );
}
