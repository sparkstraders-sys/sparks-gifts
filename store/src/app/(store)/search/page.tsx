"use client";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Loader2 } from "lucide-react";
import { Suspense } from "react";
import AddToCartButton from "@/components/shop/AddToCartButton";

function SearchContent() {
  const sp = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [results, setResults] = useState<{id:string;name:string;slug:string;brand:string|null;sellPrice:string;discount:string;stock:number;images:{url:string}[]}[]>([]);
  const [searching, setSearching] = useState(false);
  const [, startTransition] = useTransition();

  async function doSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setSearching(true);
    startTransition(() => router.push(`/search?q=${encodeURIComponent(q.trim())}`, { scroll: false }));
    const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
    if (res.ok) setResults(await res.json());
    setSearching(false);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-xl mx-auto mb-10">
        <h1 className="font-serif text-2xl font-bold text-dark-900 text-center mb-6">Search Gifts</h1>
        <form onSubmit={doSearch} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search gifts, brands, occasions..." className="w-full pl-11 pr-16 py-4 border border-dark-200 rounded-xl text-sm focus:outline-none focus:border-gold-500" autoFocus />
          <button type="submit" className="absolute right-0 top-0 h-full px-5 bg-dark-900 text-white hover:bg-gold-500 transition-colors"><Search className="w-4 h-4" /></button>
        </form>
      </div>
      {searching && <div className="text-center py-10"><Loader2 className="w-8 h-8 text-gold-500 animate-spin mx-auto" /></div>}
      {!searching && results.length > 0 && (
        <>
          <p className="text-sm text-dark-400 mb-6"><span className="font-bold text-dark-900">{results.length}</span> results for &ldquo;{sp.get("q")}&rdquo;</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map(p => {
              const img = p.images[0]; const sp2 = parseFloat(String(p.sellPrice)); const disc = parseFloat(String(p.discount)); const fp = disc > 0 ? sp2 - (sp2 * disc) / 100 : sp2;
              return (
                <div key={p.id} className="group bg-white border border-dark-100 rounded-2xl card-3d overflow-hidden">
                  <Link href={`/products/${p.slug}`}><div className="relative aspect-square bg-dark-50">{img ? <Image src={img.url} alt={p.name} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl">🎁</div>}{disc > 0 && <div className="absolute top-2 left-2 bg-gold-500 text-white text-[10px] font-bold px-2 py-0.5">{disc}% OFF</div>}</div></Link>
                  <div className="p-3">{p.brand && <div className="text-[10px] text-dark-400 uppercase tracking-widest mb-0.5">{p.brand}</div>}<Link href={`/products/${p.slug}`}><h3 className="text-sm font-semibold text-dark-800 line-clamp-2 mb-1.5 group-hover:text-gold-500">{p.name}</h3></Link><div className="flex items-center justify-between"><div><div className="text-sm font-bold">Rs. {fp.toLocaleString("en-PK")}</div>{disc > 0 && <div className="text-xs text-dark-300 line-through">Rs. {sp2.toLocaleString("en-PK")}</div>}</div><AddToCartButton product={{ id: p.id, name: p.name, slug: p.slug, brand: p.brand, sellPrice: sp2, discount: disc, stock: p.stock, imageUrl: img?.url }} compact /></div></div>
                </div>
              );
            })}
          </div>
        </>
      )}
      {!searching && results.length === 0 && sp.get("q") && <div className="text-center py-16"><div className="text-5xl mb-4">🔍</div><p className="text-dark-400 mb-4">No results for &ldquo;{sp.get("q")}&rdquo;</p><Link href="/shop" className="text-gold-500 font-semibold text-sm">Browse all gifts →</Link></div>}
    </div>
  );
}

export default function SearchPage() {
  return <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-gold-500 animate-spin" /></div>}><SearchContent /></Suspense>;
}
