"use client";

import { useEffect, useRef } from "react";

export default function Starfield() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Stars
    const starCount = 150;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.setProperty("--duration", `${2 + Math.random() * 4}s`);
      star.style.setProperty("--delay", `${Math.random() * 3}s`);
      const size = Math.random() * 2.5 + 0.5;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.opacity = `${0.2 + Math.random() * 0.8}`;
      fragment.appendChild(star);
    }

    container.appendChild(fragment);

    // Shooting stars
    const shootInterval = setInterval(() => {
      const shoot = document.createElement("div");
      shoot.className = "shooting-star";
      shoot.style.left = `${Math.random() * 70 + 10}%`;
      shoot.style.top = `${Math.random() * 40}%`;
      shoot.style.setProperty("--angle", `${Math.random() * 30 + 20}deg`);
      container.appendChild(shoot);
      setTimeout(() => shoot.remove(), 1500);
    }, 4000 + Math.random() * 3000);

    // Nebula clouds
    for (let i = 0; i < 3; i++) {
      const nebula = document.createElement("div");
      nebula.className = "nebula-cloud";
      nebula.style.left = `${Math.random() * 80}%`;
      nebula.style.top = `${Math.random() * 80}%`;
      nebula.style.width = `${200 + Math.random() * 300}px`;
      nebula.style.height = `${200 + Math.random() * 300}px`;
      nebula.style.setProperty("--nebula-delay", `${i * 2}s`);
      const colors = [
        "rgba(124, 58, 237, 0.03)",
        "rgba(244, 114, 182, 0.025)",
        "rgba(59, 130, 246, 0.02)",
      ];
      nebula.style.background = `radial-gradient(circle, ${colors[i]} 0%, transparent 70%)`;
      fragment.appendChild(nebula);
    }

    return () => {
      clearInterval(shootInterval);
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
