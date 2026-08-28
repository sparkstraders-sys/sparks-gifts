"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Gift, Package, User, MapPin, MessageSquare, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { getDiscountedPrice } from "@/lib/utils";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

interface FormData {
  senderName: string;
  senderPhone: string;
  senderEmail: string;
  recipientName: string;
  recipientPhone: string;
  recipientCity: string;
  recipientAddress: string;
  giftMessage: string;
  giftWrapping: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<FormData>({
    senderName: "",
    senderPhone: "",
    senderEmail: "",
    recipientName: "",
    recipientPhone: "",
    recipientCity: "",
    recipientAddress: "",
    giftMessage: "",
    giftWrapping: false,
  });

  const subtotal = getSubtotal();
  const deliveryCharge = subtotal >= 2000 ? 0 : 200;
  const wrappingCharge = form.giftWrapping ? 150 : 0;
  const total = subtotal + deliveryCharge + wrappingCharge;

  function set(field: keyof FormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }

  function validate() {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.senderName.trim()) newErrors.senderName = "Your name is required";
    if (!form.senderPhone.trim()) newErrors.senderPhone = "Your phone is required";
    else if (!/^(\+92|0)[0-9]{10}$/.test(form.senderPhone.replace(/\s/g, "")))
      newErrors.senderPhone = "Enter a valid Pakistani phone number";
    if (!form.recipientName.trim()) newErrors.recipientName = "Recipient name is required";
    if (!form.recipientPhone.trim()) newErrors.recipientPhone = "Recipient phone is required";
    else if (!/^(\+92|0)[0-9]{10}$/.test(form.recipientPhone.replace(/\s/g, "")))
      newErrors.recipientPhone = "Enter a valid Pakistani phone number";
    if (!form.recipientCity.trim()) newErrors.recipientCity = "City is required";
    if (!form.recipientAddress.trim()) newErrors.recipientAddress = "Delivery address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) return;

