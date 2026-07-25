"use client";

import { useEffect, useState } from "react";
import type { RecordsDemo as RecordsDemoData } from "@/i18n/types";
import { useReducedMotion } from "@/lib/hooks";

// A plain timer — the caller re-checks its own `cancelled` closure variable
// right after every await, so this doesn't need a polling loop to resolve
// early (see TypingChat.tsx for the fuller rationale).
function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

const STEP_MS = 850;

export function RecordsDemo({ data, active }: { data: RecordsDemoData; active: boolean }) {
  const [visibleVariants, setVisibleVariants] = useState(0);
  const [showProduct, setShowProduct] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!active) {
      setShowProduct(false);
      setVisibleVariants(0);
      setShowQuestion(false);
      setShowAnswer(false);
      return;
    }

    if (reducedMotion) {
      setShowProduct(true);
      setVisibleVariants(data.variants.length);
      setShowQuestion(true);
      setShowAnswer(true);
      return;
    }

    let cancelled = false;

    async function run() {
      setShowProduct(false);
      setVisibleVariants(0);
      setShowQuestion(false);
      setShowAnswer(false);

      await sleep(500);
      if (cancelled) return;
      setShowProduct(true);

      for (let i = 0; i < data.variants.length; i++) {
        await sleep(STEP_MS);
        if (cancelled) return;
        setVisibleVariants(i + 1);
      }

      await sleep(1100);
      if (cancelled) return;
      setShowQuestion(true);

      await sleep(1400);
      if (cancelled) return;
      setShowAnswer(true);

      await sleep(3200);
      if (cancelled) return;
      run();
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [active, data, reducedMotion]);

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div
        className={`rounded-xl border border-line bg-white p-3.5 shadow-card transition-opacity duration-500 ${
          showProduct ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[11px] font-medium uppercase tracking-wide text-ink-3">
            {data.addingLabel}
          </p>
          <span className="rounded-full bg-paper-2 px-2 py-0.5 text-[10px] font-medium text-ink-2">
            {data.categoryLabel}
          </span>
        </div>
        <div className="mb-2.5 flex items-center justify-between">
          <p className="text-sm font-semibold text-ink">{data.productName}</p>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-teal-500">
            {data.availabilityLabel}
            <span className="relative inline-flex h-4 w-7 items-center rounded-full bg-teal-500">
              <span className="absolute end-0.5 h-3 w-3 rounded-full bg-white shadow-sm" />
            </span>
          </span>
        </div>
        <p className="mb-1.5 text-[11px] text-ink-3">{data.variantsLabel}</p>
        <div className="flex flex-wrap gap-1.5">
          {data.variants.slice(0, visibleVariants).map((v, i) => (
            <span
              key={i}
              className="animate-fade-up inline-flex items-center gap-1 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[11px] font-medium text-brand-700"
            >
              {v.size} · {v.color} ·{" "}
              <span className="font-semibold text-ember-600">{v.price}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        {showQuestion && (
          <div className="flex animate-fade-up justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-brand-600 px-3.5 py-2.5 text-[13px] leading-relaxed text-white shadow-card">
              {data.question}
            </div>
          </div>
        )}
        {showAnswer && (
          <div className="flex animate-fade-up justify-start">
            <div className="max-w-[85%] rounded-2xl rounded-tr-md border border-ember-500/30 bg-white px-3.5 py-2.5 text-[13px] leading-relaxed text-ink shadow-card">
              {data.answer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
