"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import Starfield from "@/components/Starfield";
import { characters } from "@/lib/characters";

/* ─── Animated Counter ─── */
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
            setCount(Math.floor((1 - Math.pow(1 - p, 3)) * end));
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

/* ─── Data ─── */
const charMeta: Record<string, { line: string; tags: string[] }> = {
  yunha: { line: "가능성부터 봅니다", tags: ["성장", "응원", "가능성"] },
  harin: { line: "연애 얘기 제일 잘해요", tags: ["연애", "직관", "열정"] },
  jiho: { line: "숫자로 증명합니다", tags: ["현실", "커리어", "안정"] },
  seojin: { line: "할 말은 합니다", tags: ["팩트", "직진", "완벽"] },
  noeul: { line: "다 겪어봤어요", tags: ["인생", "위로", "지혜"] },
  myo: { line: "경계 너머를 봅니다", tags: ["영적", "타로", "균형"] },
};

const stats = [
  { label: "연애력", value: 78, color: "#e879a0" },
  { label: "재물력", value: 45, color: "#d4a056" },
  { label: "직업운", value: 92, color: "#9b8cdb" },
  { label: "건강력", value: 67, color: "#6dba8a" },
  { label: "인간관계", value: 85, color: "#7ba4d4" },
];

const featureList = [
  { title: "정통 사주팔자", desc: "만세력 기반 오행·십신·격국·신살 분석" },
  { title: "인생 대시보드", desc: "대운 타임라인과 세운 히트맵" },
  { title: "AI 캐릭터 상담", desc: "6명의 상담사와 깊이 있는 대화" },
  { title: "오늘의 운세", desc: "매일 업데이트되는 일운 리포트" },
  { title: "AI 타로", desc: "고민에 맞는 카드 배열과 해석" },
  { title: "관상 · 손금", desc: "사진 한 장으로 완성되는 분석" },
  { title: "사주 × MBTI", desc: "익숙한 프레임으로 보는 내 사주" },
  { title: "인물 매칭", desc: "나와 같은 사주를 가진 역대 인물" },
];

const socialItems = [
  { title: "궁합", desc: "연애·친구·직장·가족. 두 사람의 오행이 만나는 지점을 분석합니다." },
  { title: "운세 배틀", desc: "이번 주 운이 더 좋은 사람은? 친구와 가볍게 승부를 걸어보세요." },
  { title: "인맥 우주지도", desc: "내 주변 인연을 별자리처럼 시각화. 숨겨진 귀인을 발견하세요." },
];

