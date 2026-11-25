"use client";
import{useState}from"react";import{useRouter}from"next/navigation";import{Loader2,CheckCircle}from"lucide-react";
const STATUSES=[{v:"PENDING",l:"Pending"},{v:"PROCESSING",l:"Processing"},{v:"GIFT_WRAPPED",l:"Gift Wrapped"},{v:"SHIPPED",l:"Shipped"},{v:"DELIVERED",l:"Delivered"},{v:"CANCELLED",l:"Cancelled"}];
export default function OrderStatusUpdate({orderId,currentStatus,notes:n}:{orderId:string;currentStatus:string;notes:string}){
  const router=useRouter();const[status,setStatus]=useState(currentStatus);const[notes,setNotes]=useState(n);const[loading,setLoading]=useState(false);const[saved,setSaved]=useState(false);
  async function save(){setLoading(true);const r=await fetch(`/api/admin/orders/${orderId}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status,notes})});if(r.ok){setSaved(true);setTimeout(()=>setSaved(false),2000);router.refresh();}setLoading(false);}
  return(
    <div className="bg-white border border-dark-100 p-5">
      <h2 className="text-[10px] font-bold tracking-widest uppercase text-dark-400 mb-4">Update Status</h2>
      <div className="space-y-3">
        <div><label className="block text-xs text-dark-400 mb-1.5">Status</label><select value={status} onChange={e=>setStatus(e.target.value)} className="w-full px-3 py-2.5 border border-dark-200 text-sm focus:outline-none focus:border-gold-500">{STATUSES.map(s=><option key={s.v} value={s.v}>{s.l}</option>)}</select></div>
        <div><label className="block text-xs text-dark-400 mb-1.5">Internal Notes</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3} placeholder="Notes about this order..." className="w-full px-3 py-2.5 border border-dark-200 text-sm resize-none focus:outline-none focus:border-gold-500"/></div>
        <button onClick={save} disabled={loading} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gold-500 text-white text-[11px] font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors disabled:opacity-60">
          {loading?<Loader2 className="w-4 h-4 animate-spin"/>:saved?<><CheckCircle className="w-4 h-4"/>Saved!</>:"Save Changes"}
        </button>
      </div>
    </div>
  );
}
