"use client";

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

  return (
    <section id="top" className="relative overflow-hidden bg-midnight pb-20 pt-32 sm:pb-28 sm:pt-40">
      <MeshBackground variant="dark" />

      <div className="relative mx-auto grid max-w-6xl gap-16 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-teal-500" />
            {h.eyebrow}
          </p>
          <h1 className="balance text-4xl font-bold leading-[1.15] text-white sm:text-5xl lg:text-[3.4rem]">
            {renderWithZamiliName(h.headline)}
          </h1>
          <p className="balance mt-6 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
            {h.sub}
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

        <div ref={ref} className="relative mx-auto w-full max-w-[320px] pt-16">
          <div
            className="animate-float-slow absolute -top-2 start-2 z-20 hidden w-48 rounded-2xl border border-brand-300/20 bg-midnight/80 p-4 shadow-glow backdrop-blur-md sm:block"
            style={{ ["--tilt" as string]: "4deg" }}
          >
            <p className="text-[10px] uppercase tracking-wide text-white/40">قميص قطن · L</p>
            <p className="mt-1.5 text-lg font-bold text-ember-400">85 ₪</p>
            <p className="mt-1 text-[11px] text-teal-400">متوفر الآن</p>
          </div>

          <div className="relative z-10 animate-float">
            <PhoneFrame headerTitle={t.demoCanvas.whatsapp.contactName} headerSub="عبر Zamili">
              <TypingChat
                messages={t.demoCanvas.whatsapp.messages}
                variant="whatsapp"
                active={inView}
              />
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
