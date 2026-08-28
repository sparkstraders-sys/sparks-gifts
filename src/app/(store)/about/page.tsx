import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Gift, MapPin, Heart, Sparkles, ArrowRight, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Sparks Gifts is a modern online gifting store dedicated to making special moments more memorable across Pakistan.",
};

const steps = [
  { icon: "🎁", step: "01", title: "Choose a Gift", desc: "Browse our curated collection of premium gifts — perfumes, chocolates, gift sets and more." },
  { icon: "📍", step: "02", title: "Enter Recipient Details", desc: "Provide the recipient's name, phone number and delivery address anywhere in Pakistan." },
  { icon: "💌", step: "03", title: "Add Your Personal Message", desc: "Write a heartfelt message — it will be printed on a gift card for the recipient." },
  { icon: "🎀", step: "04", title: "We Gift-Wrap It", desc: "Your selected gift is carefully prepared and beautifully gift-wrapped by our team." },
  { icon: "🚚", step: "05", title: "We Deliver It", desc: "We deliver directly to their doorstep — so the surprise is always perfect." },
];

const occasions = [
  "Birthdays", "Anniversaries", "Weddings", "Eid & Festive", "Baby Showers", "Valentine's Day", "Mother's Day", "Corporate Gifting",
];

export default function AboutPage() {
  return (
    <div>

      {/* Hero */}
      <section className="bg-navy-900 py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-gold-400 text-xs tracking-[0.4em] uppercase font-medium">About Us</span>
            <div className="h-px w-8 bg-gold-500" />
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Making Distance Feel<br className="hidden sm:block" />
            <span className="text-gold-400"> a Little Smaller</span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Sparks Gifts is a modern online gifting store dedicated to making special moments more memorable. We help you send thoughtful gifts to your loved ones — even when you cannot be there in person.
          </p>
          <div className="inline-block bg-white/5 border border-white/10 px-6 py-4">
            <p className="text-gold-400 font-serif text-lg italic">
              &ldquo;You choose the gift. You write the message. We deliver the surprise.&rdquo;
            </p>
            <p className="text-gray-400 text-xs tracking-widest uppercase mt-2">— Sparks Gifts</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-8 bg-gold-500" />
              <span className="text-gold-600 text-xs tracking-[0.3em] uppercase font-medium">Simple Process</span>
              <div className="h-px w-8 bg-gold-500" />
            </div>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-navy-900">How Sparks Gifts Works</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((s, i) => (
              <div key={s.step} className="relative text-center group">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-full h-px bg-gold-200 z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gold-50 border-2 border-gold-200 group-hover:border-gold-500 group-hover:bg-gold-100 transition-all duration-300 flex items-center justify-center mx-auto mb-4 text-2xl">
                    {s.icon}
                  </div>
                  <div className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-1">Step {s.step}</div>
                  <h3 className="font-semibold text-navy-800 text-sm mb-2">{s.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand message */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-gold-500" />
                <span className="text-gold-600 text-xs tracking-[0.3em] uppercase font-medium">Our Promise</span>
              </div>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-navy-900 mb-5">
                A Gift that Speaks When Words Fall Short
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                From perfumes and chocolates to beautiful gifts for birthdays, anniversaries, celebrations and special occasions — you can choose your gift online, provide the recipient&apos;s details, add a personal message, and let us take care of the rest.
              </p>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Your selected gift is carefully prepared, beautifully gift-wrapped and delivered directly to your loved one&apos;s doorstep.
              </p>
              <p className="text-navy-800 font-medium text-sm italic border-l-2 border-gold-500 pl-4">
                Because sometimes, a thoughtful gift can say what words cannot. ❤️
              </p>
              <div className="mt-8">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gold-500 text-white text-xs font-medium tracking-widest uppercase hover:bg-gold-600 transition-colors"
                >
                  Shop Gifts <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { icon: Gift, title: "Curated Gift Collection", desc: "Perfumes, chocolates, gift sets and more — carefully selected for every occasion." },
                { icon: Heart, title: "Personal Touch", desc: "Every order includes a printed gift card with your personal message." },
                { icon: Package, title: "Beautiful Gift Wrapping", desc: "Premium gift wrapping included — your gift arrives looking as special as it feels." },
                { icon: MapPin, title: "Pakistan-wide Delivery", desc: "We deliver across Pakistan — from Karachi to Lahore, Islamabad to Peshawar." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 p-4 bg-white border border-gray-100 hover:border-gold-200 transition-colors">
                  <div className="w-9 h-9 bg-gold-50 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-gold-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-navy-800 mb-0.5">{item.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Occasions */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-gold-600 text-xs tracking-[0.3em] uppercase font-medium">Every Occasion</span>
            <div className="h-px w-8 bg-gold-500" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-navy-900 mb-3">Gifts for Every Moment</h2>
          <p className="text-gray-400 text-sm mb-10 max-w-lg mx-auto">
            Whatever the occasion, we have the perfect gift waiting for you.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {occasions.map((occ) => (
              <Link
                key={occ}
                href="/shop"
                className="px-5 py-2.5 border border-gray-200 text-sm text-gray-600 hover:border-gold-500 hover:text-gold-600 hover:bg-gold-50 transition-all duration-200"
              >
                {occ}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Store info strip */}
      <section className="bg-navy-800 py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-gold-400 text-xs tracking-widest uppercase mb-2 font-medium">Payment Methods</div>
              <div className="text-white text-sm font-medium">Cash on Delivery</div>
              <div className="text-gray-400 text-xs mt-1">JazzCash · EasyPaisa · Raast</div>
            </div>
            <div>
              <div className="text-gold-400 text-xs tracking-widest uppercase mb-2 font-medium">Delivery</div>
              <div className="text-white text-sm font-medium">Pakistan-wide</div>
              <div className="text-gray-400 text-xs mt-1">All major cities & towns</div>
            </div>
            <div>
              <div className="text-gold-400 text-xs tracking-widest uppercase mb-2 font-medium">Contact Us</div>
              <div className="text-white text-sm font-medium">0300-143-2502</div>
              <div className="text-gray-400 text-xs mt-1">0300-143-2007</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
