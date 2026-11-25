"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getDiscountedPrice } from "@/lib/utils";
interface CartItem { id: string; name: string; slug: string; brand?: string | null; sellPrice: number; discount: number; quantity: number; imageUrl?: string; stock: number; }
interface CartStore { items: CartItem[]; addItem: (item: Omit<CartItem, "quantity">) => void; removeItem: (id: string) => void; updateQuantity: (id: string, qty: number) => void; clearCart: () => void; getTotalItems: () => number; getSubtotal: () => number; }
export const useCartStore = create<CartStore>()(persist((set, get) => ({
  items: [],
  addItem: (newItem) => set(state => { const ex = state.items.find(i => i.id === newItem.id); if (ex) return { items: state.items.map(i => i.id === newItem.id ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) } : i) }; return { items: [...state.items, { ...newItem, quantity: 1 }] }; }),
  removeItem: (id) => set(state => ({ items: state.items.filter(i => i.id !== id) })),
  updateQuantity: (id, qty) => { if (qty <= 0) { get().removeItem(id); return; } set(state => ({ items: state.items.map(i => i.id === id ? { ...i, quantity: Math.min(qty, i.stock) } : i) })); },
  clearCart: () => set({ items: [] }),
  getTotalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
  getSubtotal: () => get().items.reduce((s, i) => s + getDiscountedPrice(i.sellPrice, i.discount) * i.quantity, 0),
}), { name: "sparks-v2-cart" }));
