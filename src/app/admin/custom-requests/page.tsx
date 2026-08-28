"use client";

import { useState, useEffect } from "react";
import { Sparkles, Loader2, MessageCircle, Phone } from "lucide-react";

interface CustomRequest {
  id: string;
  name: string;
  phone: string;
  city: string;
  description: string;
  budget?: string | null;
  occasion?: string | null;
  isGift: boolean;
  recipientName?: string | null;
  status: string;
  adminNotes?: string | null;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-yellow-100 text-yellow-700",
  CONTACTED: "bg-blue-100 text-blue-700",
  CONFIRMED: "bg-purple-100 text-purple-700",
  DONE: "bg-green-100 text-green-700",
};

const STATUSES = ["NEW", "CONTACTED", "CONFIRMED", "DONE"];

export default function AdminCustomRequestsPage() {
  const [requests, setRequests] = useState<CustomRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<CustomRequest | null>(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/custom-requests");
    if (res.ok) setRequests(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openRequest(r: CustomRequest) {
    setSelected(r);
    setNotes(r.adminNotes ?? "");
    setStatus(r.status);
  }

  async function saveUpdate() {
    if (!selected) return;
    setSaving(true);
    const res = await fetch(`/api/admin/custom-requests/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, adminNotes: notes }),
    });
    if (res.ok) {
      await load();
      setSelected(null);
    }
    setSaving(false);
  }

  const newCount = requests.filter(r => r.status === "NEW").length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-500" /> Custom Requests
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {requests.length} total · {newCount > 0 && <span className="text-yellow-600 font-medium">{newCount} new</span>}
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-100">
        {loading ? (
          <div className="text-center py-12"><Loader2 className="w-6 h-6 text-gold-400 animate-spin mx-auto" /></div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16">
            <Sparkles className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No custom requests yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {requests.map((r) => (
              <div key={r.id} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => openRequest(r)}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-800 text-sm">{r.name}</span>
                      {r.isGift && <span className="text-[10px] bg-gold-100 text-gold-700 px-1.5 py-0.5 font-medium">🎁 Gift</span>}
                      <span className={`text-[10px] px-2 py-0.5 font-medium uppercase tracking-wider ${STATUS_COLORS[r.status] ?? "bg-gray-100 text-gray-600"}`}>{r.status}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-1">{r.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>📍 {r.city}</span>
                      {r.occasion && <span>✨ {r.occasion}</span>}
                      {r.budget && <span>💰 {r.budget}</span>}
                      <span>{new Date(r.createdAt).toLocaleDateString("en-PK")}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <a href={`https://wa.me/92${r.phone.replace(/^0/, "").replace(/-/g, "")}`}
                      onClick={e => e.stopPropagation()}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-[10px] font-medium hover:bg-green-600 transition-colors">
                      <MessageCircle className="w-3 h-3" /> WhatsApp
                    </a>
                    <a href={`tel:${r.phone}`} onClick={e => e.stopPropagation()}
                      className="flex items-center gap-1 px-2 py-1 border border-gray-200 text-gray-600 text-[10px] font-medium hover:border-gold-400 transition-colors">
                      <Phone className="w-3 h-3" /> {r.phone}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Request — {selected.name}</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-400 text-xs">Name</span><div className="font-medium text-gray-800">{selected.name}</div></div>
                <div><span className="text-gray-400 text-xs">Phone</span>
                  <div className="font-medium text-gray-800">
                    <a href={`https://wa.me/92${selected.phone.replace(/^0/, "").replace(/-/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">{selected.phone}</a>
                  </div>
                </div>
                <div><span className="text-gray-400 text-xs">City</span><div className="font-medium text-gray-800">{selected.city}</div></div>
                <div><span className="text-gray-400 text-xs">Type</span><div className="font-medium text-gray-800">{selected.isGift ? "🎁 Gift for someone" : "👤 Personal purchase"}</div></div>
                {selected.isGift && selected.recipientName && <div><span className="text-gray-400 text-xs">Recipient</span><div className="font-medium text-gray-800">{selected.recipientName}</div></div>}
                {selected.occasion && <div><span className="text-gray-400 text-xs">Occasion</span><div className="font-medium text-gray-800">{selected.occasion}</div></div>}
                {selected.budget && <div><span className="text-gray-400 text-xs">Budget</span><div className="font-medium text-gray-800">{selected.budget}</div></div>}
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Description</div>
                <div className="text-sm text-gray-700 bg-gray-50 p-3 leading-relaxed">{selected.description}</div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Update Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-gold-500">
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Admin Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                  placeholder="Internal notes about this request..."
                  className="w-full px-3 py-2.5 border border-gray-200 text-sm resize-none focus:outline-none focus:border-gold-500" />
              </div>
              <div className="flex gap-3">
                <button onClick={saveUpdate} disabled={saving}
                  className="flex-1 py-2.5 bg-gold-500 text-white text-xs font-medium tracking-widest uppercase hover:bg-gold-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Save
                </button>
                <a href={`https://wa.me/92${selected.phone.replace(/^0/, "").replace(/-/g, "")}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-2.5 bg-green-500 text-white text-xs font-medium tracking-widest uppercase hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
