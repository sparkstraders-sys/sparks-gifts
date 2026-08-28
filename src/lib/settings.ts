import { getSettingsMap } from "@/db/queries";
import type { StoreSettings } from "@/types";

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "Sparks Gifts",
  tagline: "Thoughtful Gifts, Delivered with Love.",
  email: "hello@sparksgifts.pk",
  phone: "0300-143-2502",
  whatsapp: "03001432502",
  address: "Pakistan",
  facebook: "",
  instagram: "",
  twitter: "",
  deliveryCharge: 200,
  wrappingCharge: 150,
  codAvailable: true,
  checkoutEmailEnabled: true,
  checkoutEmailRequired: false,
  heroTitle: "Thoughtful Gifts, Delivered with Love.",
  heroSubtitle: "You choose the gift. You write the message. We deliver the surprise.",
};

export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    const map = await getSettingsMap();
    return {
      storeName: map.storeName ?? DEFAULT_SETTINGS.storeName,
      logo: map.logo,
      tagline: map.tagline ?? DEFAULT_SETTINGS.tagline,
      email: map.email ?? DEFAULT_SETTINGS.email,
      phone: map.phone ?? DEFAULT_SETTINGS.phone,
      whatsapp: map.whatsapp ?? DEFAULT_SETTINGS.whatsapp,
      address: map.address ?? DEFAULT_SETTINGS.address,
      facebook: map.facebook ?? "",
      instagram: map.instagram ?? "",
      twitter: map.twitter ?? "",
      deliveryCharge: parseFloat(map.deliveryCharge ?? "200"),
      wrappingCharge: parseFloat(map.wrappingCharge ?? "150"),
      codAvailable: map.codAvailable !== "false",
      checkoutEmailEnabled: map.checkoutEmailEnabled !== "false",
      checkoutEmailRequired: map.checkoutEmailRequired === "true",
      heroTitle: map.heroTitle ?? DEFAULT_SETTINGS.heroTitle,
      heroSubtitle: map.heroSubtitle ?? DEFAULT_SETTINGS.heroSubtitle,
    };
  } catch { return DEFAULT_SETTINGS; }
}
