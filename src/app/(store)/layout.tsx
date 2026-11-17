import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getCms, getSite } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [cms, site] = await Promise.all([getCms(), getSite()]);
  return (
    <div className="flex flex-col min-h-screen">
      <Header announcement={cms.announcement} />
      <main className="flex-1">{children}</main>
      <Footer cms={cms} site={site} />
    </div>
  );
}
