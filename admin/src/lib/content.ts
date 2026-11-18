import { getSettingsMap } from "@/db/queries";

export interface Cms {
  announcement: { enabled: boolean; text: string };
  seo: { siteName: string; title: string; description: string };
  hero: {
    imageUrl: string; notice: string;
    badge: string; line1: string; line2: string; subtitle: string;
    btn1Text: string; btn1Link: string; btn2Text: string; btn2Link: string;
    stats: { value: string; label: string }[];
  };
  features: { title: string; desc: string }[];
  show: { categories: boolean; products: boolean; howItWorks: boolean; customBanner: boolean; testimonials: boolean; track: boolean };
  sections: {
    categoriesEyebrow: string; categoriesTitle: string;
    productsEyebrow: string; productsTitle: string;
    howEyebrow: string; howTitle: string;
    testimonialsEyebrow: string; testimonialsTitle: string;
  };
  howItWorks: { icon: string; title: string; desc: string }[];
  customBanner: { eyebrow: string; title: string; text: string; button: string; whatsappButton: string; point1: string; point2: string };
  track: { title: string; text: string };
  testimonials: { name: string; city: string; text: string }[];
  about: {
    eyebrow: string; title1: string; title2: string; intro: string; quote: string;
    stepsTitle: string; steps: { icon: string; title: string; desc: string }[];
    promiseEyebrow: string; promiseTitle: string; promiseText: string; promiseQuote: string;
    highlights: { title: string; desc: string }[];
  };
  contact: { intro: string; phone2: string; whatsapp2: string; hours: string; deliveryNote: string };
  faqs: { q: string; a: string }[];
  footer: { about: string; copyright: string; showOccasions: boolean; occasions: string[] };
  pages: { slug: string; title: string; body: string; showInFooter: boolean }[];
}

