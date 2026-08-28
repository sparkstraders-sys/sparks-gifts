"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Package, CheckCircle, Gift, Truck, XCircle, Clock, Search, Loader2 } from "lucide-react";

const STATUS_STEPS = [
  { key: "PENDING", label: "Order Placed", icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
  { key: "PROCESSING", label: "Processing", icon: Package, color: "text-yellow-600", bg: "bg-yellow-50" },
  { key: "GIFT_WRAPPED", label: "Gift Wrapped", icon: Gift, color: "text-purple-500", bg: "bg-purple-50" },
  { key: "SHIPPED", label: "Shipped", icon: Truck, color: "text-orange-500", bg: "bg-orange-50" },
  { key: "DELIVERED", label: "Delivered", icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
];

interface OrderData {
  orderNumber: string;
  status: string;
  recipientName: string;
  recipientCity: string;
  giftWrapping: boolean;
  total: number;
  paymentMethod: string;
  createdAt: string;
  items: { name: string; price: number; quantity: number; imageUrl?: string }[];
}

function TrackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("order") ?? "");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const res = await fetch(`/api/orders/track?order=${orderNumber.trim()}`);
      if (!res.ok) throw new Error("Order not found");
      const data = await res.json();
      setOrder(data.order);
      router.push(`/track?order=${orderNumber.trim()}`, { scroll: false });
    } catch {
      setError("Order not found. Please check the order number and try again.");
    } finally {
      setLoading(false);
    }
  }

  const activeStepIndex = order
    ? STATUS_STEPS.findIndex((s) => s.key === order.status)
    : -1;
  const isCancelled = order?.status === "CANCELLED";

  // Auto-search if order number in URL
  useState(() => {
    const urlOrder = searchParams.get("order");
    if (urlOrder) {
      setOrderNumber(urlOrder);
      fetch(`/api/orders/track?order=${urlOrder}`)
        .then((r) => r.json())
        .then((d) => d.order && setOrder(d.order))
        .catch(() => {});
    }
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h1 className="font-serif text-3xl font-bold text-navy-900 mb-2">Track Your Order</h1>
        <p className="text-gray-400 text-sm">Enter your order number to see the latest status</p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-10">
        <input
          type="text"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="e.g. SG123456789"
          className="flex-1 px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-gold-500 font-mono"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-white text-xs font-medium tracking-widest uppercase hover:bg-gold-600 transition-colors disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Track
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm text-center mb-6">
          {error}
        </div>
      )}

      {order && (
        <div className="space-y-6">
          {/* Order header */}
          <div className="border border-gray-100 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs text-gray-400 tracking-widest uppercase mb-1">Order Number</div>
                <div className="font-mono font-bold text-navy-800 text-lg">{order.orderNumber}</div>
              </div>
              <div className={`text-xs font-medium tracking-wider uppercase px-3 py-1.5 ${isCancelled ? "bg-red-50 text-red-600" : "bg-gold-50 text-gold-700"}`}>
                {order.status.replace("_", " ")}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-400 text-xs">Recipient: </span>
                <span className="text-navy-800 font-medium">{order.recipientName}</span>
              </div>
              <div>
                <span className="text-gray-400 text-xs">City: </span>
                <span className="text-navy-800 font-medium">{order.recipientCity}</span>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Total: </span>
                <span className="text-navy-800 font-medium">Rs. {Number(order.total).toLocaleString("en-PK")}</span>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Payment: </span>
                <span className="text-navy-800 font-medium">{order.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Status timeline */}
          {!isCancelled ? (
            <div className="border border-gray-100 p-6">
              <h2 className="text-xs font-medium tracking-widest uppercase text-gray-600 mb-6">
                Order Progress
              </h2>
              <div className="space-y-4">
                {STATUS_STEPS.map((step, i) => {
                  const done = i <= activeStepIndex;
                  const active = i === activeStepIndex;
                  return (
                    <div key={step.key} className="flex items-center gap-4">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${done ? step.bg : "bg-gray-100"}`}>
                        <step.icon className={`w-4 h-4 ${done ? step.color : "text-gray-300"}`} />
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${done ? "text-navy-800" : "text-gray-400"}`}>
                          {step.label}
                        </div>
                        {active && (
                          <div className="text-xs text-gold-600 font-medium mt-0.5">Current Status</div>
                        )}
                      </div>
                      {done && !active && (
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="border border-red-100 bg-red-50 p-6 flex items-center gap-3">
              <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              <div>
                <div className="font-medium text-red-700">Order Cancelled</div>
                <div className="text-sm text-red-500 mt-0.5">This order has been cancelled. Contact us for help.</div>
              </div>
            </div>
          )}

          {/* Items */}
          <div className="border border-gray-100 p-6">
            <h2 className="text-xs font-medium tracking-widest uppercase text-gray-600 mb-4">
              Items Ordered
            </h2>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-600 line-clamp-1">
                    {item.name} <span className="text-gray-400">×{item.quantity}</span>
                  </span>
                  <span className="font-medium text-navy-800 flex-shrink-0 ml-2">
                    Rs. {(Number(item.price) * item.quantity).toLocaleString("en-PK")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    }>
      <TrackContent />
    </Suspense>
  );
}
