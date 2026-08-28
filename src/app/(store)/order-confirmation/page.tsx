"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, Gift, ArrowRight, Loader2 } from "lucide-react";
import { Suspense } from "react";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const [order, setOrder] = useState<{
    orderNumber: string;
    recipientName: string;
    recipientCity: string;
    total: number;
    giftWrapping: boolean;
    createdAt: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) {
      setLoading(false);
      return;
    }
    fetch(`/api/orders/track?order=${orderNumber}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data.order);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    );
  }

  if (!orderNumber) {
    return (
      <div className="text-center py-24">
        <h1 className="text-2xl font-bold text-navy-800 mb-4">Order not found</h1>
        <Link href="/shop" className="text-gold-600 hover:text-gold-700 font-medium">
          Continue Shopping →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      {/* Success icon */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
      </div>

      <h1 className="font-serif text-3xl font-bold text-navy-900 mb-2">
        Order Placed!
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Thank you for choosing Sparks Gifts. Your gift is confirmed.
      </p>

      {/* Order card */}
      <div className="bg-white border border-gray-100 p-8 text-left mb-8">
        <div className="flex items-center justify-between mb-5 pb-5 border-b border-gray-100">
          <div>
            <div className="text-xs text-gray-400 tracking-widest uppercase mb-1">Order Number</div>
            <div className="font-mono text-lg font-bold text-navy-800">{orderNumber}</div>
          </div>
          <div className="w-10 h-10 bg-gold-50 flex items-center justify-center">
            <Gift className="w-5 h-5 text-gold-500" />
          </div>
        </div>

        {order && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Recipient</span>
              <span className="font-medium text-navy-800">{order.recipientName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Delivery City</span>
              <span className="font-medium text-navy-800">{order.recipientCity}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Gift Wrapping</span>
              <span className={`font-medium ${order.giftWrapping ? "text-green-600" : "text-gray-600"}`}>
                {order.giftWrapping ? "✓ Included" : "Not selected"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total</span>
              <span className="font-bold text-navy-900">
                Rs. {Number(order.total).toLocaleString("en-PK")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Payment</span>
              <span className="font-medium text-navy-800">Cash on Delivery</span>
            </div>
          </div>
        )}
      </div>

      {/* Steps */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { icon: CheckCircle, label: "Order Confirmed", done: true },
          { icon: Gift, label: "Being Prepared", done: false },
          { icon: Package, label: "Out for Delivery", done: false },
        ].map((step, i) => (
          <div key={i} className="text-center">
            <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 ${step.done ? "bg-green-100" : "bg-gray-100"}`}>
              <step.icon className={`w-5 h-5 ${step.done ? "text-green-500" : "text-gray-400"}`} />
            </div>
            <div className={`text-xs font-medium ${step.done ? "text-green-600" : "text-gray-400"}`}>
              {step.label}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href={`/track?order=${orderNumber}`}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-navy-800 text-white text-xs font-medium tracking-widest uppercase hover:bg-navy-900 transition-colors"
        >
          Track Order <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gold-500 text-gold-600 text-xs font-medium tracking-widest uppercase hover:bg-gold-500 hover:text-white transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
