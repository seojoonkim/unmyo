"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Starfield from "@/components/Starfield";
import { characters } from "@/lib/characters";

/* ─── 오행 색상 맵 ─── */
const OH_COLORS: Record<string, string> = {
  木: "#22c55e", 火: "#ef4444", 土: "#f59e0b", 金: "#94a3b8", 水: "#3b82f6",
};

/* ─── 천간 → 오행 ─── */
const GAN_OH: Record<string, string> = {
  甲: "木", 乙: "木", 丙: "火", 丁: "火", 戊: "土",
  己: "土", 庚: "金", 辛: "金", 壬: "水", 癸: "水",
};
/* ─── 지지 → 오행 ─── */
const JI_OH: Record<string, string> = {
  子: "水", 丑: "土", 寅: "木", 卯: "木", 辰: "土", 巳: "火",
  午: "火", 未: "土", 申: "金", 酉: "金", 戌: "土", 亥: "水",
};
/* ─── 음양 ─── */
const GAN_YY: Record<string, string> = {
  甲: "양", 乙: "음", 丙: "양", 丁: "음", 戊: "양",
  己: "음", 庚: "양", 辛: "음", 壬: "양", 癸: "음",
};
const JI_YY: Record<string, string> = {
  子: "양", 丑: "음", 寅: "양", 卯: "음", 辰: "양", 巳: "음",
  午: "양", 未: "음", 申: "양", 酉: "음", 戌: "양", 亥: "음",
};

/* ─── 사주 4주 + 십신 ─── */
const SAJU_PILLARS = [
  { label: "年柱", gan: "甲", ji: "子", sipsin_gan: "편인", sipsin_ji: "겁재" },
  { label: "月柱", gan: "丙", ji: "寅", sipsin_gan: "편재", sipsin_ji: "식신" },
  { label: "日柱", gan: "壬", ji: "午", sipsin_gan: "일간", sipsin_ji: "정재" },
  { label: "時柱", gan: "丁", ji: "巳", sipsin_gan: "정재", sipsin_ji: "편관" },
];

/* ─── 오행 밸런스 ─── */
const OHAENG = [
  { name: "木", label: "나무", desc: "성장, 창의력, 새로운 시작", value: 30, color: "#22c55e" },
  { name: "火", label: "불", desc: "열정, 표현력, 사교성", value: 25, color: "#ef4444" },
  { name: "土", label: "흙", desc: "안정, 신뢰, 포용력", value: 15, color: "#f59e0b" },
  { name: "金", label: "쇠", desc: "절제, 결단력, 리더십", value: 10, color: "#94a3b8" },
  { name: "水", label: "물", desc: "지혜, 유연성, 적응력", value: 20, color: "#3b82f6" },
];

/* ─── 대운 타임라인 ─── */
const DAEUN = [
  { age: "1~10", hanja: "庚申", keyword: "안정기", icon: "🌱" },
  { age: "11~20", hanja: "辛酉", keyword: "학습기", icon: "📚" },
  { age: "21~30", hanja: "壬戌", keyword: "도전기", icon: "⚡" },
  { age: "31~40", hanja: "癸亥", keyword: "성장기", icon: "🌿" },
  { age: "41~50", hanja: "甲子", keyword: "도약기", icon: "🚀", current: true },
  { age: "51~60", hanja: "乙丑", keyword: "안정기", icon: "🏔️" },
  { age: "61~70", hanja: "丙寅", keyword: "결실기", icon: "🍎" },
];

/* ─── 올해 운세 ─── */
const YEAR_FORTUNE = {
  year: "2026", hanja: "丙午",
  scores: [
    { name: "총운", score: 82, comment: "전반적으로 상승세, 새 기회가 찾아옵니다" },
    { name: "연애운", score: 75, comment: "기존 관계는 깊어지고, 새 만남엔 열린 마음을" },
    { name: "재물운", score: 68, comment: "투자보다 저축, 하반기에 수입 증가" },
    { name: "건강운", score: 70, comment: "화 기운 과다 주의, 심장과 혈압 관리" },
    { name: "직업운", score: 88, comment: "능력을 인정받는 해, 승진/이직 유리" },
  ],
  monthly: [72, 65, 78, 80, 85, 90, 88, 75, 70, 82, 86, 92],
};

