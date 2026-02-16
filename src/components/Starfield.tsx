"use client";

import { useEffect, useRef } from "react";

export default function Starfield() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Stars — reduced count, lower opacity for softer look
    const starCount = 40;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      // Slower twinkle = less distracting
      star.style.setProperty("--duration", `${4 + Math.random() * 6}s`);
      star.style.setProperty("--delay", `${Math.random() * 5}s`);
      const size = Math.random() * 2 + 0.5;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      // Much softer opacity range
      star.style.opacity = `${0.15 + Math.random() * 0.4}`;
      star.style.willChange = "opacity";
      fragment.appendChild(star);
    }

    container.appendChild(fragment);

    // Shooting stars removed for mobile perf

    // Nebula clouds — softer
    for (let i = 0; i < 2; i++) {
      const nebula = document.createElement("div");
      nebula.className = "nebula-cloud";
      nebula.style.left = `${Math.random() * 80}%`;
      nebula.style.top = `${Math.random() * 80}%`;
      nebula.style.width = `${250 + Math.random() * 250}px`;
      nebula.style.height = `${250 + Math.random() * 250}px`;
      nebula.style.setProperty("--nebula-delay", `${i * 3}s`);
      const colors = [
        "rgba(124, 58, 237, 0.02)",
        "rgba(244, 114, 182, 0.015)",
      ];
      nebula.style.background = `radial-gradient(circle, ${colors[i]} 0%, transparent 70%)`;
      nebula.style.willChange = "opacity";
      fragment.appendChild(nebula);
    }

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
