import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Gift } from "lucide-react";
import { getProductsWithImages } from "@/db/queries";
import AddToCartButton from "@/components/shop/AddToCartButton";
import SearchInput from "@/components/shop/SearchInput";

export const metadata: Metadata = { title: "Search Gifts" };

interface Props { searchParams: Promise<{ q?: string }> }

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const products = q ? await getProductsWithImages({ isActive: true, search: q }).catch(() => []) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-xl mx-auto mb-10">
        <h1 className="font-serif text-2xl font-bold text-navy-900 text-center mb-6">Search Gifts</h1>
        <SearchInput initialValue={q ?? ""} />
      </div>
      {q && <p className="text-sm text-gray-500 mb-6"><span className="font-semibold text-navy-800">{products.length}</span> results for &ldquo;{q}&rdquo;</p>}
      {products.length === 0 && q && (
        <div className="text-center py-16">
          <Gift className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No gifts found for &ldquo;{q}&rdquo;</p>
          <Link href="/shop" className="text-gold-600 font-medium text-sm hover:text-gold-700">Browse all gifts →</Link>
        </div>
      )}
      {!q && <div className="text-center py-16"><Gift className="w-12 h-12 text-gray-200 mx-auto mb-4" /><p className="text-gray-400">Start typing to search for gifts...</p></div>}
      {products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product) => {
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
                    <h3 className="text-sm font-medium text-navy-800 line-clamp-2 group-hover:text-gold-600">{product.name}</h3>
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
  );
}
