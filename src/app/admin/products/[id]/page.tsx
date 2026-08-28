import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { db } from "@/db";
import { products, productImages, categories } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import ProductForm from "@/components/admin/ProductForm";

interface Props { params: Promise<{ id: string }> }

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const [product, cats] = await Promise.all([
    db.select().from(products).where(eq(products.id, id)).then(r => r[0]),
    db.select().from(categories).where(eq(categories.isActive, true)).orderBy(asc(categories.name)),
  ]);
  if (!product) notFound();
  const imgs = await db.select().from(productImages).where(eq(productImages.productId, id)).orderBy(asc(productImages.sortOrder));
  const serialized = { ...product, brand: product.brand ?? undefined, description: product.description ?? undefined, sku: product.sku ?? undefined, costPrice: parseFloat(String(product.costPrice)), sellPrice: parseFloat(String(product.sellPrice)), discount: parseFloat(String(product.discount)), images: imgs };
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600"><ChevronLeft className="w-4 h-4" /> Products</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-semibold text-gray-900">Edit: {product.name}</h1>
      </div>
      <ProductForm categories={cats} product={serialized} isEdit />
    </div>
  );
}
