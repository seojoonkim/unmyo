'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export type Mood = 'neutral' | 'happy' | 'worried' | 'serious';

const moodConfig: Record<Mood, { glow: string; animation: string; label: string }> = {
  neutral: {
    glow: '0 0 20px rgba(148, 163, 184, 0.3)',
    animation: 'mood-neutral',
    label: '평온',
  },
  happy: {
    glow: '0 0 30px rgba(251, 191, 36, 0.5), 0 0 60px rgba(251, 191, 36, 0.2)',
    animation: 'mood-happy',
    label: '기쁨',
  },
  worried: {
    glow: '0 0 30px rgba(96, 165, 250, 0.5), 0 0 60px rgba(96, 165, 250, 0.2)',
    animation: 'mood-worried',
    label: '걱정',
  },
  serious: {
    glow: '0 0 30px rgba(167, 139, 250, 0.5), 0 0 60px rgba(167, 139, 250, 0.2)',
    animation: 'mood-serious',
    label: '진지',
  },
};

export function detectMood(text: string): Mood {
  const happyWords = ['좋아', '대박', '최고', '행복', '기쁘', '축하', '사랑', '웃', '감사', '대길'];
  const worriedWords = ['걱정', '불안', '힘들', '어렵', '고민', '두렵', '슬프', '아프', '조심', '주의'];
  const seriousWords = ['분석', '결과', '운세', '사주', '오행', '일주', '용신', '흉', '살'];

  const lower = text.toLowerCase();
  if (happyWords.some((w) => lower.includes(w))) return 'happy';
  if (worriedWords.some((w) => lower.includes(w))) return 'worried';
  if (seriousWords.some((w) => lower.includes(w))) return 'serious';
  return 'neutral';
}

interface CharacterMoodProps {
  characterId: string;
  characterName: string;
  characterImage: string;
  mood: Mood;
}

export default function CharacterMood({ characterId, characterName, characterImage, mood }: CharacterMoodProps) {
  const config = moodConfig[mood];

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div
        className={`character-mood-avatar ${config.animation}`}
        style={{ boxShadow: config.glow }}
      >
        <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 relative">
          <Image
            src={characterImage}
            alt={characterName}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-white/90">{characterName}</span>
        <span className="text-xs text-white/50">{config.label}</span>
      </div>
      {/* Mood indicator dot */}
      <div className={`mood-indicator mood-indicator-${mood}`} />
    </div>
  );
}
