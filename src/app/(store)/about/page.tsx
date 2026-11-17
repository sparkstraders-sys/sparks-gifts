import { Metadata } from "next";
import Link from "next/link";
import { getCms, getSite } from "@/lib/content";
import { ArrowRight, Gift, MapPin, Heart, Package } from "lucide-react";
export const metadata: Metadata = { title: "About Us" };
export const dynamic = "force-dynamic";
const HL_ICONS = [Gift, Heart, Package, MapPin];
export default async function AboutPage() {
  const cms = await getCms();
  const A = cms.about;
  const site = await getSite();
  return (
    <div>
      <section className="bg-dark-900 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="text-gold-400 text-[10px] font-bold tracking-[0.4em] uppercase mb-4">{A.eyebrow}</div>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-white mb-6">{A.title1}<span className="text-gold-400 block">{A.title2}</span></h1>
          <p className="text-dark-300 text-lg leading-relaxed max-w-2xl mx-auto mb-8">{A.intro}</p>
          <div className="inline-block bg-white/5 border border-white/10 px-6 py-4">
            <p className="text-gold-400 font-serif text-lg italic">&ldquo;{A.quote}&rdquo;</p>
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14"><div className="text-gold-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-2">Simple Process</div><h2 className="font-serif text-3xl font-bold text-dark-900">{A.stepsTitle}</h2></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {A.steps.map((s, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 bg-dark-50 border-2 border-dark-100 group-hover:border-gold-500 group-hover:bg-gold-50 transition-all duration-300 flex items-center justify-center mx-auto mb-4 text-2xl">{s.icon}</div>
                <div className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-1">Step {String(i + 1).padStart(2, "0")}</div>
                <h3 className="font-bold text-dark-800 text-sm mb-1">{s.title}</h3>
                <p className="text-xs text-dark-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-dark-50 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-gold-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-3">{A.promiseEyebrow}</div>
              <h2 className="font-serif text-3xl font-bold text-dark-900 mb-5">{A.promiseTitle}</h2>
              <p className="text-dark-500 text-sm leading-relaxed mb-4">{A.promiseText}</p>
              <p className="text-dark-800 font-semibold text-sm italic border-l-2 border-gold-500 pl-4 mb-6">{A.promiseQuote}</p>
              <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3 bg-dark-900 text-white text-[11px] font-bold tracking-widest uppercase hover:bg-gold-500 transition-colors">Shop Gifts <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="space-y-4">
              {A.highlights.map((item, idx) => { const Icon = HL_ICONS[idx % 4]; return (
                <div key={idx} className="flex items-start gap-4 p-4 bg-white border border-dark-100 hover:border-gold-200 transition-colors">
                  <div className="w-9 h-9 bg-gold-50 flex items-center justify-center flex-shrink-0"><Icon className="w-4 h-4 text-gold-500" /></div>
                  <div><h3 className="text-sm font-bold text-dark-800 mb-0.5">{item.title}</h3><p className="text-xs text-dark-400 leading-relaxed">{item.desc}</p></div>
                </div>
              ); })}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-dark-900 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div><div className="text-gold-400 text-[10px] font-bold tracking-widest uppercase mb-2">Payment Methods</div><div className="text-white text-sm font-bold">Cash on Delivery</div><div className="text-dark-400 text-xs mt-1">JazzCash · EasyPaisa · Raast</div></div>
          <div><div className="text-gold-400 text-[10px] font-bold tracking-widest uppercase mb-2">Delivery</div><div className="text-white text-sm font-bold">Pakistan-wide</div><div className="text-dark-400 text-xs mt-1">All major cities & towns</div></div>
          <div><div className="text-gold-400 text-[10px] font-bold tracking-widest uppercase mb-2">Contact Us</div><div className="text-white text-sm font-bold">{site.phone}</div><div className="text-dark-400 text-xs mt-1">{cms.contact.phone2}</div></div>
        </div>
      </section>
    </div>
  );
}
