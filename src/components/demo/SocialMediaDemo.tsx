"use client";

import { useEffect, useState } from "react";
import type { SocialMediaDemo as SocialMediaDemoData } from "@/i18n/types";
import { useCountUp, useReducedMotion } from "@/lib/hooks";

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function SocialMediaDemo({ data, active }: { data: SocialMediaDemoData; active: boolean }) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showGenerating, setShowGenerating] = useState(false);
  const [showPost, setShowPost] = useState(false);
  const reducedMotion = useReducedMotion();

  const likes = useCountUp(data.likes, showPost, reducedMotion, 1000);
  const comments = useCountUp(data.comments, showPost, reducedMotion, 1000);
  const shares = useCountUp(data.shares, showPost, reducedMotion, 1000);

  useEffect(() => {
    if (!active) {
      setShowPrompt(false);
      setShowGenerating(false);
      setShowPost(false);
      return;
    }

    if (reducedMotion) {
      setShowPrompt(true);
      setShowPost(true);
      return;
    }

    let cancelled = false;

    async function run() {
      setShowPrompt(false);
      setShowGenerating(false);
      setShowPost(false);

      await sleep(400);
      if (cancelled) return;
      setShowPrompt(true);

      await sleep(1200);
      if (cancelled) return;
      setShowGenerating(true);

      await sleep(1900);
      if (cancelled) return;
      setShowGenerating(false);
      setShowPost(true);

      await sleep(4600);
      if (cancelled) return;
      run();
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [active, reducedMotion]);

  return (
    <div className="flex h-full flex-col gap-2.5 p-4">
      {showPrompt && (
        <div className="flex animate-fade-up justify-end">
          <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-brand-600 px-3.5 py-2.5 text-[13px] leading-relaxed text-white shadow-card">
            {data.prompt}
          </div>
        </div>
      )}

      {showGenerating && (
        <div className="flex animate-fade-up items-center gap-2 text-[12px] text-ink-3">
          <span className="flex items-center gap-1">
            {[0, 1, 2].map((d) => (
              <span
                key={d}
                className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-brand-400"
                style={{ animationDelay: `${d * 0.18}s` }}
              />
            ))}
          </span>
          {data.generatingLabel}
        </div>
      )}

      <div
        className={`mt-auto overflow-hidden rounded-xl border border-line bg-white shadow-card transition-all duration-500 ${
          showPost ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <div className="flex items-center gap-2.5 border-b border-line/70 px-3.5 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">
            Z
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-semibold text-ink">{data.pageName}</p>
            <p className="truncate text-[10px] text-ink-3">
              {data.pageHandle} · {data.postTimeLabel}
            </p>
          </div>
        </div>

        <p className="whitespace-pre-line px-3.5 py-3 text-[12.5px] leading-relaxed text-ink">
          {data.postText}
        </p>
        <div className="flex flex-wrap gap-x-2 gap-y-1 px-3.5 pb-3">
          {data.hashtags.map((h) => (
            <span key={h} className="text-[11px] font-medium text-brand-600">
              {h}
            </span>
          ))}
        </div>

        <div
          className="h-20 bg-gradient-to-br from-ember-400 via-ember-500 to-brand-600"
          aria-hidden="true"
        />

        <div className="flex items-center justify-between border-t border-line/70 px-3.5 py-2 text-[11px] text-ink-3">
          <span className="inline-flex items-center gap-1">👍 {likes.toLocaleString()}</span>
          <span className="inline-flex items-center gap-1">💬 {comments.toLocaleString()}</span>
          <span className="inline-flex items-center gap-1">🔁 {shares.toLocaleString()}</span>
        </div>
      </div>

      <p
        className={`text-center text-[10px] font-medium text-teal-500 transition-opacity duration-500 ${
          showPost ? "opacity-100" : "opacity-0"
        }`}
      >
        {data.publishedLabel}
      </p>
    </div>
  );
}
