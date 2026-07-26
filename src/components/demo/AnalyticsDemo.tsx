"use client";

import { useEffect, useState } from "react";
import type { AnalyticsDemo as AnalyticsDemoData } from "@/i18n/types";
import { useCountUp, useReducedMotion } from "@/lib/hooks";

const CHART_BARS = [40, 55, 35, 70, 60, 85, 100];

function StatTile({
  label,
  target,
  prefix,
  suffix,
  active,
  reducedMotion,
}: {
  label: string;
  target: number;
  prefix?: string;
  suffix?: string;
  active: boolean;
  reducedMotion: boolean;
}) {
  const value = useCountUp(target, active, reducedMotion);
  return (
    <div className="rounded-xl border border-line bg-white p-3">
      <p className="truncate text-[11px] text-ink-3">{label}</p>
      <p className="mt-1 whitespace-nowrap text-lg font-bold text-ink">
        {prefix}
        {value.toLocaleString()}
        {suffix}
      </p>
    </div>
  );
}

export function AnalyticsDemo({ data, active }: { data: AnalyticsDemoData; active: boolean }) {
  const reducedMotion = useReducedMotion();
  const [chartIn, setChartIn] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showReply, setShowReply] = useState(false);

  useEffect(() => {
    if (!active) {
      setChartIn(false);
      setShowPrompt(false);
      setShowReply(false);
      return;
    }

    if (reducedMotion) {
      setChartIn(true);
      setShowPrompt(true);
      setShowReply(true);
      return;
    }

    const t1 = setTimeout(() => setChartIn(true), 200);
    const t2 = setTimeout(() => setShowPrompt(true), 1700);
    const t3 = setTimeout(() => setShowReply(true), 3100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [active, reducedMotion]);

  return (
    <div className="flex h-full flex-col gap-2.5 p-4">
      <div className="grid grid-cols-3 gap-2">
        {data.stats.map((s, i) => (
          <StatTile
            key={i}
            label={s.label}
            target={s.value}
            prefix={s.prefix}
            suffix={s.suffix}
            active={active}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>

      <div className="rounded-xl border border-line bg-white p-3.5">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-ink-3">
          {data.chartLabel}
        </p>
        <div className="flex h-16 items-end gap-1.5">
          {CHART_BARS.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm bg-brand-500 transition-all duration-700 ease-out"
              style={{
                height: chartIn ? `${h}%` : "4%",
                transitionDelay: `${i * 70}ms`,
                opacity: i === CHART_BARS.length - 1 ? 1 : 0.55,
              }}
            />
          ))}
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        {showPrompt && (
          <div className="flex animate-fade-up justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-brand-600 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-white shadow-card">
              {data.reportPrompt}
            </div>
          </div>
        )}
        {showReply && (
          <div className="flex animate-fade-up justify-start">
            <div className="max-w-[90%] rounded-2xl rounded-tr-md border border-ember-500/30 bg-white px-3.5 py-2.5 text-[12.5px] leading-relaxed text-ink shadow-card">
              {data.reportReply}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