    setLoading(true);
    try {
      const orderItems = items.map((item) => ({
        productId: item.id,
        name: item.name,
        price: getDiscountedPrice(item.sellPrice, item.discount),
        quantity: item.quantity,
        imageUrl: item.imageUrl,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: orderItems,
          subtotal,
          deliveryCharge,
          wrappingCharge,
          total,
          paymentMethod: "COD",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to place order");
      }

      const { orderNumber } = await res.json();
      clearCart();
      router.push(`/order-confirmation?order=${orderNumber}`);
    } catch (err) {
      alert((err as Error).message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <Gift className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h1 className="font-serif text-2xl font-bold text-navy-800 mb-3">Your cart is empty</h1>
        <Link href="/shop" className="text-gold-600 font-medium text-sm hover:text-gold-700">
          Continue Shopping →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
        <Link href="/" className="hover:text-gold-600">Home</Link>
        <span>/</span>
        <Link href="/cart" className="hover:text-gold-600">Cart</Link>
        <span>/</span>
        <span className="text-gray-700">Checkout</span>
      </div>

      <h1 className="font-serif text-3xl font-bold text-navy-900 mb-10">Gift Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Sender info */}
            <div className="border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-5">
                <User className="w-4 h-4 text-gold-500" />
                <h2 className="text-xs font-medium tracking-widest uppercase text-gray-700">
                  Your Information (Sender)
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name"
                  id="senderName"
                  placeholder="e.g. Ahmed Khan"
                  value={form.senderName}
                  onChange={(e) => set("senderName", e.target.value)}
                  error={errors["senderName"]}
                  required
                />
                <Input
                  label="Your Phone"
                  id="senderPhone"
                  type="tel"
                  placeholder="e.g. 0301 2345678"
                  value={form.senderPhone}
                  onChange={(e) => set("senderPhone", e.target.value)}
                  error={errors["senderPhone"]}
                  required
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Your Email (optional)"
                    id="senderEmail"
                    type="email"
                    placeholder="you@example.com"
                    value={form.senderEmail}
                    onChange={(e) => set("senderEmail", e.target.value)}
                    hint="We'll send your order confirmation here"
                  />
                </div>
              </div>
            </div>

            {/* Recipient info */}
            <div className="border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-5">
                <MapPin className="w-4 h-4 text-gold-500" />
                <h2 className="text-xs font-medium tracking-widest uppercase text-gray-700">
                  Recipient's Information (Delivery)
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Recipient's Name"
                  id="recipientName"
                  placeholder="e.g. Sara Ahmed"
                  value={form.recipientName}
                  onChange={(e) => set("recipientName", e.target.value)}
                  error={errors["recipientName"]}
                  required
                />
                <Input
                  label="Recipient's Phone"
                  id="recipientPhone"
                  type="tel"
                  placeholder="e.g. 0321 9876543"
                  value={form.recipientPhone}
                  onChange={(e) => set("recipientPhone", e.target.value)}
                  error={errors["recipientPhone"]}
                  required
                />
                <Input
                  label="City"
                  id="recipientCity"
                  placeholder="e.g. Lahore, Karachi, Islamabad"
                  value={form.recipientCity}
                  onChange={(e) => set("recipientCity", e.target.value)}
                  error={errors["recipientCity"]}
                  required
                />
                <div className="sm:col-span-2">
                  <Textarea
                    label="Complete Delivery Address"
                    id="recipientAddress"
                    placeholder="House/Flat number, Street, Area, Landmark..."
                    value={form.recipientAddress}
                    onChange={(e) => set("recipientAddress", e.target.value)}
                    error={errors["recipientAddress"]}
                    rows={3}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Gift options */}
            <div className="border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Gift className="w-4 h-4 text-gold-500" />
                <h2 className="text-xs font-medium tracking-widest uppercase text-gray-700">
                  Gift Options
                </h2>
              </div>

              <div className="space-y-4">
                <Textarea
                  label="Personal Gift Message (optional)"
                  id="giftMessage"
                  placeholder="Write a heartfelt message for the recipient..."
                  value={form.giftMessage}
                  onChange={(e) => set("giftMessage", e.target.value)}
                  rows={4}
                  hint="This message will be printed on a gift card"
                />

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.giftWrapping}
                    onChange={(e) => set("giftWrapping", e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-gold-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-navy-800 group-hover:text-gold-600 transition-colors">
                      Add Premium Gift Wrapping
                      <span className="ml-2 text-xs bg-gold-100 text-gold-700 px-2 py-0.5 font-normal">
                        +Rs. 150
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      Beautiful premium wrapping with ribbon and gift tag
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Payment */}
            <div className="border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Package className="w-4 h-4 text-gold-500" />
                <h2 className="text-xs font-medium tracking-widest uppercase text-gray-700">
                  Payment Method
                </h2>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  checked
                  readOnly
                  className="w-4 h-4 accent-gold-500"
                />
                <div>
                  <div className="text-sm font-medium text-navy-800">Cash on Delivery (COD)</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Pay when you receive the gift. Available across Pakistan.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xs font-medium tracking-widest uppercase text-gray-700 mb-5">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-5">
                {items.map((item) => {
                  const finalPrice = getDiscountedPrice(item.sellPrice, item.discount);
                  return (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-12 h-12 flex-shrink-0 bg-gray-50">
                        {item.imageUrl ? (
                          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="48px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Gift className="w-5 h-5 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-navy-800 line-clamp-2">{item.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Qty {item.quantity} × Rs. {finalPrice.toLocaleString("en-PK")}
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-navy-900 flex-shrink-0">
                        Rs. {(finalPrice * item.quantity).toLocaleString("en-PK")}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="gold-divider mb-4" />

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-navy-800">Rs. {subtotal.toLocaleString("en-PK")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery</span>
                  <span className={deliveryCharge === 0 ? "text-green-600" : "text-navy-800"}>
                    {deliveryCharge === 0 ? "Free" : `Rs. ${deliveryCharge.toLocaleString("en-PK")}`}
                  </span>
                </div>
                {form.giftWrapping && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Gift Wrapping</span>
                    <span className="text-navy-800">Rs. {wrappingCharge.toLocaleString("en-PK")}</span>
                  </div>
                )}
              </div>

              <div className="gold-divider mb-4" />

              <div className="flex justify-between mb-6">
                <span className="font-semibold text-navy-800">Total</span>
                <span className="text-xl font-bold text-navy-900">Rs. {total.toLocaleString("en-PK")}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gold-500 text-white text-xs font-medium tracking-widest uppercase hover:bg-gold-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4" />
                    Place Order — COD
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-3">
                By placing this order you agree to our terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