export const DEFAULT_CMS: Cms = {
  announcement: { enabled: true, text: "🎁 PAKISTAN-WIDE DELIVERY · COD · JAZZCASH · EASYPAISA · 0300-143-2502" },
  seo: {
    siteName: "Sparks Gifts",
    title: "Sparks Gifts — Thoughtful Gifts, Delivered with Love",
    description: "Premium gifts, beautifully wrapped and delivered anywhere in Pakistan. Choose the gift, write a message, we deliver the surprise.",
  },
  hero: {
    imageUrl: "",
    notice: "Pakistan-wide delivery · Free delivery on orders over Rs. 2,000",
    badge: "Gifts That Travel Your Feelings",
    line1: "Send Love,", line2: "Across Cities.",
    subtitle: "Premium gifts, beautifully wrapped and delivered anywhere in Pakistan. You choose the gift — we deliver the surprise.",
    btn1Text: "Shop Gifts", btn1Link: "/shop", btn2Text: "✨ Custom Gift", btn2Link: "/custom-gift",
    stats: [
      { value: "500+", label: "Happy Customers" },
      { value: "100+", label: "Gift Options" },
      { value: "50+", label: "Cities Covered" },
    ],
  },
  features: [
    { title: "Premium Gifts", desc: "Handpicked for every occasion" },
    { title: "Nationwide Delivery", desc: "Across Pakistan" },
    { title: "Secure Payments", desc: "COD & Online" },
    { title: "Gift Wrapping", desc: "With personal message" },
  ],
  show: { categories: true, products: true, howItWorks: true, customBanner: true, testimonials: true, track: true },
  sections: {
    categoriesEyebrow: "Shop by Occasion", categoriesTitle: "Find the Perfect Gift",
    productsEyebrow: "Our Collection", productsTitle: "Trending Gifts",
    howEyebrow: "Simple Process", howTitle: "How It Works?",
    testimonialsEyebrow: "Loved by Customers", testimonialsTitle: "What People Say",
  },
  howItWorks: [
    { icon: "🛍", title: "Choose a Gift", desc: "Pick from our curated collection" },
    { icon: "📋", title: "Add Details", desc: "Recipient address & message" },
    { icon: "🚚", title: "We Deliver", desc: "Beautifully wrapped" },
    { icon: "❤️", title: "Make Someone Happy", desc: "Spread the joy!" },
  ],
  customBanner: {
    eyebrow: "✨ Can't find what you need?",
    title: "Order Any Gift on Demand",
    text: "Tell us what you want — we'll source it, wrap it and deliver it. Just like ordering on demand!",
    button: "🎁 Request Custom Gift",
    whatsappButton: "Chat on WhatsApp",
    point1: "Dedicated WhatsApp consultation",
    point2: "Photo approval before dispatch",
  },
  track: { title: "Expecting a surprise?", text: "Enter your order number (e.g. SG123456789) to see where your gift is." },
  testimonials: [
    { name: "Ayesha K.", city: "Lahore", text: "Sent a perfume set to my sister in Karachi. It arrived beautifully wrapped with my message. She was so happy!" },
    { name: "Usman R.", city: "Islamabad", text: "Smooth ordering and quick delivery. Highly recommended for anniversary gifts." },
    { name: "Sana M.", city: "Sialkot", text: "The custom gift option is great — they found exactly what I needed." },
  ],
  about: {
    eyebrow: "About Us",
    title1: "Making Distance Feel", title2: "a Little Smaller",
    intro: "Sparks Gifts is a modern online gifting store dedicated to making special moments more memorable. We help you send thoughtful gifts to your loved ones — even when you cannot be there in person.",
    quote: "You choose the gift. You write the message. We deliver the surprise.",
    stepsTitle: "How Sparks Gifts Works",
    steps: [
      { icon: "🎁", title: "Choose a Gift", desc: "Browse our curated collection of premium gifts." },
      { icon: "📍", title: "Enter Recipient Details", desc: "Provide name, phone and delivery address." },
      { icon: "💌", title: "Add Your Message", desc: "Write a heartfelt message for the recipient." },
      { icon: "🎀", title: "We Gift-Wrap It", desc: "Beautifully prepared and packaged." },
      { icon: "🚚", title: "We Deliver It", desc: "Delivered directly to their doorstep." },
    ],
    promiseEyebrow: "Our Promise",
    promiseTitle: "A Gift That Speaks When Words Fall Short",
    promiseText: "From perfumes and chocolates to gift sets for birthdays, anniversaries and special occasions — choose your gift, provide details, add a message, and let us take care of the rest.",
    promiseQuote: "Because sometimes, a thoughtful gift can say what words cannot. ❤️",
    highlights: [
      { title: "Curated Gift Collection", desc: "Perfumes, chocolates, gift sets carefully selected for every occasion." },
      { title: "Personal Touch", desc: "Every order includes a printed gift card with your personal message." },
      { title: "Beautiful Gift Wrapping", desc: "Premium wrapping — your gift arrives as special as it feels." },
      { title: "Pakistan-wide Delivery", desc: "From Karachi to Lahore, Islamabad to Peshawar." },
    ],
  },
  contact: {
    intro: "Have a question or need help? We're happy to help.",
    phone2: "0300-143-2007", whatsapp2: "923001432007",
    hours: "Mon – Sat, 10 AM – 8 PM",
    deliveryNote: "Pakistan-wide, all major cities",
  },
  faqs: [
    { q: "How do I track my order?", a: "Use the Track Order page with your order number (e.g. SG123456789)." },
    { q: "Do you deliver across Pakistan?", a: "Yes — we deliver to all major cities and towns." },
    { q: "What payment methods are available?", a: "COD, JazzCash, EasyPaisa, and Raast bank transfers." },
    { q: "Can I add a personal message?", a: "Yes, write your message at checkout — it goes on a gift card." },
    { q: "Is gift wrapping included?", a: "Premium wrapping is optional at checkout." },
  ],
  footer: {
    about: "Thoughtful Gifts, Delivered with Love. You choose the gift. We deliver the surprise — anywhere in Pakistan.",
    copyright: "Sparks Gifts. All rights reserved.",
    showOccasions: true,
    occasions: ["Birthday", "Anniversary", "Eid Gifts", "Wedding", "Baby Shower", "Corporate"],
  },
  pages: [
    { slug: "privacy", title: "Privacy Policy", showInFooter: true, body: "# Your privacy\nWe collect only the details needed to deliver your order: your name, phone number, email (optional) and the recipient's address.\n\n# How we use it\nYour information is used only to prepare, deliver and support your order. We never sell your data.\n\n# Contact\nFor any privacy question, contact us using the details on the Contact page." },
    { slug: "terms", title: "Terms & Conditions", showInFooter: true, body: "# Orders\nAn order is confirmed once our team contacts you or the order status changes to Processing.\n\n# Pricing\nPrices are in Pakistani Rupees and may change without notice.\n\n# Payments\nCash on Delivery is available for regular orders. Gifts sent to someone else through Custom Gift are paid online." },
    { slug: "shipping", title: "Shipping & Delivery", showInFooter: true, body: "# Delivery area\nWe deliver across Pakistan.\n\n# Delivery time\nMost orders arrive within 3-5 working days.\n\n# Charges\nDelivery charges are shown at checkout. Orders above the free-delivery amount ship free." },
    { slug: "returns", title: "Returns & Refunds", showInFooter: false, body: "# Damaged or wrong item\nIf your gift arrives damaged or incorrect, contact us within 24 hours with photos and we will fix it.\n\n# Personalised items\nCustom or personalised gifts cannot be returned unless damaged." },
  ],
};

