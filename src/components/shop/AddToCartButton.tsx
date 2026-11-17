"use client";
import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

interface Props {
  product: { id: string; name: string; slug: string; brand?: string | null; sellPrice: number; discount: number; stock: number; imageUrl?: string; };
  fullWidth?: boolean;
  compact?: boolean;
  className?: string;
}

export default function AddToCartButton({ product, fullWidth, compact, className = "" }: Props) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore(s => s.addItem);

  function handle() {
    addItem({ id: product.id, name: product.name, slug: product.slug, brand: product.brand, sellPrice: product.sellPrice, discount: product.discount, stock: product.stock, imageUrl: product.imageUrl });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  if (product.stock <= 0) {
    return <button disabled className={`${fullWidth ? "w-full" : ""} px-3 py-2 bg-dark-100 text-dark-400 text-[10px] font-semibold tracking-wider uppercase cursor-not-allowed ${className}`}>Out of Stock</button>;
  }

  if (compact) {
    return (
      <button onClick={handle}
        className={`w-9 h-9 flex items-center justify-center transition-all duration-200 ${added ? "bg-green-500 text-white" : "bg-dark-900 text-white hover:bg-gold-500"} ${className}`}
        title="Add to Cart">
        {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
      </button>
    );
  }

  return (
    <button onClick={handle}
      className={`${fullWidth ? "w-full" : ""} flex items-center justify-center gap-2 px-5 py-3 text-[10px] font-bold tracking-widest uppercase transition-all duration-200 ${added ? "bg-green-500 text-white" : "bg-dark-900 text-white hover:bg-gold-500"} ${className}`}>
      {added ? <><Check className="w-3.5 h-3.5" /> Added!</> : <><ShoppingBag className="w-3.5 h-3.5" /> Add to Cart</>}
    </button>
  );
}
