"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TrackBox({ button }: { button?: string }) {
  const [v, setV] = useState("");
  const router = useRouter();
  return (
    <form
      onSubmit={e => { e.preventDefault(); if (v.trim()) router.push(`/track?order=${encodeURIComponent(v.trim())}`); }}
      className="w-full md:w-auto flex items-center gap-2"
    >
      <input
        value={v} onChange={e => setV(e.target.value)} placeholder="SG123456789"
        className="flex-1 md:w-64 bg-white border border-dark-200 px-4 py-3 rounded-full text-sm focus:outline-none focus:border-gold-500"
        aria-label="Order number"
      />
      <button type="submit" className="px-6 py-3 rounded-full bg-dark-900 text-white text-[11px] font-bold tracking-widest uppercase hover:bg-gold-500 transition-colors btn-glow">
        {button || "Track"}
      </button>
    </form>
  );
}
