"use client";

import { useEffect, useState } from "react";
import type { InsightsDemo as InsightsDemoData } from "@/i18n/types";
import { useReducedMotion } from "@/lib/hooks";

const CHART_BARS = [40, 55, 35, 70, 60, 85, 100];
const COUNT_UP_MS = 1400;
const COUNT_UP_STEPS = 30;

function useCountUp(target: number, active: boolean, reducedMotion: boolean) {
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
      setValue(Math.round((target * step) / COUNT_UP_STEPS));
      if (step >= COUNT_UP_STEPS) clearInterval(id);
    }, COUNT_UP_MS / COUNT_UP_STEPS);

    return () => clearInterval(id);
  }, [active, target, reducedMotion]);

  return value;
}

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
      <p className="text-[11px] text-ink-3">{label}</p>
      <p className="mt-1 text-xl font-bold text-ink">
        {prefix}
        {value.toLocaleString()}
        {suffix}
      </p>
    </div>
  );
}

export function InsightsDemo({ data, active }: { data: InsightsDemoData; active: boolean }) {
  const reducedMotion = useReducedMotion();
  const [chartIn, setChartIn] = useState(false);

  useEffect(() => {
    if (!active) {
      setChartIn(false);
      return;
    }
    const id = setTimeout(() => setChartIn(true), 200);
    return () => clearTimeout(id);
  }, [active]);

  return (
    <div className="flex h-full flex-col gap-3 p-4">
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

      <div className="mt-auto rounded-xl border border-line bg-white p-3.5">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-ink-3">
          {data.chartLabel}
        </p>
        <div className="flex h-20 items-end gap-1.5">
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
    </div>
  );
}