function isObj(v: unknown): v is Record<string, unknown> { return typeof v === "object" && v !== null && !Array.isArray(v); }

// Merge saved content over defaults. Objects merge key by key; arrays/primitives are replaced.
export function mergeCms<T>(base: T, saved: unknown): T {
  if (Array.isArray(base)) return (Array.isArray(saved) ? saved : base) as T;
  if (isObj(base)) {
    const out: Record<string, unknown> = {};
    const s = isObj(saved) ? saved : {};
    for (const k of Object.keys(base)) out[k] = mergeCms((base as Record<string, unknown>)[k], s[k]);
    return out as T;
  }
  return (saved !== undefined && typeof saved === typeof base ? saved : base) as T;
}

export async function getCms(): Promise<Cms> {
  try {
    const map = await Promise.race([getSettingsMap(), new Promise<Record<string, string>>((_, rej) => setTimeout(() => rej(new Error("timeout")), 6000))]);
    if (map.cms) return mergeCms(DEFAULT_CMS, JSON.parse(map.cms));
  } catch { /* fall back to defaults */ }
  return DEFAULT_CMS;
}

export interface Site { storeName: string; tagline: string; email: string; phone: string; whatsapp: string; address: string; facebook: string; instagram: string; twitter: string }
export async function getSite(): Promise<Site> {
  let m: Record<string, string> = {};
  try { m = await Promise.race([getSettingsMap(), new Promise<Record<string, string>>((_, rej) => setTimeout(() => rej(new Error("timeout")), 6000))]); } catch { /* defaults */ }
  const pick = (k: string, d: string) => (m[k] && m[k].trim() ? m[k] : d);
  return {
    storeName: pick("storeName", "Sparks Gifts"), tagline: pick("tagline", "Thoughtful Gifts, Delivered with Love."),
    email: pick("email", "thesparkstraders@gmail.com"), phone: pick("phone", "0300-143-2502"),
    whatsapp: pick("whatsapp", "923001432502"), address: pick("address", "Pakistan"),
    facebook: m.facebook ?? "", instagram: m.instagram ?? "", twitter: m.twitter ?? "",
  };
}
