"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Gift, Package, Loader2 } from "lucide-react";

function Content() {
  const sp = useSearchParams();
  const orderNumber = sp.get("order");
  const [order, setOrder] = useState<{ orderNumber: string; recipientName: string; recipientCity: string; total: number; giftWrapping: boolean } | null>(null);

  useEffect(() => {
    if (!orderNumber) return;
    fetch(`/api/orders/track?order=${orderNumber}`).then(r => r.json()).then(d => d.order && setOrder(d.order)).catch(() => {});
  }, [orderNumber]);

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="w-10 h-10 text-green-500" /></div>
      <h1 className="font-serif text-3xl font-bold text-dark-900 mb-2">Order Placed! 🎉</h1>
      <p className="text-dark-400 text-sm mb-8">Thank you! Your gift is confirmed and being prepared.</p>
      {orderNumber && (
        <div className="bg-white border border-dark-100 p-6 text-left mb-8">
          <div className="flex justify-between items-center pb-4 border-b border-dark-50 mb-4">
            <div><div className="text-xs text-dark-400 tracking-widest uppercase mb-1">Order Number</div><div className="font-mono text-lg font-bold text-dark-800">{orderNumber}</div></div>
            <Gift className="w-6 h-6 text-gold-500" />
          </div>
          {order && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-dark-400">Recipient</span><span className="font-semibold text-dark-800">{order.recipientName}</span></div>
              <div className="flex justify-between"><span className="text-dark-400">City</span><span className="font-semibold text-dark-800">{order.recipientCity}</span></div>
              <div className="flex justify-between"><span className="text-dark-400">Gift Wrapping</span><span className={order.giftWrapping ? "text-green-600 font-semibold" : "text-dark-500"}>{order.giftWrapping ? "✓ Included" : "Not selected"}</span></div>
              <div className="flex justify-between"><span className="text-dark-400">Total</span><span className="font-bold text-dark-900">Rs. {Number(order.total).toLocaleString("en-PK")}</span></div>
              <div className="flex justify-between"><span className="text-dark-400">Payment</span><span className="font-semibold text-dark-800">Cash on Delivery</span></div>
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href={`/track?order=${orderNumber}`} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-dark-900 text-white text-[11px] font-bold tracking-widest uppercase hover:bg-gold-500 transition-colors"><Package className="w-4 h-4" />Track Order</Link>
        <Link href="/shop" className="inline-flex items-center justify-center px-6 py-3 border-2 border-gold-500 text-gold-600 text-[11px] font-bold tracking-widest uppercase hover:bg-gold-500 hover:text-white transition-colors">Continue Shopping</Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return <Suspense fallback={<div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 text-gold-500 animate-spin" /></div>}><Content /></Suspense>;
}
