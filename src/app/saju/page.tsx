"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Starfield from "@/components/Starfield";

export default function SajuInput() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    gender: "",
    year: "",
    month: "",
    day: "",
    hour: "",
    calendarType: "solar",
  });

  const hours = [
    { value: "", label: "모름" },
    { value: "23-01", label: "자시 (23:00~01:00)" },
    { value: "01-03", label: "축시 (01:00~03:00)" },
    { value: "03-05", label: "인시 (03:00~05:00)" },
    { value: "05-07", label: "묘시 (05:00~07:00)" },
    { value: "07-09", label: "진시 (07:00~09:00)" },
    { value: "09-11", label: "사시 (09:00~11:00)" },
    { value: "11-13", label: "오시 (11:00~13:00)" },
    { value: "13-15", label: "미시 (13:00~15:00)" },
    { value: "15-17", label: "신시 (15:00~17:00)" },
    { value: "17-19", label: "유시 (17:00~19:00)" },
    { value: "19-21", label: "술시 (19:00~21:00)" },
    { value: "21-23", label: "해시 (21:00~23:00)" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.year || !form.month || !form.day || !form.gender) return;

    const params = new URLSearchParams({
      name: form.name,
      gender: form.gender,
      year: form.year,
      month: form.month,
      day: form.day,
      hour: form.hour,
      calendar: form.calendarType,
    });

    router.push(`/saju/counselor?${params.toString()}`);
  };

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const isValid = form.year && form.month && form.day && form.gender;

  return (
    <main className="relative min-h-screen bg-[#0a0e27]">
      <Starfield />

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-12 min-h-screen flex flex-col">
        {/* Header */}
        <Link href="/" className="text-purple-400/60 text-sm mb-8 inline-flex items-center gap-1 hover:text-purple-300 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          돌아가기
        </Link>

        {/* Guide character */}
        <div className="flex items-start gap-4 mb-8 animate-fade-in-up">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-purple-500/30 flex-shrink-0">
            <Image
              src="/characters/harin.png"
              alt="하린"
              width={56}
              height={56}
              className="object-cover object-top w-full h-full"
            />
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl rounded-tl-sm px-5 py-4 border border-white/10">
            <p className="text-slate-200 text-sm leading-relaxed">
              안녕하세요 ✨ 당신의 사주를 보기 위해<br />
              <span className="text-purple-300">생년월일시</span>를 알려주세요.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up flex-1" style={{ animationDelay: "0.2s" }}>
          {/* Name */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">이름 (선택)</label>
            <input
              type="text"
              placeholder="이름을 입력해주세요"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">성별 <span className="text-purple-400">*</span></label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "female", label: "여성", icon: "♀" },
                { value: "male", label: "남성", icon: "♂" },
              ].map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => update("gender", g.value)}
                  className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    form.gender === g.value
                      ? "bg-purple-600/30 border-purple-500/50 text-purple-200"
                      : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                  }`}
                >
                  <span className="text-lg mr-2">{g.icon}</span>
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar type */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">달력</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "solar", label: "양력" },
                { value: "lunar", label: "음력" },
              ].map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => update("calendarType", c.value)}
                  className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    form.calendarType === c.value
                      ? "bg-purple-600/30 border-purple-500/50 text-purple-200"
                      : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date inputs */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">생년월일 <span className="text-purple-400">*</span></label>
            <div className="grid grid-cols-3 gap-3">
              <input
                type="number"
                placeholder="년 (YYYY)"
                value={form.year}
                onChange={(e) => update("year", e.target.value)}
                min="1920"
                max="2026"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 transition-all text-center"
              />
              <input
                type="number"
                placeholder="월"
                value={form.month}
                onChange={(e) => update("month", e.target.value)}
                min="1"
                max="12"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 transition-all text-center"
              />
              <input
                type="number"
                placeholder="일"
                value={form.day}
                onChange={(e) => update("day", e.target.value)}
                min="1"
                max="31"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 transition-all text-center"
              />
            </div>
          </div>

          {/* Birth hour */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">태어난 시간</label>
            <select
              value={form.hour}
              onChange={(e) => update("hour", e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all appearance-none"
            >
              {hours.map((h) => (
                <option key={h.value} value={h.value} className="bg-[#0f1435]">
                  {h.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-4 rounded-xl font-medium text-lg transition-all duration-500 ${
              isValid
                ? "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-amber-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02]"
                : "bg-white/5 text-slate-500 cursor-not-allowed"
            }`}
          >
            ✨ 운명 분석하기
          </button>
        </form>
      </div>
    </main>
  );
}
