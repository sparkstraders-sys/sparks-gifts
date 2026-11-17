"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Gift, User, MapPin, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { getDiscountedPrice } from "@/lib/utils";

type OrderType = "SELF" | "GIFT";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [orderType, setOrderType] = useState<OrderType>("GIFT");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    senderName: "", senderPhone: "", senderEmail: "",
    recipientName: "", recipientPhone: "", recipientCity: "", recipientAddress: "",
    giftMessage: "", giftWrapping: false,
  });

  const subtotal = getSubtotal();
  const delivery = subtotal >= 2000 ? 0 : 200;
  const wrapping = form.giftWrapping ? 150 : 0;
  const total = subtotal + delivery + wrapping;

  function set(k: string, v: string | boolean) {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.senderName.trim()) e.senderName = "Required";
    if (!form.senderPhone.trim()) e.senderPhone = "Required";
    if (!form.recipientName.trim()) e.recipientName = "Required";
    if (!form.recipientPhone.trim()) e.recipientPhone = "Required";
    if (!form.recipientCity.trim()) e.recipientCity = "Required";
    if (!form.recipientAddress.trim()) e.recipientAddress = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || !items.length) return;
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form, orderType, items: items.map(i => ({ productId: i.id, name: i.name, price: getDiscountedPrice(i.sellPrice, i.discount), quantity: i.quantity, imageUrl: i.imageUrl })),
          subtotal, deliveryCharge: delivery, wrappingCharge: wrapping, total, paymentMethod: "COD",
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      const { orderNumber } = await res.json();
      clearCart();
      router.push(`/order-confirmation?order=${orderNumber}`);
    } catch (err) {
      alert((err as Error).message || "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  }

  if (!items.length) return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="text-5xl mb-4">🎁</div>
      <h1 className="font-serif text-2xl font-bold text-dark-900 mb-3">Your cart is empty</h1>
      <Link href="/shop" className="text-gold-500 font-semibold text-sm hover:text-gold-600">Continue Shopping →</Link>
    </div>
  );

  const F = ({ label, id, error, ...props }: { label: string; id: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
      <label htmlFor={id} className="block text-[10px] font-bold tracking-wider uppercase text-dark-500 mb-1.5">{label}{props.required && <span className="text-red-400 ml-1">*</span>}</label>
      <input id={id} className={`w-full px-4 py-3 border text-sm focus:outline-none focus:border-gold-500 transition-colors ${error ? "border-red-400" : "border-dark-200"}`} {...props} />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-2 text-xs text-dark-400 mb-8">
        <Link href="/" className="hover:text-gold-500">Home</Link><span>/</span>
        <Link href="/cart" className="hover:text-gold-500">Cart</Link><span>/</span>
        <span className="text-dark-700">Checkout</span>
      </div>
      <h1 className="font-serif text-3xl font-bold text-dark-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">

            {/* Order type toggle */}
            <div className="bg-white border border-dark-100 p-6">
              <div className="text-[10px] font-bold tracking-widest uppercase text-dark-500 mb-4">Who is this order for?</div>
              <div className="grid grid-cols-2 gap-3">
                {(["SELF","GIFT"] as OrderType[]).map(t => (
                  <button key={t} type="button" onClick={() => setOrderType(t)}
                    className={`py-4 border-2 text-sm font-semibold transition-all duration-200 ${orderType === t ? "border-gold-500 bg-gold-50 text-dark-900" : "border-dark-200 text-dark-400 hover:border-dark-300"}`}>
                    {t === "SELF" ? <><div className="text-xl mb-1">👤</div><div>For Myself</div><div className="text-[10px] font-normal text-dark-400 mt-0.5">Deliver to my address</div></> : <><div className="text-xl mb-1">🎁</div><div>Send as a Gift</div><div className="text-[10px] font-normal text-dark-400 mt-0.5">For someone special</div></>}
                  </button>
                ))}
              </div>
            </div>

            {/* Sender info */}
            <div className="bg-white border border-dark-100 p-6">
              <div className="flex items-center gap-2 mb-5"><User className="w-4 h-4 text-gold-500" /><span className="text-[10px] font-bold tracking-widest uppercase text-dark-500">Your Information</span></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <F label="Your Name" id="senderName" value={form.senderName} onChange={e => set("senderName", e.target.value)} error={errors.senderName} placeholder="Ahmed Khan" required />
                <F label="Your Phone" id="senderPhone" type="tel" value={form.senderPhone} onChange={e => set("senderPhone", e.target.value)} error={errors.senderPhone} placeholder="0300-1234567" required />
                <div className="sm:col-span-2">
                  <F label="Your Email (optional)" id="senderEmail" type="email" value={form.senderEmail} onChange={e => set("senderEmail", e.target.value)} placeholder="you@example.com" />
                </div>
              </div>
            </div>

            {/* Recipient */}
            <div className="bg-white border border-dark-100 p-6">
              <div className="flex items-center gap-2 mb-5"><MapPin className="w-4 h-4 text-gold-500" /><span className="text-[10px] font-bold tracking-widest uppercase text-dark-500">{orderType === "SELF" ? "Delivery Address" : "Recipient's Details"}</span></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <F label={orderType === "SELF" ? "Your Name" : "Recipient's Name"} id="recipientName" value={form.recipientName} onChange={e => set("recipientName", e.target.value)} error={errors.recipientName} placeholder="Sara Ahmed" required />
                <F label={orderType === "SELF" ? "Your Phone" : "Recipient's Phone"} id="recipientPhone" type="tel" value={form.recipientPhone} onChange={e => set("recipientPhone", e.target.value)} error={errors.recipientPhone} placeholder="0321-9876543" required />
                <F label="City" id="recipientCity" value={form.recipientCity} onChange={e => set("recipientCity", e.target.value)} error={errors.recipientCity} placeholder="Lahore / Karachi / Islamabad" required />
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold tracking-wider uppercase text-dark-500 mb-1.5">Complete Address <span className="text-red-400">*</span></label>
                  <textarea value={form.recipientAddress} onChange={e => set("recipientAddress", e.target.value)} rows={3} placeholder="House no., Street, Area, Landmark..." className={`w-full px-4 py-3 border text-sm resize-none focus:outline-none focus:border-gold-500 transition-colors ${errors.recipientAddress ? "border-red-400" : "border-dark-200"}`} />
                  {errors.recipientAddress && <p className="mt-1 text-xs text-red-500">{errors.recipientAddress}</p>}
                </div>
              </div>
            </div>

            {/* Gift options */}
            <div className="bg-white border border-dark-100 p-6">
              <div className="flex items-center gap-2 mb-5"><Gift className="w-4 h-4 text-gold-500" /><span className="text-[10px] font-bold tracking-widest uppercase text-dark-500">Gift Options</span></div>
              <div>
                <label className="block text-[10px] font-bold tracking-wider uppercase text-dark-500 mb-1.5">Personal Message (optional)</label>
                <textarea value={form.giftMessage} onChange={e => set("giftMessage", e.target.value)} rows={4} placeholder="Write a heartfelt message for the recipient..." className="w-full px-4 py-3 border border-dark-200 text-sm resize-none focus:outline-none focus:border-gold-500 transition-colors mb-4" />
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={form.giftWrapping} onChange={e => set("giftWrapping", e.target.checked)} className="mt-0.5 w-4 h-4 accent-gold-500" />
                  <div>
                    <span className="text-sm font-semibold text-dark-800 group-hover:text-gold-500 transition-colors">Premium Gift Wrapping</span>
                    <span className="ml-2 text-[10px] bg-gold-100 text-gold-600 px-2 py-0.5 font-semibold">+Rs. 150</span>
                    <div className="text-xs text-dark-400 mt-0.5">Beautiful box, ribbon & personalized gift tag</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white border border-dark-100 p-6">
              <div className="text-[10px] font-bold tracking-widest uppercase text-dark-500 mb-4">Payment Method</div>
              <div className="flex items-center gap-3 p-4 border border-dark-200">
                <input type="radio" checked readOnly className="w-4 h-4 accent-gold-500" />
                <div><div className="text-sm font-semibold text-dark-800">Cash on Delivery (COD)</div><div className="text-xs text-dark-400">Pay when you receive — available across Pakistan</div></div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white border border-dark-100 p-6 sticky top-24">
              <h2 className="text-[11px] font-bold tracking-widest uppercase text-dark-500 mb-5">Order Summary</h2>
              <div className="space-y-3 mb-5">
                {items.map(item => {
                  const fp = getDiscountedPrice(item.sellPrice, item.discount);
                  return (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-12 h-12 flex-shrink-0 bg-dark-50">
                        {item.imageUrl ? <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="48px" /> : <div className="w-full h-full flex items-center justify-center text-lg">🎁</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-dark-800 line-clamp-2">{item.name}</div>
                        <div className="text-xs text-dark-400">Qty {item.quantity} × Rs. {fp.toLocaleString("en-PK")}</div>
                      </div>
                      <div className="text-xs font-bold text-dark-900 flex-shrink-0">Rs. {(fp * item.quantity).toLocaleString("en-PK")}</div>
                    </div>
                  );
                })}
              </div>
              <div className="h-px bg-dark-100 mb-4" />
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between"><span className="text-dark-500">Subtotal</span><span className="font-medium">Rs. {subtotal.toLocaleString("en-PK")}</span></div>
                <div className="flex justify-between"><span className="text-dark-500">Delivery</span><span className={delivery === 0 ? "text-green-600 font-medium" : "font-medium"}>{delivery === 0 ? "Free" : `Rs. ${delivery}`}</span></div>
                {form.giftWrapping && <div className="flex justify-between"><span className="text-dark-500">Gift Wrapping</span><span className="font-medium">Rs. 150</span></div>}
              </div>
              <div className="h-px bg-dark-100 mb-4" />
              <div className="flex justify-between mb-6"><span className="font-bold text-dark-900">Total</span><span className="text-xl font-bold text-dark-900">Rs. {total.toLocaleString("en-PK")}</span></div>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-dark-900 text-white text-[11px] font-bold tracking-widest uppercase hover:bg-gold-500 transition-colors disabled:opacity-60">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Placing Order...</> : <><Gift className="w-4 h-4" />Place Order — COD</>}
              </button>
              <p className="text-center text-xs text-dark-400 mt-3">By placing this order you agree to our terms.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
