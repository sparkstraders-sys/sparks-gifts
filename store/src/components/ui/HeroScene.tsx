"use client";
import Image from "next/image";
import { useRef } from "react";

export default function HeroScene({ imageUrl }: { imageUrl?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  function move(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--rx", `${-((e.clientY - r.top) / r.height - 0.5) * 12}deg`);
    el.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 16}deg`);
  }
  function leave() { ref.current?.style.setProperty("--rx", "0deg"); ref.current?.style.setProperty("--ry", "0deg"); }

  return (
    <div className="hero-scene" onMouseMove={move} onMouseLeave={leave}>
      <div ref={ref} className="hero-stage">
        <div className="hero-glow" />
        <div className="hero-floor" />

        {imageUrl ? (
          <div className="hero-photo float-slow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="Sparks Gifts" />
          </div>
        ) : (
          <div className="gbox-wrap float-slow">
            <div className="gbox">
              <span className="gf gf-front" /><span className="gf gf-back" /><span className="gf gf-left" /><span className="gf gf-right" /><span className="gf gf-top" /><span className="gf gf-bottom" />
              <svg className="gbow" viewBox="0 0 200 110" aria-hidden="true">
                <defs>
                  <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f0d58c" /><stop offset=".5" stopColor="#c9a24b" /><stop offset="1" stopColor="#9a7428" /></linearGradient>
                </defs>
                <path d="M100 70 C 60 10, 5 20, 14 62 C 20 92, 80 84, 100 70Z" fill="url(#gold)" />
                <path d="M100 70 C 140 10, 195 20, 186 62 C 180 92, 120 84, 100 70Z" fill="url(#gold)" />
                <path d="M100 74 C 84 98, 62 106, 50 104 C 70 96, 86 88, 100 74Z" fill="#b08a34" />
                <path d="M100 74 C 116 98, 138 106, 150 104 C 130 96, 114 88, 100 74Z" fill="#b08a34" />
                <ellipse cx="100" cy="68" rx="15" ry="13" fill="#e0bd5f" />
                <ellipse cx="96" cy="64" rx="6" ry="4" fill="#f6e3a8" opacity=".8" />
              </svg>
            </div>
          </div>
        )}

        <div className="brand-card float-b">
          <Image src="/logo.png" alt="Sparks Gifts" width={260} height={197} className="w-full h-auto" priority />
        </div>
        <div className="float-chip float-c" style={{ top: "8%", right: "0%" }}>
          <div className="text-[10px] text-dark-400">Delivered with love</div>
          <div className="text-xs font-bold text-dark-900">Lahore → Karachi</div>
        </div>
        <div className="float-chip dark float-b" style={{ bottom: "16%", right: "2%" }}>
          <div className="text-xs font-bold">Gift wrapping</div>
          <div className="text-[10px] opacity-75">with your message</div>
        </div>
        <span className="spark float-a" style={{ top: "14%", left: "10%" }}>✦</span>
        <span className="spark float-c" style={{ top: "40%", right: "6%", fontSize: 14 }}>✦</span>
        <span className="spark float-b" style={{ bottom: "30%", left: "4%", fontSize: 12 }}>✦</span>
      </div>
    </div>
  );
}
