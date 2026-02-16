"use client";

import { useEffect, useRef, useState } from "react";

const CHEONGAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const JIJI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

export default function SajuWheel() {
  const [rotation, setRotation] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!sectionRef.current) { ticking = false; return; }
          const rect = sectionRef.current.getBoundingClientRect();
          const vh = window.innerHeight;
          const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
          setRotation(progress * 360);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cx = 200, cy = 200, outerR = 170, innerR = 110, textOuterR = 155, textInnerR = 95;

  return (
    <div ref={sectionRef} className="relative z-10 flex items-center justify-center py-12 md:py-20 overflow-hidden">
      <div className="saju-wheel-glow" />
      <svg viewBox="0 0 400 400" className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96" style={{ willChange: "transform" }}>
        {/* Outer ring - Cheongan (clockwise) */}
        <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: "200px 200px", transition: "transform 0.05s linear" }}>
          <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="rgba(124,58,237,0.15)" strokeWidth="1" />
          <circle cx={cx} cy={cy} r={outerR - 30} fill="none" stroke="rgba(124,58,237,0.08)" strokeWidth="0.5" />
          {CHEONGAN.map((char, i) => {
            const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
            const x = cx + textOuterR * Math.cos(angle);
            const y = cy + textOuterR * Math.sin(angle);
            return (
              <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
                className="fill-purple-300/70 text-sm md:text-base font-serif-kr" fontSize="14" fontWeight="700">
                {char}
              </text>
            );
          })}
          {/* Decorative dots on outer ring */}
          {Array.from({ length: 20 }, (_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            const x = cx + (outerR - 15) * Math.cos(angle);
            const y = cy + (outerR - 15) * Math.sin(angle);
            return <circle key={i} cx={x} cy={y} r="1.5" fill="rgba(168,85,247,0.2)" />;
          })}
        </g>

        {/* Inner ring - Jiji (counter-clockwise) */}
        <g style={{ transform: `rotate(${-rotation}deg)`, transformOrigin: "200px 200px", transition: "transform 0.05s linear" }}>
          <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="rgba(244,114,182,0.15)" strokeWidth="1" />
          <circle cx={cx} cy={cy} r={innerR - 25} fill="none" stroke="rgba(244,114,182,0.08)" strokeWidth="0.5" />
          {JIJI.map((char, i) => {
            const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const x = cx + textInnerR * Math.cos(angle);
            const y = cy + textInnerR * Math.sin(angle);
            return (
              <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
                className="fill-rose-300/70 text-xs md:text-sm font-serif-kr" fontSize="12" fontWeight="700">
                {char}
              </text>
            );
          })}
        </g>

        {/* Center */}
        <circle cx={cx} cy={cy} r="35" fill="rgba(124,58,237,0.05)" stroke="rgba(124,58,237,0.2)" strokeWidth="0.5" />
        <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="middle" className="fill-white/80 font-serif-kr" fontSize="14" fontWeight="900">
          四柱
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" dominantBaseline="middle" className="fill-purple-300/50" fontSize="9">
          八字
        </text>
      </svg>
    </div>
  );
}
