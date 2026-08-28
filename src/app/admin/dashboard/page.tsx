import Link from "next/link";
import { Package, ShoppingBag, TrendingUp, Tag, ArrowRight, Clock } from "lucide-react";
import { getDashboardStats } from "@/db/queries";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700", PROCESSING: "bg-blue-100 text-blue-700",
  GIFT_WRAPPED: "bg-purple-100 text-purple-700", SHIPPED: "bg-orange-100 text-orange-700",
  DELIVERED: "bg-green-100 text-green-700", CANCELLED: "bg-red-100 text-red-600",
};

export default async function AdminDashboard() {
  const stats = await getDashboardStats().catch(() => ({ totalProducts: 0, totalOrders: 0, pendingOrders: 0, totalCategories: 0, recentOrders: [], revenue: 0, profit: 0 }));
  const cards = [
    { label: "Active Products", value: stats.totalProducts, icon: Package, href: "/admin/products", color: "bg-blue-50 text-blue-600" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, href: "/admin/orders", color: "bg-green-50 text-green-600" },
    { label: "Pending Orders", value: stats.pendingOrders, icon: Clock, href: "/admin/orders?status=PENDING", color: "bg-yellow-50 text-yellow-600" },
    { label: "Categories", value: stats.totalCategories, icon: Tag, href: "/admin/categories", color: "bg-purple-50 text-purple-600" },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">Welcome back. Here&apos;s your store overview.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="bg-white border border-gray-100 p-5 hover:shadow-sm transition-shadow">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${c.color}`}><c.icon className="w-4 h-4" /></div>
            <div className="text-2xl font-bold text-gray-900">{c.value}</div>
            <div className="text-xs text-gray-500 mt-0.5 font-medium">{c.label}</div>
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-green-500" /><span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue (Delivered)</span></div>
          <div className="text-2xl font-bold text-gray-900">Rs. {stats.revenue.toLocaleString("en-PK")}</div>
          <div className="text-xs text-gray-400 mt-0.5">Shipped + delivered orders</div>
        </div>
        <div className="bg-white border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-gold-500" /><span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Gross Profit</span></div>
          <div className="text-2xl font-bold text-gray-900">Rs. {stats.profit.toLocaleString("en-PK")}</div>
          <div className="text-xs text-gray-400 mt-0.5">Selling price − cost × qty</div>
        </div>
      </div>
      <div className="bg-white border border-gray-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs text-gold-600 hover:text-gold-700 flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">No orders yet</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {stats.recentOrders.map((order) => (
              <Link key={order.id} href={`/admin/orders/${order.id}`} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div>
                  <div className="text-sm font-medium text-gray-800 font-mono">{order.orderNumber}</div>
                  <div className="text-xs text-gray-400">{order.recipientCity} · {new Date(order.createdAt).toLocaleDateString("en-PK")}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] px-2 py-0.5 font-medium tracking-wider uppercase ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>{order.status.replace("_", " ")}</span>
                  <span className="text-sm font-semibold text-gray-800">Rs. {parseFloat(String(order.total)).toLocaleString("en-PK")}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
