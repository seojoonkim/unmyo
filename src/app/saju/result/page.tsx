"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Starfield from "@/components/Starfield";
import { characters } from "@/lib/characters";

const SAJU_PILLARS = [
  { label: "年柱", gan: "甲", ji: "子" },
  { label: "月柱", gan: "丙", ji: "寅" },
  { label: "日柱", gan: "壬", ji: "午" },
  { label: "時柱", gan: "丁", ji: "巳" },
];

const OHAENG = [
  { name: "木", value: 30, color: "#22c55e" },
  { name: "火", value: 25, color: "#ef4444" },
  { name: "土", value: 15, color: "#f59e0b" },
  { name: "金", value: 10, color: "#94a3b8" },
  { name: "水", value: 20, color: "#3b82f6" },
];

const INTERPRETATIONS: Record<string, string[]> = {
  yunha: [
    "…자네의 사주를 보았네.",
    "일간이 壬水라, 깊은 물처럼 지혜가 넘치는 사주일세.",
    "다만 木의 기운이 강하니, 새로운 시작에 대한 열망이 크겠군.",
    "올해는 흐름을 거스르지 않는 것이 좋겠네.",
  ],
  harin: [
    "우와~ 재밌는 사주다!",
    "壬水 일간이라 머리 좋은 타입이네 ㅎㅎ",
    "근데 木이 좀 많아서… 생각만 하고 행동 안 하는 거 아니지?",
    "올해는 불꽃처럼 확 질러봐! 🔥",
  ],
  jiho: [
    "음, 차 한 잔 마시면서 천천히 이야기해볼까.",
    "壬水 일간이니까, 자네는 원래 적응력이 좋은 사람이야.",
    "木 기운이 좀 많긴 한데, 그게 오히려 성장의 원동력이 될 거야.",
    "조급해하지 말고, 흘러가는 대로 한번 맡겨봐.",
  ],
  seojin: [
    "후… 꽤 흥미로운 사주로군요.",
    "壬水 일간, 지혜의 물이라… 나쁘지 않네요.",
    "다만 木이 과다하니 우유부단함을 조심하셔야 할 겁니다.",
    "…뭐, 제가 옆에서 봐드리죠. 감사하실 필요 없어요.",
  ],
  noeul: [
    "허허, 이 늙은이가 별을 읽어보마.",
    "壬水 일간이라… 깊은 바다 같은 아이로구나.",
    "木의 기운이 왕성하니 올 봄에 좋은 인연이 올 게야.",
    "걱정 말거라. 네 운명의 별은 밝게 빛나고 있단다.",
  ],
  myo: [
    "냐하~ 네 사주 들여다봤어!",
    "壬水 일간이라니~ 물처럼 변화무쌍한 운명이네 ✨",
    "木이 이렇게 많으면… 비밀 하나 알려줄까? 아, 역시 안 알려줄래~",
    "그냥 재밌게 살아! 운명 따윈 내가 장난쳐줄 테니까 냥~",
  ],
};

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const name = searchParams.get("name") || "당신";
  const counselorId = searchParams.get("counselor") || "yunha";
  const character = characters.find((c) => c.id === counselorId) || characters[0];
  const interpretation = INTERPRETATIONS[character.id] || INTERPRETATIONS.yunha;

  const handleDeepChat = () => {
    const params = new URLSearchParams(searchParams.toString());
    router.push(`/chat/${character.id}?${params.toString()}`);
  };

  return (
    <main className="relative min-h-screen bg-[#0a0e27]">
      <Starfield />

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-purple-600/[0.08] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12 space-y-8">

        {/* Section 1: Character + Header */}
        <section className="text-center animate-[fadeInUp_0.6s_ease-out_both]">
          <div className={`inline-block p-1 rounded-full bg-gradient-to-br ${character.elementColor} mb-4`}>
            <div className="w-20 h-20 rounded-full overflow-hidden bg-[#0a0e27]">
              <Image
                src={character.image}
                alt={character.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {name}님의 사주를 봤어요
          </h1>
          <p className="text-white/50 text-sm">
            상담사 <span className="text-white/80">{character.name}</span> · {character.element}
          </p>
        </section>

        {/* Section 2: 사주 팔자 4주 */}
        <section className="animate-[fadeInUp_0.6s_ease-out_0.1s_both]">
          <h2 className="text-white/60 text-sm font-medium mb-3 tracking-wider">사주 팔자</h2>
          <div className="grid grid-cols-4 gap-3">
            {SAJU_PILLARS.map((p) => (
              <div
                key={p.label}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 text-center"
              >
                <p className="text-white/40 text-xs mb-2">{p.label}</p>
                <p className="text-3xl font-bold text-white leading-none">{p.gan}</p>
                <p className="text-2xl text-white/70 mt-1">{p.ji}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: 오행 밸런스 */}
        <section className="animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
          <h2 className="text-white/60 text-sm font-medium mb-3 tracking-wider">오행 밸런스</h2>
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 space-y-3">
            {OHAENG.map((o) => (
              <div key={o.name} className="flex items-center gap-3">
                <span className="text-white/70 text-sm w-6 text-center">{o.name}</span>
                <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full animate-[barGrow_0.8s_ease-out_0.4s_both]"
                    style={{ width: `${o.value}%`, backgroundColor: o.color }}
                  />
                </div>
                <span className="text-white/40 text-xs w-8 text-right">{o.value}%</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: 캐릭터 해석 메시지 */}
        <section className="animate-[fadeInUp_0.6s_ease-out_0.3s_both]">
          <h2 className="text-white/60 text-sm font-medium mb-3 tracking-wider">{character.name}의 해석</h2>
          <div className="flex gap-3 items-start">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br ${character.elementColor}`}>
              <Image
                src={character.image}
                alt={character.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-2">
              {interpretation.map((msg, i) => (
                <div
                  key={i}
                  className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 text-white/90 text-sm leading-relaxed"
                  style={{ animationDelay: `${0.4 + i * 0.15}s` }}
                >
                  {msg}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: CTA */}
        <section className="animate-[fadeInUp_0.6s_ease-out_0.5s_both]">
          <button
            onClick={handleDeepChat}
            className={`w-full py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-r ${character.elementColor} hover:scale-[1.02] active:scale-[0.98] transition-transform`}
          >
            더 깊이 물어보기
          </button>
        </section>

        {/* Section 6: 공유 카드 */}
        <section className="animate-[fadeInUp_0.6s_ease-out_0.6s_both]">
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 text-center" id="saju-card">
            <p className="text-white/40 text-xs mb-2">MY SAJU CARD</p>
            <p className="text-white text-xl font-bold mb-1">{name}</p>
            <div className="flex justify-center gap-2 mb-3">
              {SAJU_PILLARS.map((p) => (
                <span key={p.label} className="text-white/70 text-sm">
                  {p.gan}{p.ji}
                </span>
              ))}
            </div>
            <div className="flex justify-center gap-2 mb-4">
              {OHAENG.map((o) => (
                <span
                  key={o.name}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: o.color + "30", color: o.color }}
                >
                  {o.name} {o.value}%
                </span>
              ))}
            </div>
            <p className="text-white/30 text-xs">UNMYO · 운명의 별자리</p>
          </div>
          <button
            className="w-full mt-3 py-3 rounded-2xl border border-white/10 text-white/60 hover:text-white/90 hover:border-white/20 transition-colors text-sm"
          >
            내 사주 카드 저장하기
          </button>
        </section>

      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes barGrow {
          from {
            width: 0%;
          }
        }
      `}</style>
    </main>
  );
}

export default function SajuResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
