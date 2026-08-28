import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Gift, MapPin, User, Package } from "lucide-react";
import { getOrderById } from "@/db/queries";
import OrderStatusUpdate from "@/components/admin/OrderStatusUpdate";

interface Props { params: Promise<{ id: string }> }
const STATUS_COLORS: Record<string, string> = {
  PENDING:"bg-yellow-100 text-yellow-700",PROCESSING:"bg-blue-100 text-blue-700",
  GIFT_WRAPPED:"bg-purple-100 text-purple-700",SHIPPED:"bg-orange-100 text-orange-700",
  DELIVERED:"bg-green-100 text-green-700",CANCELLED:"bg-red-100 text-red-600",
};

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const profit = order.items.reduce((sum: number, item: { price: string | number; costPrice: string | number; quantity: number }) =>
    sum + (parseFloat(String(item.price)) - parseFloat(String(item.costPrice))) * item.quantity, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/orders" className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600"><ChevronLeft className="w-4 h-4" /> Orders</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-semibold text-gray-900 font-mono">{order.orderNumber}</h1>
        <span className={`text-[10px] px-2 py-0.5 font-medium tracking-wider uppercase ${STATUS_COLORS[order.status] ?? ""}`}>{order.status.replace("_"," ")}</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-gray-100 p-5">
            <h2 className="text-xs font-medium tracking-widest uppercase text-gray-500 mb-4">Order Items</h2>
            <div className="divide-y divide-gray-50">
              {order.items.map((item: { id: string; name: string; price: string | number; costPrice: string | number; quantity: number; imageUrl?: string | null; product?: { images?: { url: string }[] } | null }) => {
                const img = item.product?.images?.[0];
                const lineProfit = (parseFloat(String(item.price)) - parseFloat(String(item.costPrice))) * item.quantity;
                return (
                  <div key={item.id} className="py-3 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-50 flex-shrink-0">
                      {img ? <Image src={img.url} alt={item.name} width={48} height={48} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Gift className="w-5 h-5 text-gray-300" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800 text-sm">{item.name}</div>
                      <div className="text-xs text-gray-400">Qty: {item.quantity} × Rs. {parseFloat(String(item.price)).toLocaleString("en-PK")}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-semibold text-gray-800">Rs. {(parseFloat(String(item.price)) * item.quantity).toLocaleString("en-PK")}</div>
                      <div className="text-xs text-green-600 font-medium">+Rs. {lineProfit.toLocaleString("en-PK")} profit</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5">
              <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>Rs. {parseFloat(String(order.subtotal)).toLocaleString("en-PK")}</span></div>
              <div className="flex justify-between text-sm text-gray-500"><span>Delivery</span><span>Rs. {parseFloat(String(order.deliveryCharge)).toLocaleString("en-PK")}</span></div>
              {order.giftWrapping && <div className="flex justify-between text-sm text-gray-500"><span>Gift Wrapping</span><span>Rs. {parseFloat(String(order.wrappingCharge)).toLocaleString("en-PK")}</span></div>}
              <div className="flex justify-between text-sm font-bold text-gray-900 pt-1 border-t border-gray-100"><span>Total</span><span>Rs. {parseFloat(String(order.total)).toLocaleString("en-PK")}</span></div>
              <div className="flex justify-between text-xs text-green-600 font-medium pt-1"><span>Est. Gross Profit</span><span>Rs. {profit.toLocaleString("en-PK")}</span></div>
            </div>
          </div>
          {(order.giftMessage || order.giftWrapping) && (
            <div className="bg-white border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-3"><Gift className="w-4 h-4 text-gold-500" /><h2 className="text-xs font-medium tracking-widest uppercase text-gray-500">Gift Details</h2></div>
              {order.giftWrapping && <div className="text-sm text-green-600 font-medium mb-2">✓ Premium gift wrapping included</div>}
              {order.giftMessage && <div className="bg-gold-50 border border-gold-100 p-3"><div className="text-xs text-gold-600 font-medium uppercase tracking-wider mb-1">Gift Message</div><p className="text-sm text-gray-700 italic">&ldquo;{order.giftMessage}&rdquo;</p></div>}
            </div>
          )}
        </div>
        <div className="space-y-5">
          <OrderStatusUpdate orderId={id} currentStatus={order.status} notes={order.notes ?? ""} />
          <div className="bg-white border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3"><User className="w-4 h-4 text-gold-500" /><h2 className="text-xs font-medium tracking-widest uppercase text-gray-500">Sender</h2></div>
            <div className="space-y-1 text-sm"><div className="font-medium text-gray-800">{order.senderName}</div><div className="text-gray-500">{order.senderPhone}</div>{order.senderEmail && <div className="text-gray-500">{order.senderEmail}</div>}</div>
          </div>
          <div className="bg-white border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3"><MapPin className="w-4 h-4 text-gold-500" /><h2 className="text-xs font-medium tracking-widest uppercase text-gray-500">Recipient & Delivery</h2></div>
            <div className="space-y-1 text-sm"><div className="font-medium text-gray-800">{order.recipientName}</div><div className="text-gray-500">{order.recipientPhone}</div><div className="text-gray-500 font-medium">{order.recipientCity}</div><div className="text-gray-600 text-xs leading-relaxed">{order.recipientAddress}</div></div>
          </div>
          <div className="bg-white border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3"><Package className="w-4 h-4 text-gold-500" /><h2 className="text-xs font-medium tracking-widest uppercase text-gray-500">Payment</h2></div>
            <div className="text-sm text-gray-700">{order.paymentMethod}</div>
            <div className="text-xs text-gray-400 mt-1">Placed: {new Date(order.createdAt).toLocaleString("en-PK")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
