import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getAllCategories } from "@/db/queries";
export const metadata: Metadata = { title: "Gift Categories" };
export default async function CategoriesPage() {
  const cats = await getAllCategories().catch(() => []);
  const ICONS: Record<string, string> = { perfumes: "🌹", chocolates: "🍫", "gift-sets": "🎁", "flowers-bouquets": "💐", cakes: "🎂", accessories: "💍", default: "✨" };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="text-gold-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-2">Collections</div>
        <h1 className="font-serif text-3xl lg:text-4xl font-bold text-dark-900">Shop by Occasion</h1>
      </div>
      {cats.length === 0 ? <div className="text-center py-20 text-5xl">🎁</div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cats.map(cat => (
            <Link key={cat.id} href={`/categories/${cat.slug}`} className="group bg-white border border-dark-100 hover:border-gold-400 hover:shadow-lg transition-all duration-300 overflow-hidden card-3d">
              <div className="relative aspect-[4/3] bg-dark-50 overflow-hidden">
                {cat.imageUrl ? <Image src={cat.imageUrl} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center text-6xl">{ICONS[cat.slug] ?? ICONS.default}</div>}
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-lg font-bold text-dark-800 group-hover:text-gold-500 transition-colors">{cat.name}</h2>
                  <p className="text-xs text-dark-400 mt-0.5">{cat._count.products} gifts</p>
                </div>
                <div className="w-8 h-8 bg-dark-50 group-hover:bg-gold-500 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-4 h-4 text-dark-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
