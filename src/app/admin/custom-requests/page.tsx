"use client";
import{useState,useEffect}from"react";import{Sparkles,Loader2,MessageCircle,Phone}from"lucide-react";
interface CR{id:string;name:string;phone:string;city:string;description:string;budget?:string|null;occasion?:string|null;isGift:boolean;recipientName?:string|null;paymentMethod:string;paymentStatus:string;paymentReference?:string|null;status:string;adminNotes?:string|null;createdAt:string}
const SC:Record<string,string>={NEW:"bg-yellow-100 text-yellow-700",CONTACTED:"bg-blue-100 text-blue-700",CONFIRMED:"bg-purple-100 text-purple-700",DONE:"bg-green-100 text-green-700"};
export default function CustomRequestsPage(){
  const[reqs,setReqs]=useState<CR[]>([]);const[loading,setLoading]=useState(true);const[sel,setSel]=useState<CR|null>(null);const[notes,setNotes]=useState("");const[status,setStatus]=useState("");const[payStatus,setPayStatus]=useState("");const[saving,setSaving]=useState(false);
  async function load(){const r=await fetch("/api/admin/custom-requests");if(r.ok)setReqs(await r.json());setLoading(false);}
  useEffect(()=>{load();},[]);
  function open(r:CR){setSel(r);setNotes(r.adminNotes??"");setStatus(r.status);setPayStatus(r.paymentStatus);}
  async function save(){if(!sel)return;setSaving(true);const r=await fetch(`/api/admin/custom-requests/${sel.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status,adminNotes:notes,paymentStatus:payStatus})});if(r.ok){await load();setSel(null);}setSaving(false);}
  const newCount=reqs.filter(r=>r.status==="NEW").length;
  return(
    <div className="space-y-5">
      <div><h1 className="text-xl font-bold text-dark-900 flex items-center gap-2"><Sparkles className="w-5 h-5 text-gold-500"/>Custom Requests</h1><p className="text-sm text-dark-400 mt-0.5">{reqs.length} total{newCount>0&&<span className="ml-2 text-yellow-600 font-bold">· {newCount} new</span>}</p></div>
      <div className="bg-white border border-dark-100">
        {loading?<div className="text-center py-12"><Loader2 className="w-6 h-6 text-gold-400 animate-spin mx-auto"/></div>:reqs.length===0?<div className="text-center py-16"><Sparkles className="w-10 h-10 text-dark-200 mx-auto mb-3"/><p className="text-dark-400 text-sm">No custom requests yet.</p></div>:(
          <div className="divide-y divide-dark-50">
            {reqs.map(r=>(
              <div key={r.id} className="p-4 hover:bg-dark-50 cursor-pointer transition-colors" onClick={()=>open(r)}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1"><span className="font-bold text-dark-800 text-sm">{r.name}</span>{r.isGift&&<span className="text-[10px] bg-gold-100 text-gold-700 px-1.5 py-0.5 font-bold">🎁 Gift</span>}{r.isGift&&<span className={`text-[10px] px-1.5 py-0.5 font-bold ${r.paymentStatus==="PAID"?"bg-green-100 text-green-700":"bg-red-100 text-red-600"}`}>{r.paymentStatus==="PAID"?"PAID":"UNPAID · "+r.paymentMethod}</span>}<span className={`text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider ${SC[r.status]??"bg-dark-100 text-dark-600"}`}>{r.status}</span></div>
                    <p className="text-xs text-dark-500 line-clamp-2 mb-1">{r.description}</p>
                    <div className="flex items-center gap-3 text-xs text-dark-400"><span>📍 {r.city}</span>{r.occasion&&<span>✨ {r.occasion}</span>}{r.budget&&<span>💰 {r.budget}</span>}<span>{new Date(r.createdAt).toLocaleDateString("en-PK")}</span></div>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <a href={`https://wa.me/92${r.phone.replace(/^0/,"").replace(/-/g,"")}`} onClick={e=>e.stopPropagation()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-[10px] font-bold hover:bg-green-600 transition-colors"><MessageCircle className="w-3 h-3"/>WhatsApp</a>
                    <a href={`tel:${r.phone}`} onClick={e=>e.stopPropagation()} className="flex items-center gap-1 px-2 py-1 border border-dark-200 text-dark-600 text-[10px] font-bold hover:border-gold-400 transition-colors"><Phone className="w-3 h-3"/>{r.phone}</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {sel&&(
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setSel(null)}>
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="p-5 border-b border-dark-100 flex items-center justify-between"><h2 className="font-bold text-dark-800">{sel.name}</h2><button onClick={()=>setSel(null)} className="text-dark-400 hover:text-dark-600 text-xl leading-none">×</button></div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-dark-400 text-xs">Name</span><div className="font-semibold text-dark-800">{sel.name}</div></div>
                <div><span className="text-dark-400 text-xs">Phone</span><div className="font-semibold"><a href={`https://wa.me/92${sel.phone.replace(/^0/,"").replace(/-/g,"")}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">{sel.phone}</a></div></div>
                <div><span className="text-dark-400 text-xs">City</span><div className="font-semibold text-dark-800">{sel.city}</div></div>
                <div><span className="text-dark-400 text-xs">Type</span><div className="font-semibold text-dark-800">{sel.isGift?"🎁 Gift for someone":"👤 Personal"}</div></div>
                {sel.occasion&&<div><span className="text-dark-400 text-xs">Occasion</span><div className="font-semibold text-dark-800">{sel.occasion}</div></div>}
                {sel.budget&&<div><span className="text-dark-400 text-xs">Budget</span><div className="font-semibold text-dark-800">{sel.budget}</div></div>}
              </div>
              <div><div className="text-xs text-dark-400 mb-1">Description</div><div className="text-sm text-dark-700 bg-dark-50 p-3 leading-relaxed">{sel.description}</div></div>
              {sel.isGift&&(<div className="border border-gold-100 bg-gold-50 p-3 space-y-2"><div className="text-[10px] font-bold uppercase tracking-wider text-gold-700">Online payment (sender pays)</div><div className="text-sm text-dark-700">Method: <b>{sel.paymentMethod.replace("_"," ")}</b>{sel.paymentReference&&<> · Ref: <span className="font-mono">{sel.paymentReference}</span></>}</div><div><label className="block text-xs text-dark-400 mb-1.5">Payment status</label><select value={payStatus} onChange={e=>setPayStatus(e.target.value)} className="w-full px-3 py-2.5 border border-dark-200 text-sm bg-white focus:outline-none focus:border-gold-500">{["AWAITING_PAYMENT","AWAITING_VERIFICATION","PAID"].map(s=><option key={s} value={s}>{s.replace("_"," ")}</option>)}</select></div></div>)}
              <div><label className="block text-xs text-dark-400 mb-1.5">Status</label><select value={status} onChange={e=>setStatus(e.target.value)} className="w-full px-3 py-2.5 border border-dark-200 text-sm focus:outline-none focus:border-gold-500">{["NEW","CONTACTED","CONFIRMED","DONE"].map(s=><option key={s} value={s}>{s}</option>)}</select></div>
              <div><label className="block text-xs text-dark-400 mb-1.5">Admin Notes</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3} className="w-full px-3 py-2.5 border border-dark-200 text-sm resize-none focus:outline-none focus:border-gold-500"/></div>
              <div className="flex gap-3">
                <button onClick={save} disabled={saving} className="flex-1 py-2.5 bg-gold-500 text-white text-[11px] font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">{saving?<Loader2 className="w-4 h-4 animate-spin"/>:null}Save</button>
                <a href={`https://wa.me/92${sel.phone.replace(/^0/,"").replace(/-/g,"")}`} target="_blank" rel="noopener noreferrer" className="flex-1 py-2.5 bg-green-500 text-white text-[11px] font-bold tracking-widest uppercase hover:bg-green-600 transition-colors flex items-center justify-center gap-2"><MessageCircle className="w-4 h-4"/>WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
