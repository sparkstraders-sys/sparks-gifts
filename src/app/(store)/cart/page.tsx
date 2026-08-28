"use client";

import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Gift } from "lucide-react";
import { getDiscountedPrice, formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const deliveryCharge = subtotal >= 2000 ? 0 : 200;
  const total = subtotal + deliveryCharge;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h1 className="font-serif text-2xl font-bold text-navy-800 mb-3">Your cart is empty</h1>
        <p className="text-gray-400 text-sm mb-8">Discover our curated collection of premium gifts.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gold-500 text-white text-xs font-medium tracking-widest uppercase hover:bg-gold-600 transition-colors"
        >
          Shop Gifts <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
        <Link href="/" className="hover:text-gold-600">Home</Link>
        <span>/</span>
        <span className="text-gray-700">Cart</span>
      </div>

      <h1 className="font-serif text-3xl font-bold text-navy-900 mb-10">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const finalPrice = getDiscountedPrice(item.sellPrice, item.discount);
            return (
              <div key={item.id} className="flex gap-4 p-4 border border-gray-100 bg-white">
                {/* Image */}
                <div className="relative w-20 h-20 flex-shrink-0 bg-gray-50">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Gift className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  {item.brand && (
                    <div className="text-[10px] tracking-widest text-gray-400 uppercase mb-0.5">
                      {item.brand}
                    </div>
                  )}
                  <Link
                    href={`/products/${item.slug}`}
                    className="text-sm font-medium text-navy-800 hover:text-gold-600 transition-colors line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-navy-900">
                        Rs. {finalPrice.toLocaleString("en-PK")}
                      </span>
                      {item.discount > 0 && (
                        <span className="text-xs text-gray-400 line-through">
                          Rs. {item.sellPrice.toLocaleString("en-PK")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity + remove */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 border border-gray-200 flex items-center justify-center hover:border-gold-400 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="w-7 h-7 border border-gray-200 flex items-center justify-center hover:border-gold-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-xs font-medium text-navy-700 mt-1">
                    Rs. {(finalPrice * item.quantity).toLocaleString("en-PK")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="border border-gray-100 p-6 sticky top-24">
            <h2 className="text-sm font-medium tracking-widest uppercase text-gray-700 mb-5">
              Order Summary
            </h2>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-navy-800 font-medium">Rs. {subtotal.toLocaleString("en-PK")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery</span>
                <span className={deliveryCharge === 0 ? "text-green-600 font-medium" : "text-navy-800 font-medium"}>
                  {deliveryCharge === 0 ? "Free" : `Rs. ${deliveryCharge.toLocaleString("en-PK")}`}
                </span>
              </div>
              {deliveryCharge === 0 && (
                <p className="text-xs text-green-600">🎉 You qualify for free delivery!</p>
              )}
              {deliveryCharge > 0 && (
                <p className="text-xs text-gray-400">
                  Add Rs. {(2000 - subtotal).toLocaleString("en-PK")} more for free delivery
                </p>
              )}
            </div>

            <div className="gold-divider mb-4" />

            <div className="flex justify-between mb-6">
              <span className="font-medium text-navy-800">Total</span>
              <span className="text-lg font-bold text-navy-900">Rs. {total.toLocaleString("en-PK")}</span>
            </div>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 py-4 bg-gold-500 text-white text-xs font-medium tracking-widest uppercase hover:bg-gold-600 transition-colors"
            >
              Proceed to Gift Checkout <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/shop"
              className="mt-3 w-full flex items-center justify-center gap-2 py-3 border border-gray-200 text-gray-600 text-xs font-medium tracking-widest uppercase hover:border-gold-400 hover:text-gold-600 transition-colors"
            >
              Continue Shopping
            </Link>

            {/* Gift note */}
            <div className="mt-5 p-3 bg-gold-50 border border-gold-100">
              <div className="flex items-start gap-2">
                <Gift className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gold-700">
                  At checkout, you can add a personal gift message and gift wrapping for the recipient.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
