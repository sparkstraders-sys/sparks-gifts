import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SlidersHorizontal } from "lucide-react";
import { getProductsWithImages, getActiveCategories } from "@/db/queries";
import AddToCartButton from "@/components/shop/AddToCartButton";

export const metadata: Metadata = { title: "Shop All Gifts" };

interface Props { searchParams: Promise<{ category?: string; sort?: string; min?: string; max?: string; q?: string }> }

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;
  const [prods, cats] = await Promise.all([
    getProductsWithImages({ isActive: true, categorySlug: params.category, sortBy: params.sort, minPrice: params.min ? +params.min : undefined, maxPrice: params.max ? +params.max : undefined, search: params.q }).catch(() => []),
    getActiveCategories().catch(() => []),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-2 text-xs text-dark-400 mb-6">
        <Link href="/" className="hover:text-gold-500">Home</Link><span>/</span><span className="text-dark-700">Shop</span>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-52 flex-shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center gap-2 mb-5">
              <SlidersHorizontal className="w-4 h-4 text-gold-500" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-dark-500">Filters</span>
            </div>
            <div className="mb-6">
              <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-dark-400 mb-3">Category</div>
              <Link href="/shop" className={`block px-2 py-2 text-sm transition-colors ${!params.category ? "text-gold-500 font-semibold" : "text-dark-500 hover:text-gold-500"}`}>All Gifts</Link>
              {cats.map(c => (
                <Link key={c.id} href={`/shop?category=${c.slug}`} className={`block px-2 py-2 text-sm transition-colors ${params.category === c.slug ? "text-gold-500 font-semibold" : "text-dark-500 hover:text-gold-500"}`}>{c.name}</Link>
              ))}
            </div>
            <div className="mb-6">
              <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-dark-400 mb-3">Price Range</div>
              {[["Under Rs. 1,000","","1000"],["Rs. 1,000–2,500","1000","2500"],["Rs. 2,500–5,000","2500","5000"],["Rs. 5,000–10,000","5000","10000"],["Over Rs. 10,000","10000",""]].map(([l,mn,mx]) => (
                <Link key={l} href={`/shop?${params.category?`category=${params.category}&`:""}${mn?`min=${mn}&`:""}${mx?`max=${mx}`:""}`}
                  className="block px-2 py-2 text-sm text-dark-500 hover:text-gold-500 transition-colors">{l}</Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-dark-100">
            <p className="text-sm text-dark-400">
              <span className="font-bold text-dark-900">{prods.length}</span> gifts found{params.q ? ` for "${params.q}"` : ""}
            </p>
            <div className="flex gap-1.5">
              {[["newest","Newest"],["price-asc","Price ↑"],["price-desc","Price ↓"],["name-asc","A–Z"]].map(([v,l]) => (
                <Link key={v} href={`/shop?${params.category?`category=${params.category}&`:""}sort=${v}`}
                  className={`px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase transition-colors ${(params.sort??'newest')===v?"bg-dark-900 text-white":"border border-dark-200 text-dark-500 hover:border-gold-400"}`}>
                  {l}
                </Link>
              ))}
            </div>
          </div>

          {prods.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🎁</div>
              <p className="text-dark-400 mb-4">No gifts found</p>
              <Link href="/shop" className="text-gold-500 font-semibold text-sm">Clear filters →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {prods.map(p => {
                const img = p.images[0];
                const sp = parseFloat(String(p.sellPrice));
                const disc = parseFloat(String(p.discount));
                const fp = disc > 0 ? sp - (sp * disc) / 100 : sp;
                return (
                  <div key={p.id} className="group bg-white border border-dark-100 card-3d overflow-hidden">
                    <Link href={`/products/${p.slug}`}>
                      <div className="relative aspect-square bg-dark-50 overflow-hidden">
                        {img ? <Image src={img.url} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center text-4xl">🎁</div>}
                        {disc > 0 && <div className="absolute top-2 left-2 bg-gold-500 text-white text-[10px] font-bold px-2 py-0.5">{disc}% OFF</div>}
                      </div>
                    </Link>
                    <div className="p-3">
                      {p.brand && <div className="text-[10px] text-dark-400 tracking-widest uppercase mb-0.5">{p.brand}</div>}
                      <Link href={`/products/${p.slug}`}>
                        <h3 className="text-sm font-semibold text-dark-800 line-clamp-2 mb-1.5 group-hover:text-gold-500 transition-colors">{p.name}</h3>
                      </Link>
                      <div className="flex items-center gap-0.5 mb-2">
                        {"★★★★★".split("").map((s,i) => <span key={i} className="text-gold-400 text-[10px]">{s}</span>)}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-dark-900">Rs. {fp.toLocaleString("en-PK")}</div>
                          {disc > 0 && <div className="text-xs text-dark-300 line-through">Rs. {sp.toLocaleString("en-PK")}</div>}
                        </div>
                        <AddToCartButton product={{ id: p.id, name: p.name, slug: p.slug, brand: p.brand, sellPrice: sp, discount: disc, stock: p.stock, imageUrl: img?.url }} compact />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
