import Link from "next/link";
import Image from "next/image";
import Starfield from "@/components/Starfield";
import { characters } from "@/lib/characters";

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

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="animate-fade-in-up">
          {/* Logo / Title */}
          <p className="text-purple-400/80 text-sm tracking-[0.3em] uppercase mb-4 font-light">
            ✦ AI 사주 상담 ✦
          </p>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-purple-200 to-amber-300 bg-clip-text text-transparent">
            운묘
          </h1>
          <p className="text-lg md:text-xl text-purple-200/60 tracking-[0.15em] mb-2">
            UNMYO
          </p>
          <p className="text-xl md:text-2xl text-slate-300/90 mb-12 font-light max-w-md mx-auto leading-relaxed">
            당신의 운명을 읽다
          </p>

          {/* CTA Button */}
          <Link
            href="/saju"
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-amber-500 text-white font-medium rounded-full transition-all duration-500 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105"
          >
            <span className="relative z-10">사주 보러 가기</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 animate-bounce text-purple-400/40">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Characters Preview */}
      <section className="relative z-10 px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-400/70 text-sm tracking-[0.2em] mb-3">COUNSELORS</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              다섯 명의 상담사
            </h2>
            <p className="text-slate-400 max-w-md mx-auto">
              각기 다른 오행의 기운을 가진 상담사가<br />당신의 사주를 읽어드립니다
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {characters.map((char, i) => (
              <Link
                key={char.id}
                href="/saju"
                className="group animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-b ${char.gradient} border border-white/5 hover:border-purple-500/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2`}>
                  <div className="aspect-[3/4] relative">
                    <Image
                      src={char.image}
                      alt={char.name}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 50vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27] via-transparent to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className={`text-xs font-medium bg-gradient-to-r ${char.elementColor} bg-clip-text text-transparent mb-1`}>
                      {char.element}
                    </p>
                    <h3 className="text-lg font-bold text-white mb-1">{char.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {char.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-slate-500 text-sm border-t border-white/5">
        <p>© 2026 운묘 UNMYO. All rights reserved.</p>
      </footer>
    </main>
  );
}
