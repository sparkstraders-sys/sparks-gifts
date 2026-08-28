import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Gift } from "lucide-react";
import { getCategoryBySlug, getProductsWithImages } from "@/db/queries";
import AddToCartButton from "@/components/shop/AddToCartButton";
interface Props { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; const cat = await getCategoryBySlug(slug);
  if (!cat) return { title: "Not Found" }; return { title: cat.name };
}
export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();
  const products = await getProductsWithImages({ isActive: true, categorySlug: slug }).catch(() => []);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
        <Link href="/" className="hover:text-gold-600">Home</Link><span>/</span><Link href="/categories" className="hover:text-gold-600">Categories</Link><span>/</span><span className="text-gray-700">{category.name}</span>
      </div>
      <h1 className="font-serif text-3xl font-bold text-navy-900 mb-2">{category.name}</h1>
      {category.description && <p className="text-gray-500 text-sm mb-2">{category.description}</p>}
      <p className="text-xs text-gray-400 mb-10">{products.length} gifts</p>
      {products.length === 0 ? <div className="text-center py-20"><Gift className="w-12 h-12 text-gray-200 mx-auto mb-4" /><p className="text-gray-400">No products yet.</p></div> : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product) => {
            const image = product.images[0]; const sp = parseFloat(String(product.sellPrice)); const disc = parseFloat(String(product.discount)); const fp = disc > 0 ? sp - (sp * disc) / 100 : sp;
            return (
              <div key={product.id} className="group">
                <Link href={`/products/${product.slug}`}>
                  <div className="relative aspect-square overflow-hidden bg-gray-50 mb-3">{image ? <Image src={image.url} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center"><Gift className="w-10 h-10 text-gray-300" /></div>}{disc > 0 && <div className="absolute top-2 left-2 bg-gold-500 text-white text-[10px] font-bold px-2 py-0.5">-{disc}%</div>}</div>
                  <div className="mb-2">{product.brand && <div className="text-[10px] tracking-widest text-gray-400 uppercase mb-0.5">{product.brand}</div>}<h3 className="text-sm font-medium text-navy-800 line-clamp-2 group-hover:text-gold-600">{product.name}</h3><div className="flex items-center gap-2 mt-1.5"><span className="text-sm font-semibold text-navy-900">Rs. {fp.toLocaleString("en-PK")}</span>{disc > 0 && <span className="text-xs text-gray-400 line-through">Rs. {sp.toLocaleString("en-PK")}</span>}</div></div>
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
