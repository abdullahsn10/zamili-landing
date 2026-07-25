"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import { useRevealOnce } from "@/lib/hooks";

export function Trust() {
  const { t } = useLocale();
  const trust = t.trust;
  const { ref, revealed } = useRevealOnce<HTMLDivElement>(0.15);

  return (
    <section id="trust" className="bg-paper py-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-brand-600">
            {trust.eyebrow}
          </p>
          <h2 className="balance text-3xl font-bold text-ink sm:text-4xl">{trust.heading}</h2>
        </div>

        <div ref={ref} className="grid gap-5 sm:grid-cols-2">
          {trust.items.map((item, i) => (
            <div
              key={item.title}
              className={`rounded-2xl border border-line bg-white p-6 shadow-card transition-all duration-700 ${
                revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-teal-500/10 text-teal-500">
                ✓
              </div>
              <h3 className="mb-2 text-base font-semibold text-ink">{item.title}</h3>
              <p className="text-sm leading-relaxed text-ink-3">{item.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-ink-3">{trust.technicalNote}</p>
      </div>
    </section>
  );
}
