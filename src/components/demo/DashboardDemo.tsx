"use client";

import { useEffect, useState } from "react";
import type { DashboardDemo as DashboardDemoData } from "@/i18n/types";
import { useReducedMotion } from "@/lib/hooks";

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function DashboardDemo({ data, active }: { data: DashboardDemoData; active: boolean }) {
  const [visibleRows, setVisibleRows] = useState(0);
  const [statusIndex, setStatusIndex] = useState<number[]>(() => data.orders.map(() => 0));
  const reducedMotion = useReducedMotion();
  const lastStatus = data.statusLabels.length - 1;

  useEffect(() => {
    if (!active) {
      setVisibleRows(0);
      setStatusIndex(data.orders.map(() => 0));
      return;
    }

    if (reducedMotion) {
      setVisibleRows(data.orders.length);
      setStatusIndex(data.orders.map(() => lastStatus));
      return;
    }

    let cancelled = false;

    async function run() {
      setVisibleRows(0);
      setStatusIndex(data.orders.map(() => 0));

      for (let i = 0; i < data.orders.length; i++) {
        await sleep(450);
        if (cancelled) return;
        setVisibleRows(i + 1);
      }

      await sleep(900);

      for (let i = 0; i < data.orders.length; i++) {
        await sleep(700);
        if (cancelled) return;
        setStatusIndex((prev) => prev.map((v, idx) => (idx === i ? 1 : v)));
      }

      await sleep(1100);

      for (let i = 0; i < data.orders.length; i++) {
        await sleep(700);
        if (cancelled) return;
        setStatusIndex((prev) => prev.map((v, idx) => (idx === i ? lastStatus : v)));
      }

      await sleep(3400);
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
    <div className="flex h-full flex-col gap-2.5 p-4">
      <div className="mb-0.5 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-teal-500" />
        <span className="text-[11px] font-medium uppercase tracking-wide text-ink-3">
          {data.liveLabel}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {data.orders.slice(0, visibleRows).map((o, i) => (
          <div key={o.code} className="animate-fade-up rounded-xl border border-line bg-white p-3 shadow-card">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <p className="truncate text-[12px] font-semibold text-ink">{o.item}</p>
              <span className="shrink-0 text-[10px] text-ink-3">{o.code}</span>
            </div>
            <p className="mb-2 truncate text-[11px] text-ink-3">{o.customer}</p>
            <div className="flex overflow-hidden rounded-full border border-line text-[10px] font-medium">
              {data.statusLabels.map((label, si) => {
                const isActive = statusIndex[i] === si;
                return (
                  <span
                    key={label}
                    className={`flex-1 px-2 py-1 text-center transition-colors duration-500 ${
                      isActive
                        ? si === lastStatus
                          ? "bg-teal-500 text-white"
                          : "bg-brand-600 text-white"
                        : "bg-paper-2 text-ink-3"
                    }`}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
