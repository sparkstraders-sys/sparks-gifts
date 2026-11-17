import type { Metadata } from "next";
import "./globals.css";
import { getCms } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getCms();
  return {
    title: { default: cms.seo.title, template: `%s | ${cms.seo.siteName}` },
    description: cms.seo.description,
    icons: { icon: "/favicon.png" },
    openGraph: { title: cms.seo.title, description: cms.seo.description, siteName: cms.seo.siteName, type: "website" },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
