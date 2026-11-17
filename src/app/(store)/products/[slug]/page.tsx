import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Gift, Truck, Package, ShieldCheck } from "lucide-react";
import { getProductBySlug, getProductsWithImages } from "@/db/queries";
import AddToCartButton from "@/components/shop/AddToCartButton";
import ProductImageGallery from "@/components/shop/ProductImageGallery";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Not Found" };
  return { title: p.name, description: p.description ?? `Shop ${p.name} at Sparks Gifts.` };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const sp = parseFloat(String(product.sellPrice));
  const disc = parseFloat(String(product.discount));
  const fp = disc > 0 ? sp - (sp * disc) / 100 : sp;
  const savings = sp - fp;

  const related = await getProductsWithImages({ isActive: true, categorySlug: product.category?.slug ?? "", limit: 4 }).catch(() => []);
  const filtered = related.filter(r => r.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-2 text-xs text-dark-400 mb-8 flex-wrap">
        <Link href="/" className="hover:text-gold-500">Home</Link><span>/</span>
        <Link href="/shop" className="hover:text-gold-500">Shop</Link><span>/</span>
        <span className="text-dark-700">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        <ProductImageGallery images={product.images} productName={product.name} />

        <div>
          {product.brand && <div className="text-[10px] tracking-[0.3em] text-dark-400 uppercase mb-2">{product.brand}</div>}
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-dark-900 mb-3 leading-tight">{product.name}</h1>

          {/* Stars */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-0.5">{"★★★★★".split("").map((s,i) => <span key={i} className="text-gold-400 text-base">{s}</span>)}</div>
            <span className="text-sm text-dark-400">4.8 (132 reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-dark-100">
            <span className="text-3xl font-bold text-dark-900">Rs. {fp.toLocaleString("en-PK")}</span>
            {disc > 0 && <>
              <span className="text-lg text-dark-300 line-through">Rs. {sp.toLocaleString("en-PK")}</span>
              <span className="text-xs bg-gold-100 text-gold-600 px-2 py-0.5 font-semibold">Save Rs. {savings.toLocaleString("en-PK")}</span>
            </>}
          </div>

          {product.description && (
            <div className="text-dark-500 text-sm leading-relaxed mb-6 whitespace-pre-line">{product.description}</div>
          )}

          <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
            {product.sku && <div><span className="text-dark-400 uppercase tracking-wider font-semibold">SKU: </span><span className="text-dark-600">{product.sku}</span></div>}
            <div>
              <span className="text-dark-400 uppercase tracking-wider font-semibold">Stock: </span>
              <span className={product.stock > 0 ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <AddToCartButton product={{ id: product.id, name: product.name, slug: product.slug, brand: product.brand, sellPrice: sp, discount: disc, stock: product.stock, imageUrl: product.images[0]?.url }} fullWidth className="py-4 text-sm" />
            <Link href="/cart" className="flex-1 flex items-center justify-center px-6 py-4 border-2 border-dark-900 text-dark-900 text-[10px] font-bold tracking-widest uppercase hover:bg-dark-900 hover:text-white transition-colors">
              View Cart
            </Link>
          </div>

          <div className="space-y-3 border-t border-dark-100 pt-6">
            {[{ icon: Gift, text: "Beautiful gift wrapping available at checkout" }, { icon: Truck, text: "Delivery across Pakistan — Cash on Delivery" }, { icon: ShieldCheck, text: "Secure payment · COD · JazzCash · EasyPaisa" }].map(f => (
              <div key={f.text} className="flex items-center gap-3 text-xs text-dark-500">
                <f.icon className="w-4 h-4 text-gold-500 flex-shrink-0" />{f.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {filtered.length > 0 && (
        <div className="mt-20">
          <div className="text-gold-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-2">More Gifts</div>
          <h2 className="font-serif text-2xl font-bold text-dark-900 mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filtered.map(rel => {
              const ri = rel.images[0]; const rsp = parseFloat(String(rel.sellPrice)); const rdisc = parseFloat(String(rel.discount)); const rfp = rdisc > 0 ? rsp - (rsp * rdisc) / 100 : rsp;
              return (
                <Link key={rel.id} href={`/products/${rel.slug}`} className="group bg-white border border-dark-100 card-3d overflow-hidden">
                  <div className="aspect-square bg-dark-50 overflow-hidden">{ri ? <Image src={ri.url} alt={rel.name} width={300} height={300} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" /> : <div className="w-full h-full flex items-center justify-center text-4xl">🎁</div>}</div>
                  <div className="p-3"><h3 className="text-sm font-semibold text-dark-800 line-clamp-2 group-hover:text-gold-500">{rel.name}</h3><p className="text-sm font-bold text-dark-900 mt-1">Rs. {rfp.toLocaleString("en-PK")}</p></div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
