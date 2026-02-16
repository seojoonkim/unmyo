import Link from "next/link";
import Image from "next/image";
import Starfield from "@/components/Starfield";
import { characters } from "@/lib/characters";

const features = [
  {
    icon: "🔮",
    title: "정통 사주팔자",
    desc: "만세력 기반 사주 분석. 오행·십신·격국까지 정확하게.",
  },
  {
    icon: "💬",
    title: "AI 캐릭터 상담",
    desc: "6명의 상담사가 각자의 시선으로 당신의 운명을 해석합니다.",
  },
  {
    icon: "💕",
    title: "궁합 & 소셜",
    desc: "친구, 연인, 동료와의 궁합을 보고 프로필 카드를 공유하세요.",
  },
  {
    icon: "📅",
    title: "오늘의 운세",
    desc: "매일 바뀌는 대운·세운 흐름. 오늘 뭘 조심하고, 뭘 밀어붙일지.",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#0a0e27]">
      <Starfield />

      {/* Gradient overlays */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px]" />
      </div>

      {/* ──────────── Hero Section ──────────── */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="animate-fade-in-up max-w-2xl mx-auto">
          <p className="text-purple-400/80 text-sm tracking-[0.3em] uppercase mb-6 font-light">
            ✦ AI × 사주팔자 ✦
          </p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-purple-200 to-amber-300 bg-clip-text text-transparent leading-tight">
            운명을 아는 순간,<br />삶이 달라진다
          </h1>
          <p className="text-lg md:text-xl text-slate-300/80 mb-4 font-light max-w-lg mx-auto leading-relaxed">
            생년월일시 하나로, 나만의 AI 상담사가<br />
            사주팔자를 풀어드립니다.
          </p>
          <p className="text-sm text-purple-300/50 mb-10 tracking-wide">
            정통 만세력 × 6명의 캐릭터 상담사 × 매일 업데이트되는 운세
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/saju"
              className="group relative inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-amber-500 text-white font-semibold rounded-full transition-all duration-500 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 text-lg"
            >
              <span>무료로 사주 보기</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="text-xs text-slate-500">가입 없이 바로 시작</p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 animate-bounce text-purple-400/40">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ──────────── How It Works ──────────── */}
      <section className="relative z-10 px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="text-amber-400/70 text-sm tracking-[0.2em] mb-3">HOW IT WORKS</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              3분이면 충분합니다
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "생년월일시 입력", desc: "양력/음력, 태어난 시간까지. 정확할수록 깊어집니다.", icon: "📝" },
              { step: "02", title: "상담사 선택", desc: "따뜻한 위로? 냉정한 분석? 6명 중 마음 가는 사람에게.", icon: "🎭" },
              { step: "03", title: "AI 사주 상담", desc: "사주 해석부터 올해 운세, 연애운, 재물운까지 대화로.", icon: "✨" },
            ].map((item, i) => (
              <div key={i} className="animate-fade-in-up text-center" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="text-4xl mb-4">{item.icon}</div>
                <p className="text-purple-400/60 text-xs tracking-[0.2em] mb-2">STEP {item.step}</p>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── Characters ──────────── */}
      <section className="relative z-10 px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="text-amber-400/70 text-sm tracking-[0.2em] mb-3">COUNSELORS</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              여섯 명의 운명 해석자
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
              같은 사주도 누가 읽느냐에 따라 다른 이야기가 됩니다.<br />
              당신의 질문에 가장 잘 맞는 상담사를 고르세요.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {characters.map((char, i) => (
              <Link
                key={char.id}
                href="/saju"
                className="group animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27] via-[#0a0e27]/20 to-transparent" />
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
                    <h3 className="text-lg font-bold text-white mb-1">{char.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 group-hover:text-slate-300 transition-colors">
                      {char.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── Features ──────────── */}
      <section className="relative z-10 px-4 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="text-amber-400/70 text-sm tracking-[0.2em] mb-3">FEATURES</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              사주 앱은 많지만,<br />이런 건 없었습니다
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="animate-fade-in-up group p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-purple-500/20 hover:bg-white/[0.05] transition-all duration-300"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className="text-3xl mb-3 block">{f.icon}</span>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── Social Proof / Tagline ──────────── */}
      <section className="relative z-10 px-4 py-24">
        <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
          <p className="text-6xl mb-8">🌌</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-snug">
            &ldquo;사주가 이렇게 재밌는 거였어?&rdquo;
          </h2>
          <p className="text-slate-400 mb-12 leading-relaxed max-w-md mx-auto">
            어려운 한자 풀이 대신, 나를 아는 캐릭터와 대화하세요.<br />
            연애운이 궁금할 땐 하린에게, 진로 고민은 지호에게,<br />
            인생의 큰 그림은 노을에게 물어보세요.
          </p>
          <Link
            href="/saju"
            className="group relative inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-purple-600 to-amber-500 hover:from-amber-500 hover:to-purple-600 text-white font-semibold rounded-full transition-all duration-500 shadow-lg shadow-purple-500/25 hover:shadow-amber-500/30 hover:scale-105 text-lg"
          >
            <span>내 사주 확인하기</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ──────────── Footer ──────────── */}
      <footer className="relative z-10 text-center py-12 border-t border-white/5">
        <p className="text-lg font-bold bg-gradient-to-r from-purple-400 to-amber-300 bg-clip-text text-transparent mb-2">
          운묘 UNMYO
        </p>
        <p className="text-slate-500 text-sm mb-1">운명을 아는 순간, 삶이 달라진다</p>
        <p className="text-slate-600 text-xs">© 2026 UNMYO. All rights reserved.</p>
      </footer>
    </main>
  );
}
