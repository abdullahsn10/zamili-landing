"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { ChatMessage } from "@/i18n/types";
import { useReducedMotion } from "@/lib/hooks";

export type ChatVariant = "whatsapp" | "telegram" | "widget";

// A plain timer — the caller already re-checks its own `cancelled` closure
// variable right after every await, so this doesn't need its own polling
// loop to resolve early. Avoids stacking a 50ms setInterval per animation
// step across every concurrently-mounted demo card.
function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/** Bubble background per dark-themed chat variant (WhatsApp/Telegram both
 * render on a dark device frame; "widget" gets its own light-theme styling
 * further down instead of appearing here). */
const DARK_BUBBLE_COLORS: Record<"whatsapp" | "telegram", { customer: string; zamili: string }> = {
  whatsapp: { customer: "bg-[#005C4B]", zamili: "bg-[#1F2C34]" },
  telegram: { customer: "bg-[#2B5278]", zamili: "bg-[#182533]" },
};

export function TypingChat({
  messages,
  variant,
  active,
  onProgress,
}: {
  messages: ChatMessage[];
  variant: ChatVariant;
  active: boolean;
  /** Called with how many messages are currently visible (0..messages.length) — lets a parent react when the conversation reaches its final message, e.g. to reveal something once the order is "confirmed." */
  onProgress?: (visibleCount: number) => void;
}) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [typingSender, setTypingSender] = useState<ChatMessage["sender"] | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    onProgress?.(visibleCount);
    // Only the count itself should trigger this — `onProgress` is expected
    // to be an inline closure that changes every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleCount]);

  useEffect(() => {
    if (!active) {
      setVisibleCount(0);
      setTypingSender(null);
      return;
    }

    if (reducedMotion) {
      setVisibleCount(messages.length);
      return;
    }

    let cancelled = false;

    async function run() {
      for (let i = 0; i < messages.length; i++) {
        if (cancelled) return;
        const msg = messages[i];
        if (!msg) continue;
        setTypingSender(msg.sender);
        await sleep(msg.typingMs);
        if (cancelled) return;
        setTypingSender(null);
        setVisibleCount(i + 1);
        await sleep(500);
      }
      if (cancelled) return;
      await sleep(3000);
      if (cancelled) return;
      setVisibleCount(0);
      run();
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [active, messages, reducedMotion]);

  const isDark = variant !== "widget";
  const darkColors = isDark ? DARK_BUBBLE_COLORS[variant as "whatsapp" | "telegram"] : null;

  return (
    <div className="flex h-full flex-col justify-end gap-2">
      {messages.slice(0, visibleCount).map((m, i) => (
        <Bubble key={i} message={m} variant={variant} />
      ))}
      {typingSender && (
        <div className={`flex ${typingSender === "customer" ? "justify-end" : "justify-start"}`}>
          <div
            className={`flex items-center gap-1 rounded-2xl px-3.5 py-2.5 ${
              darkColors
                ? typingSender === "customer"
                  ? darkColors.customer
                  : darkColors.zamili
                : typingSender === "customer"
                  ? "bg-brand-600"
                  : "bg-paper-2"
            }`}
          >
            {[0, 1, 2].map((d) => (
              <span
                key={d}
                className={`h-1.5 w-1.5 animate-pulse-dot rounded-full ${
                  isDark || typingSender === "customer" ? "bg-white/70" : "bg-ink-3"
                }`}
                style={{ animationDelay: `${d * 0.18}s` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MessageImage({ message }: { message: ChatMessage }) {
  if (message.images?.length) {
    return (
      <div className="mb-1.5 grid grid-cols-2 gap-1">
        {message.images.map((img, i) => (
          <Image
            key={i}
            src={img.src}
            alt={img.alt}
            width={140}
            height={100}
            className="h-[72px] w-full rounded-lg object-cover"
          />
        ))}
      </div>
    );
  }
  if (!message.image) return null;
  return (
    <Image
      src={message.image}
      alt={message.imageAlt ?? ""}
      width={220}
      height={150}
      className="mb-1.5 h-[110px] w-full rounded-xl object-cover"
    />
  );
}

function MenuCard({ message, tone }: { message: ChatMessage; tone: "dark" | "light" }) {
  if (!message.menu?.length) return null;
  return (
    <div
      className={`mb-1.5 overflow-hidden rounded-lg ${
        tone === "dark" ? "bg-black/15" : "border border-line bg-paper-2"
      }`}
    >
      {message.menu.map((item, i) => (
        <div
          key={i}
          className={`flex items-center justify-between px-2.5 py-1.5 text-[12px] ${
            i > 0 ? (tone === "dark" ? "border-t border-white/10" : "border-t border-line") : ""
          }`}
        >
          <span className={tone === "dark" ? "text-white/90" : "text-ink"}>{item.name}</span>
          <span className={`font-semibold ${tone === "dark" ? "text-white" : "text-ember-600"}`}>
            {item.price}
          </span>
        </div>
      ))}
    </div>
  );
}

const WAVEFORM_BAR_HEIGHTS = [6, 12, 8, 16, 10, 14, 7, 11, 15, 9, 13, 6];

function VoiceNote({ light }: { light: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
          light ? "bg-white/20" : "bg-brand-50"
        }`}
      >
        <svg width="9" height="11" viewBox="0 0 10 12" fill="none" aria-hidden="true">
          <path d="M0 0L10 6L0 12V0Z" fill={light ? "white" : "#4C3BCF"} />
        </svg>
      </span>
      <span className="flex items-center gap-[2px]" aria-hidden="true">
        {WAVEFORM_BAR_HEIGHTS.map((h, i) => (
          <span
            key={i}
            className={`w-[2px] rounded-full ${light ? "bg-white/70" : "bg-brand-300"}`}
            style={{ height: `${h}px` }}
          />
        ))}
      </span>
    </span>
  );
}

function Bubble({ message, variant }: { message: ChatMessage; variant: ChatVariant }) {
  const fromCustomer = message.sender === "customer";
  const isDark = variant !== "widget";
  const darkColors = isDark ? DARK_BUBBLE_COLORS[variant as "whatsapp" | "telegram"] : null;
  const light = isDark || fromCustomer;

  if (message.voice) {
    return (
      <div className={`flex animate-fade-up flex-col ${fromCustomer ? "items-end" : "items-start"}`}>
        <div
          className={`flex max-w-[80%] items-center gap-2 rounded-2xl px-3.5 py-2.5 shadow-sm ${
            darkColors
              ? fromCustomer
                ? `rounded-tl-md ${darkColors.customer}`
                : `rounded-tr-md ${darkColors.zamili}`
              : fromCustomer
                ? "rounded-tl-md bg-brand-600 text-white"
                : "rounded-tr-md border border-line bg-white text-ink"
          }`}
        >
          <VoiceNote light={light} />
          <span className={`text-[11px] ${light ? "text-white/80" : "text-ink-3"}`}>
            {message.voiceDuration}
          </span>
        </div>
        <p className={`mt-1 max-w-[80%] text-[11px] italic ${isDark ? "text-white/40" : "text-ink-3"}`}>
          {message.text}
        </p>
      </div>
    );
  }

  if (darkColors) {
    return (
      <div className={`flex animate-fade-up ${fromCustomer ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed text-white shadow-sm ${
            fromCustomer ? `rounded-tl-md ${darkColors.customer}` : `rounded-tr-md ${darkColors.zamili}`
          }`}
        >
          <MessageImage message={message} />
          <MenuCard message={message} tone="dark" />
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex animate-fade-up ${fromCustomer ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-card ${
          fromCustomer
            ? "rounded-tl-md bg-brand-600 text-white"
            : "rounded-tr-md border border-line bg-white text-ink"
        }`}
      >
        <MessageImage message={message} />
        <MenuCard message={message} tone={fromCustomer ? "dark" : "light"} />
        {message.text}
      </div>
    </div>
  );
}
