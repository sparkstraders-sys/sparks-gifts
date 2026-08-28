import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Gift, ArrowRight } from "lucide-react";
import { getAllCategories } from "@/db/queries";
export const metadata: Metadata = { title: "Gift Categories" };
export default async function CategoriesPage() {
  const categories = await getAllCategories().catch(() => []);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="font-serif text-3xl lg:text-4xl font-bold text-navy-900">Shop by Category</h1>
      </div>
      {categories.length === 0 ? <div className="text-center py-20"><Gift className="w-12 h-12 text-gray-200 mx-auto mb-4" /><p className="text-gray-400">No categories yet.</p></div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/categories/${cat.slug}`} className="group bg-white border border-gray-100 hover:border-gold-300 hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="aspect-[4/3] bg-gray-50 overflow-hidden relative">
                {cat.imageUrl ? <Image src={cat.imageUrl} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center"><Gift className="w-16 h-16 text-gray-200" /></div>}
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-lg font-semibold text-navy-800 group-hover:text-gold-600 transition-colors">{cat.name}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{cat._count.products} gifts</p>
                </div>
                <div className="w-8 h-8 bg-gold-50 group-hover:bg-gold-500 flex items-center justify-center transition-colors"><ArrowRight className="w-4 h-4 text-gold-500 group-hover:text-white" /></div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
