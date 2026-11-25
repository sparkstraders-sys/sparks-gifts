"use client";
import { useRef } from "react";

interface Props { children: React.ReactNode; className?: string; max?: number; glare?: boolean }

export default function Tilt3D({ children, className = "", max = 8, glare = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);

  function move(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) translateY(-8px) scale3d(1.02,1.02,1.02)`;
      el.style.setProperty("--gx", `${px * 100}%`);
      el.style.setProperty("--gy", `${py * 100}%`);
    });
  }
  function leave() {
    const el = ref.current;
    if (!el) return;
    if (raf.current) cancelAnimationFrame(raf.current);
    el.style.transform = "";
  }

  return (
    <div ref={ref} onMouseMove={move} onMouseLeave={leave} className={`tilt3d ${glare ? "tilt-glare" : ""} ${className}`}>
      {children}
    </div>
  );
}
