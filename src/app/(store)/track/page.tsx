"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Gift, Truck, Package, Clock, XCircle, Search, Loader2 } from "lucide-react";

const STEPS = [
  { key: "PENDING", label: "Order Placed", icon: Clock, bg: "bg-blue-50", color: "text-blue-500" },
  { key: "PROCESSING", label: "Processing", icon: Package, bg: "bg-yellow-50", color: "text-yellow-600" },
  { key: "GIFT_WRAPPED", label: "Gift Wrapped", icon: Gift, bg: "bg-purple-50", color: "text-purple-500" },
  { key: "SHIPPED", label: "Shipped", icon: Truck, bg: "bg-orange-50", color: "text-orange-500" },
  { key: "DELIVERED", label: "Delivered", icon: CheckCircle, bg: "bg-green-50", color: "text-green-500" },
];

function TrackContent() {
  const sp = useSearchParams();
  const router = useRouter();
  const [orderNum, setOrderNum] = useState(sp.get("order") ?? "");
  const [order, setOrder] = useState<{ orderNumber: string; status: string; recipientName: string; recipientCity: string; total: number; paymentMethod: string; items: { name: string; price: number; quantity: number }[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (!orderNum.trim()) return;
    setLoading(true); setError(""); setOrder(null);
    try {
      const res = await fetch(`/api/orders/track?order=${orderNum.trim()}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrder(data.order);
      router.push(`/track?order=${orderNum.trim()}`, { scroll: false });
    } catch { setError("Order not found. Please check the order number."); }
    finally { setLoading(false); }
  }

  const activeIdx = order ? STEPS.findIndex(s => s.key === order.status) : -1;
  const cancelled = order?.status === "CANCELLED";

  return (
    <div className="max-w-2xl mx-auto px-4 py-14">
      <div className="text-center mb-10">
        <h1 className="font-serif text-3xl font-bold text-dark-900 mb-2">Track Your Order</h1>
        <p className="text-dark-400 text-sm">Enter your order number (e.g. SG123456789)</p>
      </div>
      <form onSubmit={search} className="flex gap-2 mb-10">
        <input value={orderNum} onChange={e => setOrderNum(e.target.value)} placeholder="e.g. SG123456789" className="flex-1 px-4 py-3 border border-dark-200 text-sm font-mono focus:outline-none focus:border-gold-500" />
        <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-dark-900 text-white text-[11px] font-bold tracking-widest uppercase hover:bg-gold-500 transition-colors disabled:opacity-60">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Track
        </button>
      </form>
      {error && <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm text-center mb-6">{error}</div>}
      {order && (
        <div className="space-y-5">
          <div className="bg-white border border-dark-100 p-6">
            <div className="flex justify-between items-start mb-5">
              <div><div className="text-xs text-dark-400 tracking-widest uppercase mb-1">Order Number</div><div className="font-mono font-bold text-dark-800 text-lg">{order.orderNumber}</div></div>
              <span className={`text-[10px] px-3 py-1.5 font-bold tracking-wider uppercase ${cancelled ? "bg-red-100 text-red-600" : "bg-gold-100 text-gold-700"}`}>{order.status.replace("_"," ")}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-dark-400 text-xs">Recipient</span><div className="font-semibold text-dark-800">{order.recipientName}</div></div>
              <div><span className="text-dark-400 text-xs">City</span><div className="font-semibold text-dark-800">{order.recipientCity}</div></div>
              <div><span className="text-dark-400 text-xs">Total</span><div className="font-bold text-dark-900">Rs. {Number(order.total).toLocaleString("en-PK")}</div></div>
              <div><span className="text-dark-400 text-xs">Payment</span><div className="font-semibold text-dark-800">{order.paymentMethod}</div></div>
            </div>
          </div>
          {!cancelled ? (
            <div className="bg-white border border-dark-100 p-6">
              <div className="text-[10px] font-bold tracking-widest uppercase text-dark-400 mb-6">Order Progress</div>
              <div className="space-y-4">
                {STEPS.map((step, i) => {
                  const done = i <= activeIdx; const active = i === activeIdx;
                  return (
                    <div key={step.key} className="flex items-center gap-4">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${done ? step.bg : "bg-dark-50"}`}>
                        <step.icon className={`w-4 h-4 ${done ? step.color : "text-dark-300"}`} />
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-semibold ${done ? "text-dark-800" : "text-dark-300"}`}>{step.label}</div>
                        {active && <div className="text-xs text-gold-500 font-semibold">Current Status</div>}
                      </div>
                      {done && !active && <CheckCircle className="w-4 h-4 text-green-400" />}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="border border-red-100 bg-red-50 p-5 flex items-center gap-3">
              <XCircle className="w-6 h-6 text-red-500" />
              <div><div className="font-semibold text-red-700">Order Cancelled</div><div className="text-sm text-red-500 mt-0.5">Contact us for help: 0300-143-2502</div></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return <Suspense fallback={<div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 text-gold-500 animate-spin" /></div>}><TrackContent /></Suspense>;
}