/* ─── 성격 분석 ─── */
const PERSONALITY = {
  type: "壬午 일주 — 자유로운 전략가",
  axes: [
    { left: "내향", right: "외향", value: 65 },
    { left: "현실", right: "직관", value: 72 },
    { left: "논리", right: "감정", value: 40 },
    { left: "즉흥", right: "계획", value: 55 },
  ],
  tags: ["#전략가", "#자유영혼", "#지적호기심", "#변화무쌍", "#깊은사고", "#적응력甲"],
};

/* ─── 십신 관계도 ─── */
const SIPSIN_MAP = [
  { name: "비견", strength: 30, desc: "경쟁심, 자립" },
  { name: "겁재", strength: 45, desc: "추진력, 욕구" },
  { name: "식신", strength: 70, desc: "재능, 표현" },
  { name: "상관", strength: 55, desc: "창의, 반항" },
  { name: "편재", strength: 60, desc: "투자, 모험" },
  { name: "정재", strength: 40, desc: "안정, 축적" },
  { name: "편관", strength: 50, desc: "권위, 도전" },
  { name: "정관", strength: 35, desc: "질서, 책임" },
  { name: "편인", strength: 80, desc: "학문, 직관" },
  { name: "정인", strength: 25, desc: "지혜, 보호" },
];

/* ─── 신살 ─── */
const SINSAL = [
  { name: "천을귀인", type: "길신", stars: 3, desc: "어려울 때 귀인이 나타나 도움을 줍니다. 대인관계에서 큰 행운이 따릅니다.", icon: "✨" },
  { name: "도화살", type: "길신", stars: 3, desc: "매력이 넘치고 이성에게 인기가 많습니다. 예술적 감각이 뛰어납니다.", icon: "🌸" },
  { name: "역마살", type: "중성", stars: 2, desc: "이동과 변화가 많은 삶입니다. 해외 운이 좋고 활동적입니다.", icon: "🐎" },
  { name: "화개살", type: "길신", stars: 2, desc: "학문과 예술에 재능이 있으며, 영적인 감각이 발달합니다.", icon: "🎭" },
];

/* ─── 행운 가이드 ─── */
const LUCKY_GUIDE = [
  { label: "행운의 색", value: "금색, 백색", sub: "金 기운 강화", icon: "🎨" },
  { label: "행운의 방향", value: "서쪽", sub: "집/사무실 서쪽 활용", icon: "🧭" },
  { label: "행운의 숫자", value: "4, 9", sub: "중요한 결정에 활용", icon: "🔢" },
  { label: "행운의 시간", value: "신시 (15~17시)", sub: "중요 미팅/결정 추천", icon: "⏰" },
  { label: "행운의 음식", value: "맵고 따뜻한 음식", sub: "火 기운 보충", icon: "🍲" },
  { label: "행운의 보석", value: "자수정, 백수정", sub: "金水 기운 조화", icon: "💎" },
];

