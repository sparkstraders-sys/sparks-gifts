import{notFound}from"next/navigation";import Link from"next/link";import Image from"next/image";import{ChevronLeft,Gift,MapPin,User,Package}from"lucide-react";import{getOrderById}from"@/db/queries";import OrderStatusUpdate from"@/components/admin/OrderStatusUpdate";
interface P{params:Promise<{id:string}>}
const SC:Record<string,string>={PENDING:"bg-yellow-100 text-yellow-700",PROCESSING:"bg-blue-100 text-blue-700",GIFT_WRAPPED:"bg-purple-100 text-purple-700",SHIPPED:"bg-orange-100 text-orange-700",DELIVERED:"bg-green-100 text-green-700",CANCELLED:"bg-red-100 text-red-600"};
export default async function OrderDetail({params}:P){
  const{id}=await params;const order=await getOrderById(id);if(!order)notFound();
  const profit=order.items.reduce((s:number,i:{price:string|number;costPrice:string|number;quantity:number})=>s+(parseFloat(String(i.price))-parseFloat(String(i.costPrice)))*i.quantity,0);
  return(
    <div className="space-y-5">
      <div className="flex items-center gap-3"><Link href="/admin/orders" className="flex items-center gap-1 text-sm text-dark-400 hover:text-dark-600"><ChevronLeft className="w-4 h-4"/>Orders</Link><span className="text-dark-200">/</span><h1 className="text-xl font-bold text-dark-900 font-mono">{order.orderNumber}</h1><span className={`text-[10px] px-2 py-0.5 font-bold tracking-wider uppercase ${SC[order.status]??""}`}>{order.status.replace("_"," ")}</span><span className={`text-[10px] px-2 py-0.5 font-bold ${order.orderType==="GIFT"?"bg-gold-100 text-gold-700":"bg-dark-100 text-dark-600"}`}>{order.orderType}</span></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-dark-100 p-5">
            <h2 className="text-[10px] font-bold tracking-widest uppercase text-dark-400 mb-4">Items</h2>
            <div className="divide-y divide-dark-50">
              {order.items.map((item:{id:string;name:string;price:string|number;costPrice:string|number;quantity:number;imageUrl?:string|null;product?:{images?:{url:string}[]}|null})=>{
                const img=item.product?.images?.[0];const lp=(parseFloat(String(item.price))-parseFloat(String(item.costPrice)))*item.quantity;
                return(<div key={item.id} className="py-3 flex items-center gap-3"><div className="w-12 h-12 bg-dark-50 flex-shrink-0">{img?<Image src={img.url} alt={item.name} width={48} height={48} className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center text-xl">🎁</div>}</div>
                  <div className="flex-1 min-w-0"><div className="font-semibold text-dark-800 text-sm">{item.name}</div><div className="text-xs text-dark-400">Qty: {item.quantity} × Rs. {parseFloat(String(item.price)).toLocaleString("en-PK")}</div></div>
                  <div className="text-right flex-shrink-0"><div className="text-sm font-bold text-dark-800">Rs. {(parseFloat(String(item.price))*item.quantity).toLocaleString("en-PK")}</div><div className="text-xs text-green-600 font-semibold">+Rs. {lp.toLocaleString("en-PK")}</div></div>
                </div>);
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-dark-100 space-y-1.5">
              {[{l:"Subtotal",v:order.subtotal},{l:"Delivery",v:order.deliveryCharge},...(order.giftWrapping?[{l:"Wrapping",v:order.wrappingCharge}]:[])].map(({l,v})=><div key={l} className="flex justify-between text-sm text-dark-500"><span>{l}</span><span>Rs. {parseFloat(String(v)).toLocaleString("en-PK")}</span></div>)}
              <div className="flex justify-between text-sm font-bold text-dark-900 pt-1 border-t border-dark-100"><span>Total</span><span>Rs. {parseFloat(String(order.total)).toLocaleString("en-PK")}</span></div>
              <div className="flex justify-between text-xs text-green-600 font-bold pt-1"><span>Est. Profit</span><span>Rs. {profit.toLocaleString("en-PK")}</span></div>
            </div>
          </div>
          {(order.giftMessage||order.giftWrapping)&&<div className="bg-white border border-dark-100 p-5"><div className="flex items-center gap-2 mb-3"><Gift className="w-4 h-4 text-gold-500"/><h2 className="text-[10px] font-bold tracking-widest uppercase text-dark-400">Gift Details</h2></div>{order.giftWrapping&&<div className="text-sm text-green-600 font-semibold mb-2">✓ Premium gift wrapping</div>}{order.giftMessage&&<div className="bg-gold-50 border border-gold-100 p-3"><div className="text-xs text-gold-600 font-bold uppercase tracking-wider mb-1">Gift Message</div><p className="text-sm text-dark-700 italic">&ldquo;{order.giftMessage}&rdquo;</p></div>}</div>}
        </div>
        <div className="space-y-5">
          <OrderStatusUpdate orderId={id} currentStatus={order.status} notes={order.notes??""}/>
          <div className="bg-white border border-dark-100 p-5"><div className="flex items-center gap-2 mb-3"><User className="w-4 h-4 text-gold-500"/><h2 className="text-[10px] font-bold tracking-widest uppercase text-dark-400">Sender</h2></div><div className="space-y-1 text-sm"><div className="font-semibold text-dark-800">{order.senderName}</div><div className="text-dark-500">{order.senderPhone}</div>{order.senderEmail&&<div className="text-dark-500">{order.senderEmail}</div>}</div></div>
          <div className="bg-white border border-dark-100 p-5"><div className="flex items-center gap-2 mb-3"><MapPin className="w-4 h-4 text-gold-500"/><h2 className="text-[10px] font-bold tracking-widest uppercase text-dark-400">Recipient & Delivery</h2></div><div className="space-y-1 text-sm"><div className="font-semibold text-dark-800">{order.recipientName}</div><div className="text-dark-500">{order.recipientPhone}</div><div className="font-semibold text-dark-800">{order.recipientCity}</div><div className="text-dark-600 text-xs leading-relaxed">{order.recipientAddress}</div></div></div>
          <div className="bg-white border border-dark-100 p-5"><div className="flex items-center gap-2 mb-3"><Package className="w-4 h-4 text-gold-500"/><h2 className="text-[10px] font-bold tracking-widest uppercase text-dark-400">Payment</h2></div><div className="text-sm text-dark-700">{order.paymentMethod}</div><div className="text-xs text-dark-400 mt-1">{new Date(order.createdAt).toLocaleString("en-PK")}</div></div>
        </div>
      </div>
    </div>
  );
}
