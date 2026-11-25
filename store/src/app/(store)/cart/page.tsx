"use client";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, Gift } from "lucide-react";
import { getDiscountedPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const delivery = subtotal >= 2000 ? 0 : 200;
  const total = subtotal + delivery;

  if (!items.length) return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-6xl mb-4">🛍</div>
      <h1 className="font-serif text-2xl font-bold text-dark-900 mb-3">Your cart is empty</h1>
      <p className="text-dark-400 text-sm mb-8">Discover our curated collection of premium gifts.</p>
      <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-dark-900 text-white text-[11px] font-bold tracking-widest uppercase hover:bg-gold-500 transition-colors">Shop Gifts <ArrowRight className="w-4 h-4" /></Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-2 text-xs text-dark-400 mb-8"><Link href="/" className="hover:text-gold-500">Home</Link><span>/</span><span className="text-dark-700">Cart</span></div>
      <h1 className="font-serif text-3xl font-bold text-dark-900 mb-10">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => {
            const fp = getDiscountedPrice(item.sellPrice, item.discount);
            return (
              <div key={item.id} className="flex gap-4 p-4 bg-white border border-dark-100 rounded-2xl">
                <div className="relative w-20 h-20 flex-shrink-0 bg-dark-50">
                  {item.imageUrl ? <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="80px" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🎁</div>}
                </div>
                <div className="flex-1 min-w-0">
                  {item.brand && <div className="text-[10px] text-dark-400 tracking-widest uppercase mb-0.5">{item.brand}</div>}
                  <Link href={`/products/${item.slug}`} className="text-sm font-semibold text-dark-800 hover:text-gold-500 line-clamp-2">{item.name}</Link>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-dark-900">Rs. {fp.toLocaleString("en-PK")}</span>
                      {item.discount > 0 && <span className="text-xs text-dark-300 line-through">Rs. {item.sellPrice.toLocaleString("en-PK")}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeItem(item.id)} className="p-1 text-dark-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 border border-dark-200 rounded-xl flex items-center justify-center hover:border-gold-400 transition-colors"><Minus className="w-3 h-3" /></button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock} className="w-7 h-7 border border-dark-200 rounded-xl flex items-center justify-center hover:border-gold-400 transition-colors disabled:opacity-40"><Plus className="w-3 h-3" /></button>
                  </div>
                  <div className="text-xs font-bold text-dark-700">Rs. {(fp * item.quantity).toLocaleString("en-PK")}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-dark-100 rounded-2xl p-6 sticky top-24">
            <h2 className="text-[11px] font-bold tracking-widest uppercase text-dark-500 mb-5">Order Summary</h2>
            <div className="space-y-3 mb-5 text-sm">
              <div className="flex justify-between"><span className="text-dark-500">Subtotal</span><span className="font-semibold">Rs. {subtotal.toLocaleString("en-PK")}</span></div>
              <div className="flex justify-between"><span className="text-dark-500">Delivery</span><span className={delivery === 0 ? "text-green-600 font-semibold" : "font-semibold"}>{delivery === 0 ? "Free 🎉" : `Rs. ${delivery.toLocaleString("en-PK")}`}</span></div>
              {delivery > 0 && <p className="text-xs text-dark-400">Add Rs. {(2000 - subtotal).toLocaleString("en-PK")} more for free delivery</p>}
            </div>
            <div className="h-px bg-dark-100 mb-4" />
            <div className="flex justify-between mb-6"><span className="font-bold text-dark-900">Total</span><span className="text-xl font-bold text-dark-900">Rs. {total.toLocaleString("en-PK")}</span></div>
            <Link href="/checkout" className="w-full flex items-center justify-center gap-2 py-4 bg-dark-900 text-white text-[11px] font-bold tracking-widest uppercase hover:bg-gold-500 transition-colors rounded-full">
              Checkout <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/shop" className="mt-3 w-full flex items-center justify-center py-3 border border-dark-200 rounded-xl text-dark-500 text-[10px] font-bold tracking-widest uppercase hover:border-gold-400 hover:text-gold-500 transition-colors">
              Continue Shopping
            </Link>
            <div className="mt-5 p-3 bg-gold-50 border border-gold-100 flex items-start gap-2">
              <Gift className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gold-700">Add gift message & wrapping at checkout.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
