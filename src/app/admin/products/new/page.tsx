import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const cats = await db.select().from(categories).where(eq(categories.isActive, true)).orderBy(asc(categories.name));
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600"><ChevronLeft className="w-4 h-4" /> Products</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-semibold text-gray-900">Add Product</h1>
      </div>
      <ProductForm categories={cats} />
    </div>
  );
}
