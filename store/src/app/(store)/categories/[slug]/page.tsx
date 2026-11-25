import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCategoryBySlug, getProductsWithImages } from "@/db/queries";
import AddToCartButton from "@/components/shop/AddToCartButton";
interface Props { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; const cat = await getCategoryBySlug(slug);
  if (!cat) return { title: "Not Found" }; return { title: cat.name };
}
export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const [cat, prods] = await Promise.all([getCategoryBySlug(slug), getProductsWithImages({ isActive: true, categorySlug: slug }).catch(() => [])]);
  if (!cat) notFound();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-2 text-xs text-dark-400 mb-6"><Link href="/" className="hover:text-gold-500">Home</Link><span>/</span><Link href="/categories" className="hover:text-gold-500">Categories</Link><span>/</span><span className="text-dark-700">{cat.name}</span></div>
      <h1 className="font-serif text-3xl font-bold text-dark-900 mb-1">{cat.name}</h1>
      {cat.description && <p className="text-dark-400 text-sm mb-2">{cat.description}</p>}
      <p className="text-xs text-dark-300 mb-8">{prods.length} gifts</p>
      {prods.length === 0 ? <div className="text-center py-20 text-5xl">🎁</div> : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {prods.map(p => {
            const img = p.images[0]; const sp = parseFloat(String(p.sellPrice)); const disc = parseFloat(String(p.discount)); const fp = disc > 0 ? sp - (sp * disc) / 100 : sp;
            return (
              <div key={p.id} className="group bg-white border border-dark-100 rounded-2xl card-3d overflow-hidden">
                <Link href={`/products/${p.slug}`}><div className="relative aspect-square bg-dark-50 overflow-hidden">{img ? <Image src={img.url} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center text-4xl">🎁</div>}{disc > 0 && <div className="absolute top-2 left-2 bg-gold-500 text-white text-[10px] font-bold px-2 py-0.5">{disc}% OFF</div>}</div></Link>
                <div className="p-3">{p.brand && <div className="text-[10px] text-dark-400 tracking-widest uppercase mb-0.5">{p.brand}</div>}<Link href={`/products/${p.slug}`}><h3 className="text-sm font-semibold text-dark-800 line-clamp-2 mb-2 group-hover:text-gold-500">{p.name}</h3></Link><div className="flex items-center justify-between"><div><div className="text-sm font-bold text-dark-900">Rs. {fp.toLocaleString("en-PK")}</div>{disc > 0 && <div className="text-xs text-dark-300 line-through">Rs. {sp.toLocaleString("en-PK")}</div>}</div><AddToCartButton product={{ id: p.id, name: p.name, slug: p.slug, brand: p.brand, sellPrice: sp, discount: disc, stock: p.stock, imageUrl: img?.url }} compact /></div></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
