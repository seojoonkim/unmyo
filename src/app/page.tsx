"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import Starfield from "@/components/Starfield";
import { characters } from "@/lib/characters";

/* ─── Animated Counter Hook ─── */
function useCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = Date.now();
          const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(tick);
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

/* ─── Character Tags ─── */
const charTags: Record<string, { tags: string[]; catchphrase: string }> = {
  yunha: { tags: ["#성장", "#응원", "#가능성"], catchphrase: "가능성부터 봐요" },
  harin: { tags: ["#연애", "#직관", "#열정"], catchphrase: "연애 얘기 제일 잘해요" },
  jiho: { tags: ["#현실", "#커리어", "#안정"], catchphrase: "숫자로 증명합니다" },
  seojin: { tags: ["#팩폭", "#직진", "#완벽"], catchphrase: "할 말은 합니다" },
  noeul: { tags: ["#인생", "#위로", "#지혜"], catchphrase: "다 겪어봤어요" },
  myo: { tags: ["#영적", "#타로", "#장난"], catchphrase: "경계 너머를 봐요" },
};

/* ─── Stat Data for RPG Showcase ─── */
const stats = [
  { label: "연애력", value: 78, color: "#f43f5e" },
  { label: "재물력", value: 45, color: "#f59e0b" },
  { label: "직업운", value: 92, color: "#8b5cf6" },
  { label: "건강력", value: 67, color: "#10b981" },
  { label: "인간관계", value: 85, color: "#3b82f6" },
];

/* ─── Social Features ─── */
const socialFeatures = [
  {
    icon: "💕",
    title: "궁합",
    desc: "연애·친구·직장·가족 궁합을 한번에. 링크 보내면 상대방도 바로 확인.",
    cta: "궁합 보기",
  },
  {
    icon: "⚔️",
    title: "운세 배틀",
    desc: "이번 주 운 더 좋은 사람? 친구와 대결해서 진 사람이 커피 사기.",
    cta: "배틀 시작",
  },
  {
    icon: "🗺️",
    title: "인맥 우주지도",
    desc: "내 주변 인연을 별자리처럼 시각화. 숨겨진 귀인을 찾아보세요.",
    cta: "지도 보기",
  },
];

/* ─── Features ─── */
const features = [
  { icon: "🔮", title: "정통 사주팔자", desc: "만세력·오행·십신·격국·신살 완전 분석" },
  { icon: "🎮", title: "Life RPG", desc: "내 인생 스탯, 레벨, 대운 타임라인" },
  { icon: "💬", title: "AI 캐릭터 상담", desc: "6명의 상담사와 자유로운 대화" },
  { icon: "📅", title: "오늘의 운세", desc: "일운 데일리 + 세운 히트맵" },
  { icon: "🃏", title: "AI 타로", desc: "질문 던지면 카드가 답해요" },
  { icon: "🪞", title: "관상 & 손금 AI", desc: "셀카 한 장이면 끝" },
  { icon: "🧬", title: "MBTI 변환", desc: "내 사주를 MBTI로 번역" },
  { icon: "🏛️", title: "역대 인물 매칭", desc: "나와 같은 사주의 유명인은?" },
];

/* ─── Pricing ─── */
const plans = [
  {
    name: "무료",
    price: "₩0",
    period: "",
    items: ["기본 사주 분석", "오늘의 운세", "AI 상담 3회/일"],
    cta: "무료로 시작",
    highlight: false,
  },
  {
    name: "플러스",
    price: "₩4,900",
    period: "/월",
    items: ["무제한 AI 상담", "궁합 분석", "RPG 대시보드", "타로 & 꿈해몽"],
    cta: "플러스 시작하기",
    highlight: true,
  },
  {
    name: "프로",
    price: "₩9,900",
    period: "/월",
    items: ["전체 기능 해금", "관상·손금 AI", "프로필 카드 무제한", "우선 응답"],
    cta: "프로 시작하기",
    highlight: false,
  },
];

