import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function formatPrice(p: number | string) { return `Rs. ${parseFloat(String(p)).toLocaleString("en-PK")}`; }
export function getDiscountedPrice(sell: number, disc: number) { return disc > 0 ? sell - (sell * disc) / 100 : sell; }
export function generateOrderNumber() { return `SG${Date.now().toString().slice(-6)}${Math.floor(Math.random()*1000).toString().padStart(3,"0")}`; }
export function slugify(t: string) { return t.toLowerCase().replace(/[^\w\s-]/g,"").replace(/[\s_-]+/g,"-").replace(/^-+|-+$/g,""); }
