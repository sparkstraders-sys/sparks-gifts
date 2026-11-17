import Link from"next/link";import{ShoppingBag,Eye}from"lucide-react";import{getAdminOrders}from"@/db/queries";
const SC:Record<string,string>={PENDING:"bg-yellow-100 text-yellow-700",PROCESSING:"bg-blue-100 text-blue-700",GIFT_WRAPPED:"bg-purple-100 text-purple-700",SHIPPED:"bg-orange-100 text-orange-700",DELIVERED:"bg-green-100 text-green-700",CANCELLED:"bg-red-100 text-red-600"};
interface P{searchParams:Promise<{status?:string;page?:string}>}
export default async function AdminOrders({searchParams}:P){
  const{status,page:pg}=await searchParams;const page=parseInt(pg??"1");
  const{orders,total}=await getAdminOrders({status,limit:20,offset:(page-1)*20}).catch(()=>({orders:[],total:0}));
  const pages=Math.ceil(total/20);const statuses=["PENDING","PROCESSING","GIFT_WRAPPED","SHIPPED","DELIVERED","CANCELLED"];
  return(
    <div className="space-y-5">
      <div><h1 className="text-xl font-bold text-dark-900">Orders</h1><p className="text-sm text-dark-400 mt-0.5">{total} total</p></div>
      <div className="flex flex-wrap gap-2">
        <Link href="/admin/orders" className={`px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase transition-colors ${!status?"bg-gold-500 text-white":"border border-dark-200 text-dark-500 hover:border-gold-400"}`}>All</Link>
        {statuses.map(s=><Link key={s} href={`/admin/orders?status=${s}`} className={`px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase transition-colors ${status===s?"bg-gold-500 text-white":"border border-dark-200 text-dark-500 hover:border-gold-400"}`}>{s.replace("_"," ")}</Link>)}
      </div>
      <div className="bg-white border border-dark-100">
        {orders.length===0?(<div className="text-center py-16"><ShoppingBag className="w-10 h-10 text-dark-200 mx-auto mb-3"/><p className="text-dark-400 text-sm">No orders {status?`with status "${status}"`:"yet"}</p></div>):(
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="bg-dark-50 border-b border-dark-100"><tr>{["Order","Type","Sender","Recipient","City","Total","Status",""].map(h=><th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-dark-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-dark-50">
              {orders.map(o=>(
                <tr key={o.id} className="hover:bg-dark-50 transition-colors">
                  <td className="px-4 py-3"><div className="font-mono font-bold text-dark-800 text-xs">{o.orderNumber}</div><div className="text-xs text-dark-400">{new Date(o.createdAt).toLocaleDateString("en-PK")}</div></td>
                  <td className="px-4 py-3"><span className={`text-[10px] px-2 py-0.5 font-bold ${o.orderType==="GIFT"?"bg-gold-100 text-gold-700":"bg-dark-100 text-dark-600"}`}>{o.orderType}</span></td>
                  <td className="px-4 py-3"><div className="font-semibold text-dark-700 text-xs">{o.senderName}</div><div className="text-xs text-dark-400">{o.senderPhone}</div></td>
                  <td className="px-4 py-3"><div className="font-semibold text-dark-700 text-xs">{o.recipientName}</div><div className="text-xs text-dark-400">{o.recipientPhone}</div></td>
                  <td className="px-4 py-3 text-xs text-dark-500">{o.recipientCity}</td>
                  <td className="px-4 py-3 text-xs font-bold text-dark-800">Rs. {parseFloat(String(o.total)).toLocaleString("en-PK")}</td>
                  <td className="px-4 py-3"><span className={`text-[10px] px-2 py-0.5 font-bold tracking-wider uppercase ${SC[o.status]??"bg-dark-100 text-dark-600"}`}>{o.status.replace("_"," ")}</span></td>
                  <td className="px-4 py-3"><Link href={`/admin/orders/${o.id}`} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs border border-dark-200 text-dark-600 hover:border-gold-400 hover:text-gold-500 transition-colors"><Eye className="w-3 h-3"/>View</Link></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </div>
      {pages>1&&<div className="flex items-center justify-center gap-2">{page>1&&<Link href={`/admin/orders?${status?`status=${status}&`:""}page=${page-1}`} className="px-3 py-1.5 border border-dark-200 text-xs hover:border-gold-400">← Prev</Link>}<span className="text-xs text-dark-400">Page {page} of {pages}</span>{page<pages&&<Link href={`/admin/orders?${status?`status=${status}&`:""}page=${page+1}`} className="px-3 py-1.5 border border-dark-200 text-xs hover:border-gold-400">Next →</Link>}</div>}
    </div>
  );
}
