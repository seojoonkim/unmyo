"use client";

import { useEffect, useState, useRef } from "react";

const MESSAGES = [
  { role: "user" as const, text: "1995년 3월 15일 오후 2시..." },
  { role: "ai" as const, text: "흥미로운 사주군요... 壬午 일주, 자유로운 전략가의 기운이 보여요 ✨" },
];

export default function TypingPreview() {
  const [displayMessages, setDisplayMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [currentMsg, setCurrentMsg] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pause" | "clear">("typing");
  const intervalRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (phase === "typing") {
      const msg = MESSAGES[currentMsg];
      if (currentChar <= msg.text.length) {
        intervalRef.current = setTimeout(() => {
          setDisplayMessages((prev) => {
            const copy = [...prev];
            const idx = copy.findIndex((m, i) => i === currentMsg);
            if (idx === -1) {
              copy.push({ role: msg.role, text: msg.text.slice(0, currentChar) });
            } else {
              copy[idx] = { role: msg.role, text: msg.text.slice(0, currentChar) };
            }
            return copy;
          });
          setCurrentChar((c) => c + 1);
        }, msg.role === "user" ? 60 : 40);
      } else {
        // Done typing this message
        if (currentMsg < MESSAGES.length - 1) {
          intervalRef.current = setTimeout(() => {
            setCurrentMsg((m) => m + 1);
            setCurrentChar(0);
          }, 800);
        } else {
          // All messages done, pause then clear
          setPhase("pause");
        }
      }
    } else if (phase === "pause") {
      intervalRef.current = setTimeout(() => setPhase("clear"), 3000);
    } else if (phase === "clear") {
      intervalRef.current = setTimeout(() => {
        setDisplayMessages([]);
        setCurrentMsg(0);
        setCurrentChar(0);
        setPhase("typing");
      }, 500);
    }
    return () => clearTimeout(intervalRef.current);
  }, [phase, currentMsg, currentChar]);

  return (
    <div className="w-full max-w-sm mx-auto mt-6 typing-preview-container">
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
            <span className="text-[8px] text-white font-bold">묘</span>
          </div>
          <span className="text-[10px] text-slate-500 tracking-wider font-display">AI 상담 미리보기</span>
        </div>
        
        <div className="min-h-[80px] space-y-2">
          {displayMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                msg.role === "user"
                  ? "bg-purple-500/20 text-purple-200 rounded-br-sm"
                  : "bg-white/[0.05] text-slate-300 rounded-bl-sm"
              }`}>
                {msg.text}
                {i === currentMsg && phase === "typing" && currentChar <= MESSAGES[currentMsg].text.length && (
                  <span className="typing-cursor">|</span>
                )}
              </div>
            </div>
          ))}
          {displayMessages.length === 0 && (
            <div className="flex items-center gap-1.5 py-4 justify-center">
              <div className="typing-dot" style={{ animationDelay: "0s" }} />
              <div className="typing-dot" style={{ animationDelay: "0.15s" }} />
              <div className="typing-dot" style={{ animationDelay: "0.3s" }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