export default function Home() {
  /* Live counter (simulated) */
  const [liveCount, setLiveCount] = useState(1247);
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const counter1 = useCounter(12847);
  const counter2 = useCounter(89231);
  const counter3 = useCounter(5120);

  return (
    <main className="relative min-h-screen bg-[#0a0e27] overflow-x-hidden">
      <Starfield />

      {/* Gradient overlays */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-0 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px]" />
      </div>

      {/* ════════════════════ 1. HERO ════════════════════ */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="animate-fade-in-up max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            <span className="text-purple-300/80 text-sm">지금 {liveCount.toLocaleString()}명이 사주 보는 중</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-300 via-white to-amber-300 bg-clip-text text-transparent">
              내 사주,
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-purple-200 to-purple-400 bg-clip-text text-transparent">
              이렇게 재밌었어?
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300/80 mb-3 font-light max-w-md mx-auto leading-relaxed">
            생년월일 하나면 끝.<br />
            AI 상담사가 사주를 풀고, RPG처럼 내 인생 스탯을 보여줘요.
          </p>
          <p className="text-xs text-purple-300/40 mb-10 tracking-wide">
            정통 만세력 × 6명의 캐릭터 상담사 × 매일 업데이트되는 운세
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/saju"
              className="group relative inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-amber-500 hover:to-purple-500 text-white font-bold rounded-full transition-all duration-500 shadow-lg shadow-purple-600/30 hover:shadow-amber-500/30 hover:scale-105 text-lg"
            >
              무료로 시작하기
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="text-xs text-slate-500">가입 없이 · 카드 등록 없이 · 바로 시작</p>
          </div>
        </div>

        <div className="absolute bottom-8 animate-bounce text-purple-400/30">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ════════════════════ 2. RPG DASHBOARD SHOWCASE ════════════════════ */}
      <section className="relative z-10 px-4 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <p className="text-amber-400/60 text-xs tracking-[0.25em] uppercase mb-3">Your Life, Your Stats</p>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
              내 인생을 RPG 스탯으로 보면?
            </h2>
            <p className="text-slate-400 max-w-md mx-auto">
              막연한 미래 대신, 구체적인 수치를 보여드려요.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Stat bars */}
            <div className="space-y-5 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              {stats.map((s, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-300 font-medium">{s.label}</span>
                    <span className="text-slate-400 tabular-nums">{s.value}</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${s.value}%`,
                        backgroundColor: s.color,
                        boxShadow: `0 0 12px ${s.color}40`,
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-4 flex items-center gap-3 text-sm text-purple-300/60">
                <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                  🔥 레벨업 시기: 2026 하반기
                </span>
              </div>
            </div>

            {/* Visual card */}
            <div className="animate-fade-in-up relative" style={{ animationDelay: "0.4s" }}>
              <div className="relative rounded-3xl bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-slate-900/40 border border-purple-500/10 p-8 backdrop-blur-sm">
                <div className="absolute -top-3 -right-3 px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded-full">
                  SAMPLE
                </div>
                <div className="text-center mb-6">
                  <p className="text-purple-400/60 text-xs tracking-wider mb-1">LIFE RPG DASHBOARD</p>
                  <p className="text-2xl font-black text-white">🌊 壬午 일주</p>
                  <p className="text-sm text-amber-300/80 mt-1">&ldquo;자유로운 전략가&rdquo;</p>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-white/5">
                    <p className="text-xs text-slate-500 mb-1">HP</p>
                    <p className="text-lg font-bold text-green-400">67</p>
                    <p className="text-[10px] text-slate-500">건강운</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5">
                    <p className="text-xs text-slate-500 mb-1">MP</p>
                    <p className="text-lg font-bold text-blue-400">85</p>
                    <p className="text-[10px] text-slate-500">멘탈</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5">
                    <p className="text-xs text-slate-500 mb-1">GOLD</p>
                    <p className="text-lg font-bold text-amber-400">45</p>
                    <p className="text-[10px] text-slate-500">재물운</p>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                  <p className="text-xs text-amber-300">💎 용신: 金 — 메탈 소재 시계 착용하면 운 UP!</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href="/saju" className="inline-flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-purple-500/20 text-purple-300 hover:text-white border border-purple-500/20 hover:border-purple-500/40 rounded-full transition-all duration-300 font-medium">
              내 스탯 확인하기 →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════ 3. CHARACTERS ════════════════════ */}
      <section className="relative z-10 px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 animate-fade-in-up">
            <p className="text-amber-400/60 text-xs tracking-[0.25em] uppercase mb-3">Counselors</p>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              여섯 명의 상담사, 각자의 시선
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              같은 사주도 누가 읽느냐에 따라 달라요.<br />
              마음 가는 사람에게 물어보세요.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {characters.map((char, i) => {
              const meta = charTags[char.id];
              return (
                <Link
                  key={char.id}
                  href="/saju"
                  className="group animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-b ${char.gradient} border border-white/5 hover:border-purple-500/30 transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2`}>
                    <div className="aspect-[3/4] relative">
                      <Image
                        src={char.image}
                        alt={char.name}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27] via-[#0a0e27]/30 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`text-xs font-medium bg-gradient-to-r ${char.elementColor} bg-clip-text text-transparent`}>
                          {char.element}
                        </p>
                        <span className="text-[10px] text-slate-500">
                          {char.gender === "M" ? "♂" : "♀"} {char.age}세
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-0.5">{char.name}</h3>
                      <p className="text-xs text-amber-300/70 mb-1.5 italic">&ldquo;{meta?.catchphrase}&rdquo;</p>
                      <div className="flex flex-wrap gap-1">
                        {meta?.tags.map((tag) => (
                          <span key={tag} className="text-[10px] text-purple-300/50 bg-purple-500/10 px-1.5 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════ 4. HOW IT WORKS ════════════════════ */}
      <section className="relative z-10 px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14 animate-fade-in-up">
            <p className="text-amber-400/60 text-xs tracking-[0.25em] uppercase mb-3">3 Steps</p>
            <h2 className="text-3xl md:text-4xl font-black text-white">3분이면 충분해요</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "생년월일시 입력", desc: "양력·음력, 태어난 시간까지.\n정확할수록 깊어져요.", icon: "📝" },
              { step: "02", title: "상담사 선택", desc: "따뜻한 위로? 냉정한 팩폭?\n마음 가는 사람에게.", icon: "🎭" },
              { step: "03", title: "AI 사주 상담", desc: "사주 해석부터 올해 운세,\n연애운까지 대화로.", icon: "✨" },
            ].map((item, i) => (
              <div key={i} className="animate-fade-in-up text-center group" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <p className="text-purple-400/40 text-xs tracking-[0.2em] mb-2 font-mono">STEP {item.step}</p>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ 5. SOCIAL FEATURES ════════════════════ */}
      <section className="relative z-10 px-4 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 animate-fade-in-up">
            <p className="text-amber-400/60 text-xs tracking-[0.25em] uppercase mb-3">With Friends</p>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              혼자 보면 아쉽잖아요
            </h2>
            <p className="text-slate-400">궁합 보고, 배틀하고, 프로필 카드 자랑하세요.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {socialFeatures.map((f, i) => (
              <div
                key={i}
                className="animate-fade-in-up group relative p-6 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/5 hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-1"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className="text-4xl block mb-4">{f.icon}</span>
                <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">{f.desc}</p>
                <Link href="/saju" className="text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium">
                  {f.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ 6. PROFILE CARD (VIRAL) ════════════════════ */}
      <section className="relative z-10 px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <p className="text-amber-400/60 text-xs tracking-[0.25em] uppercase mb-3">Share Your Fate</p>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                내 사주, 카드로 만들어<br />인스타에 올리기
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                인스타 스토리에 딱 맞는 사주 프로필 카드.<br />
                오행 밸런스, 올해 키워드, 성격 유형까지<br />
                예쁘게 담아서 공유하세요.
              </p>
              <Link href="/saju" className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600/80 to-indigo-500/80 hover:from-purple-500 hover:to-amber-500 text-white rounded-full transition-all duration-500 font-medium hover:scale-105">
                내 카드 만들기 →
              </Link>
            </div>

            {/* Mock profile card */}
            <div className="animate-fade-in-up flex justify-center" style={{ animationDelay: "0.3s" }}>
              <div className="relative w-64 rounded-3xl bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-slate-900/60 border border-purple-500/20 p-6 shadow-2xl shadow-purple-500/10 hover:rotate-2 transition-transform duration-500">
                <div className="absolute -top-2 -left-2 w-16 h-16 bg-amber-500/20 rounded-full blur-xl" />
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center text-2xl">
                    🌊
                  </div>
                  <p className="text-white font-bold text-lg">壬午 일주</p>
                  <p className="text-amber-300/80 text-sm mt-0.5">&ldquo;자유로운 전략가&rdquo;</p>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">오행</span>
                    <span className="text-purple-300">水 &gt; 火 &gt; 木 &gt; 金 &gt; 土</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">용신</span>
                    <span className="text-amber-300">金</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">2026 키워드</span>
                    <span className="text-green-300">🚀 도약</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-1 justify-center">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">#직감형</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">#승부사</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">#자유영혼</span>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-[10px] text-slate-500 tracking-wider">UNMYO · 운묘</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ 7. FEATURES GRID ════════════════════ */}
      <section className="relative z-10 px-4 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 animate-fade-in-up">
            <p className="text-amber-400/60 text-xs tracking-[0.25em] uppercase mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              사주 앱은 많지만,<br />이런 건 없었어요
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="animate-fade-in-up p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/20 hover:bg-white/[0.04] transition-all duration-300 group"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <span className="text-2xl block mb-3 group-hover:scale-110 transition-transform">{f.icon}</span>
                <h3 className="text-sm font-bold text-white mb-1">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ 8. SOCIAL PROOF ════════════════════ */}
      <section className="relative z-10 px-4 py-24">
        <div className="max-w-4xl mx-auto">
          {/* Counters */}
          <div className="grid grid-cols-3 gap-4 mb-16">
            {[
              { ref: counter1.ref, count: counter1.count, label: "사주 분석 완료", icon: "👥" },
              { ref: counter2.ref, count: counter2.count, label: "AI 상담 대화", icon: "💬" },
              { ref: counter3.ref, count: counter3.count, label: "궁합 매칭", icon: "💕" },
            ].map((c, i) => (
              <div key={i} ref={c.ref} className="text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <p className="text-2xl mb-1">{c.icon}</p>
                <p className="text-2xl md:text-3xl font-black text-white tabular-nums">{c.count.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">{c.label}</p>
              </div>
            ))}
          </div>

          {/* Reviews */}
          <div className="text-center mb-10 animate-fade-in-up">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
              &ldquo;사주가 이렇게 중독적일 줄이야&rdquo;
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { text: "서진한테 팩폭 당했는데 할 말이 없었음 ㅋㅋ", name: "박○○, 31", emoji: "🔥" },
              { text: "관상AI 해봤는데 소름... 셀카 하나로 이렇게까지?", name: "김○○, 27", emoji: "😱" },
              { text: "운세배틀 지는 사람이 커피 사기로 함 ㅋㅋ 매일 해요", name: "이○○, 24", emoji: "☕" },
            ].map((r, i) => (
              <div key={i} className="animate-fade-in-up p-5 rounded-2xl bg-white/[0.03] border border-white/5" style={{ animationDelay: `${i * 0.1}s` }}>
                <p className="text-3xl mb-3">{r.emoji}</p>
                <p className="text-sm text-slate-300 leading-relaxed mb-3">&ldquo;{r.text}&rdquo;</p>
                <p className="text-xs text-slate-500">— {r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ 9. PRICING ════════════════════ */}
      <section className="relative z-10 px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14 animate-fade-in-up">
            <p className="text-amber-400/60 text-xs tracking-[0.25em] uppercase mb-3">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
              시작은 무료, 더 깊이 들어가고 싶다면
            </h2>
            <p className="text-slate-500 text-sm">연간 결제 시 40% 할인 → ₩59,000/년</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((p, i) => (
              <div
                key={i}
                className={`animate-fade-in-up relative p-6 rounded-2xl border transition-all duration-300 ${
                  p.highlight
                    ? "bg-purple-500/10 border-purple-500/30 scale-[1.02]"
                    : "bg-white/[0.02] border-white/5 hover:border-purple-500/20"
                }`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-amber-500 text-black text-xs font-bold rounded-full">
                    ⭐ 인기
                  </div>
                )}
                <p className="text-lg font-bold text-white mb-1">{p.name}</p>
                <p className="text-3xl font-black text-white mb-1">
                  {p.price}
                  <span className="text-sm font-normal text-slate-500">{p.period}</span>
                </p>
                <ul className="space-y-2 my-5">
                  {p.items.map((item, j) => (
                    <li key={j} className="text-sm text-slate-400 flex items-center gap-2">
                      <span className="text-purple-400 text-xs">✓</span> {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/saju"
                  className={`block text-center py-2.5 rounded-full text-sm font-medium transition-all ${
                    p.highlight
                      ? "bg-purple-600 hover:bg-purple-500 text-white"
                      : "bg-white/5 hover:bg-white/10 text-slate-300"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ 10. FINAL CTA ════════════════════ */}
      <section className="relative z-10 px-4 py-24">
        <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
          <p className="text-6xl mb-6">🌌</p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-snug">
            오늘의 운세,<br />확인하셨나요?
          </h2>
          <p className="text-slate-400 mb-10 max-w-md mx-auto">
            연애운이 궁금할 땐 하린에게, 진로 고민은 지호에게,<br />
            인생의 큰 그림은 노을에게 물어보세요.
          </p>
          <Link
            href="/saju"
            className="group inline-flex items-center gap-2 px-12 py-5 bg-gradient-to-r from-purple-600 to-amber-500 hover:from-amber-500 hover:to-purple-600 text-white font-bold rounded-full transition-all duration-500 shadow-xl shadow-purple-600/20 hover:shadow-amber-500/30 hover:scale-105 text-xl"
          >
            내 사주 확인하기
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className="text-xs text-slate-600 mt-4">가입 없이 바로 시작 · 카드 등록 불필요</p>
        </div>
      </section>

      {/* ════════════════════ FOOTER ════════════════════ */}
      <footer className="relative z-10 text-center py-12 border-t border-white/5">
        <p className="text-lg font-black bg-gradient-to-r from-purple-400 to-amber-300 bg-clip-text text-transparent mb-1">
          운묘 UNMYO
        </p>
        <p className="text-slate-500 text-sm mb-1">내 사주, 이렇게 재밌었어?</p>
        <p className="text-slate-600 text-xs">© 2026 UNMYO. All rights reserved.</p>
      </footer>

      {/* ════════════════════ FLOATING CTA (Mobile) ════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden p-3 bg-[#0a0e27]/90 backdrop-blur-lg border-t border-purple-500/10">
        <Link
          href="/saju"
          className="block w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold rounded-full text-center shadow-lg shadow-purple-600/30"
        >
          무료로 사주 보기 ✨
        </Link>
      </div>
    </main>
  );
}
