"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, CheckCircle, Loader2, Gift, Phone, MessageCircle } from "lucide-react";

const OCCASIONS = [
  "Birthday", "Anniversary", "Wedding", "Eid", "Valentine's Day",
  "Mother's Day", "Baby Shower", "Graduation", "Corporate Gift", "Other"
];

const BUDGETS = [
  "Under Rs. 1,000", "Rs. 1,000 – 2,500", "Rs. 2,500 – 5,000",
  "Rs. 5,000 – 10,000", "Rs. 10,000 – 20,000", "Above Rs. 20,000"
];

export default function CustomGiftPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", city: "", description: "",
    budget: "", occasion: "", recipientName: "",
  });

  function set(k: string, v: string) {
    setForm(p => ({ ...p, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.city || !form.description) return;
    setLoading(true);
    try {
      const res = await fetch("/api/custom-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, isGift }),
      });
      if (res.ok) setSubmitted(true);
      else throw new Error();
    } catch {
      alert("Something went wrong. Please WhatsApp us directly at 0300-143-2502");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-navy-900 mb-3">Request Received!</h1>
        <p className="text-gray-500 text-sm mb-2">We&apos;ll review your request and contact you within a few hours.</p>
        <p className="text-gray-500 text-sm mb-8">For faster response, WhatsApp us directly.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="https://wa.me/923001432502" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white text-xs font-medium tracking-widest uppercase hover:bg-green-600 transition-colors">
            <MessageCircle className="w-4 h-4" /> WhatsApp Us
          </a>
          <Link href="/shop" className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-gray-600 text-xs font-medium tracking-widest uppercase hover:border-gold-400 hover:text-gold-600 transition-colors">
            Browse Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">

      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-14 h-14 bg-gold-50 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-7 h-7 text-gold-500" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-navy-900 mb-2">Custom Gift Request</h1>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Can&apos;t find what you&apos;re looking for? Tell us what you need — we&apos;ll source it, prepare it, and deliver it for you.
        </p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { icon: "📝", label: "Tell us what you want" },
          { icon: "📞", label: "We call you to confirm" },
          { icon: "🎁", label: "We prepare & deliver" },
        ].map((s) => (
          <div key={s.label} className="text-center p-3 bg-gray-50 border border-gray-100">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-xs text-gray-500 leading-tight">{s.label}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Order type toggle */}
        <div className="border border-gray-200 p-4">
          <div className="text-xs font-medium tracking-wider uppercase text-gray-500 mb-3">This gift is for…</div>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setIsGift(false)}
              className={`py-3 text-sm font-medium border-2 transition-all ${!isGift ? "border-gold-500 bg-gold-50 text-gold-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
              👤 Myself
            </button>
            <button type="button" onClick={() => setIsGift(true)}
              className={`py-3 text-sm font-medium border-2 transition-all ${isGift ? "border-gold-500 bg-gold-50 text-gold-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
              🎁 Someone else
            </button>
          </div>
        </div>

        {/* Your info */}
        <div className="space-y-4">
          <div className="text-xs font-medium tracking-wider uppercase text-gray-400">Your Details</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Your Name <span className="text-red-500">*</span></label>
              <input required value={form.name} onChange={e => set("name", e.target.value)}
                placeholder="Ahmed Khan"
                className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-gold-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone / WhatsApp <span className="text-red-500">*</span></label>
              <input required value={form.phone} onChange={e => set("phone", e.target.value)}
                placeholder="0300-143-2502" type="tel"
                className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-gold-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Your City <span className="text-red-500">*</span></label>
              <input required value={form.city} onChange={e => set("city", e.target.value)}
                placeholder="e.g. Lahore, Karachi, Islamabad"
                className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-gold-500" />
            </div>
          </div>
        </div>

        {/* Recipient (gift only) */}
        {isGift && (
          <div className="space-y-4 p-4 bg-gold-50 border border-gold-100">
            <div className="text-xs font-medium tracking-wider uppercase text-gold-600">Recipient Details</div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Recipient&apos;s Name</label>
              <input value={form.recipientName} onChange={e => set("recipientName", e.target.value)}
                placeholder="Sara Ahmed"
                className="w-full px-4 py-3 border border-gray-200 bg-white text-sm focus:outline-none focus:border-gold-500" />
            </div>
          </div>
        )}

        {/* Gift details */}
        <div className="space-y-4">
          <div className="text-xs font-medium tracking-wider uppercase text-gray-400">Gift Details</div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">What do you want? <span className="text-red-500">*</span></label>
            <textarea required value={form.description} onChange={e => set("description", e.target.value)}
              rows={4} placeholder="e.g. A perfume gift set for my wife's birthday. She likes floral scents. Prefer something in a nice box. Budget around Rs. 3,000."
              className="w-full px-4 py-3 border border-gray-200 text-sm resize-none focus:outline-none focus:border-gold-500" />
            <p className="text-xs text-gray-400 mt-1">Be as specific as possible — the more detail, the better we can help.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Occasion</label>
              <select value={form.occasion} onChange={e => set("occasion", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-gold-500 bg-white">
                <option value="">Select occasion</option>
                {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Budget</label>
              <select value={form.budget} onChange={e => set("budget", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-gold-500 bg-white">
                <option value="">Select budget</option>
                {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-4 bg-gold-500 text-white text-xs font-medium tracking-widest uppercase hover:bg-gold-600 transition-colors disabled:opacity-60">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Sparkles className="w-4 h-4" /> Submit Custom Request</>}
        </button>

        <p className="text-center text-xs text-gray-400">
          Or WhatsApp us directly at{" "}
          <a href="https://wa.me/923001432502" className="text-green-600 font-medium hover:underline">0300-143-2502</a>
        </p>
      </form>
    </div>
  );
}