export default function Home() {
  const [live, setLive] = useState(1247);
  useEffect(() => {
    const id = setInterval(() => setLive((v) => v + Math.floor(Math.random() * 3)), 5000);
    return () => clearInterval(id);
  }, []);

  const c1 = useCounter(12847);
  const c2 = useCounter(89231);
  const c3 = useCounter(5120);

  return (
    <main className="relative min-h-screen bg-[#0a0e27] overflow-x-hidden">
      <Starfield />

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-0 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[100px]" />
      </div>

      {/* ═══ HERO ═══ */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="animate-fade-in-up max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-10">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            <span className="text-slate-400 text-xs tracking-wide">{live.toLocaleString()}명이 지금 사주를 보고 있어요</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
            <span className="text-white">내 사주,</span>
            <br />
            <span className="bg-gradient-to-r from-purple-300 to-amber-200 bg-clip-text text-transparent">
              이렇게 재밌었어?
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 mb-3 font-light max-w-md mx-auto leading-relaxed">
            생년월일 하나면 끝.<br />
            AI 상담사가 사주를 풀고, 내 인생 스탯을 보여드려요.
          </p>
          <p className="text-xs text-slate-500/60 mb-12 tracking-wider">
            정통 만세력 · 6명의 캐릭터 상담사 · 매일 새로운 운세
          </p>

          <div className="flex flex-col items-center gap-3">
            <Link
              href="/saju"
              className="group inline-flex items-center gap-2.5 px-10 py-4 bg-white text-[#0a0e27] font-semibold rounded-full transition-all duration-300 hover:bg-purple-100 hover:scale-[1.03] text-base"
            >
              무료로 시작하기
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="text-[11px] text-slate-600">가입 없이 · 바로 시작</p>
          </div>
        </div>

        <div className="absolute bottom-10 text-slate-600">
          <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ═══ RPG DASHBOARD ═══ */}
      <section className="relative z-10 px-4 py-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="text-slate-500 text-[11px] tracking-[0.3em] uppercase mb-4">Life Dashboard</p>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-5 tracking-tight">
              내 인생을 스탯으로 본다면
            </h2>
            <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed">
              막연한 미래 대신, 구체적인 수치로 보여드립니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-5 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
              {stats.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300 font-medium tracking-wide">{s.label}</span>
                    <span className="text-slate-500 tabular-nums font-mono text-xs">{s.value}</span>
                  </div>
                  <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${s.value}%`,
                        backgroundColor: s.color,
                        opacity: 0.8,
                      }}
                    />
                  </div>
                </div>
              ))}
              <p className="text-xs text-slate-600 pt-2 tracking-wide">
                * 실제 사주 분석 기반으로 생성됩니다
              </p>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-8">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-[10px] text-slate-600 tracking-[0.2em] uppercase">Sample Dashboard</p>
                  <span className="text-[10px] text-slate-600 px-2 py-0.5 border border-white/[0.06] rounded-full">Preview</span>
                </div>
                <div className="text-center mb-6">
                  <p className="text-2xl font-black text-white tracking-tight">壬午 일주</p>
                  <p className="text-sm text-slate-500 mt-1">자유로운 전략가</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "HP", value: "67", sub: "건강운", color: "text-emerald-400/70" },
                    { label: "MP", value: "85", sub: "멘탈", color: "text-blue-400/70" },
                    { label: "Gold", value: "45", sub: "재물운", color: "text-amber-400/70" },
                  ].map((g, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white/[0.03] text-center">
                      <p className="text-[10px] text-slate-600 mb-1">{g.label}</p>
                      <p className={`text-xl font-black ${g.color} tabular-nums`}>{g.value}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">{g.sub}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
                  <p className="text-xs text-slate-500">용신 <span className="text-slate-300 font-medium">金</span> — 메탈 소재의 액세서리가 행운을 끌어옵니다</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/saju" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors duration-300 tracking-wide group">
              내 스탯 확인하기
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ CHARACTERS ═══ */}
      <section className="relative z-10 px-4 py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="text-slate-500 text-[11px] tracking-[0.3em] uppercase mb-4">Counselors</p>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-5 tracking-tight">
              여섯 명의 상담사
            </h2>
            <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed">
              같은 사주도 누가 읽느냐에 따라 다른 이야기가 됩니다.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {characters.map((char, i) => {
              const meta = charMeta[char.id];
              return (
                <Link
                  key={char.id}
                  href="/saju"
                  className="group animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-b ${char.gradient} border border-white/[0.04] hover:border-white/[0.1] transition-all duration-500 hover:-translate-y-1`}>
                    <div className="aspect-[3/4] relative">
                      <Image
                        src={char.image}
                        alt={char.name}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27] via-[#0a0e27]/20 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`text-xs font-medium bg-gradient-to-r ${char.elementColor} bg-clip-text text-transparent`}>
                          {char.element}
                        </p>
                        <span className="text-[10px] text-slate-600">
                          {char.gender === "M" ? "M" : "F"} · {char.age}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-0.5">{char.name}</h3>
                      <p className="text-xs text-slate-500 italic mb-2">{meta?.line}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {meta?.tags.map((t) => (
                          <span key={t} className="text-[10px] text-slate-500 tracking-wide">#{t}</span>
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

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="relative z-10 px-4 py-28">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="text-slate-500 text-[11px] tracking-[0.3em] uppercase mb-4">Process</p>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">3분이면 충분합니다</h2>
          </div>

          <div className="space-y-0">
            {[
              { n: "01", title: "생년월일시 입력", desc: "양력 또는 음력, 태어난 시간까지. 정확할수록 깊어집니다." },
              { n: "02", title: "상담사 선택", desc: "따뜻한 위로가 필요한지, 냉정한 분석이 필요한지. 마음 가는 사람에게." },
              { n: "03", title: "AI 사주 상담", desc: "사주 해석부터 올해 운세, 연애운, 커리어까지. 대화로 풀어갑니다." },
            ].map((s, i) => (
              <div
                key={i}
                className="animate-fade-in-up flex items-start gap-6 py-8 border-b border-white/[0.04] last:border-0"
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <span className="text-xs text-slate-600 font-mono tracking-wider pt-1 shrink-0">{s.n}</span>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1.5">{s.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SOCIAL ═══ */}
      <section className="relative z-10 px-4 py-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="text-slate-500 text-[11px] tracking-[0.3em] uppercase mb-4">Together</p>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-5 tracking-tight">
              혼자 보면 아쉽잖아요
            </h2>
            <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed">
              궁합을 확인하고, 배틀하고, 관계의 지도를 그려보세요.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {socialItems.map((f, i) => (
              <div
                key={i}
                className="animate-fade-in-up p-7 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-all duration-300"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <h3 className="text-lg font-bold text-white mb-3">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROFILE CARD ═══ */}
      <section className="relative z-10 px-4 py-28">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up">
              <p className="text-slate-500 text-[11px] tracking-[0.3em] uppercase mb-4">Share</p>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-5 tracking-tight leading-tight">
                내 사주를 카드로<br />만들어 공유하기
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                오행 밸런스, 올해 키워드, 성격 유형까지<br />
                하나의 카드에 담아 인스타 스토리로 공유하세요.
              </p>
              <Link href="/saju" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors duration-300 tracking-wide group">
                내 카드 만들기
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            <div className="animate-fade-in-up flex justify-center" style={{ animationDelay: "0.2s" }}>
              <div className="w-60 rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 hover:border-white/[0.1] transition-all duration-500">
                <div className="text-center mb-5">
                  <p className="text-xl font-black text-white">壬午 일주</p>
                  <p className="text-xs text-slate-500 mt-1">자유로운 전략가</p>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between"><span className="text-slate-600">오행</span><span className="text-slate-400">水 › 火 › 木 › 金 › 土</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">용신</span><span className="text-slate-400">金</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">2026</span><span className="text-slate-400">도약의 해</span></div>
                </div>
                <div className="mt-5 flex flex-wrap gap-1.5 justify-center">
                  {["직감형", "승부사", "자유영혼"].map((t) => (
                    <span key={t} className="text-[10px] text-slate-500 px-2 py-0.5 rounded-full border border-white/[0.06]">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-white/[0.04] text-center">
                  <p className="text-[10px] text-slate-600 tracking-[0.15em]">UNMYO</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="relative z-10 px-4 py-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="text-slate-500 text-[11px] tracking-[0.3em] uppercase mb-4">Features</p>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              사주 앱은 많지만, 이런 건 없었습니다
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {featureList.map((f, i) => (
              <div
                key={i}
                className="animate-fade-in-up p-5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-300"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <h3 className="text-sm font-semibold text-white mb-1.5">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF ═══ */}
      <section className="relative z-10 px-4 py-28">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-4 mb-20">
            {[
              { ref: c1.ref, count: c1.count, label: "사주 분석 완료" },
              { ref: c2.ref, count: c2.count, label: "AI 상담 대화" },
              { ref: c3.ref, count: c3.count, label: "궁합 매칭" },
            ].map((c, i) => (
              <div key={i} ref={c.ref} className="text-center animate-fade-in-up">
                <p className="text-2xl md:text-4xl font-black text-white tabular-nums tracking-tight">{c.count.toLocaleString()}</p>
                <p className="text-[11px] text-slate-600 mt-2 tracking-wide">{c.label}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { text: "서진한테 팩폭 당했는데 할 말이 없었음", who: "31세, 직장인" },
              { text: "셀카 한 장으로 관상 분석이 되는 게 말이 됨?", who: "27세, 대학원생" },
              { text: "운세배틀 지는 사람이 커피 사기로 했는데 매일 해요", who: "24세, 디자이너" },
            ].map((r, i) => (
              <div key={i} className="animate-fade-in-up p-6 rounded-xl bg-white/[0.02] border border-white/[0.04]" style={{ animationDelay: `${i * 0.1}s` }}>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">&ldquo;{r.text}&rdquo;</p>
                <p className="text-xs text-slate-600">— {r.who}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="relative z-10 px-4 py-28">
        <div className="max-w-2xl mx-auto text-center animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-5 tracking-tight leading-snug">
            오늘의 운세,<br />확인하셨나요?
          </h2>
          <p className="text-slate-500 text-sm mb-12 max-w-md mx-auto leading-relaxed">
            연애운이 궁금하다면 하린에게, 진로 고민이라면 지호에게,<br />
            인생의 큰 그림은 노을에게 물어보세요.
          </p>
          <Link
            href="/saju"
            className="group inline-flex items-center gap-2.5 px-12 py-5 bg-white text-[#0a0e27] font-semibold rounded-full transition-all duration-300 hover:bg-purple-100 hover:scale-[1.03] text-lg"
          >
            내 사주 확인하기
            <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className="text-[11px] text-slate-600 mt-5">가입 없이 바로 시작</p>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="relative z-10 text-center py-16 border-t border-white/[0.04]">
        <p className="text-sm font-semibold text-white tracking-wider mb-1">UNMYO</p>
        <p className="text-xs text-slate-600">© 2026 운묘. All rights reserved.</p>
      </footer>

      {/* ═══ FLOATING CTA (Mobile) ═══ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden p-3 bg-[#0a0e27]/95 backdrop-blur-lg border-t border-white/[0.04]">
        <Link
          href="/saju"
          className="block w-full py-3.5 bg-white text-[#0a0e27] font-semibold rounded-full text-center text-sm"
        >
          무료로 사주 보기
        </Link>
      </div>
    </main>
  );
}
