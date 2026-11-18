"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, CheckCircle, Loader2, MessageCircle, ShieldCheck, Banknote, Smartphone, Landmark } from "lucide-react";

const OCCASIONS = ["Birthday","Anniversary","Wedding","Eid","Valentine's Day","Mother's Day","Baby Shower","Graduation","Corporate Gift","Other"];
const BUDGETS = ["Under Rs. 1,000","Rs. 1,000–2,500","Rs. 2,500–5,000","Rs. 5,000–10,000","Rs. 10,000–20,000","Above Rs. 20,000"];
const ONLINE = [
  { v: "JAZZCASH", label: "JazzCash", icon: Smartphone },
  { v: "EASYPAISA", label: "EasyPaisa", icon: Smartphone },
  { v: "RAAST", label: "Raast", icon: Landmark },
  { v: "BANK_TRANSFER", label: "Bank transfer", icon: Landmark },
] as const;

interface PayInfo { jazzcash: string; easypaisa: string; raast: string; bankDetails: string; accountTitle: string; whatsapp: string }

export default function CustomGiftPage() {
  const [submitted, setSubmitted] = useState<null | { isGift: boolean; method: string }>(null);
  const [loading, setLoading] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [method, setMethod] = useState<string>("JAZZCASH");
  const [pay, setPay] = useState<PayInfo | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", city: "", description: "", budget: "", occasion: "", recipientName: "", paymentReference: "" });

  useEffect(() => { fetch("/api/payment-info").then(r => r.json()).then(setPay).catch(() => {}); }, []);
  function set(k: string, v: string) { setForm(p => ({ ...p, [k]: v })); }

  function accountFor(m: string) {
    if (!pay) return "";
    if (m === "JAZZCASH") return pay.jazzcash;
    if (m === "EASYPAISA") return pay.easypaisa;
    if (m === "RAAST") return pay.raast;
    return pay.bankDetails;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.phone || !form.city || !form.description) return;
    if (isGift && form.recipientName.trim().length < 2) { setError("Enter the recipient's name."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/custom-request", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, isGift, paymentMethod: isGift ? method : undefined }),
      });
      if (!res.ok) throw new Error();
      setSubmitted({ isGift, method });
    } catch { setError("Something went wrong. WhatsApp us: 0300-143-2502"); }
    finally { setLoading(false); }
  }

  const wa = pay?.whatsapp || "923001432502";

  if (submitted) {
    const acct = accountFor(submitted.method);
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5"><CheckCircle className="w-8 h-8 text-green-500" /></div>
        <h1 className="font-serif text-2xl font-bold text-dark-900 mb-3">Request received</h1>
        {submitted.isGift ? (
          <div className="text-left bg-white border border-dark-100 rounded-2xl p-5 mb-6 float-card">
            <p className="text-sm text-dark-600 mb-3">Your gift is on hold until payment is confirmed. Pay online using <b>{ONLINE.find(o => o.v === submitted.method)?.label}</b>, then send the receipt on WhatsApp.</p>
            {acct ? (
              <div className="bg-gold-50 border border-gold-100 p-3 text-sm text-dark-800 whitespace-pre-line">
                {pay?.accountTitle && <div className="text-xs text-dark-500 mb-1">Account title: {pay.accountTitle}</div>}
                {acct}
              </div>
            ) : (
              <p className="text-sm text-dark-500">We&apos;ll WhatsApp you the payment details shortly.</p>
            )}
          </div>
        ) : (
          <p className="text-dark-400 text-sm mb-8">We&apos;ll contact you within a few hours. For a faster reply, WhatsApp us.</p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white text-[11px] font-bold tracking-widest uppercase hover:bg-green-600 transition-colors"><MessageCircle className="w-4 h-4" />{submitted.isGift ? "Send payment receipt" : "WhatsApp us"}</a>
          <Link href="/shop" className="inline-flex items-center justify-center px-6 py-3 border border-dark-200 rounded-xl text-dark-600 text-[11px] font-bold tracking-widest uppercase hover:border-gold-400 hover:text-gold-500 transition-colors">Browse shop</Link>
        </div>
      </div>
    );
  }

  const field = "w-full px-4 py-3 border border-dark-200 rounded-xl text-sm focus:outline-none focus:border-gold-500 bg-white";
  const label = "block text-[10px] font-bold tracking-wider uppercase text-dark-500 mb-1.5";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <div className="w-14 h-14 bg-gold-50 border border-gold-200 flex items-center justify-center mx-auto mb-4 float-card"><Sparkles className="w-7 h-7 text-gold-500" /></div>
        <h1 className="font-serif text-3xl font-bold text-dark-900 mb-2">Custom gift request</h1>
        <p className="text-dark-400 text-sm max-w-md mx-auto">Can&apos;t find what you&apos;re looking for? Tell us what you need — we&apos;ll source, prepare and deliver it.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white border border-dark-100 rounded-2xl p-5 float-card">
          <div className="text-[10px] font-bold tracking-widest uppercase text-dark-500 mb-3">This is for…</div>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setIsGift(false)} className={`py-3 border-2 text-sm font-semibold transition-all ${!isGift ? "border-gold-500 bg-gold-50 text-dark-900" : "border-dark-200 text-dark-400"}`}>👤 Myself</button>
            <button type="button" onClick={() => setIsGift(true)} className={`py-3 border-2 text-sm font-semibold transition-all ${isGift ? "border-gold-500 bg-gold-50 text-dark-900" : "border-dark-200 text-dark-400"}`}>🎁 Someone else</button>
          </div>
          {isGift && (
            <div className="mt-3 flex items-start gap-2 text-xs text-dark-600 bg-dark-50 p-3">
              <ShieldCheck className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
              <span>Gifts for someone else are paid online by you, the sender. The receiver pays nothing at the door.</span>
            </div>
          )}
        </div>

        <div className="bg-white border border-dark-100 rounded-2xl p-5 space-y-4 float-card">
          <div className="text-[10px] font-bold tracking-widest uppercase text-dark-400">Your details</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={label}>Your name <span className="text-red-400">*</span></label><input required value={form.name} onChange={e => set("name", e.target.value)} placeholder="Ahmed Khan" className={field} /></div>
            <div><label className={label}>Phone / WhatsApp <span className="text-red-400">*</span></label><input required type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="0300-1234567" className={field} /></div>
            <div className="sm:col-span-2"><label className={label}>{isGift ? "Recipient's city" : "Your city"} <span className="text-red-400">*</span></label><input required value={form.city} onChange={e => set("city", e.target.value)} placeholder="e.g. Lahore, Karachi" className={field} /></div>
          </div>
        </div>

        {isGift && (
          <div className="bg-gold-50 border border-gold-100 p-5 float-card">
            <div className="text-[10px] font-bold tracking-widest uppercase text-gold-600 mb-3">Recipient details</div>
            <label className={label}>Recipient&apos;s name <span className="text-red-400">*</span></label>
            <input value={form.recipientName} onChange={e => set("recipientName", e.target.value)} placeholder="Sara Ahmed" className={field} />
          </div>
        )}

        <div className="bg-white border border-dark-100 rounded-2xl p-5 space-y-4 float-card">
          <div className="text-[10px] font-bold tracking-widest uppercase text-dark-400">Gift details</div>
          <div>
            <label className={label}>What do you want? <span className="text-red-400">*</span></label>
            <textarea required value={form.description} onChange={e => set("description", e.target.value)} rows={4} placeholder="e.g. A perfume gift set for my wife's birthday. She likes floral scents. Budget Rs. 3,000." className={`${field} resize-none`} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={label}>Occasion</label><select value={form.occasion} onChange={e => set("occasion", e.target.value)} className={field}><option value="">Select</option>{OCCASIONS.map(o => <option key={o}>{o}</option>)}</select></div>
            <div><label className={label}>Budget</label><select value={form.budget} onChange={e => set("budget", e.target.value)} className={field}><option value="">Select</option>{BUDGETS.map(b => <option key={b}>{b}</option>)}</select></div>
          </div>
        </div>

        <div className="bg-white border border-dark-100 rounded-2xl p-5 float-card">
          <div className="text-[10px] font-bold tracking-widest uppercase text-dark-400 mb-3">Payment</div>
          {!isGift ? (
            <div className="flex items-center gap-3 p-3 border border-dark-200 rounded-xl">
              <Banknote className="w-5 h-5 text-gold-500" />
              <div><div className="text-sm font-semibold text-dark-800">Cash on delivery</div><div className="text-xs text-dark-400">We confirm the price with you first, then you pay on delivery.</div></div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs text-dark-500">Online payment only for gifts. Choose how you&apos;ll pay:</div>
              <div className="grid grid-cols-2 gap-2">
                {ONLINE.map(o => (
                  <button key={o.v} type="button" onClick={() => setMethod(o.v)}
                    className={`flex items-center gap-2 px-3 py-3 border-2 text-sm font-semibold transition-all ${method === o.v ? "border-gold-500 bg-gold-50 text-dark-900" : "border-dark-200 text-dark-500 hover:border-dark-300"}`}>
                    <o.icon className="w-4 h-4" />{o.label}
                  </button>
                ))}
              </div>
              {accountFor(method) && (
                <div className="bg-gold-50 border border-gold-100 p-3 text-sm text-dark-800 whitespace-pre-line">
                  {pay?.accountTitle && <div className="text-xs text-dark-500 mb-1">Account title: {pay.accountTitle}</div>}
                  {accountFor(method)}
                </div>
              )}
              <div>
                <label className={label}>Transaction ID (optional)</label>
                <input value={form.paymentReference} onChange={e => set("paymentReference", e.target.value)} placeholder="Add it now or send the receipt on WhatsApp" className={field} />
              </div>
              <p className="text-xs text-dark-400">We start preparing the gift once your payment is confirmed.</p>
            </div>
          )}
        </div>

        {error && <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm">{error}</div>}

        <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-4 bg-dark-900 text-white text-[11px] font-bold tracking-widest uppercase hover:bg-gold-500 transition-colors disabled:opacity-60 btn-glow rounded-full">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Sending...</> : <><Sparkles className="w-4 h-4" />{isGift ? "Submit and pay online" : "Submit request"}</>}
        </button>
        <p className="text-center text-xs text-dark-400">Or WhatsApp: <a href={`https://wa.me/${wa}`} className="text-green-600 font-bold hover:underline">0300-143-2502</a></p>
      </form>
    </div>
  );
}
