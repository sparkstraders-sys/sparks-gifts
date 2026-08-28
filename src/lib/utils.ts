import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return `Rs. ${num.toLocaleString("en-PK")}`;
}

export function calculateDiscountedPrice(price: number, discount: number): number {
  return price - (price * discount) / 100;
}

export function generateOrderNumber(): string {
  const prefix = "SG";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `${prefix}${timestamp}${random}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getDiscountedPrice(sellPrice: number, discount: number): number {
  if (!discount || discount === 0) return sellPrice;
  return sellPrice - (sellPrice * discount) / 100;
}