/* ─── 캐릭터 해석 (확장) ─── */
const INTERPRETATIONS: Record<string, { section: string; messages: string[] }[]> = {
  yunha: [
    { section: "총운", messages: [
      "…자네의 사주를 찬찬히 살펴보았네.",
      "일간이 壬水라, 깊은 바다와 같은 지혜를 타고났네. 겉으로는 고요하나 속은 끊임없이 흐르고 있지.",
      "木의 기운이 강하니 새로운 것을 향한 열망이 대단하네만, 金이 약해서 결단의 순간에 흔들릴 수 있네.",
    ]},
    { section: "연애", messages: [
      "도화살이 있으니 이성에게 인기가 좋을 것이네.",
      "다만 壬水의 깊은 내면을 이해해줄 사람을 만나는 것이 중요하지.",
    ]},
    { section: "재물", messages: [
      "편재의 기운이 있어 투자 감각은 좋으나, 올해는 보수적으로 가는 게 낫겠네.",
    ]},
    { section: "조언", messages: [
      "금년은 흐름을 거스르지 말고, 물처럼 유연하게 대처하게.",
      "용신인 金의 기운을 보충하면 한결 안정될 것이네. 서쪽 방향, 금색 계열을 가까이하게나.",
    ]},
  ],
  harin: [
    { section: "총운", messages: [
      "우와~ 재밌는 사주다! 진짜 독특해!",
      "壬水 일간이라 머리 좋은 타입이네 ㅎㅎ 근데 좀 오버씽킹하는 스타일일듯?",
      "木이 많아서 아이디어는 넘치는데 金이 부족하니까 실행력이 좀 아쉬울 수 있어!",
    ]},
    { section: "연애", messages: [
      "도화살 있으니까 인기 많을 거야~ 근데 너무 이상만 높이지 마! ㅋㅋ",
      "올해 하반기에 좋은 인연 올 확률 높아 보여!",
    ]},
    { section: "재물", messages: [
      "돈은… 벌 수 있는데 쓰는 것도 좋아하는 타입이넹 ㅋㅋ 저축 좀 해!",
    ]},
    { section: "조언", messages: [
      "올해는 불꽃처럼 확 질러봐! 🔥 근데 건강은 챙겨야 해~",
      "金 기운 보충하려면 운동 추천! 특히 웨이트 같은 거!",
    ]},
  ],
  jiho: [
    { section: "총운", messages: [
      "음, 차 한 잔 마시면서 천천히 이야기해볼까.",
      "壬水 일간이니까, 자네는 원래 적응력이 좋은 사람이야. 어디서든 물처럼 스며들지.",
      "木 기운이 좀 많긴 한데, 그게 오히려 성장의 원동력이 될 거야.",
    ]},
    { section: "연애", messages: [
      "감정 표현을 좀 더 하는 게 좋을 것 같아. 속으로만 삭이지 말고.",
      "올해 좋은 사람 만날 수 있어. 열린 마음으로.",
    ]},
    { section: "재물", messages: [
      "큰 투자보다는 꾸준한 수입에 집중하는 게 좋겠어.",
    ]},
    { section: "조언", messages: [
      "조급해하지 말고, 흘러가는 대로 한번 맡겨봐.",
      "金 기운이 부족하니까, 규칙적인 생활 패턴을 만들어보는 건 어때?",
    ]},
  ],
  seojin: [
    { section: "총운", messages: [
      "후… 꽤 흥미로운 사주로군요.",
      "壬水 일간, 지혜의 물이라… 나쁘지 않네요. 깊은 사고력과 직관을 가졌어요.",
      "다만 木이 과다하니 우유부단함을 조심하셔야 할 겁니다.",
    ]},
    { section: "연애", messages: [
      "…연애요? 도화살이 있으니 인기야 있겠지만, 본인이 벽을 치고 있잖아요.",
      "좀 더 솔직해지세요. 어렵지 않을 거예요… 아마도.",
    ]},
    { section: "재물", messages: [
      "재물운은 나쁘지 않은데, 충동 소비 주의하세요.",
    ]},
    { section: "조언", messages: [
      "용신이 金이니까 결단력을 키우세요. 망설이지 마시고.",
      "…뭐, 제가 옆에서 봐드리죠. 감사하실 필요 없어요.",
    ]},
  ],
  noeul: [
    { section: "총운", messages: [
      "허허, 이 늙은이가 별을 읽어보마.",
      "壬水 일간이라… 깊은 바다 같은 아이로구나. 세상의 이치를 꿰뚫는 눈을 가졌어.",
      "木의 기운이 왕성하니 올 봄에 새로운 기회가 올 게야.",
    ]},
    { section: "연애", messages: [
      "좋은 인연은 억지로 찾는 게 아니란다. 자연스럽게 다가올 거야.",
      "네 진심을 보여주면, 상대도 마음을 열 게다.",
    ]},
    { section: "재물", messages: [
      "욕심내지 말거라. 필요한 만큼만 가지면 충분하단다.",
    ]},
    { section: "조언", messages: [
      "걱정 말거라. 네 운명의 별은 밝게 빛나고 있단다.",
      "金 기운을 보충하려면, 새벽 산책을 해보렴. 맑은 공기가 도움이 될 거야.",
    ]},
  ],
  myo: [
    { section: "총운", messages: [
      "냐하~ 네 사주 들여다봤어! 꽤 재밌는 운명이네~",
      "壬水 일간이라니~ 물처럼 변화무쌍한 운명이야 ✨ 근데 그게 매력이지!",
      "木이 이렇게 많으면… 비밀 하나 알려줄까? 아, 역시 안 알려줄래~ 냐하핫!",
    ]},
    { section: "연애", messages: [
      "도화살 있으니까 인기 대폭발이야~ 🌸",
      "근데 너무 장난치지 마~ 진심인 사람 놓친다옹!",
    ]},
    { section: "재물", messages: [
      "돈? 들어오긴 하는데 나가는 것도 빠를 거야~ 고양이 간식값은 남겨둬! 🐟",
    ]},
    { section: "조언", messages: [
      "그냥 재밌게 살아! 운명 따윈 내가 장난쳐줄 테니까 냥~",
      "아 맞다, 金 기운 보충해야 하니까 반짝이는 거 모아봐! 악세사리 같은 거~ ✨",
    ]},
  ],
};

