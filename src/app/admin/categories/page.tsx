"use client";
import{useState,useEffect}from"react";import Image from"next/image";import{Plus,Pencil,Trash2,Loader2,ImagePlus}from"lucide-react";
interface Cat{id:string;name:string;slug:string;description?:string|null;imageUrl?:string|null;isActive:boolean;sortOrder:number;_count?:{products:number}}
export default function AdminCategoriesPage(){
  const[cats,setCats]=useState<Cat[]>([]);const[loading,setLoading]=useState(true);const[saving,setSaving]=useState(false);const[uploading,setUploading]=useState(false);const[showForm,setShowForm]=useState(false);const[editId,setEditId]=useState<string|null>(null);
  const[form,setForm]=useState({name:"",description:"",imageUrl:"",sortOrder:"0",isActive:true});
  async function load(){setLoading(true);const r=await fetch("/api/admin/categories");if(r.ok)setCats(await r.json());setLoading(false);}
  useEffect(()=>{load();},[]);
  function reset(){setForm({name:"",description:"",imageUrl:"",sortOrder:"0",isActive:true});setEditId(null);setShowForm(false);}
  function startEdit(c:Cat){setForm({name:c.name,description:c.description??"",imageUrl:c.imageUrl??"",sortOrder:String(c.sortOrder),isActive:c.isActive});setEditId(c.id);setShowForm(true);window.scrollTo({top:0,behavior:"smooth"});}
  async function uploadImg(e:React.ChangeEvent<HTMLInputElement>){const f=e.target.files?.[0];if(!f)return;setUploading(true);const fd=new FormData();fd.append("file",f);const r=await fetch("/api/admin/upload",{method:"POST",body:fd});if(r.ok){const{url}=await r.json();setForm(p=>({...p,imageUrl:url}));}setUploading(false);e.target.value="";}
  async function submit(e:React.FormEvent){e.preventDefault();if(!form.name.trim())return;setSaving(true);const url=editId?`/api/admin/categories/${editId}`:"/api/admin/categories";const method=editId?"PUT":"POST";const r=await fetch(url,{method,headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,sortOrder:Number(form.sortOrder)})});if(r.ok){reset();load();}else{const d=await r.json();alert(d.error??"Failed");}setSaving(false);}
  async function del(id:string,name:string){if(!confirm(`Delete "${name}"?`))return;const r=await fetch(`/api/admin/categories/${id}`,{method:"DELETE"});if(!r.ok){const d=await r.json();alert(d.error??"Failed");}else load();}
  async function toggleStatus(c:Cat){await fetch(`/api/admin/categories/${c.id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({isActive:!c.isActive})});load();}
  return(
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-xl font-bold text-dark-900">Categories</h1><p className="text-sm text-dark-400 mt-0.5">{cats.length} categories</p></div><button onClick={()=>{reset();setShowForm(true);}} className="flex items-center gap-2 px-4 py-2.5 bg-gold-500 text-white text-[11px] font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors"><Plus className="w-4 h-4"/>Add Category</button></div>
      {showForm&&(
        <div className="bg-white border border-dark-100 p-6">
          <h2 className="text-sm font-bold text-dark-700 mb-4">{editId?"Edit Category":"New Category"}</h2>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-[10px] font-bold tracking-wider uppercase text-dark-500 mb-1.5">Name *</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full px-4 py-3 border border-dark-200 text-sm focus:outline-none focus:border-gold-500"/></div>
              <div><label className="block text-[10px] font-bold tracking-wider uppercase text-dark-500 mb-1.5">Sort Order</label><input type="number" value={form.sortOrder} onChange={e=>setForm({...form,sortOrder:e.target.value})} className="w-full px-4 py-3 border border-dark-200 text-sm focus:outline-none focus:border-gold-500"/></div>
            </div>
            <div><label className="block text-[10px] font-bold tracking-wider uppercase text-dark-500 mb-1.5">Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={2} className="w-full px-4 py-3 border border-dark-200 text-sm resize-none focus:outline-none focus:border-gold-500"/></div>
            <div><label className="block text-[10px] font-bold tracking-wider uppercase text-dark-500 mb-1.5">Image</label>
              <div className="flex items-center gap-3">
                {form.imageUrl&&(<div className="relative w-14 h-14 flex-shrink-0"><Image src={form.imageUrl} alt="Cat" fill className="object-cover" sizes="56px"/><button type="button" onClick={()=>setForm({...form,imageUrl:""})} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">×</button></div>)}
                <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-dark-200 text-xs text-dark-400 cursor-pointer hover:border-gold-400 hover:text-gold-500 transition-colors">{uploading?<Loader2 className="w-4 h-4 animate-spin"/>:<ImagePlus className="w-4 h-4"/>}Upload<input type="file" accept="image/*" onChange={uploadImg} className="hidden" disabled={uploading}/></label>
                <input placeholder="or paste URL" value={form.imageUrl} onChange={e=>setForm({...form,imageUrl:e.target.value})} className="flex-1 px-4 py-2 border border-dark-200 text-sm focus:outline-none focus:border-gold-500"/>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isActive} onChange={e=>setForm({...form,isActive:e.target.checked})} className="w-4 h-4 accent-gold-500"/><span className="text-sm text-dark-700">Active (visible on store)</span></label>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 text-white text-[11px] font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors disabled:opacity-60">{saving&&<Loader2 className="w-4 h-4 animate-spin"/>}{editId?"Save Changes":"Create Category"}</button>
              <button type="button" onClick={reset} className="px-5 py-2.5 border border-dark-200 text-dark-600 text-[11px] font-bold tracking-widest uppercase hover:bg-dark-50">Cancel</button>
            </div>
          </form>
        </div>
      )}
      <div className="bg-white border border-dark-100">
        {loading?<div className="text-center py-10"><Loader2 className="w-6 h-6 text-gold-400 animate-spin mx-auto"/></div>:cats.length===0?<div className="text-center py-16"><p className="text-dark-400 text-sm">No categories yet.</p></div>:(
          <table className="w-full text-sm"><thead className="bg-dark-50 border-b border-dark-100"><tr>{["Category","Products","Order","Status","Actions"].map(h=><th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-dark-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-dark-50">
              {cats.map(c=>(
                <tr key={c.id} className="hover:bg-dark-50 transition-colors">
                  <td className="px-4 py-3"><div className="flex items-center gap-3">{c.imageUrl?<Image src={c.imageUrl} alt={c.name} width={36} height={36} className="w-9 h-9 object-cover flex-shrink-0"/>:<div className="w-9 h-9 bg-dark-100 flex items-center justify-center text-lg flex-shrink-0">🏷</div>}<div><div className="font-semibold text-dark-800">{c.name}</div><div className="text-xs text-dark-400 font-mono">{c.slug}</div></div></div></td>
                  <td className="px-4 py-3 text-dark-400 text-xs">{c._count?.products??0}</td>
                  <td className="px-4 py-3 text-dark-400 text-xs">{c.sortOrder}</td>
                  <td className="px-4 py-3"><button onClick={()=>toggleStatus(c)} className={`w-10 h-5 rounded-full transition-colors relative ${c.isActive?"bg-green-500":"bg-dark-200"}`}><span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${c.isActive?"left-5":"left-0.5"}`}/></button></td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><button onClick={()=>startEdit(c)} className="p-1.5 text-dark-400 hover:text-gold-500 hover:bg-gold-50 transition-colors"><Pencil className="w-3.5 h-3.5"/></button><button onClick={()=>del(c.id,c.name)} className="p-1.5 text-dark-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5"/></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
