"use client";

import { useEffect, useState } from "react";
import type { DocumentsDemo as DocumentsDemoData } from "@/i18n/types";
import { useReducedMotion } from "@/lib/hooks";

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

const FORMAT_STYLES: Record<string, string> = {
  PDF: "bg-[#E5484D]/10 text-[#E5484D]",
  DOCX: "bg-[#2F6FEB]/10 text-[#2F6FEB]",
  XLSX: "bg-[#1F9D55]/10 text-[#1F9D55]",
  CSV: "bg-[#1F9D55]/10 text-[#1F9D55]",
};

export function DocumentsDemo({ data, active }: { data: DocumentsDemoData; active: boolean }) {
  const [visibleFiles, setVisibleFiles] = useState(0);
  const [showReady, setShowReady] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!active) {
      setVisibleFiles(0);
      setShowReady(false);
      setShowQuestion(false);
      setShowAnswer(false);
      return;
    }

    if (reducedMotion) {
      setVisibleFiles(data.files.length);
      setShowReady(true);
      setShowQuestion(true);
      setShowAnswer(true);
      return;
    }

    let cancelled = false;

    async function run() {
      setVisibleFiles(0);
      setShowReady(false);
      setShowQuestion(false);
      setShowAnswer(false);

      for (let i = 0; i < data.files.length; i++) {
        await sleep(600);
        if (cancelled) return;
        setVisibleFiles(i + 1);
      }

      await sleep(700);
      if (cancelled) return;
      setShowReady(true);

      await sleep(1100);
      if (cancelled) return;
      setShowQuestion(true);

      await sleep(1400);
      if (cancelled) return;
      setShowAnswer(true);

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
    <div className="flex h-full flex-col gap-2.5 p-4">
      <p className="text-[11px] font-medium uppercase tracking-wide text-ink-3">{data.uploadingLabel}</p>

      <div className="flex flex-col gap-2">
        {data.files.slice(0, visibleFiles).map((f, i) => (
          <div
            key={i}
            className="flex animate-fade-up items-center gap-2.5 rounded-xl border border-line bg-white p-2.5 shadow-card"
          >
            <span
              className={`shrink-0 rounded-md px-1.5 py-1 text-[10px] font-bold ${
                FORMAT_STYLES[f.format] ?? "bg-paper-2 text-ink-2"
              }`}
            >
              {f.format}
            </span>
            <span className="flex-1 truncate text-[12px] text-ink">{f.name}</span>
            <span className="shrink-0 text-teal-500">✓</span>
          </div>
        ))}
      </div>

      {showReady && (
        <p className="animate-fade-up text-center text-[11px] font-medium text-teal-500">{data.readyLabel}</p>
      )}

      <div className="mt-auto flex flex-col gap-2">
        {showQuestion && (
          <div className="flex animate-fade-up justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-brand-600 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-white shadow-card">
              {data.question}
            </div>
          </div>
        )}
        {showAnswer && (
          <div className="flex animate-fade-up justify-start">
            <div className="max-w-[90%] rounded-2xl rounded-tr-md border border-ember-500/30 bg-white px-3.5 py-2.5 text-[12.5px] leading-relaxed text-ink shadow-card">
              {data.answer}
            </div>
          </div>
        )}
      </div>

      {showAnswer && (
        <p className="animate-fade-up border-t border-line pt-2 text-[10px] leading-relaxed text-ink-3">
          {data.groundedNote}
        </p>
      )}
    </div>
  );
}
