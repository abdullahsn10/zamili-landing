"use client";

import { useEffect, useState } from "react";
import type { CustomSolutionDemo as CustomSolutionDemoData } from "@/i18n/types";
import { useReducedMotion } from "@/lib/hooks";

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function CustomSolutionDemo({
  data,
  active,
}: {
  data: CustomSolutionDemoData;
  active: boolean;
}) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showBuilding, setShowBuilding] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!active) {
      setShowPrompt(false);
      setShowBuilding(false);
      setVisibleSteps(0);
      setShowResult(false);
      return;
    }

    if (reducedMotion) {
      setShowPrompt(true);
      setVisibleSteps(data.steps.length);
      setShowResult(true);
      return;
    }

    let cancelled = false;

    async function run() {
      setShowPrompt(false);
      setShowBuilding(false);
      setVisibleSteps(0);
      setShowResult(false);

      await sleep(400);
      if (cancelled) return;
      setShowPrompt(true);

      await sleep(1100);
      if (cancelled) return;
      setShowBuilding(true);

      for (let i = 0; i < data.steps.length; i++) {
        await sleep(950);
        if (cancelled) return;
        setVisibleSteps(i + 1);
      }

      setShowBuilding(false);
      await sleep(700);
      if (cancelled) return;
      setShowResult(true);

      await sleep(3600);
      if (cancelled) return;
      run();
    }

    run();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, data, reducedMotion]);

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      {showPrompt && (
        <div className="flex animate-fade-up justify-end">
          <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-brand-600 px-3.5 py-2.5 text-[13px] leading-relaxed text-white shadow-card">
            {data.prompt}
          </div>
        </div>
      )}

      {showBuilding && (
        <div className="flex animate-fade-up items-center gap-2 text-[12px] text-ink-3">
          <span className="flex items-center gap-1">
            {[0, 1, 2].map((d) => (
              <span
                key={d}
                className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-brand-400"
                style={{ animationDelay: `${d * 0.18}s` }}
              />
            ))}
          </span>
          {data.buildingLabel}
        </div>
      )}

      <div className="flex flex-col">
        {data.steps.map((s, i) => {
          const shown = visibleSteps > i;
          return (
            <div
              key={s.label}
              className={`flex gap-3 transition-all duration-500 ${
                shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
            >
              <div className="flex flex-col items-center">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm">
                  {s.icon}
                </span>
                {i < data.steps.length - 1 && <span className="my-1 w-px flex-1 bg-line" />}
              </div>
              <div className="pb-4 pt-1">
                <p className="text-[12.5px] font-semibold text-ink">{s.label}</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-ink-3">{s.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className={`mt-auto flex items-center gap-2 rounded-xl border border-teal-500/30 bg-teal-500/5 px-3.5 py-2.5 transition-all duration-500 ${
          showResult ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500 text-[11px] font-bold text-white">
          ✓
        </span>
        <span className="text-[12px] font-medium text-ink">{data.resultLabel}</span>
      </div>
    </div>
  );
}
