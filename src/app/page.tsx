"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion";
import Starfield from "@/components/Starfield";
import { characters } from "@/lib/characters";

/* ─── Animated Counter (slot-machine style) ─── */
function useCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const t0 = Date.now();
          const tick = () => {
            const p = Math.min((Date.now() - t0) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setCount(Math.floor(eased * end));
            if (p < 1) requestAnimationFrame(tick);
          };
          tick();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);
  return { count, ref };
}

/* ─── Scroll Reveal Hook ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

/* ─── Mouse Follow Glow ─── */
function useMouseGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return pos;
}

/* ─── 3D Tilt Handler ─── */
function use3DTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.02)`;
  }, []);
  const handleLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "perspective(800px) rotateY(0) rotateX(0) scale(1)";
  }, []);
  return { ref, handleMove, handleLeave };
}

/* ─── Data ─── */
const charMeta: Record<string, { line: string; tags: string[]; dialogue: string }> = {
  yunha: { line: "가능성부터 봅니다", tags: ["성장", "응원", "가능성"], dialogue: "오늘 좋은 기운이 느껴져요 ✨" },
  harin: { line: "연애 얘기 제일 잘해요", tags: ["연애", "직관", "열정"], dialogue: "설레는 인연이 곧 다가올 거예요 💕" },
  jiho: { line: "숫자로 증명합니다", tags: ["현실", "커리어", "안정"], dialogue: "지금이 투자할 타이밍이에요 📊" },
  seojin: { line: "할 말은 합니다", tags: ["팩트", "직진", "완벽"], dialogue: "현실을 직시해야 해요… 냉정하게 🪞" },
  noeul: { line: "다 겪어봤어요", tags: ["인생", "위로", "지혜"], dialogue: "걱정 마, 다 지나가는 거야 🌙" },
  myo: { line: "경계 너머를 봅니다", tags: ["영적", "타로", "균형"], dialogue: "운명의 실이 움직이고 있어요 🔮" },
};

const stats = [
  { label: "연애력", value: 78, color: "from-rose-500 to-pink-400", bar: "#e879a0" },
  { label: "재물력", value: 45, color: "from-amber-500 to-orange-400", bar: "#d4a056" },
  { label: "직업운", value: 92, color: "from-violet-500 to-purple-400", bar: "#9b8cdb" },
  { label: "건강력", value: 67, color: "from-emerald-500 to-teal-400", bar: "#6dba8a" },
  { label: "인간관계", value: 85, color: "from-blue-500 to-cyan-400", bar: "#7ba4d4" },
];

const featureList = [
  { title: "정통 사주팔자", desc: "만세력 기반 오행·십신·격국·신살 분석", accent: "from-violet-500/20 to-purple-500/5" },
  { title: "인생 대시보드", desc: "대운 타임라인과 세운 히트맵", accent: "from-blue-500/20 to-cyan-500/5" },
  { title: "AI 캐릭터 상담", desc: "6명의 상담사와 깊이 있는 대화", accent: "from-rose-500/20 to-pink-500/5" },
  { title: "오늘의 운세", desc: "매일 업데이트되는 일운 리포트", accent: "from-amber-500/20 to-orange-500/5" },
  { title: "AI 타로", desc: "고민에 맞는 카드 배열과 해석", accent: "from-indigo-500/20 to-violet-500/5" },
  { title: "관상 · 손금", desc: "사진 한 장으로 완성되는 분석", accent: "from-emerald-500/20 to-teal-500/5" },
  { title: "사주 × MBTI", desc: "익숙한 프레임으로 보는 내 사주", accent: "from-pink-500/20 to-rose-500/5" },
  { title: "인물 매칭", desc: "나와 같은 사주를 가진 역대 인물", accent: "from-cyan-500/20 to-blue-500/5" },
];

const socialItems = [
  { title: "궁합", desc: "연애·친구·직장·가족. 두 사람의 오행이 만나는 지점을 분석합니다.", accent: "border-rose-500/20 hover:border-rose-500/40" },
  { title: "운세 배틀", desc: "이번 주 운이 더 좋은 사람은? 친구와 가볍게 승부를 걸어보세요.", accent: "border-violet-500/20 hover:border-violet-500/40" },
  { title: "인맥 우주지도", desc: "내 주변 인연을 별자리처럼 시각화. 숨겨진 귀인을 발견하세요.", accent: "border-blue-500/20 hover:border-blue-500/40" },
];

/* ─── Wave Divider SVG ─── */
function WaveDivider({ flip = false, color = "rgba(124, 58, 237, 0.05)" }: { flip?: boolean; color?: string }) {
  return (
    <div className={`w-full h-16 md:h-24 ${flip ? "rotate-180" : ""}`}>
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-full">
        <path
          d="M0,40 C360,100 1080,0 1440,60 L1440,100 L0,100 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

/* ─── Floating Orbs around CTA ─── */
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float-orb"
          style={{
            width: `${6 + i * 3}px`,
            height: `${6 + i * 3}px`,
            background: `radial-gradient(circle, ${
              ["rgba(168,85,247,0.6)", "rgba(244,114,182,0.5)", "rgba(251,191,36,0.4)", "rgba(139,92,246,0.5)", "rgba(236,72,153,0.4)"][i]
            }, transparent)`,
            top: `${20 + Math.sin(i * 1.2) * 30}%`,
            left: `${15 + i * 16}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${4 + i * 0.5}s`,
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Pentagon Radar Chart ─── */
function RadarChart({ values, visible }: { values: number[]; visible: boolean }) {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = 70;
  const labels = ["연애", "재물", "직업", "건강", "관계"];

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
    const dist = (value / 100) * r;
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[200px] mx-auto">
      {/* Grid */}
      {gridLevels.map((level, li) => (
        <polygon
          key={li}
          points={Array.from({ length: 5 }, (_, i) => {
            const p = getPoint(i, level * 100);
            return `${p.x},${p.y}`;
          }).join(" ")}
          fill="none"
          stroke="rgba(124,58,237,0.1)"
          strokeWidth="0.5"
        />
      ))}
      {/* Data shape */}
      <motion.polygon
        points={values.map((v, i) => {
          const p = getPoint(i, visible ? v : 0);
          return `${p.x},${p.y}`;
        }).join(" ")}
        fill="rgba(139,92,246,0.15)"
        stroke="rgba(168,85,247,0.6)"
        strokeWidth="1.5"
        initial={false}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
      {/* Labels */}
      {labels.map((label, i) => {
        const p = getPoint(i, 115);
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" className="fill-slate-500 text-[8px]">
            {label}
          </text>
        );
      })}
      {/* Dots */}
      {values.map((v, i) => {
        const p = getPoint(i, visible ? v : 0);
        return (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3"
            fill={["#e879a0", "#d4a056", "#9b8cdb", "#6dba8a", "#7ba4d4"][i]}
            initial={{ opacity: 0 }}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
          />
        );
      })}
    </svg>
  );
}

/* ─── Stagger Container ─── */
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring" as const, stiffness: 200, damping: 20 },
  },
};

/* ═══════════════════════════════════════════════════ */
/*                   MAIN COMPONENT                   */
/* ═══════════════════════════════════════════════════ */

export default function Home() {
  const [live, setLive] = useState(1247);
  const [scrollProgress, setScrollProgress] = useState(0);
  const mousePos = useMouseGlow();
  const heroRef = useRef<HTMLDivElement>(null);

  // Parallax
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const springY = useSpring(heroY, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const id = setInterval(() => setLive((v) => v + Math.floor(Math.random() * 3)), 5000);
    return () => clearInterval(id);
  }, []);

  // Scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const c1 = useCounter(12847);
  const c2 = useCounter(89231);
  const c3 = useCounter(5120);

  const rpgReveal = useReveal();
  const socialReveal = useReveal();
  const featureReveal = useReveal();
  const proofReveal = useReveal();

  // Hero text reveal
  const headlineWords = ["당신의", "사주를", "아시나요."];
  const subWords = ["그", "사람의", "사주는요?"];

  return (
    <main className="relative min-h-screen bg-[#0a0e27] overflow-x-hidden pb-32 md:pb-0">
      <Starfield />

      {/* Scroll Progress */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* Grain Overlay */}
      <div className="grain-overlay" />

      {/* Mouse follow glow (desktop only) */}
      <div
        className="fixed pointer-events-none z-[1] hidden md:block"
        style={{
          left: mousePos.x - 200,
          top: mousePos.y - 200,
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)",
          borderRadius: "50%",
          transition: "left 0.3s ease-out, top 0.3s ease-out",
        }}
      />

      {/* Ambient gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/4 rounded-full blur-[150px]" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-rose-600/3 rounded-full blur-[130px]" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-blue-600/3 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-amber-500/2 rounded-full blur-[140px]" />
      </div>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section ref={heroRef} className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 md:px-8">
        {/* Floating character images behind hero */}
        <motion.div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ y: springY }}>
          <div className="absolute top-[15%] left-[5%] w-24 h-32 md:w-32 md:h-44 rounded-2xl overflow-hidden opacity-[0.08] animate-float-slow rotate-[-6deg]">
            <Image src="/characters/yunha.png" alt="" fill className="object-cover" sizes="128px" quality={85} />
          </div>
          <div className="absolute top-[20%] right-[5%] w-24 h-32 md:w-32 md:h-44 rounded-2xl overflow-hidden opacity-[0.06] animate-float-slow rotate-[8deg]" style={{ animationDelay: "2s" }}>
            <Image src="/characters/harin.png" alt="" fill className="object-cover" sizes="128px" quality={85} />
          </div>
          <div className="absolute bottom-[20%] left-[8%] w-20 h-28 md:w-28 md:h-38 rounded-2xl overflow-hidden opacity-[0.05] animate-float-slow rotate-[4deg]" style={{ animationDelay: "4s" }}>
            <Image src="/characters/noeul.png" alt="" fill className="object-cover" sizes="112px" quality={85} />
          </div>
          <div className="absolute bottom-[25%] right-[8%] w-20 h-28 md:w-28 md:h-38 rounded-2xl overflow-hidden opacity-[0.05] animate-float-slow rotate-[-5deg]" style={{ animationDelay: "3s" }}>
            <Image src="/characters/seojin.png" alt="" fill className="object-cover" sizes="112px" quality={85} />
          </div>
        </motion.div>

        <motion.div className="relative max-w-4xl mx-auto text-center" style={{ opacity: heroOpacity }}>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8"
          >
            <Image src="/logo.png" alt="UNMYO" width={180} height={60} className="mx-auto" quality={95} />
          </motion.div>

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-10"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            <span className="text-slate-400 text-xs tracking-wide font-display">{live.toLocaleString()}명이 지금 사주를 보고 있어요</span>
          </motion.div>

          {/* Headline — word-by-word reveal */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-[1.05] tracking-tight font-serif-kr">
            <span className="block text-white">
              {headlineWords.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.7, delay: 0.4 + i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="inline-block mr-[0.25em]"
                >
                  {word}
                </motion.span>
              ))}
            </span>
            <span className="block">
              {subWords.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.7, delay: 0.7 + i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="inline-block mr-[0.25em] bg-gradient-to-r from-purple-400 via-rose-300 to-amber-300 bg-clip-text text-transparent text-shimmer"
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="space-y-3 mb-12"
          >
            <p className="text-base sm:text-lg text-slate-300/90 font-light max-w-lg mx-auto leading-relaxed">
              AI가 풀어드리는 정통 사주팔자.
              <br className="hidden sm:block" />
              두 사람의 궁합, 운세 대결, 관계의 별자리까지 —
              <br className="hidden sm:block" />
              운명은 함께 읽을 때 완성됩니다.
            </p>
          </motion.div>

          {/* CTA with floating orbs and pulse ring */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="relative">
              <FloatingOrbs />
              <Link
                href="/saju"
                className="pulse-ring group relative inline-flex items-center gap-2.5 px-10 py-4 bg-gradient-to-r from-purple-500 to-rose-500 hover:from-purple-400 hover:to-amber-400 text-white font-semibold rounded-full transition-all duration-500 hover:scale-[1.06] text-base shadow-lg shadow-purple-500/25 hover:shadow-rose-500/30"
              >
                무료로 시작하기
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
            <p className="text-xs text-slate-600">가입 없이 · 바로 시작</p>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 text-slate-600"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      <WaveDivider color="rgba(124, 58, 237, 0.04)" />

      {/* ═══════════════════ RPG DASHBOARD ═══════════════════ */}
      <section ref={rpgReveal.ref} className="relative z-10 px-6 md:px-8 py-32">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={rpgReveal.visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <p className="text-purple-400/60 text-xs tracking-[0.25em] uppercase mb-4 font-display">Life Dashboard</p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight font-serif-kr">
              내 인생을 스탯으로 본다면
            </h2>
            <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed">
              사주팔자를 기반으로 연애력, 재물력, 직업운 등
              <br />나의 운명 스탯을 한눈에 확인하세요.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Stat bars */}
            <div className={`space-y-5 transition-all duration-700 delay-200 ${rpgReveal.visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
              {stats.map((s, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300 font-medium tracking-wide">{s.label}</span>
                    <motion.span
                      className={`tabular-nums font-mono text-xs font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}
                      initial={{ opacity: 0 }}
                      animate={rpgReveal.visible ? { opacity: 1 } : {}}
                      transition={{ delay: i * 0.15 + 0.5 }}
                    >
                      {s.value}
                    </motion.span>
                  </div>
                  <div className="h-2.5 bg-white/[0.04] rounded-full overflow-hidden relative">
                    <motion.div
                      className="h-full rounded-full relative"
                      initial={{ width: "0%" }}
                      animate={rpgReveal.visible ? { width: `${s.value}%` } : {}}
                      transition={{ duration: 1.2, delay: i * 0.15 + 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                      style={{
                        backgroundColor: s.bar,
                        boxShadow: `0 0 20px ${s.bar}40, 0 0 40px ${s.bar}15`,
                      }}
                    >
                      {/* Particle glow at bar tip */}
                      <div
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full animate-stat-glow"
                        style={{ background: `radial-gradient(circle, ${s.bar}, transparent)`, filter: "blur(2px)" }}
                      />
                    </motion.div>
                  </div>
                </div>
              ))}

              {/* Radar chart */}
              <div className="mt-8">
                <RadarChart values={stats.map(s => s.value)} visible={rpgReveal.visible} />
              </div>
            </div>

            {/* Dashboard card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={rpgReveal.visible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <div className="relative rounded-2xl bg-gradient-to-br from-purple-900/20 via-slate-900/40 to-rose-900/10 border border-white/[0.06] p-8 animate-border-glow">
                <div className="absolute -top-10 -right-4 w-20 h-28 rounded-xl overflow-hidden opacity-20 rotate-6">
                  <Image src="/characters/myo.png" alt="" fill className="object-cover" sizes="80px" quality={85} />
                </div>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-xs text-slate-600 tracking-[0.2em] uppercase font-display">Sample Dashboard</p>
                  <span className="text-[11px] text-purple-400/60 px-2 py-0.5 border border-purple-500/20 rounded-full">Preview</span>
                </div>
                <div className="text-center mb-6">
                  <p className="text-2xl font-black text-white tracking-tight font-serif-kr">壬午 일주</p>
                  <p className="text-sm text-purple-300/60 mt-1">자유로운 전략가</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "HP", value: "67", sub: "건강운", color: "text-emerald-400" },
                    { label: "MP", value: "85", sub: "멘탈", color: "text-blue-400" },
                    { label: "Gold", value: "45", sub: "재물운", color: "text-amber-400" },
                  ].map((g, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white/[0.03] text-center hover:bg-white/[0.06] transition-colors duration-300">
                      <p className="text-xs text-slate-600 mb-1 font-display">{g.label}</p>
                      <p className={`text-xl font-black ${g.color} tabular-nums`}>{g.value}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{g.sub}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 p-3 rounded-xl bg-gradient-to-r from-amber-500/5 to-transparent border border-amber-500/10 text-center">
                  <p className="text-xs text-slate-500">용신 <span className="text-amber-300 font-medium">金</span> — 메탈 소재의 액세서리가 행운을 끌어옵니다</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <Link href="/saju" className="inline-flex items-center gap-2 text-sm text-purple-400/80 hover:text-purple-300 transition-colors duration-300 tracking-wide group">
              내 스탯 확인하기
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <WaveDivider flip color="rgba(244, 114, 182, 0.03)" />

      {/* ═══════════════════ CHARACTERS ═══════════════════ */}
      <section className="relative z-10 px-6 md:px-8 py-32">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <p className="text-rose-400/50 text-xs tracking-[0.25em] uppercase mb-4 font-display">Counselors</p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight font-serif-kr">
              여섯 명의 상담사, 각자의 시선
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto text-sm leading-relaxed">
              따뜻한 위로가 필요하신가요, 냉정한 팩트가 필요하신가요?
              <br />마음이 가는 상담사를 선택하세요. 같은 사주도 완전히 달라집니다.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5"
          >
            {characters.map((char, i) => {
              const meta = charMeta[char.id];
              return (
                <motion.div key={char.id} variants={staggerItem}>
                  <Link href="/saju" className="group block">
                    <div
                      className={`card-3d relative overflow-hidden rounded-2xl bg-gradient-to-b ${char.gradient} border border-white/[0.04] hover:border-purple-500/20 transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/10`}
                      style={{ transition: "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.5s, box-shadow 0.5s" }}
                    >
                      {/* Dialogue bubble */}
                      <div className="dialogue-bubble">{meta?.dialogue}</div>

                      <div className="aspect-[3/4] relative">
                        <Image
                          src={char.image}
                          alt={char.name}
                          fill
                          className="object-cover object-top group-hover:scale-[1.05] transition-transform duration-700"
                          sizes="(max-width: 768px) 50vw, 33vw" quality={90}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27] via-[#0a0e27]/20 to-transparent" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`text-xs font-medium bg-gradient-to-r ${char.elementColor} bg-clip-text text-transparent`}>
                            {char.element}
                          </p>
                          <span className="text-xs text-slate-600">
                            {char.gender === "M" ? "M" : "F"} · {char.age}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-0.5 font-serif-kr">{char.name}</h3>
                        <p className="text-xs text-slate-400/80 italic mb-2">{meta?.line}</p>
                        <div className="flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {meta?.tags.map((t) => (
                            <span key={t} className="text-[11px] text-slate-500 tracking-wide">#{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <WaveDivider color="rgba(59, 130, 246, 0.03)" />

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section className="relative z-10 px-6 md:px-8 py-32">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <p className="text-blue-400/50 text-xs tracking-[0.25em] uppercase mb-4 font-display">Process</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight font-serif-kr">3분이면 충분합니다</h2>
          </motion.div>

          <div className="space-y-0">
            {[
              { n: "01", title: "생년월일시 입력", desc: "양력 또는 음력, 태어난 시간까지. 정확할수록 깊이 있는 분석이 가능해요." },
              { n: "02", title: "상담사 선택", desc: "6명의 상담사 중 마음 가는 분을 고르세요. 연애 고민이면 하린, 커리어 고민이면 지호가 잘 맞아요." },
              { n: "03", title: "AI 사주 상담 시작", desc: "대화하듯 편하게 물어보세요. 사주 해석, 올해 운세, 연애운, 재물운까지 상세하게 풀어드려요." },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15, type: "spring", stiffness: 150 }}
                className="flex items-start gap-6 py-8 border-b border-white/[0.04] last:border-0 group hover:bg-white/[0.01] rounded-xl transition-colors duration-300 px-4"
              >
                <span className={`text-2xl font-black tabular-nums shrink-0 pt-0.5 bg-gradient-to-b ${
                  i === 0 ? "from-purple-400 to-purple-600" : i === 1 ? "from-rose-400 to-rose-600" : "from-amber-400 to-amber-600"
                } bg-clip-text text-transparent font-display`}>{s.n}</span>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1.5 font-serif-kr">{s.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider flip color="rgba(251, 191, 36, 0.03)" />

      {/* ═══════════════════ SOCIAL ═══════════════════ */}
      <section ref={socialReveal.ref} className="relative z-10 px-6 md:px-8 py-32">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={socialReveal.visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <p className="text-amber-400/50 text-xs tracking-[0.25em] uppercase mb-4 font-display">Together</p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight font-serif-kr">
              혼자 보면 아쉽잖아요
            </h2>
            <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed">
              친구, 연인, 동료와 함께 즐기세요.<br />
              궁합을 확인하고, 운세 배틀을 하고, 관계의 우주를 그려보세요.
            </p>
          </motion.div>

          {/* Connection dots SVG */}
          <div className="relative">
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block" viewBox="0 0 100 30">
              <line x1="25" y1="15" x2="50" y2="15" stroke="rgba(124,58,237,0.1)" strokeWidth="0.2" strokeDasharray="1,1" />
              <line x1="50" y1="15" x2="75" y2="15" stroke="rgba(124,58,237,0.1)" strokeWidth="0.2" strokeDasharray="1,1" />
              <circle cx="25" cy="15" r="0.5" fill="rgba(124,58,237,0.2)" />
              <circle cx="50" cy="15" r="0.5" fill="rgba(124,58,237,0.2)" />
              <circle cx="75" cy="15" r="0.5" fill="rgba(124,58,237,0.2)" />
            </svg>

            <div className="grid md:grid-cols-3 gap-4 relative z-10">
              {socialItems.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={socialReveal.visible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.15 + 0.2, type: "spring" }}
                  className={`animate-float-card p-7 rounded-2xl bg-white/[0.02] border ${f.accent} transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/5`}
                  style={{ animationDelay: `${i * 0.8}s` }}
                >
                  <h3 className="text-lg font-bold text-white mb-3 font-serif-kr">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Floating character between social cards */}
          <div className="flex justify-center mt-8 gap-3 opacity-[0.15]">
            {["jiho", "harin", "myo"].map((id) => (
              <div key={id} className="w-12 h-16 rounded-lg overflow-hidden animate-float-slow" style={{ animationDelay: `${Math.random() * 3}s` }}>
                <Image src={`/characters/${id}.png`} alt="" width={48} height={64} className="object-cover object-top w-full h-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider color="rgba(244, 114, 182, 0.03)" />

      {/* ═══════════════════ PROFILE CARD ═══════════════════ */}
      <section className="relative z-10 px-6 md:px-8 py-32">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, type: "spring" }}
            >
              <p className="text-rose-400/50 text-xs tracking-[0.25em] uppercase mb-4 font-display">Share</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-tight font-serif-kr">
                내 사주를 카드로<br />만들어 공유하기
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                오행 밸런스, 올해 키워드, 성격 유형까지
                하나의 카드에 담아 인스타 스토리로 공유하세요.
              </p>
              <p className="text-slate-600 text-xs leading-relaxed mb-8">
                수묵화, 네온, 미니멀, 우주 등 6가지 테마 중 취향에 맞게 고를 수 있어요.
                친구에게 보내면 상대방도 자신의 카드를 만들 수 있습니다.
              </p>
              <Link href="/saju" className="inline-flex items-center gap-2 text-sm text-rose-400/80 hover:text-rose-300 transition-colors duration-300 tracking-wide group">
                내 카드 만들기
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40, rotateY: -10 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute -top-8 -left-6 w-16 h-24 rounded-lg overflow-hidden opacity-[0.12] rotate-[-10deg] animate-float-slow">
                  <Image src="/characters/yunha.png" alt="" fill className="object-cover" sizes="64px" quality={85} />
                </div>
                <div className="w-60 rounded-2xl bg-gradient-to-br from-purple-900/20 to-rose-900/10 border border-white/[0.06] p-6 hover:border-purple-500/20 transition-all duration-500 hover:rotate-1 animate-border-glow">
                  <div className="text-center mb-5">
                    <p className="text-xl font-black text-white font-serif-kr">壬午 일주</p>
                    <p className="text-xs text-purple-300/50 mt-1">자유로운 전략가</p>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between"><span className="text-slate-600">오행</span><span className="text-slate-400">水 › 火 › 木 › 金 › 土</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">용신</span><span className="text-amber-300/80">金</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">2026</span><span className="text-rose-300/80">도약의 해</span></div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-1.5 justify-center">
                    {["직감형", "승부사", "자유영혼"].map((t) => (
                      <span key={t} className="text-[11px] text-slate-500 px-2 py-0.5 rounded-full border border-white/[0.06] hover:border-purple-500/30 transition-colors duration-300">{t}</span>
                    ))}
                  </div>
                  <div className="mt-5 pt-4 border-t border-white/[0.04] text-center">
                    <p className="text-xs text-slate-600 tracking-[0.15em] font-display">UNMYO</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <WaveDivider flip color="rgba(139, 92, 246, 0.03)" />

      {/* ═══════════════════ FEATURES ═══════════════════ */}
      <section ref={featureReveal.ref} className="relative z-10 px-6 md:px-8 py-32">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={featureReveal.visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <p className="text-violet-400/50 text-xs tracking-[0.25em] uppercase mb-4 font-display">Features</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight font-serif-kr">
              사주 앱은 많지만, 이런 건 없었습니다
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={featureReveal.visible ? "show" : "hidden"}
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {featureList.map((f, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`p-5 rounded-xl bg-gradient-to-b ${f.accent} border border-white/[0.04] hover:border-white/[0.12] transition-all duration-300`}
              >
                <h3 className="text-sm font-semibold text-white mb-1.5">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <WaveDivider color="rgba(251, 191, 36, 0.02)" />

      {/* ═══════════════════ SOCIAL PROOF ═══════════════════ */}
      <section ref={proofReveal.ref} className="relative z-10 px-6 md:px-8 py-32">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-4 mb-20">
            {[
              { ref: c1.ref, count: c1.count, label: "사주 분석 완료", color: "from-purple-400 to-purple-600" },
              { ref: c2.ref, count: c2.count, label: "AI 상담 대화", color: "from-rose-400 to-rose-600" },
              { ref: c3.ref, count: c3.count, label: "궁합 매칭", color: "from-amber-400 to-amber-600" },
            ].map((c, i) => (
              <div key={i} ref={c.ref} className="text-center">
                <p className={`text-3xl md:text-5xl font-black tabular-nums tracking-tight bg-gradient-to-b ${c.color} bg-clip-text text-transparent font-display`}>
                  {c.count.toLocaleString()}
                </p>
                <p className="text-xs text-slate-600 mt-2 tracking-wide">{c.label}</p>
              </div>
            ))}
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={proofReveal.visible ? "show" : "hidden"}
            className="grid md:grid-cols-3 gap-4"
          >
            {[
              { text: "서진한테 팩폭 당했는데 할 말이 없었음", who: "31세, 직장인" },
              { text: "셀카 한 장으로 관상 분석이 되는 게 말이 됨?", who: "27세, 대학원생" },
              { text: "운세배틀 지는 사람이 커피 사기로 했는데 매일 해요", who: "24세, 디자이너" },
            ].map((r, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                whileHover={{ y: -4 }}
                className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] transition-all duration-300"
              >
                <p className="text-sm text-slate-300 leading-relaxed mb-4">&ldquo;{r.text}&rdquo;</p>
                <p className="text-xs text-slate-600">— {r.who}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <WaveDivider flip color="rgba(124, 58, 237, 0.04)" />

      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <section className="relative z-10 px-6 md:px-8 py-32">
        <div className="max-w-3xl mx-auto text-center">
          {/* Character row */}
          <div className="flex justify-center gap-2 mb-10 opacity-[0.2]">
            {characters.map((c) => (
              <div key={c.id} className="w-10 h-14 rounded-lg overflow-hidden animate-float-slow" style={{ animationDelay: `${Math.random() * 4}s` }}>
                <Image src={c.image} alt="" width={40} height={56} className="object-cover object-top w-full h-full" />
              </div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-snug font-serif-kr">
              오늘의 운세,<br />확인하셨나요?
            </h2>
            <p className="text-slate-500 text-sm mb-12 max-w-md mx-auto leading-relaxed">
              연애운이 궁금하다면 하린에게, 진로 고민이라면 지호에게,
              <br />인생의 큰 그림은 노을에게 물어보세요.
            </p>
            <div className="relative inline-block">
              <FloatingOrbs />
              <Link
                href="/saju"
                className="pulse-ring group relative inline-flex items-center gap-2.5 px-12 py-5 bg-gradient-to-r from-purple-500 via-rose-500 to-amber-500 hover:from-amber-500 hover:via-rose-500 hover:to-purple-500 text-white font-semibold rounded-full transition-all duration-700 hover:scale-[1.06] text-lg shadow-xl shadow-purple-500/20"
              >
                내 사주 확인하기
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
            <p className="text-xs text-slate-600 mt-5">가입 없이 바로 시작</p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="relative z-10 text-center py-20 border-t border-white/[0.04]">
        <Image src="/logo.png" alt="UNMYO" width={120} height={40} className="mx-auto mb-2" quality={95} />
        <p className="text-xs text-slate-600">© 2026 운묘. All rights reserved.</p>
      </footer>

      {/* ═══════════════════ FLOATING CTA (Mobile) ═══════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden p-3 bg-[#0a0e27]/95 backdrop-blur-lg border-t border-white/[0.04]">
        <Link
          href="/saju"
          className="block w-full py-3.5 bg-gradient-to-r from-purple-500 to-rose-500 text-white font-semibold rounded-full text-center text-sm shadow-lg shadow-purple-500/20"
        >
          무료로 사주 보기
        </Link>
      </div>
    </main>
  );
}
