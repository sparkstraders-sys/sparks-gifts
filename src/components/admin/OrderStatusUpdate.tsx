"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";

const STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "PROCESSING", label: "Processing" },
  { value: "GIFT_WRAPPED", label: "Gift Wrapped" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

interface Props {
  orderId: string;
  currentStatus: string;
  notes: string;
}

export default function OrderStatusUpdate({ orderId, currentStatus, notes: initialNotes }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState(initialNotes);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setLoading(true);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, notes }),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="bg-white border border-gray-100 p-5">
      <h2 className="text-xs font-medium tracking-widest uppercase text-gray-500 mb-4">Update Status</h2>
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Order Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-gold-500"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Internal Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Add notes about this order..."
            className="w-full px-3 py-2.5 border border-gray-200 text-sm resize-none focus:outline-none focus:border-gold-500"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-gold-500 text-white text-xs font-medium tracking-widest uppercase hover:bg-gold-600 transition-colors disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <><CheckCircle className="w-4 h-4" /> Saved!</>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
}
