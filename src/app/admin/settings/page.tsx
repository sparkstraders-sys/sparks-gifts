"use client";
import{useState,useEffect}from"react";import{Loader2,CheckCircle}from"lucide-react";
const D={storeName:"Sparks Gifts",tagline:"Thoughtful Gifts, Delivered with Love.",email:"thesparkstraders@gmail.com",phone:"0300-143-2502",whatsapp:"923001432502",address:"Pakistan",facebook:"",instagram:"",twitter:"",deliveryCharge:"200",wrappingCharge:"150",heroTitle:"Send Love, Across Cities.",heroSubtitle:"Premium gifts, beautifully wrapped and delivered anywhere in Pakistan.",paymentAccountTitle:"",paymentJazzcash:"",paymentEasypaisa:"",paymentRaast:"",paymentBankDetails:""};
export default function SettingsPage(){
  const[s,setS]=useState(D);const[loading,setLoading]=useState(true);const[saving,setSaving]=useState(false);const[saved,setSaved]=useState(false);
  useEffect(()=>{fetch("/api/admin/settings").then(r=>r.json()).then(d=>{setS({...D,...d});setLoading(false);}).catch(()=>setLoading(false));},[]);
  function set(k:string,v:string){setS(p=>({...p,[k]:v}));}
  async function save(e:React.FormEvent){e.preventDefault();setSaving(true);const r=await fetch("/api/admin/settings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(r.ok){setSaved(true);setTimeout(()=>setSaved(false),2500);}setSaving(false);}
  if(loading)return<div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-gold-400 animate-spin"/></div>;
  const F=({label,k,type="text",hint}:{label:string;k:keyof typeof s;type?:string;hint?:string})=>(
    <div><label className="block text-[10px] font-bold tracking-wider uppercase text-dark-500 mb-1.5">{label}</label><input type={type} value={s[k]} onChange={e=>set(k,e.target.value)} className="w-full px-4 py-3 border border-dark-200 text-sm focus:outline-none focus:border-gold-500"/>{hint&&<p className="text-xs text-dark-400 mt-1">{hint}</p>}</div>
  );
  return(
    <div className="space-y-5">
      <div><h1 className="text-xl font-bold text-dark-900">Store Settings</h1><p className="text-sm text-dark-400 mt-0.5">Manage your store configuration</p></div>
      <form onSubmit={save} className="space-y-5">
        <div className="bg-white border border-dark-100 p-5"><div className="text-[10px] font-bold tracking-widest uppercase text-dark-400 mb-4">Store Information</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><F label="Store Name" k="storeName"/><F label="Tagline" k="tagline"/><F label="Email" k="email" type="email"/><F label="Phone" k="phone"/><F label="WhatsApp Number" k="whatsapp" hint="Include country code e.g. 923001432502"/><F label="Address" k="address"/></div>
        </div>
        <div className="bg-white border border-dark-100 p-5"><div className="text-[10px] font-bold tracking-widest uppercase text-dark-400 mb-4">Social Media</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><F label="Facebook URL" k="facebook"/><F label="Instagram URL" k="instagram"/><F label="Twitter/X URL" k="twitter"/></div>
        </div>
        <div className="bg-white border border-dark-100 p-5"><div className="text-[10px] font-bold tracking-widest uppercase text-dark-400 mb-4">Charges</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><F label="Delivery Charge (Rs.)" k="deliveryCharge" type="number" hint="Set 0 for free delivery"/><F label="Gift Wrapping Charge (Rs.)" k="wrappingCharge" type="number"/></div>
        </div>
        <div className="bg-white border border-dark-100 p-5"><div className="text-[10px] font-bold tracking-widest uppercase text-dark-400 mb-1">Online payment accounts</div><p className="text-xs text-dark-400 mb-4">Shown to customers who send a custom gift to someone else (online payment only).</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><F label="Account title" k="paymentAccountTitle"/><F label="JazzCash number" k="paymentJazzcash"/><F label="EasyPaisa number" k="paymentEasypaisa"/><F label="Raast ID" k="paymentRaast"/></div>
          <div className="mt-4"><label className="block text-[10px] font-bold tracking-wider uppercase text-dark-500 mb-1.5">Bank transfer details</label><textarea value={s.paymentBankDetails} onChange={e=>set("paymentBankDetails",e.target.value)} rows={3} placeholder="Bank name, account number, IBAN" className="w-full px-4 py-3 border border-dark-200 text-sm resize-none focus:outline-none focus:border-gold-500"/></div>
        </div>
        <div className="bg-white border border-dark-100 p-5"><div className="text-[10px] font-bold tracking-widest uppercase text-dark-400 mb-4">Homepage Content</div>
          <div className="space-y-4"><F label="Hero Title" k="heroTitle"/><div><label className="block text-[10px] font-bold tracking-wider uppercase text-dark-500 mb-1.5">Hero Subtitle</label><textarea value={s.heroSubtitle} onChange={e=>set("heroSubtitle",e.target.value)} rows={2} className="w-full px-4 py-3 border border-dark-200 text-sm resize-none focus:outline-none focus:border-gold-500"/></div></div>
        </div>
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-white text-[11px] font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors disabled:opacity-60">
          {saving?<Loader2 className="w-4 h-4 animate-spin"/>:saved?<><CheckCircle className="w-4 h-4"/>Saved!</>:"Save Settings"}
        </button>
      </form>
    </div>
  );
}
