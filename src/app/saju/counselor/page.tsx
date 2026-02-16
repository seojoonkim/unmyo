"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Starfield from "@/components/Starfield";
import { characters, counselors } from "@/lib/characters";

function CounselorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get("name") || "당신";

  const handleSelect = (charId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("counselor", charId);
    router.push(`/saju/result?${params.toString()}`);
  };

  return (
    <main className="relative min-h-screen bg-[#0a0e27]">
      <Starfield />

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-purple-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <Link href="/saju" className="text-purple-400/60 text-sm mb-8 inline-flex items-center gap-1 hover:text-purple-300 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          다시 입력하기
        </Link>

        <div className="text-center mb-12 animate-fade-in-up">
          <p className="text-amber-400/70 text-sm tracking-[0.2em] mb-3">SELECT COUNSELOR</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {name}님의 상담사를 선택하세요
          </h1>
          <p className="text-slate-400">
            각 상담사의 오행 기운에 따라 다른 관점으로<br />사주를 해석해 드립니다
          </p>
        </div>

        {/* Character Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {counselors.map((char, i) => (
            <button
              key={char.id}
              onClick={() => handleSelect(char.id)}
              className="group text-left animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-b ${char.gradient} border border-white/5 hover:border-purple-500/30 transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/10`}>
                <div className="aspect-[3/4] relative">
                  <Image
                    src={char.image}
                    alt={char.name}
                    fill
                    className="object-cover object-top group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27] via-[#0a0e27]/30 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className={`text-xs font-semibold tracking-wider bg-gradient-to-r ${char.elementColor} bg-clip-text text-transparent mb-2`}>
                    {char.element}
                  </p>
                  <h3 className="text-2xl font-bold text-white mb-2">{char.name}</h3>
                  <p className="text-sm text-slate-300/80 leading-relaxed">
                    {char.description}
                  </p>

                  {/* Select indicator */}
                  <div className="mt-4 flex items-center gap-2 text-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <span className="text-sm font-medium">선택하기</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function CounselorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
        <div className="text-purple-400 animate-pulse text-lg">로딩 중...</div>
      </div>
    }>
      <CounselorContent />
    </Suspense>
  );
}
