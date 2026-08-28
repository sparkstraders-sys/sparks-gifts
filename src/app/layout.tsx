import type { Metadata } from "next";
import "./globals.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";

export const metadata: Metadata = {
  title: { default: "Sparks Gifts – Thoughtful Gifts, Delivered with Love", template: "%s | Sparks Gifts" },
  description: "Sparks Gifts is Pakistan's premium online gifting store. Send thoughtful gifts to your loved ones across Pakistan. COD, JazzCash, EasyPaisa accepted.",
  keywords: ["gifts pakistan", "online gifting", "send gifts pakistan", "perfume gift", "gift delivery pakistan"],
  icons: { icon: "/favicon.png", apple: "/logo.png" },
  openGraph: { type: "website", locale: "en_PK", siteName: "Sparks Gifts" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
