"use client";
import{signOut}from"next-auth/react";import{LogOut,User}from"lucide-react";
interface Props{user?:{name?:string|null;email?:string|null}}
export default function AdminHeader({user}:Props){
  return(<header className="bg-white border-b border-dark-100 px-6 py-3 flex items-center justify-between">
    <h1 className="text-xs font-bold text-dark-400 tracking-widest uppercase">Admin Panel</h1>
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm text-dark-600"><User className="w-4 h-4 text-dark-400"/><span>{user?.name??user?.email??"Admin"}</span></div>
      <button onClick={()=>signOut({callbackUrl:"/admin/login"})} className="flex items-center gap-1.5 text-xs text-dark-400 hover:text-red-500 transition-colors"><LogOut className="w-3.5 h-3.5"/>Sign out</button>
    </div>
  </header>);
}
