"use client";

import { useCallback, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { useInView } from "@/lib/hooks";
import { MeshBackground } from "@/components/background/MeshBackground";
import { PhoneFrame } from "@/components/demo/PhoneFrame";
import { TypingChat } from "@/components/demo/TypingChat";
import { renderWithZamiliName } from "@/lib/renderZamiliName";

export function Hero() {
  const { t } = useLocale();
  const h = t.hero;
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  const [orderLanded, setOrderLanded] = useState(false);
  const messageCount = t.demoCanvas.ordering.messages.length;

  const handleProgress = useCallback(
    (visibleCount: number) => setOrderLanded(visibleCount >= messageCount),
    [messageCount]
  );

  return (
    <section id="top" className="relative overflow-hidden bg-midnight pb-20 pt-32 sm:pb-28 sm:pt-40">
      <MeshBackground variant="dark" />

      <div className="relative mx-auto grid max-w-6xl gap-16 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-teal-500" />
            {h.eyebrow}
          </p>
          <h1 className="balance text-4xl font-bold leading-[1.45] text-white sm:text-5xl sm:leading-[1.4] lg:text-[3.4rem] lg:leading-[1.35]">
            {renderWithZamiliName(h.headline)}
          </h1>
          <p className="balance mt-6 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
            {h.sub}
          </p>
          <p className="balance mt-4 max-w-xl border-s-2 border-ember-500/60 ps-3 text-sm leading-relaxed text-ember-400 sm:text-base">
            {renderWithZamiliName(h.growthLine)}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#book-demo"
              className="focus-ring rounded-full bg-ember-500 px-6 py-3 text-sm font-semibold text-midnight shadow-glow transition-transform hover:scale-[1.03] hover:bg-ember-400"
            >
              {h.ctaPrimary}
            </a>
            <a
              href="#demo"
              className="focus-ring rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5"
            >
              {h.ctaSecondary}
            </a>
          </div>

          <dl className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {[
              [h.statValue1, h.statLabel1],
              [h.statValue2, h.statLabel2],
              [h.statValue3, h.statLabel3],
            ].map(([value, label], i) => (
              <div key={i}>
                <dt className="sr-only">{label}</dt>
                <dd className="text-2xl font-bold text-white">{value}</dd>
                <dd className="mt-1 text-xs text-white/50">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div ref={ref} className="relative mx-auto flex w-full max-w-[320px] flex-col items-center">
          <div className="animate-float">
            <PhoneFrame headerTitle={t.demoCanvas.ordering.contactName} headerSub="عبر Zamili">
              <TypingChat
                messages={t.demoCanvas.ordering.messages}
                variant="whatsapp"
                active={inView}
                onProgress={handleProgress}
              />
            </PhoneFrame>
          </div>

          <div className="relative flex h-11 flex-col items-center" aria-hidden="true">
            <div
              className={`h-full w-px bg-gradient-to-b transition-colors duration-700 ${
                orderLanded ? "from-ember-500/90 to-ember-500/10" : "from-white/15 to-white/0"
              }`}
            />
            {orderLanded && (
              <span className="absolute start-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 animate-travel-down rounded-full bg-ember-400 shadow-[0_0_8px_2px_rgba(255,138,76,0.6)]" />
            )}
            <div
              className={`absolute -bottom-3 flex h-7 w-7 items-center justify-center rounded-full border-2 border-midnight bg-ember-500 text-[13px] font-bold text-midnight shadow-glow ${
                orderLanded ? "animate-pop-in" : "scale-0 opacity-0"
              }`}
            >
              ✓
            </div>
          </div>

          <div
            className={`w-full max-w-[260px] rounded-2xl border border-line bg-white p-4 shadow-glow transition-all duration-500 ${
              orderLanded ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            <div className="mb-2.5 flex items-center justify-between">
              <p className="text-[10px] font-medium uppercase tracking-wide text-ink-3">
                {h.panelTitle}
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-ember-500/10 px-2 py-0.5 text-[10px] font-semibold text-ember-600">
                <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-ember-500" />
                {h.panelBadge}
              </span>
            </div>
            <p className="text-sm font-semibold text-ink">{h.panelItem}</p>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-xs text-ink-3">{h.panelOrderNo}</span>
              <span className="text-xs font-medium text-teal-500">{h.panelStatus}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
