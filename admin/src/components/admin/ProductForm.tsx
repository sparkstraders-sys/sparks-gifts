"use client";
import{useState}from"react";import{useRouter}from"next/navigation";import Image from"next/image";import{Loader2,Plus,Trash2,ImagePlus}from"lucide-react";

interface Cat{id:string;name:string}
interface PI{id:string;url:string;sortOrder:number}
interface PD{id?:string;name?:string;brand?:string;description?:string;sku?:string;costPrice?:number;sellPrice?:number;discount?:number;stock?:number;categoryId?:string;isActive?:boolean;isFeatured?:boolean;images?:PI[]}

export default function ProductForm({categories,product,isEdit=false}:{categories:Cat[];product?:PD;isEdit?:boolean}){
  const router=useRouter();const[loading,setLoading]=useState(false);const[uploading,setUploading]=useState(false);const[images,setImages]=useState<PI[]>(product?.images??[]);
  const[form,setForm]=useState({name:product?.name??"",brand:product?.brand??"",description:product?.description??"",sku:product?.sku??"",costPrice:product?.costPrice??"",sellPrice:product?.sellPrice??"",discount:product?.discount??0,stock:product?.stock??0,categoryId:product?.categoryId??(categories[0]?.id??""),isActive:product?.isActive??true,isFeatured:product?.isFeatured??false});
  function set(k:string,v:string|number|boolean){setForm(p=>({...p,[k]:v}));}

  async function uploadImage(e:React.ChangeEvent<HTMLInputElement>){
    const files=Array.from(e.target.files??[]);if(!files.length)return;setUploading(true);
    for(const file of files){const fd=new FormData();fd.append("file",file);const r=await fetch("/api/admin/upload",{method:"POST",body:fd});if(r.ok){const{url}=await r.json();setImages(p=>[...p,{id:`tmp-${Date.now()}`,url,sortOrder:p.length}]);}}
    setUploading(false);e.target.value="";
  }

  async function submit(e:React.FormEvent){
    e.preventDefault();if(!form.name||!form.costPrice||!form.sellPrice||!form.categoryId)return;setLoading(true);
    try{
      const url=isEdit?`/api/admin/products/${product!.id}`:"/api/admin/products";
      const res=await fetch(url,{method:isEdit?"PUT":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,costPrice:Number(form.costPrice),sellPrice:Number(form.sellPrice),discount:Number(form.discount),stock:Number(form.stock),images:images.map((i,idx)=>({url:i.url,sortOrder:idx}))})});
      if(!res.ok)throw new Error((await res.json()).error??"Failed");
      router.push("/admin/products");router.refresh();
    }catch(e){alert((e as Error).message);}finally{setLoading(false);}
  }

  async function del(){
    if(!product?.id)return;if(!confirm(`Delete "${form.name}"?`))return;
    const r=await fetch(`/api/admin/products/${product.id}`,{method:"DELETE"});
    if(r.ok){router.push("/admin/products");router.refresh();}
  }

  const profit=form.costPrice&&form.sellPrice?(Number(form.sellPrice)*(1-Number(form.discount)/100)-Number(form.costPrice)):null;

  return(
    <form onSubmit={submit} className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Info */}
          <div className="bg-white border border-dark-100 p-5">
            <div className="text-[10px] font-bold tracking-widest uppercase text-dark-400 mb-4">Product Info</div>
            <div className="space-y-4">
              <div><label className="block text-[10px] font-bold tracking-wider uppercase text-dark-500 mb-1.5">Name *</label><input required value={form.name} onChange={e=>set("name",e.target.value)} className="w-full px-4 py-3 border border-dark-200 text-sm focus:outline-none focus:border-gold-500"/></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[10px] font-bold tracking-wider uppercase text-dark-500 mb-1.5">Brand</label><input value={form.brand} onChange={e=>set("brand",e.target.value)} placeholder="e.g. Lattafa" className="w-full px-4 py-3 border border-dark-200 text-sm focus:outline-none focus:border-gold-500"/></div>
                <div><label className="block text-[10px] font-bold tracking-wider uppercase text-dark-500 mb-1.5">SKU</label><input value={form.sku} onChange={e=>set("sku",e.target.value)} className="w-full px-4 py-3 border border-dark-200 text-sm focus:outline-none focus:border-gold-500"/></div>
              </div>
              <div><label className="block text-[10px] font-bold tracking-wider uppercase text-dark-500 mb-1.5">Description</label><textarea value={form.description} onChange={e=>set("description",e.target.value)} rows={5} className="w-full px-4 py-3 border border-dark-200 text-sm resize-none focus:outline-none focus:border-gold-500"/></div>
            </div>
          </div>
          {/* Pricing */}
          <div className="bg-white border border-dark-100 p-5">
            <div className="text-[10px] font-bold tracking-widest uppercase text-dark-400 mb-4">Pricing</div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-[10px] font-bold tracking-wider uppercase text-dark-500 mb-1.5">Cost Price (Rs.) *<span className="ml-1 text-dark-300 normal-case font-normal">Hidden</span></label><input required type="number" min="0" step="0.01" value={String(form.costPrice)} onChange={e=>set("costPrice",e.target.value)} className="w-full px-4 py-3 border border-dark-200 text-sm focus:outline-none focus:border-gold-500"/></div>
              <div><label className="block text-[10px] font-bold tracking-wider uppercase text-dark-500 mb-1.5">Selling Price (Rs.) *</label><input required type="number" min="0" step="0.01" value={String(form.sellPrice)} onChange={e=>set("sellPrice",e.target.value)} className="w-full px-4 py-3 border border-dark-200 text-sm focus:outline-none focus:border-gold-500"/></div>
              <div><label className="block text-[10px] font-bold tracking-wider uppercase text-dark-500 mb-1.5">Discount (%)</label><input type="number" min="0" max="100" step="0.01" value={String(form.discount)} onChange={e=>set("discount",e.target.value)} className="w-full px-4 py-3 border border-dark-200 text-sm focus:outline-none focus:border-gold-500"/></div>
              <div><label className="block text-[10px] font-bold tracking-wider uppercase text-dark-500 mb-1.5">Stock</label><input type="number" min="0" value={String(form.stock)} onChange={e=>set("stock",e.target.value)} className="w-full px-4 py-3 border border-dark-200 text-sm focus:outline-none focus:border-gold-500"/></div>
            </div>
            {profit!==null&&<div className="mt-4 p-3 bg-green-50 border border-green-100 text-sm"><span className="font-bold text-green-700">Profit per unit: </span><span className="text-green-800 font-bold">Rs. {profit.toLocaleString("en-PK")}</span></div>}
          </div>
          {/* Images */}
          <div className="bg-white border border-dark-100 p-5">
            <div className="text-[10px] font-bold tracking-widest uppercase text-dark-400 mb-4">Images</div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
              {images.map((img,i)=>(
                <div key={img.id} className="relative group aspect-square bg-dark-50">
                  <Image src={img.url} alt="Product" fill className="object-cover" sizes="150px"/>
                  {i===0&&<div className="absolute top-1 left-1 bg-gold-500 text-white text-[9px] px-1.5 py-0.5 font-bold">Main</div>}
                  <button type="button" onClick={()=>setImages(p=>p.filter(x=>x.id!==img.id))} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3"/></button>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-dark-200 flex flex-col items-center justify-center cursor-pointer hover:border-gold-400 transition-colors">
                {uploading?<Loader2 className="w-5 h-5 text-dark-400 animate-spin"/>:<><ImagePlus className="w-5 h-5 text-dark-300 mb-1"/><span className="text-[10px] text-dark-400">Add Image</span></>}
                <input type="file" accept="image/*" multiple onChange={uploadImage} className="hidden" disabled={uploading}/>
              </label>
            </div>
            <p className="text-xs text-dark-400">First image is main. Max 5MB each.</p>
          </div>
        </div>
        <div className="space-y-5">
          <div className="bg-white border border-dark-100 p-5">
            <div className="text-[10px] font-bold tracking-widest uppercase text-dark-400 mb-4">Organisation</div>
            <div><label className="block text-[10px] font-bold tracking-wider uppercase text-dark-500 mb-1.5">Category *</label>
              <select required value={form.categoryId} onChange={e=>set("categoryId",e.target.value)} className="w-full px-4 py-3 border border-dark-200 text-sm focus:outline-none focus:border-gold-500 bg-white">
                {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="bg-white border border-dark-100 p-5 space-y-3">
            <div className="text-[10px] font-bold tracking-widest uppercase text-dark-400 mb-2">Status</div>
            <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={form.isActive} onChange={e=>set("isActive",e.target.checked)} className="w-4 h-4 accent-gold-500"/><div><div className="text-sm font-semibold text-dark-700">Active</div><div className="text-xs text-dark-400">Visible to customers</div></div></label>
            <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={form.isFeatured} onChange={e=>set("isFeatured",e.target.checked)} className="w-4 h-4 accent-gold-500"/><div><div className="text-sm font-semibold text-dark-700">Featured</div><div className="text-xs text-dark-400">Show on homepage</div></div></label>
          </div>
          <div className="space-y-2">
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 bg-gold-500 text-white text-[11px] font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors disabled:opacity-60">
              {loading?<Loader2 className="w-4 h-4 animate-spin"/>:<Plus className="w-4 h-4"/>}{isEdit?"Save Changes":"Create Product"}
            </button>
            {isEdit&&<button type="button" onClick={del} className="w-full py-3 border border-red-200 text-red-500 text-[11px] font-bold tracking-widest uppercase hover:bg-red-50 transition-colors">Delete Product</button>}
          </div>
        </div>
      </div>
    </form>
  );
}
