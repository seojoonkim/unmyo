"use client";

import { useEffect, useRef, useState } from "react";

const elements = [
  { name: "木", label: "나무", color: "#22c55e", animClass: "element-grow" },
  { name: "火", label: "불꽃", color: "#f43f5e", animClass: "element-flicker" },
  { name: "土", label: "산", color: "#f59e0b", animClass: "element-pulse" },
  { name: "金", label: "다이아", color: "#94a3b8", animClass: "element-shine" },
  { name: "水", label: "물결", color: "#6366f1", animClass: "element-wave" },
];

function WoodIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className={`w-10 h-10 ${active ? "element-grow" : ""}`}>
      <line x1="24" y1="40" x2="24" y2="16" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="14" r="10" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.7" />
      <circle cx="18" cy="18" r="6" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.5" />
      <circle cx="30" cy="18" r="6" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}

function FireIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className={`w-10 h-10 ${active ? "element-flicker" : ""}`}>
      <path d="M24 6 C28 16, 38 22, 36 32 C34 40, 14 40, 12 32 C10 22, 20 16, 24 6Z" fill="none" stroke="#f43f5e" strokeWidth="2" />
      <path d="M24 18 C26 24, 32 26, 30 32 C28 36, 20 36, 18 32 C16 26, 22 24, 24 18Z" fill="#f43f5e" opacity="0.3" />
    </svg>
  );
}

function EarthIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className={`w-10 h-10 ${active ? "element-pulse" : ""}`}>
      <path d="M8 36 L24 12 L40 36 Z" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round" />
      <path d="M16 36 L24 22 L32 36 Z" fill="#f59e0b" opacity="0.15" />
      <line x1="6" y1="38" x2="42" y2="38" stroke="#f59e0b" strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}

function MetalIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className={`w-10 h-10 ${active ? "element-shine" : ""}`}>
      <polygon points="24,6 30,18 42,20 33,30 35,42 24,36 13,42 15,30 6,20 18,18" fill="none" stroke="#94a3b8" strokeWidth="2" />
      <polygon points="24,14 28,22 36,23 30,29 31,37 24,33 17,37 18,29 12,23 20,22" fill="#94a3b8" opacity="0.15" />
    </svg>
  );
}

function WaterIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className={`w-10 h-10 ${active ? "element-wave" : ""}`}>
      <path d="M6 20 Q12 14 18 20 Q24 26 30 20 Q36 14 42 20" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 28 Q12 22 18 28 Q24 34 30 28 Q36 22 42 28" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M6 36 Q12 30 18 36 Q24 42 30 36 Q36 30 42 36" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

const icons = [WoodIcon, FireIcon, EarthIcon, MetalIcon, WaterIcon];

export default function ElementIcons() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex items-center justify-center gap-6 md:gap-10 py-8">
      {elements.map((el, i) => {
        const Icon = icons[i];
        return (
          <div
            key={el.name}
            className={`flex flex-col items-center gap-2 transition-all duration-700 ${active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: `${i * 120}ms` }}
          >
            <div className="element-icon-wrap" style={{ "--el-color": el.color } as React.CSSProperties}>
              <Icon active={active} />
            </div>
            <span className="text-[10px] text-slate-500 tracking-wider">{el.name}</span>
          </div>
        );
      })}
    </div>
  );
}
