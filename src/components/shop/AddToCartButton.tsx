"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

interface Props {
  product: {
    id: string;
    name: string;
    slug: string;
    brand?: string | null;
    sellPrice: number;
    discount: number;
    stock: number;
    imageUrl?: string;
  };
  className?: string;
  fullWidth?: boolean;
}

export default function AddToCartButton({ product, className = "", fullWidth = false }: Props) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  function handleAdd() {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      sellPrice: product.sellPrice,
      discount: product.discount,
      stock: product.stock,
      imageUrl: product.imageUrl,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  if (product.stock <= 0) {
    return (
      <button
        disabled
        className={`${fullWidth ? "w-full" : ""} px-4 py-2 bg-gray-100 text-gray-400 text-xs font-medium tracking-widest uppercase cursor-not-allowed ${className}`}
      >
        Out of Stock
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className={`${fullWidth ? "w-full" : ""} flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium tracking-widest uppercase transition-all duration-200 ${
        added
          ? "bg-green-500 text-white"
          : "bg-navy-800 text-white hover:bg-gold-500"
      } ${className}`}
    >
      {added ? (
        <>
          <Check className="w-3.5 h-3.5" />
          Added
        </>
      ) : (
        <>
          <ShoppingBag className="w-3.5 h-3.5" />
          Add to Cart
        </>
      )}
    </button>
  );
}