/* ─── 공유 카드 테마 ─── */
const SHARE_THEMES = [
  { id: "soomook", name: "수묵화", bg: "from-gray-900 to-gray-800", text: "text-gray-100", accent: "border-gray-500" },
  { id: "neon", name: "네온", bg: "from-purple-900 to-pink-900", text: "text-pink-100", accent: "border-pink-400" },
  { id: "minimal", name: "미니멀", bg: "from-white to-gray-100", text: "text-gray-900", accent: "border-gray-300" },
  { id: "cosmos", name: "우주", bg: "from-indigo-950 to-violet-950", text: "text-violet-100", accent: "border-violet-400" },
  { id: "romantic", name: "로맨틱", bg: "from-rose-900 to-pink-800", text: "text-rose-100", accent: "border-rose-300" },
  { id: "dark", name: "다크", bg: "from-black to-gray-950", text: "text-gray-100", accent: "border-gray-600" },
];

/* ─── 도넛 차트 SVG ─── */
function DonutChart({ data }: { data: typeof OHAENG }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 60, cx = 80, cy = 80, stroke = 24;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg viewBox="0 0 160 160" className="w-40 h-40 mx-auto">
      {data.map((d) => {
        const pct = d.value / total;
        const dash = circumference * pct;
        const gap = circumference - dash;
        const currentOffset = offset;
        offset += dash;
        return (
          <circle
            key={d.name}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={d.color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-currentOffset}
            className="animate-[donutGrow_1s_ease-out_0.5s_both]"
            style={{ transformOrigin: "center" }}
          />
        );
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" className="fill-white text-xs font-bold">오행</text>
      <text x={cx} y={cy + 12} textAnchor="middle" className="fill-white/50 text-[10px]">밸런스</text>
    </svg>
  );
}

/* ─── 레이더 차트 (Pentagon) SVG ─── */
function RadarChart({ scores }: { scores: { name: string; score: number }[] }) {
  const cx = 100, cy = 100, maxR = 75;
  const n = scores.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  const pointAt = (i: number, r: number) => {
    const angle = startAngle + i * angleStep;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const dataPoints = scores.map((s, i) => pointAt(i, (s.score / 100) * maxR));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z";

  return (
    <svg viewBox="0 0 200 200" className="w-52 h-52 mx-auto">
      {gridLevels.map((level) => {
        const pts = scores.map((_, i) => pointAt(i, maxR * level));
        const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z";
        return <path key={level} d={path} fill="none" stroke="white" strokeOpacity={0.1} strokeWidth={0.5} />;
      })}
      {scores.map((_, i) => {
        const p = pointAt(i, maxR);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="white" strokeOpacity={0.08} strokeWidth={0.5} />;
      })}
      <path d={dataPath} fill="rgba(139,92,246,0.25)" stroke="#8b5cf6" strokeWidth={1.5} className="animate-[radarGrow_1s_ease-out_0.5s_both]" />
      {scores.map((s, i) => {
        const p = pointAt(i, maxR + 18);
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" className="fill-white/60 text-[10px]">
            {s.name}
          </text>
        );
      })}
    </svg>
  );
}

/* ─── WaveDivider ─── */
function WaveDivider() {
  return (
    <div className="py-4 opacity-30">
      <svg viewBox="0 0 1200 40" className="w-full h-5" preserveAspectRatio="none">
        <path d="M0,20 Q300,0 600,20 T1200,20" fill="none" stroke="white" strokeOpacity="0.15" strokeWidth="1" />
      </svg>
    </div>
  );
}

/* ─── Main Content ─── */
function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [shareTheme, setShareTheme] = useState("cosmos");

  const name = searchParams.get("name") || "당신";
  const counselorId = searchParams.get("counselor") || "yunha";
  const character = characters.find((c) => c.id === counselorId) || characters[0];
  const interpretation = INTERPRETATIONS[character.id] || INTERPRETATIONS.yunha;
  const selectedTheme = SHARE_THEMES.find((t) => t.id === shareTheme) || SHARE_THEMES[3];

  const handleDeepChat = (question?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (question) params.set("initial", question);
    router.push(`/chat/${character.id}?${params.toString()}`);
  };

  const maxSipsin = SIPSIN_MAP.reduce((a, b) => a.strength > b.strength ? a : b);

  return (
    <main className="relative min-h-screen bg-[#0a0e27]">
      <Starfield />

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-purple-600/[0.08] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/[0.05] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12 space-y-2">

        {/* ═══ SECTION 1: 상단 헤더 ═══ */}
        <section className="text-center stagger-1">
          <div className={`inline-block p-1 rounded-full bg-gradient-to-br ${character.elementColor} mb-4`}>
            <div className="w-24 h-24 rounded-full overflow-hidden bg-[#0a0e27]">
              <Image src={character.image} alt={character.name} width={96} height={96} className="w-full h-full object-cover" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {name}님의 사주를 봤어요
          </h1>
          <p className="text-white/50 text-sm mb-4">
            상담사 <span className="text-white/80">{character.name}</span> · {character.element} · 1985년 2월 4일 오후 3시
          </p>
          <div className="inline-block bg-white/[0.04] backdrop-blur border border-white/[0.08] rounded-2xl px-6 py-3">
            <p className="text-white/40 text-xs mb-1">일주(日柱) 기반 유형</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text text-transparent">
              {PERSONALITY.type}
            </p>
          </div>
        </section>

        <WaveDivider />

        {/* ═══ SECTION 2: 사주 팔자 4주 카드 ═══ */}
        <section className="stagger-2">
          <h2 className="section-title">사주 팔자</h2>
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {SAJU_PILLARS.map((p) => (
              <div key={p.label} className="glass-card rounded-2xl p-3 sm:p-4 text-center relative overflow-hidden">
                <p className="text-white/40 text-xs mb-2">{p.label}</p>

                {/* 천간 */}
                <div className="mb-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full mb-1 inline-block"
                    style={{ backgroundColor: OH_COLORS[GAN_OH[p.gan]] + "25", color: OH_COLORS[GAN_OH[p.gan]] }}>
                    {GAN_OH[p.gan]} · {GAN_YY[p.gan]}
                  </span>
                  <p className="text-3xl font-bold leading-none" style={{ color: OH_COLORS[GAN_OH[p.gan]] }}>
                    {p.gan}
                  </p>
                </div>

                {/* 지지 */}
                <div className="mb-2">
                  <p className="text-2xl mt-1" style={{ color: OH_COLORS[JI_OH[p.ji]] + "cc" }}>
                    {p.ji}
                  </p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full inline-block"
                    style={{ backgroundColor: OH_COLORS[JI_OH[p.ji]] + "25", color: OH_COLORS[JI_OH[p.ji]] }}>
                    {JI_OH[p.ji]} · {JI_YY[p.ji]}
                  </span>
                </div>

                {/* 십신 */}
                <div className="border-t border-white/[0.06] pt-2 space-y-0.5">
                  <p className="text-white/50 text-[10px]">{p.sipsin_gan}</p>
                  <p className="text-white/30 text-[10px]">{p.sipsin_ji}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <WaveDivider />

        {/* ═══ SECTION 3: 오행 밸런스 ═══ */}
        <section className="stagger-3">
          <h2 className="section-title">오행 밸런스</h2>
          <div className="glass-card rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row gap-6 items-center mb-6">
              <DonutChart data={OHAENG} />
              <div className="flex-1 space-y-3 w-full">
                {OHAENG.map((o) => (
                  <div key={o.name} className="flex items-center gap-3">
                    <span className="text-sm w-6 text-center font-bold" style={{ color: o.color }}>{o.name}</span>
                    <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full animate-[barGrow_0.8s_ease-out_0.6s_both]"
                        style={{ width: `${o.value}%`, backgroundColor: o.color }} />
                    </div>
                    <span className="text-white/40 text-xs w-8 text-right">{o.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 오행 설명 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {OHAENG.map((o) => (
                <div key={o.name} className="flex items-center gap-2 text-xs text-white/50">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: o.color }} />
                  <span><span style={{ color: o.color }} className="font-medium">{o.name}({o.label})</span> — {o.desc}</span>
                </div>
              ))}
            </div>

            {/* 용신 */}
            <div className="border-t border-white/[0.06] pt-4">
              <div className="flex items-start gap-3 bg-white/[0.03] rounded-xl p-4">
                <span className="text-2xl">⚖️</span>
                <div>
                  <p className="text-white/80 text-sm font-medium mb-1">
                    용신(用神): <span className="font-bold" style={{ color: OH_COLORS["金"] }}>金</span>
                  </p>
                  <p className="text-white/50 text-xs leading-relaxed">
                    당신의 사주에서 金이 가장 부족합니다. 절제와 결단력을 보충하면 균형이 잡힙니다.
                    금색 계열의 악세사리, 서쪽 방향, 가을 계절이 도움됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <WaveDivider />

        {/* ═══ SECTION 4: 대운 타임라인 ═══ */}
        <section className="stagger-4">
          <h2 className="section-title">대운(大運) 타임라인</h2>
          <div className="glass-card rounded-2xl p-5">
            <div className="overflow-x-auto pb-2 -mx-2 px-2">
              <div className="flex gap-0 min-w-[600px] relative">
                {/* 연결 라인 */}
                <div className="absolute top-8 left-6 right-6 h-[2px] bg-white/10" />
                {DAEUN.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center relative">
                    <p className="text-white/40 text-[10px] mb-2">{d.age}세</p>
                    <div className={`w-4 h-4 rounded-full z-10 mb-2 ${d.current
                      ? "bg-violet-500 ring-4 ring-violet-500/30 animate-pulse"
                      : "bg-white/20"}`} />
                    <p className={`text-sm font-bold mb-0.5 ${d.current ? "text-violet-300" : "text-white/60"}`}>
                      {d.hanja}
                    </p>
                    <p className="text-lg mb-1">{d.icon}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${d.current
                      ? "bg-violet-500/20 text-violet-300"
                      : "bg-white/5 text-white/40"}`}>
                      {d.keyword}
                    </span>
                    {d.current && (
                      <span className="text-[9px] text-violet-400 mt-1 font-medium">← 현재</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <WaveDivider />

        {/* ═══ SECTION 5: 올해 운세 ═══ */}
        <section className="stagger-5">
          <h2 className="section-title">2026년 {YEAR_FORTUNE.hanja}년 운세</h2>
          <div className="glass-card rounded-2xl p-5 space-y-6">

            <RadarChart scores={YEAR_FORTUNE.scores} />

            {/* 운세 항목 */}
            <div className="space-y-3">
              {YEAR_FORTUNE.scores.map((s) => (
                <div key={s.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white/70 text-sm font-medium">{s.name}</span>
                    <span className="text-white/90 text-sm font-bold">{s.score}<span className="text-white/40 text-xs">/100</span></span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-1">
                    <div className="h-full rounded-full animate-[barGrow_0.8s_ease-out_0.8s_both]"
                      style={{
                        width: `${s.score}%`,
                        background: s.score >= 80 ? "linear-gradient(90deg,#8b5cf6,#a78bfa)"
                          : s.score >= 60 ? "linear-gradient(90deg,#3b82f6,#60a5fa)"
                          : "linear-gradient(90deg,#6b7280,#9ca3af)"
                      }} />
                  </div>
                  <p className="text-white/40 text-xs">{s.comment}</p>
                </div>
              ))}
            </div>

            {/* 월별 히트맵 */}
            <div>
              <p className="text-white/50 text-xs mb-2 font-medium">월별 운세 흐름</p>
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                {YEAR_FORTUNE.monthly.map((v, i) => (
                  <div key={i} className="text-center">
                    <div className="aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold transition-colors"
                      style={{
                        backgroundColor: `rgba(139,92,246,${v / 120})`,
                        color: v > 80 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
                      }}>
                      {v}
                    </div>
                    <p className="text-white/30 text-[9px] mt-0.5">{i + 1}월</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <WaveDivider />

        {/* ═══ SECTION 6: 성격 분석 ═══ */}
        <section className="stagger-6">
          <h2 className="section-title">성격 분석</h2>
          <div className="glass-card rounded-2xl p-5 space-y-5">
            <div className="text-center">
              <p className="text-lg font-bold bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text text-transparent">
                {PERSONALITY.type}
              </p>
            </div>

            {/* 4축 슬라이더 */}
            <div className="space-y-4">
              {PERSONALITY.axes.map((axis) => (
                <div key={axis.left}>
                  <div className="flex justify-between text-xs text-white/50 mb-1">
                    <span>{axis.left}</span>
                    <span>{axis.right}</span>
                  </div>
                  <div className="h-2.5 bg-white/5 rounded-full relative">
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 animate-[barGrow_0.8s_ease-out_1s_both]"
                        style={{ width: `${axis.value}%` }} />
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg shadow-violet-500/30 animate-[barGrow_0.8s_ease-out_1s_both]"
                      style={{ left: `calc(${axis.value}% - 8px)` }} />
                  </div>
                  <p className="text-center text-white/30 text-[10px] mt-0.5">{axis.value}%</p>
                </div>
              ))}
            </div>

            {/* 태그 */}
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              {PERSONALITY.tags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-300 text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <WaveDivider />

        {/* ═══ SECTION 7: 십신 관계도 ═══ */}
        <section className="stagger-7">
          <h2 className="section-title">십신(十神) 관계도</h2>
          <div className="glass-card rounded-2xl p-5">
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {SIPSIN_MAP.map((s) => {
                const isMax = s.name === maxSipsin.name;
                return (
                  <div key={s.name} className={`text-center p-2 sm:p-3 rounded-xl transition-all ${isMax
                    ? "bg-violet-500/15 border border-violet-500/30 ring-1 ring-violet-500/20"
                    : "bg-white/[0.02]"}`}>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-full flex items-center justify-center mb-1.5 text-sm sm:text-base font-bold"
                      style={{
                        backgroundColor: `rgba(139,92,246,${s.strength / 120})`,
                        color: s.strength > 50 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
                      }}>
                      {s.strength}
                    </div>
                    <p className={`text-xs font-medium mb-0.5 ${isMax ? "text-violet-300" : "text-white/70"}`}>
                      {s.name}
                    </p>
                    <p className="text-[9px] text-white/30">{s.desc}</p>
                    {isMax && <span className="text-[9px] text-violet-400 font-medium">★ 최강</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <WaveDivider />

        {/* ═══ SECTION 8: 신살 분석 ═══ */}
        <section className="stagger-8">
          <h2 className="section-title">신살(神殺) 분석</h2>
          <div className="space-y-2">
            {SINSAL.map((s) => (
              <div key={s.name} className="glass-card rounded-2xl p-4 flex items-start gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white/90 text-sm font-bold">{s.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${s.type === "길신"
                      ? "bg-green-500/15 text-green-400"
                      : s.type === "흉신"
                      ? "bg-red-500/15 text-red-400"
                      : "bg-yellow-500/15 text-yellow-400"}`}>
                      {s.type}
                    </span>
                    <span className="text-yellow-400 text-xs">{"★".repeat(s.stars)}{"☆".repeat(3 - s.stars)}</span>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <WaveDivider />

        {/* ═══ SECTION 9: 캐릭터 상세 해석 ═══ */}
        <section className="stagger-9">
          <h2 className="section-title">{character.name}의 상세 해석</h2>
          <div className="flex gap-3 items-start">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br ${character.elementColor}`}>
              <Image src={character.image} alt={character.name} width={40} height={40} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-4">
              {interpretation.map((group, gi) => (
                <div key={gi}>
                  <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1.5 ml-1">{group.section}</p>
                  <div className="space-y-1.5">
                    {group.messages.map((msg, mi) => (
                      <div key={mi}
                        className="bg-white/[0.04] backdrop-blur border border-white/[0.08] rounded-2xl rounded-tl-sm px-4 py-3 text-white/90 text-sm leading-relaxed msg-bubble"
                        style={{ animationDelay: `${0.5 + gi * 0.3 + mi * 0.12}s` }}>
                        {msg}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <WaveDivider />

        {/* ═══ SECTION 10: 행운 가이드 ═══ */}
        <section className="stagger-10">
          <h2 className="section-title">행운 가이드</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {LUCKY_GUIDE.map((item) => (
              <div key={item.label} className="glass-card rounded-2xl p-4 text-center">
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <p className="text-white/40 text-[10px] mb-1">{item.label}</p>
                <p className="text-white/90 text-sm font-bold mb-0.5">{item.value}</p>
                <p className="text-white/30 text-[10px]">{item.sub}</p>
              </div>
            ))}
          </div>
        </section>

        <WaveDivider />

        {/* ═══ SECTION 11: AI 상담 CTA ═══ */}
        <section className="stagger-11">
          <div className="glass-card rounded-2xl p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-blue-600/10" />
            <div className="relative z-10">
              <div className={`inline-block p-0.5 rounded-full bg-gradient-to-br ${character.elementColor} mb-3`}>
                <div className="w-16 h-16 rounded-full overflow-hidden bg-[#0a0e27]">
                  <Image src={character.image} alt={character.name} width={64} height={64} className="w-full h-full object-cover" />
                </div>
              </div>
              <h3 className="text-white font-bold text-lg mb-1">{character.name}에게 더 물어보기</h3>
              <p className="text-white/50 text-sm mb-4">사주를 바탕으로 더 깊은 상담을 받아보세요</p>

              <div className="flex flex-col gap-2 mb-4">
                {["올해 연애운이 궁금해요", "이직해도 될까요?", "재물운 올리려면?"].map((q) => (
                  <button key={q} onClick={() => handleDeepChat(q)}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/70 text-sm hover:bg-white/[0.08] hover:text-white/90 transition-all text-left">
                    💬 {q}
                  </button>
                ))}
              </div>

              <button onClick={() => handleDeepChat()}
                className={`w-full py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-r ${character.elementColor} hover:scale-[1.02] active:scale-[0.98] transition-transform`}>
                자유롭게 대화하기
              </button>
            </div>
          </div>
        </section>

        <WaveDivider />

        {/* ═══ SECTION 12: 공유 카드 ═══ */}
        <section className="stagger-12">
          <h2 className="section-title">내 사주 카드</h2>

          {/* 테마 선택 */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
            {SHARE_THEMES.map((theme) => (
              <button key={theme.id} onClick={() => setShareTheme(theme.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs transition-all ${shareTheme === theme.id
                  ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                  : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"}`}>
                {theme.name}
              </button>
            ))}
          </div>

          {/* 카드 */}
          <div className={`bg-gradient-to-br ${selectedTheme.bg} rounded-2xl p-6 text-center border ${selectedTheme.accent}`}
            id="saju-card">
            <p className={`${selectedTheme.text} opacity-40 text-[10px] tracking-[0.2em] mb-3`}>✦ UNMYO ✦</p>
            <p className={`${selectedTheme.text} text-2xl font-bold mb-1`}>{name}</p>
            <p className={`${selectedTheme.text} opacity-50 text-xs mb-3`}>{PERSONALITY.type}</p>

            <div className="flex justify-center gap-3 mb-3">
              {SAJU_PILLARS.map((p) => (
                <div key={p.label} className="text-center">
                  <p className={`${selectedTheme.text} opacity-30 text-[9px]`}>{p.label}</p>
                  <p className={`${selectedTheme.text} text-lg font-bold`}>{p.gan}{p.ji}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-1.5 mb-3">
              {OHAENG.map((o) => (
                <span key={o.name} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: o.color + "25", color: o.color }}>
                  {o.name} {o.value}%
                </span>
              ))}
            </div>

            <p className={`${selectedTheme.text} opacity-60 text-xs mb-2`}>2026년 키워드</p>
            <div className="flex justify-center gap-1.5 mb-4">
              {["도약", "지혜", "결단"].map((kw) => (
                <span key={kw} className={`${selectedTheme.text} text-xs px-2.5 py-1 rounded-full bg-white/10`}>
                  {kw}
                </span>
              ))}
            </div>

            <p className={`${selectedTheme.text} opacity-20 text-[9px]`}>운묘 UNMYO · 운명의 별자리</p>
          </div>

          <button className="w-full mt-3 py-3 rounded-2xl border border-white/10 text-white/60 hover:text-white/90 hover:border-white/20 transition-colors text-sm">
            📷 내 사주 카드 저장하기
          </button>
        </section>

        <div className="h-16" />
      </div>

      <style jsx global>{`
        .section-title {
          color: rgba(255,255,255,0.55);
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          margin-bottom: 0.75rem;
        }
        .glass-card {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.07);
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes barGrow {
          from { width: 0%; }
        }
        @keyframes donutGrow {
          from { stroke-dashoffset: 377; }
        }
        @keyframes radarGrow {
          from { opacity: 0; transform: scale(0.3); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes msgAppear {
          from { opacity: 0; transform: translateY(8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .msg-bubble {
          animation: msgAppear 0.4s ease-out both;
        }

        ${Array.from({ length: 12 }, (_, i) => `
          .stagger-${i + 1} {
            animation: fadeInUp 0.6s ease-out ${i * 0.08}s both;
          }
        `).join("")}
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
