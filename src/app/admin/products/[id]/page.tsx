import{notFound}from"next/navigation";import Link from"next/link";import{ChevronLeft}from"lucide-react";import{db}from"@/db";import{products,productImages,categories}from"@/db/schema";import{eq,asc}from"drizzle-orm";import ProductForm from"@/components/admin/ProductForm";
interface P{params:Promise<{id:string}>}
export default async function EditProduct({params}:P){
  const{id}=await params;
  const[[p],cats]=await Promise.all([db.select().from(products).where(eq(products.id,id)),db.select().from(categories).where(eq(categories.isActive,true)).orderBy(asc(categories.name))]);
  if(!p)notFound();
  const imgs=await db.select().from(productImages).where(eq(productImages.productId,id)).orderBy(asc(productImages.sortOrder));
  const s={...p,brand:p.brand??undefined,description:p.description??undefined,sku:p.sku??undefined,costPrice:parseFloat(String(p.costPrice)),sellPrice:parseFloat(String(p.sellPrice)),discount:parseFloat(String(p.discount)),images:imgs};
  return(<div className="space-y-5"><div className="flex items-center gap-3"><Link href="/admin/products" className="flex items-center gap-1 text-sm text-dark-400 hover:text-dark-600"><ChevronLeft className="w-4 h-4"/>Products</Link><span className="text-dark-200">/</span><h1 className="text-xl font-bold text-dark-900">Edit: {p.name}</h1></div><ProductForm categories={cats} product={s} isEdit/></div>);
}
