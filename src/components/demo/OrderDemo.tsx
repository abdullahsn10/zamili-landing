"use client";

import { useEffect, useState } from "react";
import type { OrderDemo as OrderDemoData } from "@/i18n/types";
import { useReducedMotion } from "@/lib/hooks";

// A plain timer — the caller re-checks its own `cancelled` closure variable
// right after every await, so this doesn't need a polling loop to resolve
// early (see TypingChat.tsx for the fuller rationale).
function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function OrderDemo({ data, active }: { data: OrderDemoData; active: boolean }) {
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!active) {
      setVisibleSteps(0);
      setShowToast(false);
      setShowInbox(false);
      return;
    }

    if (reducedMotion) {
      setVisibleSteps(data.steps.length);
      setShowToast(true);
      setShowInbox(true);
      return;
    }

    let cancelled = false;

    async function run() {
      setVisibleSteps(0);
      setShowToast(false);
      setShowInbox(false);

      for (let i = 0; i < data.steps.length; i++) {
        await sleep(1100);
        if (cancelled) return;
        setVisibleSteps(i + 1);
      }

      await sleep(900);
      if (cancelled) return;
      setShowToast(true);

      await sleep(700);
      if (cancelled) return;
      setShowInbox(true);

      await sleep(3600);
      if (cancelled) return;
      run();
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [active, data, reducedMotion]);

  return (
    <div className="relative flex h-full flex-col gap-3 overflow-hidden p-4">
      <div
        className={`pointer-events-none absolute inset-x-4 top-3 z-10 flex items-center gap-2 rounded-xl border border-ember-500/40 bg-white px-3.5 py-2.5 shadow-glow transition-all duration-500 ${
          showToast ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        }`}
      >
        <span className="h-2 w-2 shrink-0 rounded-full bg-ember-500" />
        <span className="text-[13px] font-medium text-ink">{data.toast}</span>
      </div>

      <div className="mt-10 flex flex-col gap-2">
        {data.steps.slice(0, visibleSteps).map((s, i) => (
          <div key={i} className={`flex animate-fade-up flex-col ${s.sender === "customer" ? "items-end" : "items-start"}`}>
            {s.voice ? (
              <VoiceBubble fromCustomer={s.sender === "customer"} duration={s.voiceDuration} />
            ) : (
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-card ${
                  s.sender === "customer"
                    ? "rounded-tl-md bg-brand-600 text-white"
                    : "rounded-tr-md border border-line bg-white text-ink"
                }`}
              >
                {s.text}
              </div>
            )}
            {s.voice && (
              <p className="mt-1 max-w-[85%] text-[11px] italic text-ink-3">{s.text}</p>
            )}
          </div>
        ))}
      </div>

      <div
        className={`mt-auto rounded-xl border border-line bg-white p-3.5 shadow-card transition-all duration-500 ${
          showInbox ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[11px] font-medium uppercase tracking-wide text-ink-3">
            {data.inboxTitle}
          </p>
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-teal-500" />
        </div>
        <p className="text-sm font-semibold text-ink">{data.inboxLine}</p>
        <p className="mt-1 text-[11px] text-teal-500">{data.inboxStatus}</p>
      </div>
    </div>
  );
}

const WAVEFORM_BAR_HEIGHTS = [6, 12, 8, 16, 10, 14, 7, 11, 15, 9, 13, 6];

function VoiceBubble({ fromCustomer, duration }: { fromCustomer: boolean; duration?: string }) {
  return (
    <div
      className={`flex max-w-[85%] items-center gap-2 rounded-2xl px-3.5 py-2.5 shadow-card ${
        fromCustomer
          ? "rounded-tl-md bg-brand-600 text-white"
          : "rounded-tr-md border border-line bg-white text-ink"
      }`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          fromCustomer ? "bg-white/20" : "bg-brand-50"
        }`}
      >
        <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
          <path d="M0 0L10 6L0 12V0Z" fill={fromCustomer ? "white" : "#4C3BCF"} />
        </svg>
      </span>
      <span className="flex items-center gap-[2px]" aria-hidden="true">
        {WAVEFORM_BAR_HEIGHTS.map((h, i) => (
          <span
            key={i}
            className={`w-[2px] rounded-full ${fromCustomer ? "bg-white/70" : "bg-brand-300"}`}
            style={{ height: `${h}px` }}
          />
        ))}
      </span>
      <span className={`text-[11px] ${fromCustomer ? "text-white/80" : "text-ink-3"}`}>
        {duration}
      </span>
    </div>
  );
}
