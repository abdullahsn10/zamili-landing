"use client";

import { useEffect, useRef } from "react";

/**
 * A fixed, deterministic node field (no Math.random at render time — avoids
 * hydration mismatches) meant to read as loosely "operational" connective
 * tissue behind the hero/demo canvas, not decoration for its own sake.
 */
const NODES = [
  { x: 8, y: 18 }, { x: 22, y: 42 }, { x: 14, y: 68 }, { x: 34, y: 12 },
  { x: 41, y: 58 }, { x: 52, y: 30 }, { x: 60, y: 74 }, { x: 68, y: 20 },
  { x: 76, y: 50 }, { x: 84, y: 10 }, { x: 90, y: 66 }, { x: 30, y: 86 },
  { x: 58, y: 92 }, { x: 12, y: 4 }, { x: 96, y: 36 },
];

const EDGES: [number, number][] = [
  [0, 1], [1, 3], [1, 4], [4, 5], [5, 6], [5, 7], [7, 8], [8, 9], [8, 10],
  [2, 4], [11, 4], [11, 12], [3, 13], [9, 14], [6, 12],
];

export function MeshBackground({ variant = "light" }: { variant?: "light" | "dark" }) {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;

    const apply = () => {
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
      }
      raf = requestAnimationFrame(apply);
    };

    const onPointerMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      targetX = nx * 18;
      targetY = ny * 18;
    };

    const onScroll = () => {
      const s = Math.min(window.scrollY / 900, 1);
      targetY = -s * 40;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(apply);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const isDark = variant === "dark";

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div ref={parallaxRef} className="absolute inset-[-10%]">
        <div
          className={`animate-drift-a absolute left-[8%] top-[10%] h-[42vw] w-[42vw] rounded-full blur-3xl ${
            isDark ? "bg-brand-500/30" : "bg-brand-300/40"
          }`}
        />
        <div
          className={`animate-drift-b absolute right-[6%] top-[28%] h-[38vw] w-[38vw] rounded-full blur-3xl ${
            isDark ? "bg-ember-500/[0.12]" : "bg-ember-400/20"
          }`}
        />
        <div
          className={`animate-drift-a absolute bottom-[4%] left-[26%] h-[36vw] w-[36vw] rounded-full blur-3xl ${
            isDark ? "bg-brand-800/40" : "bg-brand-100/60"
          }`}
          style={{ animationDelay: "-9s" }}
        />
      </div>

      <svg
        className={`absolute inset-0 h-full w-full ${isDark ? "opacity-[0.18]" : "opacity-[0.12]"}`}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {EDGES.map(([a, b], i) => {
          const na = NODES[a];
          const nb = NODES[b];
          if (!na || !nb) return null;
          return (
            <line
              key={i}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              stroke={isDark ? "#C6BBF2" : "#4C3BCF"}
              strokeWidth="0.15"
            />
          );
        })}
        {NODES.map((n, i) => (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r="0.5"
            fill={isDark ? "#FFB37E" : "#4C3BCF"}
            className="animate-pulse-dot"
            style={{ animationDelay: `${(i % 7) * 0.35}s`, transformOrigin: `${n.x}px ${n.y}px` }}
          />
        ))}
      </svg>
    </div>
  );
}
