import { Metadata } from "next";
import { Phone, Mail, MessageCircle, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Sparks Gifts. Call or WhatsApp us at 0300-143-2502 or 0300-143-2007.",
};

const faqs = [
  { q: "How do I track my order?", a: "Use the Track Order page with your order number (e.g. SG123456789) for real-time status updates." },
  { q: "Do you deliver across Pakistan?", a: "Yes — we deliver to all major cities and towns across Pakistan." },
  { q: "What payment methods are available?", a: "We accept Cash on Delivery (COD), JazzCash, EasyPaisa, and Raast bank transfers." },
  { q: "Can I add a personal message?", a: "Absolutely. At checkout you can write a personal gift message which will be printed on a card for the recipient." },
  { q: "Is gift wrapping included?", a: "Premium gift wrapping is available at checkout for a small charge. Your gift will arrive beautifully wrapped." },
  { q: "Can I change the delivery address after placing an order?", a: "Contact us via WhatsApp immediately after placing the order. We'll try our best to update it before dispatch." },
];

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-8 bg-gold-500" />
          <span className="text-gold-600 text-xs tracking-[0.3em] uppercase font-medium">Get in Touch</span>
          <div className="h-px w-8 bg-gold-500" />
        </div>
        <h1 className="font-serif text-3xl lg:text-4xl font-bold text-navy-900 mb-3">Contact Us</h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Have a question about an order or need a gift recommendation? We&apos;re happy to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Contact info */}
        <div className="space-y-5">
          <div className="border border-gray-100 p-6">
            <h2 className="font-serif text-xl font-semibold text-navy-800 mb-6">Reach Us</h2>
            <div className="space-y-5">

              {/* WhatsApp */}
              <div className="space-y-2">
                <div className="text-xs font-medium tracking-wider uppercase text-gray-400">WhatsApp (Fastest)</div>
                <a href="https://wa.me/923001432502" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border border-gray-100 hover:border-green-300 hover:bg-green-50 transition-all group">
                  <div className="w-9 h-9 bg-green-50 group-hover:bg-green-100 flex items-center justify-center flex-shrink-0 transition-colors">
                    <MessageCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-navy-800 group-hover:text-green-700">0300-143-2502</div>
                    <div className="text-xs text-gray-400">Tap to open WhatsApp</div>
                  </div>
                </a>
                <a href="https://wa.me/923001432007" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border border-gray-100 hover:border-green-300 hover:bg-green-50 transition-all group">
                  <div className="w-9 h-9 bg-green-50 group-hover:bg-green-100 flex items-center justify-center flex-shrink-0 transition-colors">
                    <MessageCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-navy-800 group-hover:text-green-700">0300-143-2007</div>
                    <div className="text-xs text-gray-400">Tap to open WhatsApp</div>
                  </div>
                </a>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <div className="text-xs font-medium tracking-wider uppercase text-gray-400">Call Us</div>
                <a href="tel:+923001432502" className="flex items-center gap-3 p-3 border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group">
                  <div className="w-9 h-9 bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-navy-800">0300-143-2502</div>
                    <div className="text-xs text-gray-400">0300-143-2007</div>
                  </div>
                </a>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <div className="text-xs font-medium tracking-wider uppercase text-gray-400">Email</div>
                <a href="mailto:hello@sparksgifts.pk" className="flex items-center gap-3 p-3 border border-gray-100 hover:border-gold-300 hover:bg-gold-50 transition-all group">
                  <div className="w-9 h-9 bg-gold-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-gold-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-navy-800 group-hover:text-gold-700">hello@sparksgifts.pk</div>
                    <div className="text-xs text-gray-400">Response within 24 hours</div>
                  </div>
                </a>
              </div>

              {/* Hours & Location */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Hours</span>
                  </div>
                  <div className="text-xs text-navy-800 font-medium">Mon – Sat</div>
                  <div className="text-xs text-gray-500">10 AM – 8 PM</div>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Delivery</span>
                  </div>
                  <div className="text-xs text-navy-800 font-medium">Pakistan-wide</div>
                  <div className="text-xs text-gray-500">All major cities</div>
                </div>
              </div>

              {/* Payment */}
              <div className="p-4 bg-navy-50 border border-navy-100">
                <div className="text-[10px] uppercase tracking-wider text-gray-500 font-medium mb-2">Payment Methods</div>
                <div className="flex flex-wrap gap-2">
                  {["Cash on Delivery", "JazzCash", "EasyPaisa", "Raast"].map((m) => (
                    <span key={m} className="text-[10px] px-2 py-1 bg-white border border-gray-200 text-gray-600 font-medium">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="font-serif text-xl font-semibold text-navy-800 mb-5">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.q} className="border border-gray-100 p-4 hover:border-gold-200 transition-colors">
                <h3 className="text-sm font-semibold text-navy-800 mb-1.5">{faq.q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
