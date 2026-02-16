'use client';

import { useState } from 'react';

export interface SajuData {
  ilju: string;        // 일주 (e.g. "甲子")
  yongsin: string;     // 용신 (e.g. "水")
  oheng: {
    wood: number;      // 0-100
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
  summary?: string;
}

const ohengColors: Record<string, { bg: string; label: string }> = {
  wood: { bg: 'bg-green-500', label: '木' },
  fire: { bg: 'bg-red-500', label: '火' },
  earth: { bg: 'bg-amber-500', label: '土' },
  metal: { bg: 'bg-slate-300', label: '金' },
  water: { bg: 'bg-blue-500', label: '水' },
};

export function parseSajuCard(text: string): { before: string; data: SajuData; after: string } | null {
  const regex = /\[saju-card\]([\s\S]*?)\[\/saju-card\]/;
  const match = text.match(regex);
  if (!match) return null;

  try {
    const data = JSON.parse(match[1]);
    const before = text.slice(0, match.index);
    const after = text.slice((match.index || 0) + match[0].length);
    return { before, data, after };
  } catch {
    return null;
  }
}

// Sample data for preview
export const sampleSajuData: SajuData = {
  ilju: '甲子',
  yongsin: '水',
  oheng: { wood: 30, fire: 15, earth: 20, metal: 10, water: 25 },
  summary: '물의 기운이 강하여 지혜와 유연함이 넘칩니다. 나무의 기운을 보충하면 성장에 도움이 됩니다.',
};

interface SajuCardProps {
  data: SajuData;
}

export default function SajuCard({ data }: SajuCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="saju-card-container"
      onClick={() => setExpanded(!expanded)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && setExpanded(!expanded)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">☰</span>
          <span className="text-sm font-semibold text-white/90">사주 분석 결과</span>
        </div>
        <span className={`text-xs text-white/50 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </div>

      {/* Ilju + Yongsin */}
      <div className="flex gap-4 mb-3">
        <div className="flex flex-col items-center">
          <span className="text-xs text-white/40 mb-1">일주</span>
          <span className="text-2xl font-serif-kr font-bold text-white">{data.ilju}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-white/40 mb-1">용신</span>
          <span className="text-2xl font-serif-kr font-bold text-amber-400">{data.yongsin}</span>
        </div>
      </div>

      {/* Oheng Balance Bars */}
      <div className="space-y-2">
        {Object.entries(data.oheng).map(([key, value]) => {
          const config = ohengColors[key];
          return (
            <div key={key} className="flex items-center gap-2">
              <span className="text-xs w-4 text-center text-white/60">{config.label}</span>
              <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full ${config.bg} saju-bar-fill`}
                  style={{ width: `${value}%`, animationDelay: `${Object.keys(data.oheng).indexOf(key) * 0.1}s` }}
                />
              </div>
              <span className="text-xs text-white/40 w-8 text-right">{value}%</span>
            </div>
          );
        })}
      </div>

      {/* Expanded Summary */}
      <div className={`saju-card-expand ${expanded ? 'saju-card-expanded' : ''}`}>
        {data.summary && (
          <p className="text-sm text-white/70 leading-relaxed mt-3 pt-3 border-t border-white/10">
            {data.summary}
          </p>
        )}
      </div>
    </div>
  );
}
