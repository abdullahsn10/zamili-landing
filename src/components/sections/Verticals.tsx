"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import { useRevealOnce } from "@/lib/hooks";

function VerticalCard({
  icon,
  name,
  problem,
  solution,
  index,
}: {
  icon: string;
  name: string;
  problem: string;
  solution: string;
  index: number;
}) {
  const { ref, revealed } = useRevealOnce<HTMLDivElement>(0.15);

  return (
    <div
      ref={ref}
      className={`rounded-2xl border border-line bg-white p-6 shadow-card transition-all duration-700 ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={{ transitionDelay: `${(index % 3) * 90}ms` }}
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-xl">
        {icon}
      </div>
      <h3 className="mb-3 text-base font-semibold text-ink">{name}</h3>
      <p className="mb-3 text-sm leading-relaxed text-ink-3">{problem}</p>
      <p className="border-t border-line pt-3 text-sm font-medium leading-relaxed text-brand-700">
        {solution}
      </p>
    </div>
  );
}

export function Verticals() {
  const { t } = useLocale();
  const v = t.verticals;

  return (
    <section className="bg-paper py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-brand-600">
            {v.eyebrow}
          </p>
          <h2 className="balance text-3xl font-bold text-ink sm:text-4xl">{v.heading}</h2>
          <p className="mt-4 text-base text-ink-3">{v.sub}</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {v.items.map((item, i) => (
            <VerticalCard key={item.name} index={i} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
