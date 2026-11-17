"use client";
import{useState}from"react";import{useRouter}from"next/navigation";
export default function ProductStatusToggle({id,isActive}:{id:string;isActive:boolean}){
  const[active,setActive]=useState(isActive);const[loading,setLoading]=useState(false);const router=useRouter();
  async function toggle(){setLoading(true);const r=await fetch(`/api/admin/products/${id}/status`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({isActive:!active})});if(r.ok){setActive(!active);router.refresh();}setLoading(false);}
  return(<button onClick={toggle} disabled={loading} className={`w-10 h-5 rounded-full transition-colors relative disabled:opacity-50 ${active?"bg-green-500":"bg-dark-200"}`}><span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${active?"left-5":"left-0.5"}`}/></button>);
}
