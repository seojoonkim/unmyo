'use client';

import { useRef, useEffect, useCallback } from 'react';

type ParticleType = 'golden' | 'red' | 'purple';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  type: ParticleType;
}

function getParticleColor(type: ParticleType, alpha: number): string {
  switch (type) {
    case 'golden': return `rgba(251, 191, 36, ${alpha})`;
    case 'red': return `rgba(239, 68, 68, ${alpha})`;
    case 'purple': return `rgba(167, 139, 250, ${alpha})`;
  }
}

export function detectParticleType(text: string): ParticleType {
  const goldenWords = ['대길', '길', '좋은', '행운', '축복', '번창'];
  const redWords = ['주의', '조심', '흉', '위험', '경고'];
  if (goldenWords.some((w) => text.includes(w))) return 'golden';
  if (redWords.some((w) => text.includes(w))) return 'red';
  return 'purple';
}

interface TypingParticlesProps {
  active: boolean;
  type?: ParticleType;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export default function TypingParticles({ active, type = 'purple', containerRef }: TypingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  const spawnParticle = useCallback((canvas: HTMLCanvasElement) => {
    if (particlesRef.current.length >= 20) return;
    const rect = containerRef?.current?.getBoundingClientRect();
    const x = rect ? Math.random() * rect.width : Math.random() * canvas.width;
    const y = rect ? rect.height - 10 : canvas.height - 10;
    particlesRef.current.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -(Math.random() * 2 + 1),
      life: 0,
      maxLife: 40 + Math.random() * 30,
      size: 2 + Math.random() * 3,
      type,
    });
  }, [type, containerRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    let frameCount = 0;
    const animate = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (active && frameCount % 3 === 0) {
        spawnParticle(canvas);
      }

      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++;
        if (p.life > p.maxLife) return false;
        p.x += p.vx;
        p.y += p.vy;
        p.vy *= 0.98;
        const alpha = 1 - p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle = getParticleColor(p.type, alpha * 0.8);
        ctx.fill();
        // glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha * 2, 0, Math.PI * 2);
        ctx.fillStyle = getParticleColor(p.type, alpha * 0.2);
        ctx.fill();
        return true;
      });

      frameCount++;
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [active, spawnParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="typing-particles-canvas"
      aria-hidden="true"
    />
  );
}
