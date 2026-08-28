import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Gift, Package, Truck } from "lucide-react";
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

  const related = await getProductsWithImages({ isActive: true, limit: 4 }).catch(() => []);
  const relatedFiltered = related.filter((r) => r.categoryId === product.categoryId && r.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-8 flex-wrap">
        <Link href="/" className="hover:text-gold-600">Home</Link><span>/</span>
        <Link href="/shop" className="hover:text-gold-600">Shop</Link><span>/</span>
        <span className="text-gray-600">{product.name}</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        <ProductImageGallery images={product.images} productName={product.name} />
        <div className="flex flex-col">
          {product.brand && <div className="text-xs tracking-widest text-gray-400 uppercase mb-1">{product.brand}</div>}
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-navy-900 mb-3">{product.name}</h1>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-2xl font-bold text-navy-900">Rs. {fp.toLocaleString("en-PK")}</span>
            {disc > 0 && <><span className="text-base text-gray-400 line-through">Rs. {sp.toLocaleString("en-PK")}</span><span className="text-xs bg-gold-100 text-gold-700 px-2 py-0.5 font-medium">Save Rs. {savings.toLocaleString("en-PK")}</span></>}
          </div>
          <div className="gold-divider mb-6" />
          {product.description && <div className="text-gray-600 text-sm leading-relaxed mb-6 whitespace-pre-line">{product.description}</div>}
          <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
            {product.sku && <div><span className="text-gray-400 uppercase tracking-wider">SKU: </span><span className="text-gray-600">{product.sku}</span></div>}
            <div><span className="text-gray-400 uppercase tracking-wider">Stock: </span><span className={product.stock > 0 ? "text-green-600 font-medium" : "text-red-500 font-medium"}>{product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}</span></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <AddToCartButton product={{ id: product.id, name: product.name, slug: product.slug, brand: product.brand, sellPrice: sp, discount: disc, stock: product.stock, imageUrl: product.images[0]?.url }} fullWidth className="py-4 text-sm" />
            <Link href="/cart" className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 border-navy-800 text-navy-800 text-xs font-medium tracking-widest uppercase hover:bg-navy-800 hover:text-white transition-colors">View Cart</Link>
          </div>
          <div className="space-y-3 border-t border-gray-100 pt-6">
            {[{ icon: Gift, text: "Beautiful gift wrapping available at checkout" }, { icon: Truck, text: "Delivery across Pakistan – Cash on Delivery" }, { icon: Package, text: "Carefully packaged to arrive in perfect condition" }].map((f) => (
              <div key={f.text} className="flex items-center gap-3 text-xs text-gray-500"><f.icon className="w-4 h-4 text-gold-500 flex-shrink-0" />{f.text}</div>
            ))}
          </div>
        </div>
      </div>
      {relatedFiltered.length > 0 && (
        <div className="mt-20">
          <h2 className="font-serif text-2xl font-bold text-navy-900 mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {relatedFiltered.map((rel) => {
              const rsp = parseFloat(String(rel.sellPrice)); const rdisc = parseFloat(String(rel.discount));
              const rfp = rdisc > 0 ? rsp - (rsp * rdisc) / 100 : rsp;
              const rimg = rel.images[0];
              return (
                <Link key={rel.id} href={`/products/${rel.slug}`} className="group">
                  <div className="aspect-square overflow-hidden bg-gray-50 mb-3">{rimg ? <Image src={rimg.url} alt={rel.name} width={300} height={300} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" /> : <div className="w-full h-full flex items-center justify-center"><Gift className="w-10 h-10 text-gray-300" /></div>}</div>
                  <h3 className="text-sm font-medium text-navy-800 line-clamp-2 group-hover:text-gold-600">{rel.name}</h3>
                  <p className="text-sm font-semibold text-navy-900 mt-1">Rs. {rfp.toLocaleString("en-PK")}</p>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
