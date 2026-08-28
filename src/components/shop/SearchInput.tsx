"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export default function SearchInput({ initialValue = "" }: { initialValue?: string }) {
  const [value, setValue] = useState(initialValue);
  const [, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim()) {
      startTransition(() => {
        router.push(`/search?q=${encodeURIComponent(value.trim())}`);
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search gifts, brands, categories..."
        className="w-full pl-11 pr-12 py-4 border border-gray-200 text-sm focus:outline-none focus:border-gold-500 bg-white"
        autoFocus
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-gray-300 hover:text-gray-500"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      <button
        type="submit"
        className="absolute right-0 top-0 h-full px-4 bg-gold-500 text-white hover:bg-gold-600 transition-colors"
      >
        <Search className="w-4 h-4" />
      </button>
    </form>
  );
}
