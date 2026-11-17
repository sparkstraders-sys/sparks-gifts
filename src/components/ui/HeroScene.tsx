"use client";
import Image from "next/image";
import { useRef } from "react";

export default function HeroScene() {
  const ref = useRef<HTMLDivElement>(null);
  function move(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${-y * 14}deg`);
    el.style.setProperty("--ry", `${x * 18}deg`);
  }
  function leave() { ref.current?.style.setProperty("--rx", "0deg"); ref.current?.style.setProperty("--ry", "0deg"); }

  return (
    <div className="hero-scene" onMouseMove={move} onMouseLeave={leave}>
      <div ref={ref} className="hero-stage">
        <div className="hero-glow" />
        <div className="hero-plate float-slow">
          <Image src="/logo.png" alt="Sparks Gifts" width={420} height={318} className="w-[78%] h-auto" priority />
        </div>
        <div className="gift-cube float-a" style={{ top: "6%", left: "2%" }}>
          <span className="face f1">🎁</span><span className="face f2" /><span className="face f3" /><span className="face f4" /><span className="face f5" /><span className="face f6" />
        </div>
        <div className="gift-cube small float-b" style={{ bottom: "8%", right: "4%" }}>
          <span className="face f1">✨</span><span className="face f2" /><span className="face f3" /><span className="face f4" /><span className="face f5" /><span className="face f6" />
        </div>
        <div className="float-chip float-c" style={{ top: "10%", right: "0%" }}>
          <div className="text-[10px] text-dark-400">Order delivered</div>
          <div className="text-xs font-bold text-dark-900">Lahore → Karachi</div>
        </div>
        <div className="float-chip gold float-b" style={{ bottom: "14%", left: "0%" }}>
          <div className="text-xs font-bold">4.9 rating</div>
          <div className="text-[10px] opacity-80">500+ reviews</div>
        </div>
        <span className="orb float-a" style={{ top: "42%", left: "-2%", width: 14, height: 14 }} />
        <span className="orb float-c" style={{ top: "70%", right: "12%", width: 10, height: 10 }} />
      </div>
    </div>
  );
}
