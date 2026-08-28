"use client";

import { useState, useEffect } from "react";
import { Loader2, CheckCircle, Settings } from "lucide-react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

interface SettingsMap {
  storeName: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  facebook: string;
  instagram: string;
  twitter: string;
  deliveryCharge: string;
  wrappingCharge: string;
  codAvailable: string;
  checkoutEmailEnabled: string;
  checkoutEmailRequired: string;
  heroTitle: string;
  heroSubtitle: string;
}

const defaults: SettingsMap = {
  storeName: "Sparks Gifts",
  tagline: "Premium Gifting, Delivered with Love",
  email: "hello@sparksgifts.pk",
  phone: "+92 300 0000000",
  whatsapp: "+92 300 0000000",
  address: "Pakistan",
  facebook: "",
  instagram: "",
  twitter: "",
  deliveryCharge: "200",
  wrappingCharge: "150",
  codAvailable: "true",
  checkoutEmailEnabled: "true",
  checkoutEmailRequired: "false",
  heroTitle: "Gift Someone Special Today",
  heroSubtitle: "Premium gifts, beautifully wrapped and delivered across Pakistan",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsMap>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings({ ...defaults, ...data });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function set(key: keyof SettingsMap, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-gold-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Store Settings</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage your store configuration</p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Store Info */}
        <div className="bg-white border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-4 h-4 text-gold-500" />
            <h2 className="text-xs font-medium tracking-widest uppercase text-gray-500">Store Information</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Store Name" value={settings.storeName} onChange={(e) => set("storeName", e.target.value)} />
            <Input label="Tagline" value={settings.tagline} onChange={(e) => set("tagline", e.target.value)} />
            <Input label="Email" type="email" value={settings.email} onChange={(e) => set("email", e.target.value)} />
            <Input label="Phone" value={settings.phone} onChange={(e) => set("phone", e.target.value)} />
            <Input label="WhatsApp Number" value={settings.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} hint="Include country code e.g. +92300..." />
            <div className="sm:col-span-2">
              <Input label="Address" value={settings.address} onChange={(e) => set("address", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Social links */}
        <div className="bg-white border border-gray-100 p-5">
          <h2 className="text-xs font-medium tracking-widest uppercase text-gray-500 mb-4">Social Media</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Facebook URL" value={settings.facebook} onChange={(e) => set("facebook", e.target.value)} placeholder="https://facebook.com/..." />
            <Input label="Instagram URL" value={settings.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="https://instagram.com/..." />
            <Input label="Twitter/X URL" value={settings.twitter} onChange={(e) => set("twitter", e.target.value)} placeholder="https://twitter.com/..." />
          </div>
        </div>

        {/* Delivery & Charges */}
        <div className="bg-white border border-gray-100 p-5">
          <h2 className="text-xs font-medium tracking-widest uppercase text-gray-500 mb-4">Charges</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Delivery Charge (Rs.)" type="number" value={settings.deliveryCharge} onChange={(e) => set("deliveryCharge", e.target.value)} hint="Set to 0 for free delivery" />
            <Input label="Gift Wrapping Charge (Rs.)" type="number" value={settings.wrappingCharge} onChange={(e) => set("wrappingCharge", e.target.value)} />
          </div>
        </div>

        {/* Checkout configuration */}
        <div className="bg-white border border-gray-100 p-5">
          <h2 className="text-xs font-medium tracking-widest uppercase text-gray-500 mb-4">Checkout Configuration</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.codAvailable === "true"}
                onChange={(e) => set("codAvailable", e.target.checked ? "true" : "false")}
                className="w-4 h-4 accent-gold-500"
              />
              <div>
                <div className="text-sm font-medium text-gray-700">Cash on Delivery Available</div>
                <div className="text-xs text-gray-400">Allow COD as payment method</div>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.checkoutEmailEnabled === "true"}
                onChange={(e) => set("checkoutEmailEnabled", e.target.checked ? "true" : "false")}
                className="w-4 h-4 accent-gold-500"
              />
              <div>
                <div className="text-sm font-medium text-gray-700">Show Email Field at Checkout</div>
                <div className="text-xs text-gray-400">Customer can optionally provide email</div>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.checkoutEmailRequired === "true"}
                onChange={(e) => set("checkoutEmailRequired", e.target.checked ? "true" : "false")}
                className="w-4 h-4 accent-gold-500"
              />
              <div>
                <div className="text-sm font-medium text-gray-700">Make Email Required</div>
                <div className="text-xs text-gray-400">Only applies if email field is enabled</div>
              </div>
            </label>
          </div>
        </div>

        {/* Homepage content */}
        <div className="bg-white border border-gray-100 p-5">
          <h2 className="text-xs font-medium tracking-widest uppercase text-gray-500 mb-4">Homepage Content</h2>
          <div className="space-y-4">
            <Input label="Hero Title" value={settings.heroTitle} onChange={(e) => set("heroTitle", e.target.value)} />
            <Textarea label="Hero Subtitle" value={settings.heroSubtitle} onChange={(e) => set("heroSubtitle", e.target.value)} rows={2} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-white text-xs font-medium tracking-widest uppercase hover:bg-gold-600 transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : null}
            {saved ? "Saved!" : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
