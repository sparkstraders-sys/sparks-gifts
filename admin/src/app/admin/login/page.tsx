"use client";
import{useState}from"react";import{signIn}from"next-auth/react";import{useRouter}from"next/navigation";import Image from"next/image";import{Eye,EyeOff,Loader2,Lock}from"lucide-react";
export default function AdminLogin(){
  const router=useRouter();const[email,setEmail]=useState("");const[password,setPassword]=useState("");const[show,setShow]=useState(false);const[loading,setLoading]=useState(false);const[err,setErr]=useState("");
  async function submit(e:React.FormEvent){e.preventDefault();setErr("");setLoading(true);const r=await signIn("credentials",{email,password,redirect:false});if(r?.error){setErr("Invalid email or password.");setLoading(false);}else router.push("/admin/dashboard");}
  return(
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Image src="/logo-white.png" alt="Sparks Gifts" width={180} height={72} className="h-16 w-auto object-contain  mx-auto mb-3" priority/>
          <p className="text-dark-400 text-[10px] tracking-[0.4em] uppercase">Admin Panel</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-8">
          <div className="flex items-center gap-2 mb-6"><Lock className="w-4 h-4 text-gold-400"/><h2 className="text-sm font-bold tracking-widest uppercase text-dark-300">Sign In</h2></div>
          {err&&<div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{err}</div>}
          <form onSubmit={submit} className="space-y-4">
            <div><label className="block text-[10px] font-bold tracking-wider uppercase text-dark-400 mb-1.5">Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@sparksgifts.pk" required className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm placeholder:text-dark-600 focus:outline-none focus:border-gold-500"/></div>
            <div><label className="block text-[10px] font-bold tracking-wider uppercase text-dark-400 mb-1.5">Password</label>
              <div className="relative"><input type={show?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm placeholder:text-dark-600 focus:outline-none focus:border-gold-500 pr-10"/>
              <button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300">{show?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button></div></div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-gold-500 text-white text-[11px] font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
              {loading?<><Loader2 className="w-4 h-4 animate-spin"/>Signing in...</>:"Sign In"}
            </button>
          </form>
        </div>
        <p className="text-center text-dark-600 text-xs mt-6">Secured admin access only</p>
      </div>
    </div>
  );
}
