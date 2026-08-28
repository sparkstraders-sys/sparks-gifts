import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Gift, SlidersHorizontal } from "lucide-react";
import { getProductsWithImages, getActiveCategories } from "@/db/queries";
import AddToCartButton from "@/components/shop/AddToCartButton";

export const metadata: Metadata = { title: "Shop All Gifts" };

interface Props { searchParams: Promise<{ category?: string; sort?: string; min?: string; max?: string; q?: string }> }

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;
  const [prods, cats] = await Promise.all([
    getProductsWithImages({ isActive: true, categorySlug: params.category, sortBy: params.sort, minPrice: params.min ? parseFloat(params.min) : undefined, maxPrice: params.max ? parseFloat(params.max) : undefined, search: params.q }).catch(() => []),
    getActiveCategories().catch(() => []),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
        <Link href="/" className="hover:text-gold-600">Home</Link><span>/</span><span className="text-gray-700">Shop</span>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-56 flex-shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center gap-2 mb-5"><SlidersHorizontal className="w-4 h-4 text-gold-500" /><h2 className="text-xs font-medium tracking-widest uppercase text-gray-700">Filters</h2></div>
            <div className="mb-6">
              <h3 className="text-[10px] font-medium tracking-widest uppercase text-gray-400 mb-3">Category</h3>
              <ul className="space-y-1">
                <li><Link href="/shop" className={`block px-2 py-1.5 text-sm transition-colors ${!params.category ? "text-gold-600 font-medium" : "text-gray-600 hover:text-gold-600"}`}>All Gifts</Link></li>
                {cats.map((cat) => (
                  <li key={cat.id}><Link href={`/shop?category=${cat.slug}`} className={`block px-2 py-1.5 text-sm transition-colors ${params.category === cat.slug ? "text-gold-600 font-medium" : "text-gray-600 hover:text-gold-600"}`}>{cat.name}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
            <p className="text-sm text-gray-500"><span className="font-semibold text-navy-800">{prods.length}</span> gifts found</p>
            <div className="flex items-center gap-2">
              {[["newest","Newest"],["price-asc","Price ↑"],["price-desc","Price ↓"]].map(([v,l]) => (
                <Link key={v} href={`/shop?${params.category ? `category=${params.category}&` : ""}sort=${v}`} className={`px-3 py-1.5 text-xs font-medium tracking-wider transition-colors ${(params.sort ?? "newest") === v ? "bg-gold-500 text-white" : "border border-gray-200 text-gray-600 hover:border-gold-400"}`}>{l}</Link>
              ))}
            </div>
          </div>
          {prods.length === 0 ? (
            <div className="text-center py-20"><Gift className="w-12 h-12 text-gray-200 mx-auto mb-4" /><p className="text-gray-400">No gifts found</p><Link href="/shop" className="mt-3 inline-block text-gold-600 text-sm font-medium">Clear filters</Link></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
              {prods.map((product) => {
                const image = product.images[0];
                const sp = parseFloat(String(product.sellPrice));
                const disc = parseFloat(String(product.discount));
                const fp = disc > 0 ? sp - (sp * disc) / 100 : sp;
                return (
                  <div key={product.id} className="group">
                    <Link href={`/products/${product.slug}`}>
                      <div className="relative aspect-square overflow-hidden bg-gray-50 mb-3">
                        {image ? <Image src={image.url} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center"><Gift className="w-10 h-10 text-gray-300" /></div>}
                        {disc > 0 && <div className="absolute top-2 left-2 bg-gold-500 text-white text-[10px] font-bold px-2 py-0.5">-{disc}%</div>}
                      </div>
                      <div className="mb-2">
                        {product.brand && <div className="text-[10px] tracking-widest text-gray-400 uppercase mb-0.5">{product.brand}</div>}
                        <h3 className="text-sm font-medium text-navy-800 line-clamp-2 group-hover:text-gold-600 transition-colors">{product.name}</h3>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-sm font-semibold text-navy-900">Rs. {fp.toLocaleString("en-PK")}</span>
                          {disc > 0 && <span className="text-xs text-gray-400 line-through">Rs. {sp.toLocaleString("en-PK")}</span>}
                        </div>
                      </div>
                    </Link>
                    <AddToCartButton product={{ id: product.id, name: product.name, slug: product.slug, brand: product.brand, sellPrice: sp, discount: disc, stock: product.stock, imageUrl: image?.url }} />
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
