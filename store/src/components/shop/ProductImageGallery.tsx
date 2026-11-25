"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props { images: { id: string; url: string; altText?: string | null }[]; productName: string; }

export default function ProductImageGallery({ images, productName }: Props) {
  const [active, setActive] = useState(0);
  if (!images.length) return <div className="aspect-square bg-dark-50 flex items-center justify-center text-8xl">🎁</div>;
  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden bg-dark-50 group">
        <Image src={images[active].url} alt={images[active].altText ?? productName} fill className="object-cover" priority sizes="(max-width:768px) 100vw, 50vw" />
        {images.length > 1 && (
          <>
            <button onClick={() => setActive(i => i === 0 ? images.length - 1 : i - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-white">
              <ChevronLeft className="w-5 h-5 text-dark-800" />
            </button>
            <button onClick={() => setActive(i => i === images.length - 1 ? 0 : i + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-white">
              <ChevronRight className="w-5 h-5 text-dark-800" />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button key={img.id} onClick={() => setActive(i)}
              className={`relative w-16 h-16 flex-shrink-0 overflow-hidden transition-all ${i === active ? "ring-2 ring-gold-500 ring-offset-1" : "ring-1 ring-dark-200 opacity-60 hover:opacity-100"}`}>
              <Image src={img.url} alt={`${productName} ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
