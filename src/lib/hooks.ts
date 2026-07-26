"use client";

import { useEffect, useRef, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/**
 * Tracks whether an element is on-screen. Used to pause looping demo
 * animations (typing chats, order capture) when scrolled away, per the
 * ZAM-1102 brief, instead of burning cycles animating off-screen content.
 */
export function useInView<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(!!entry?.isIntersecting),
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/**
 * Animates a number counting up from 0 to `target` while `active` is true,
 * resetting to 0 when it goes false. Shared by every demo that shows a KPI
 * tile (Analytics stats, Social post reaction counts).
 */
export function useCountUp(
  target: number,
  active: boolean,
  reducedMotion: boolean,
  durationMs = 1400,
  steps = 30
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    if (reducedMotion) {
      setValue(target);
      return;
    }

    let step = 0;
    const id = setInterval(() => {
      step += 1;
      setValue(Math.round((target * step) / steps));
      if (step >= steps) clearInterval(id);
    }, durationMs / steps);

    return () => clearInterval(id);
  }, [active, target, reducedMotion, durationMs, steps]);

  return value;
}

/**
 * Like useInView, but latches `true` the first time the element is seen and
 * never reverts — for one-shot scroll-reveal fade-ups (Verticals, Packs,
 * Trust cards). Toggling visibility back off when the user scrolls past and
 * back reads as flicker, not choreography; the looping demo animations use
 * useInView directly instead, since those are meant to pause off-screen.
 */
export function useRevealOnce<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (revealed) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, revealed]);

  return { ref, revealed };
}
