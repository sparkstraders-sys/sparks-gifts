"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function AccountPage() {
  const [f, setF] = useState({ currentPassword: "", newPassword: "", confirm: "", newEmail: "", name: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const set = (k: string, v: string) => setF(p => ({ ...p, [k]: v }));

  async function save(e: React.FormEvent) {
    e.preventDefault(); setMsg(null);
    if (f.newPassword && f.newPassword !== f.confirm) return setMsg({ ok: false, text: "New passwords do not match" });
    if (!f.newPassword && !f.newEmail && !f.name) return setMsg({ ok: false, text: "Change at least one thing" });
    setBusy(true);
    const body: Record<string, string> = { currentPassword: f.currentPassword };
    if (f.newPassword) body.newPassword = f.newPassword;
    if (f.newEmail) body.newEmail = f.newEmail;
    if (f.name) body.name = f.name;
    const r = await fetch("/api/admin/account", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) return setMsg({ ok: false, text: d.error ?? "Something went wrong" });
    setMsg({ ok: true, text: "Saved." + (d.relogin ? " Please login again with the new details." : "") });
    if (d.relogin) setTimeout(() => signOut({ callbackUrl: "/admin/login" }), 1500);
  }

  const inp = "w-full px-4 py-3 border border-dark-200 text-sm focus:outline-none focus:border-gold-500";
  const lab = "block text-[10px] font-bold tracking-wider uppercase text-dark-500 mb-1.5";
  return (
    <div className="space-y-5 max-w-xl">
      <div><h1 className="text-xl font-bold text-dark-900">My Account</h1><p className="text-sm text-dark-400 mt-0.5">Change your admin login email, name or password</p></div>
      <form onSubmit={save} className="bg-white border border-dark-100 p-5 space-y-4">
        <div><label className={lab}>Current password (required)</label><input type="password" required value={f.currentPassword} onChange={e => set("currentPassword", e.target.value)} className={inp} /></div>
        <hr className="border-dark-100" />
        <div><label className={lab}>Your name (optional)</label><input value={f.name} onChange={e => set("name", e.target.value)} className={inp} /></div>
        <div><label className={lab}>New login email (optional)</label><input type="email" value={f.newEmail} onChange={e => set("newEmail", e.target.value)} className={inp} /></div>
        <div><label className={lab}>New password (optional, min 8 characters)</label><input type="password" value={f.newPassword} onChange={e => set("newPassword", e.target.value)} className={inp} /></div>
        <div><label className={lab}>Confirm new password</label><input type="password" value={f.confirm} onChange={e => set("confirm", e.target.value)} className={inp} /></div>
        {msg && <p className={`text-sm ${msg.ok ? "text-green-600" : "text-red-600"}`}>{msg.text}</p>}
        <button disabled={busy} className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-white text-[11px] font-bold tracking-widest uppercase hover:bg-gold-400 disabled:opacity-60">{busy && <Loader2 className="w-4 h-4 animate-spin" />}Save changes</button>
      </form>
    </div>
  );
}
