"use client";

import { useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { useRevealOnce } from "@/lib/hooks";
import { Modal } from "@/components/ui/Modal";
import { TypingChat } from "@/components/demo/TypingChat";
import type { PackItem } from "@/i18n/types";

const ACCENTS = [
  { bar: "from-brand-500 to-brand-700", tile: "from-brand-500 to-brand-700", glow: "hover:shadow-[0_16px_40px_-8px_rgba(76,59,207,0.35)]" },
  { bar: "from-ember-500 to-ember-600", tile: "from-ember-400 to-ember-600", glow: "hover:shadow-[0_16px_40px_-8px_rgba(255,138,76,0.4)]" },
  { bar: "from-[#22C7B6] to-[#158F83]", tile: "from-[#22C7B6] to-[#158F83]", glow: "hover:shadow-[0_16px_40px_-8px_rgba(31,181,166,0.35)]" },
];

function PackCard({
  pack,
  index,
  agentsLabel,
  detailsLabel,
  onOpen,
}: {
  pack: PackItem;
  index: number;
  agentsLabel: string;
  detailsLabel: string;
  onOpen: () => void;
}) {
  const { ref, revealed } = useRevealOnce<HTMLButtonElement>(0.15);
  const accent = ACCENTS[index % ACCENTS.length]!;

  return (
    <button
      ref={ref}
      onClick={onOpen}
      className={`focus-ring group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white text-start shadow-card transition-all duration-700 hover:-translate-y-1.5 ${accent.glow} ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={{ transitionDelay: `${(index % 3) * 90}ms` }}
    >
      <span className={`h-1 w-full shrink-0 bg-gradient-to-r ${accent.bar}`} aria-hidden="true" />
      <div className="flex flex-1 flex-col p-6">
        <div
          className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-xl shadow-sm ${accent.tile}`}
        >
          {pack.icon}
        </div>
        <h3 className="mb-2 text-base font-semibold text-ink">{pack.name}</h3>
        <p className="mb-4 text-sm leading-relaxed text-ink-3">{pack.outcome}</p>

        <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-ink-3">
          {agentsLabel}
        </p>
        <ul className="mb-4 flex-1 space-y-1.5">
          {pack.agents.map((a) => (
            <li key={a.name} className="flex items-center gap-2 text-[13px] text-ink-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-paper-2 text-[11px]">
                {a.icon}
              </span>
              <span className="font-medium">{a.name}</span>
            </li>
          ))}
        </ul>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {pack.channels.map((c) => (
            <span
              key={c}
              className="rounded-full bg-paper-2 px-2.5 py-1 text-[11px] font-medium text-ink-2"
            >
              {c}
            </span>
          ))}
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 transition-[gap] group-hover:gap-2">
          {detailsLabel}
          <span aria-hidden="true" className="rtl:rotate-180">
            →
          </span>
        </span>
      </div>
    </button>
  );
}

export function SolutionPacks() {
  const { t } = useLocale();
  const p = t.packs;
  const [openId, setOpenId] = useState<string | null>(null);
  const activePack = p.items.find((i) => i.id === openId) ?? null;

  return (
    <section id="packs" className="bg-paper-2 py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-brand-600">
            {p.eyebrow}
          </p>
          <h2 className="balance text-3xl font-bold text-ink sm:text-4xl">{p.heading}</h2>
          <p className="mt-4 text-base text-ink-3">{p.sub}</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {p.items.map((pack, i) => (
            <PackCard
              key={pack.id}
              pack={pack}
              index={i}
              agentsLabel={p.agentsLabel}
              detailsLabel={p.detailsLabel}
              onOpen={() => setOpenId(pack.id)}
            />
          ))}
        </div>
      </div>

      <Modal
        open={!!activePack}
        onClose={() => setOpenId(null)}
        labelledBy="pack-modal-title"
        closeLabel={p.closeLabel}
      >
        {activePack && (
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-xl">
                {activePack.icon}
              </div>
              <h3 id="pack-modal-title" className="text-lg font-semibold text-ink">
                {activePack.name}
              </h3>
            </div>
            <p className="mb-5 text-sm leading-relaxed text-ink-2">{activePack.outcome}</p>

            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-3">
              {p.agentsLabel}
            </p>
            <ul className="mb-6 space-y-2">
              {activePack.agents.map((a) => (
                <li key={a.name} className="flex items-start gap-2.5 rounded-xl bg-paper-2 p-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-sm shadow-sm">
                    {a.icon}
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-ink">{a.name}</p>
                    <p className="text-[12px] leading-relaxed text-ink-3">{a.role}</p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-3">
              {p.modalChannelsLabel}
            </p>
            <div className="mb-6 flex flex-wrap gap-1.5">
              {activePack.channels.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-paper-2 px-2.5 py-1 text-[11px] font-medium text-ink-2"
                >
                  {c}
                </span>
              ))}
            </div>

            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-3">
              {p.modalSampleLabel}
            </p>
            <div className="mb-6 h-40 rounded-xl border border-line bg-paper p-3">
              <TypingChat messages={activePack.sample} variant="widget" active={!!activePack} />
            </div>

            <a
              href="#book-demo"
              onClick={() => setOpenId(null)}
              className="focus-ring block w-full rounded-full bg-brand-600 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              {p.modalCta}
            </a>
          </div>
        )}
      </Modal>
    </section>
  );
}
