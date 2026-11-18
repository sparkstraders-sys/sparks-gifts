import { Metadata } from "next";
import { getCms, getSite } from "@/lib/content";
import { Phone, Mail, MessageCircle, MapPin, Clock } from "lucide-react";
export const metadata: Metadata = { title: "Contact Us" };
export const dynamic = "force-dynamic";
export default async function ContactPage() {
  const cms = await getCms();
  const site = await getSite();
  const faqs = cms.faqs;
  const wa1 = site.whatsapp, wa2 = cms.contact.whatsapp2;
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="text-center mb-12"><div className="text-gold-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-2">Get in Touch</div><h1 className="font-serif text-3xl font-bold text-dark-900 mb-3">Contact Us</h1><p className="text-dark-400 text-sm max-w-md mx-auto">{cms.contact.intro}</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="bg-white border border-dark-100 rounded-2xl p-6">
            <h2 className="font-serif text-xl font-bold text-dark-800 mb-6">Reach Us</h2>
            <div className="space-y-4">
              <div><div className="text-[10px] font-bold tracking-wider uppercase text-dark-400 mb-2">WhatsApp (Fastest)</div>
                <a href={`https://wa.me/${wa1}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 border border-dark-100 rounded-2xl hover:border-green-300 hover:bg-green-50 transition-all group mb-2">
                  <div className="w-9 h-9 bg-green-50 flex items-center justify-center"><MessageCircle className="w-4 h-4 text-green-600" /></div>
                  <div><div className="text-sm font-bold text-dark-800 group-hover:text-green-700">{site.phone}</div><div className="text-xs text-dark-400">Tap to open WhatsApp</div></div>
                </a>
                <a href={`https://wa.me/${wa2}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 border border-dark-100 rounded-2xl hover:border-green-300 hover:bg-green-50 transition-all group">
                  <div className="w-9 h-9 bg-green-50 flex items-center justify-center"><MessageCircle className="w-4 h-4 text-green-600" /></div>
                  <div><div className="text-sm font-bold text-dark-800 group-hover:text-green-700">{cms.contact.phone2}</div><div className="text-xs text-dark-400">Tap to open WhatsApp</div></div>
                </a>
              </div>
              <a href={`tel:+${wa1}`} className="flex items-center gap-3 p-3 border border-dark-100 rounded-2xl hover:border-gold-300 hover:bg-gold-50 transition-all group">
                <div className="w-9 h-9 bg-gold-50 flex items-center justify-center"><Phone className="w-4 h-4 text-gold-500" /></div>
                <div><div className="text-sm font-bold text-dark-800">{site.phone}</div><div className="text-xs text-dark-400">{cms.contact.hours}</div></div>
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center gap-3 p-3 border border-dark-100 rounded-2xl hover:border-gold-300 hover:bg-gold-50 transition-all group">
                <div className="w-9 h-9 bg-gold-50 flex items-center justify-center"><Mail className="w-4 h-4 text-gold-500" /></div>
                <div><div className="text-sm font-bold text-dark-800 group-hover:text-gold-600">{site.email}</div><div className="text-xs text-dark-400">Response within 24 hours</div></div>
              </a>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-dark-50 border border-dark-100 rounded-2xl"><div className="flex items-center gap-2 mb-1"><Clock className="w-3.5 h-3.5 text-dark-400" /><span className="text-[10px] uppercase tracking-wider text-dark-400 font-bold">Hours</span></div><div className="text-xs font-bold text-dark-800">{cms.contact.hours}</div></div>
                <div className="p-3 bg-dark-50 border border-dark-100 rounded-2xl"><div className="flex items-center gap-2 mb-1"><MapPin className="w-3.5 h-3.5 text-dark-400" /><span className="text-[10px] uppercase tracking-wider text-dark-400 font-bold">Delivery</span></div><div className="text-xs font-bold text-dark-800">{cms.contact.deliveryNote}</div></div>
              </div>
              <div className="p-4 bg-dark-50 border border-dark-100 rounded-2xl"><div className="text-[10px] font-bold uppercase tracking-wider text-dark-500 mb-2">Payment Methods</div><div className="flex flex-wrap gap-2">{["COD","JazzCash","EasyPaisa","Raast"].map(m => <span key={m} className="text-[10px] px-2 py-1 bg-white border border-dark-200 rounded-xl text-dark-600 font-bold">{m}</span>)}</div></div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-dark-800 mb-5">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="border border-dark-100 rounded-2xl p-4 hover:border-gold-200 transition-colors">
                <h3 className="text-sm font-bold text-dark-800 mb-1.5">{f.q}</h3>
                <p className="text-sm text-dark-400 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
