import Link from "next/link";
import Image from "next/image";
import { Plus, Package, Gift, Pencil } from "lucide-react";
import { getAdminProducts } from "@/db/queries";
import ProductStatusToggle from "@/components/admin/ProductStatusToggle";

export default async function AdminProductsPage() {
  const products = await getAdminProducts().catch(() => []);
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Products</h1>
          <p className="text-sm text-gray-400 mt-0.5">{products.length} total products</p>
        </div>
        <Link href="/admin/products/new" className="flex items-center gap-2 px-4 py-2.5 bg-gold-500 text-white text-xs font-medium tracking-widest uppercase hover:bg-gold-600 transition-colors">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>
      <div className="bg-white border border-gray-100">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No products yet.</p>
            <Link href="/admin/products/new" className="mt-3 inline-block text-gold-600 text-sm font-medium hover:text-gold-700">Add your first product →</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Image</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => {
                  const image = p.images[0];
                  const sp = parseFloat(String(p.sellPrice));
                  const disc = parseFloat(String(p.discount));
                  const fp = disc > 0 ? sp - (sp * disc) / 100 : sp;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="w-11 h-11 bg-gray-100 overflow-hidden">
                          {image ? <Image src={image.url} alt={p.name} width={44} height={44} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Gift className="w-5 h-5 text-gray-300" /></div>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800 line-clamp-1">{p.name}</div>
                        {p.brand && <div className="text-xs text-gray-400">{p.brand}</div>}
                        {p.sku && <div className="text-xs text-gray-300 font-mono">{p.sku}</div>}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{p.category?.name ?? "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="font-medium text-gray-800">Rs. {fp.toLocaleString("en-PK")}</div>
                        {disc > 0 && <div className="text-xs text-gray-400 line-through">Rs. {sp.toLocaleString("en-PK")}</div>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-medium ${p.stock === 0 ? "text-red-500" : p.stock <= 5 ? "text-yellow-600" : "text-gray-700"}`}>{p.stock}</span>
                      </td>
                      <td className="px-4 py-3 text-center"><ProductStatusToggle id={p.id} isActive={p.isActive} /></td>
                      <td className="px-4 py-3 text-center">
                        <Link href={`/admin/products/${p.id}`} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-200 text-gray-600 hover:border-gold-400 hover:text-gold-600 transition-colors">
                          <Pencil className="w-3 h-3" /> Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
