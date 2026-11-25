import Link from "next/link";
import Image from "next/image";
import type { Cms, Site } from "@/lib/content";
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";

export default function Footer({ cms, site }: { cms: Cms; site: Site }) {
  const waDigits = (n: string) => n.replace(/\D/g, "");
  return (
    <footer className="bg-navy-900 text-white">
      {/* Gold top line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Image src="/logo-white.png" alt="Sparks Gifts" width={220} height={167}
              className="h-16 w-auto object-contain mb-4" />
            <p className="text-dark-300 text-sm leading-relaxed mb-5">
              {cms.footer.about}
            </p>
            <div className="flex gap-3">
              {site.instagram && <a href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full border border-dark-600 flex items-center justify-center hover:border-gold-500 hover:text-gold-500 transition-colors">
                <Instagram className="w-3.5 h-3.5" />
              </a>}
              {site.facebook && <a href={site.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full border border-dark-600 flex items-center justify-center hover:border-gold-500 hover:text-gold-500 transition-colors">
                <Facebook className="w-3.5 h-3.5" />
              </a>}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold-400 mb-5">Shop</h4>
            <ul className="space-y-3">
              {[{h:"/shop",l:"All Gifts"},{h:"/categories",l:"By Occasion"},{h:"/shop?sort=price-asc",l:"Budget Gifts"},{h:"/custom-gift",l:"Custom Gift ✨"},{h:"/track",l:"Track Order"}].map(i => (
                <li key={i.h}><Link href={i.h} className="text-sm text-dark-300 hover:text-gold-400 transition-colors">{i.l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Occasions */}
          {cms.footer.showOccasions && (
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold-400 mb-5">Occasions</h4>
            <ul className="space-y-3">
              {cms.footer.occasions.map(o => (
                <li key={o}><Link href="/shop" className="text-sm text-dark-300 hover:text-gold-400 transition-colors">{o}</Link></li>
              ))}
            </ul>
          </div>
          )}

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold-400 mb-5">Contact</h4>
            <ul className="space-y-4">
              <li>
                <div className="text-[10px] text-dark-400 uppercase tracking-wider mb-1.5">WhatsApp / Call</div>
                <a href={`https://wa.me/${waDigits(site.whatsapp)}`} className="flex items-center gap-2 text-sm text-dark-200 hover:text-gold-400 transition-colors">
                  <Phone className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" /> {site.phone}
                </a>
                <a href={`https://wa.me/${waDigits(cms.contact.whatsapp2)}`} className="flex items-center gap-2 text-sm text-dark-200 hover:text-gold-400 transition-colors mt-1">
                  <Phone className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" /> {cms.contact.phone2}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
                <a href={`mailto:${site.email}`} className="text-sm text-dark-300 hover:text-gold-400">{site.email}</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
                <span className="text-sm text-dark-300">{site.address}</span>
              </li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              {["COD","JazzCash","EasyPaisa","Raast"].map(m => (
                <span key={m} className="text-[9px] px-2.5 py-1 rounded-full border border-dark-600 text-dark-400 font-medium tracking-wider">{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-dark-700" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-dark-500 text-xs tracking-wider">© {new Date().getFullYear()} {cms.footer.copyright}</p>
        <div className="flex flex-wrap gap-4">
          {cms.pages.filter(p => p.showInFooter).map(p => (
            <Link key={p.slug} href={`/pages/${p.slug}`} className="text-dark-500 text-xs hover:text-gold-400 transition-colors">{p.title}</Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
