import Link from "next/link";
import { ShoppingBag, Eye } from "lucide-react";
import { getAdminOrders } from "@/db/queries";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700", PROCESSING: "bg-blue-100 text-blue-700",
  GIFT_WRAPPED: "bg-purple-100 text-purple-700", SHIPPED: "bg-orange-100 text-orange-700",
  DELIVERED: "bg-green-100 text-green-700", CANCELLED: "bg-red-100 text-red-600",
};

interface Props { searchParams: Promise<{ status?: string; page?: string }> }

export default async function AdminOrdersPage({ searchParams }: Props) {
  const { status, page: pageStr } = await searchParams;
  const page = parseInt(pageStr ?? "1");
  const { orders, total } = await getAdminOrders({ status, limit: 20, offset: (page - 1) * 20 }).catch(() => ({ orders: [], total: 0 }));
  const statuses = ["PENDING","PROCESSING","GIFT_WRAPPED","SHIPPED","DELIVERED","CANCELLED"];
  const pages = Math.ceil(total / 20);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-400 mt-0.5">{total} total orders</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href="/admin/orders" className={`px-3 py-1.5 text-xs font-medium tracking-wider uppercase transition-colors ${!status ? "bg-gold-500 text-white" : "border border-gray-200 text-gray-600 hover:border-gold-400 hover:text-gold-600"}`}>All</Link>
        {statuses.map((s) => (
          <Link key={s} href={`/admin/orders?status=${s}`} className={`px-3 py-1.5 text-xs font-medium tracking-wider uppercase transition-colors ${status === s ? "bg-gold-500 text-white" : "border border-gray-200 text-gray-600 hover:border-gold-400 hover:text-gold-600"}`}>{s.replace("_", " ")}</Link>
        ))}
      </div>
      <div className="bg-white border border-gray-100">
        {orders.length === 0 ? (
          <div className="text-center py-16"><ShoppingBag className="w-10 h-10 text-gray-200 mx-auto mb-3" /><p className="text-gray-400 text-sm">No orders {status ? `with status "${status}"` : "yet"}</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Order","Sender","Recipient","City","Total","Status",""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3"><div className="font-mono font-medium text-gray-800 text-xs">{order.orderNumber}</div><div className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString("en-PK")}</div></td>
                    <td className="px-4 py-3"><div className="font-medium text-gray-700 text-xs">{order.senderName}</div><div className="text-xs text-gray-400">{order.senderPhone}</div></td>
                    <td className="px-4 py-3"><div className="font-medium text-gray-700 text-xs">{order.recipientName}</div><div className="text-xs text-gray-400">{order.recipientPhone}</div></td>
                    <td className="px-4 py-3 text-xs text-gray-500">{order.recipientCity}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-gray-800">Rs. {parseFloat(String(order.total)).toLocaleString("en-PK")}</td>
                    <td className="px-4 py-3"><span className={`text-[10px] px-2 py-0.5 font-medium tracking-wider uppercase ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>{order.status.replace("_"," ")}</span></td>
                    <td className="px-4 py-3"><Link href={`/admin/orders/${order.id}`} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-200 text-gray-600 hover:border-gold-400 hover:text-gold-600 transition-colors"><Eye className="w-3 h-3" /> View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && <Link href={`/admin/orders?${status ? `status=${status}&` : ""}page=${page-1}`} className="px-3 py-1.5 border border-gray-200 text-xs hover:border-gold-400">← Prev</Link>}
          <span className="text-xs text-gray-500">Page {page} of {pages}</span>
          {page < pages && <Link href={`/admin/orders?${status ? `status=${status}&` : ""}page=${page+1}`} className="px-3 py-1.5 border border-gray-200 text-xs hover:border-gold-400">Next →</Link>}
        </div>
      )}
    </div>
  );
}
