"use client";

import { useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { useRevealOnce } from "@/lib/hooks";
import { Modal } from "@/components/ui/Modal";
import { TypingChat } from "@/components/demo/TypingChat";
import type { PackItem } from "@/i18n/types";

function PackCard({
  pack,
  index,
  onOpen,
}: {
  pack: PackItem;
  index: number;
  onOpen: () => void;
}) {
  const { ref, revealed } = useRevealOnce<HTMLButtonElement>(0.15);

  return (
    <button
      ref={ref}
      onClick={onOpen}
      className={`focus-ring group flex flex-col rounded-2xl border border-line bg-white p-6 text-start shadow-card transition-all duration-700 hover:-translate-y-1 hover:border-brand-300 hover:shadow-glow ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={{ transitionDelay: `${(index % 3) * 90}ms` }}
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-xl">
        {pack.icon}
      </div>
      <h3 className="mb-2 text-base font-semibold text-ink">{pack.name}</h3>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-ink-3">{pack.outcome}</p>
      <div className="flex flex-wrap gap-1.5">
        {pack.channels.map((c) => (
          <span
            key={c}
            className="rounded-full bg-paper-2 px-2.5 py-1 text-[11px] font-medium text-ink-2"
          >
            {c}
          </span>
        ))}
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
            <PackCard key={pack.id} pack={pack} index={i} onOpen={() => setOpenId(pack.id)} />
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
