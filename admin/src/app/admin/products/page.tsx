import Link from"next/link";import Image from"next/image";import{Plus,Package,Pencil}from"lucide-react";import{getAdminProducts}from"@/db/queries";import ProductStatusToggle from"@/components/admin/ProductStatusToggle";
export default async function AdminProductsPage(){
  const products=await getAdminProducts().catch(()=>[]);
  return(
    <div className="space-y-5">
      <div className="flex items-center justify-between"><div><h1 className="text-xl font-bold text-dark-900">Products</h1><p className="text-sm text-dark-400 mt-0.5">{products.length} total</p></div><Link href="/admin/products/new" className="flex items-center gap-2 px-4 py-2.5 bg-gold-500 text-white text-[11px] font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors"><Plus className="w-4 h-4"/>Add Product</Link></div>
      <div className="bg-white border border-dark-100">
        {products.length===0?(<div className="text-center py-16"><Package className="w-10 h-10 text-dark-200 mx-auto mb-3"/><p className="text-dark-400 text-sm">No products yet.</p><Link href="/admin/products/new" className="mt-3 inline-block text-gold-500 text-sm font-semibold hover:text-gold-600">Add your first product →</Link></div>):(
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="bg-dark-50 border-b border-dark-100"><tr>{["Image","Product","Category","Price","Stock","Status","Edit"].map(h=><th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-dark-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-dark-50">
              {products.map(p=>{const img=p.images[0];const sp=parseFloat(String(p.sellPrice));const disc=parseFloat(String(p.discount));const fp=disc>0?sp-(sp*disc)/100:sp;return(
                <tr key={p.id} className="hover:bg-dark-50 transition-colors">
                  <td className="px-4 py-3"><div className="w-11 h-11 bg-dark-100 overflow-hidden">{img?<Image src={img.url} alt={p.name} width={44} height={44} className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center text-xl">🎁</div>}</div></td>
                  <td className="px-4 py-3"><div className="font-semibold text-dark-800 line-clamp-1">{p.name}</div>{p.brand&&<div className="text-xs text-dark-400">{p.brand}</div>}{p.sku&&<div className="text-xs text-dark-300 font-mono">{p.sku}</div>}</td>
                  <td className="px-4 py-3 text-dark-500 text-xs">{p.category?.name??"—"}</td>
                  <td className="px-4 py-3"><div className="font-semibold text-dark-800">Rs. {fp.toLocaleString("en-PK")}</div>{disc>0&&<div className="text-xs text-dark-300 line-through">Rs. {sp.toLocaleString("en-PK")}</div>}</td>
                  <td className="px-4 py-3"><span className={`font-bold ${p.stock===0?"text-red-500":p.stock<=5?"text-yellow-600":"text-dark-700"}`}>{p.stock}</span></td>
                  <td className="px-4 py-3"><ProductStatusToggle id={p.id} isActive={p.isActive}/></td>
                  <td className="px-4 py-3"><Link href={`/admin/products/${p.id}`} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs border border-dark-200 text-dark-600 hover:border-gold-400 hover:text-gold-500 transition-colors"><Pencil className="w-3 h-3"/>Edit</Link></td>
                </tr>
              );})}
            </tbody>
          </table></div>
        )}
      </div>
    </div>
  );
}
