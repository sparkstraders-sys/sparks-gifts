"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Gift } from "lucide-react";

interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
}

interface Props {
  images: ProductImage[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-gray-50 flex items-center justify-center">
        <Gift className="w-20 h-20 text-gray-300" />
      </div>
    );
  }

  const prev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 group">
        <Image
          src={images[activeIndex].url}
          alt={images[activeIndex].altText ?? productName}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-md"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-navy-800" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-md"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-navy-800" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={`relative w-16 h-16 flex-shrink-0 overflow-hidden transition-all ${
                i === activeIndex
                  ? "ring-2 ring-gold-500 ring-offset-1"
                  : "ring-1 ring-gray-200 opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt={img.altText ?? `${productName} ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
