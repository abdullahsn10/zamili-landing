"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { ChatMessage } from "@/i18n/types";
import { useReducedMotion } from "@/lib/hooks";

// A plain timer — the caller already re-checks its own `cancelled` closure
// variable right after every await, so this doesn't need its own polling
// loop to resolve early. Avoids stacking a 50ms setInterval per animation
// step across every concurrently-mounted demo card.
function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function TypingChat({
  messages,
  variant,
  active,
  onProgress,
}: {
  messages: ChatMessage[];
  variant: "whatsapp" | "widget";
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

  const isWhatsapp = variant === "whatsapp";

  return (
    <div className="flex h-full flex-col justify-end gap-2">
      {messages.slice(0, visibleCount).map((m, i) => (
        <Bubble key={i} message={m} isWhatsapp={isWhatsapp} />
      ))}
      {typingSender && (
        <div className={`flex ${typingSender === "customer" ? "justify-end" : "justify-start"}`}>
          <div
            className={`flex items-center gap-1 rounded-2xl px-3.5 py-2.5 ${
              isWhatsapp
                ? typingSender === "customer"
                  ? "bg-[#005C4B]"
                  : "bg-[#1F2C34]"
                : typingSender === "customer"
                  ? "bg-brand-600"
                  : "bg-paper-2"
            }`}
          >
            {[0, 1, 2].map((d) => (
              <span
                key={d}
                className={`h-1.5 w-1.5 animate-pulse-dot rounded-full ${
                  isWhatsapp || typingSender === "customer" ? "bg-white/70" : "bg-ink-3"
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

function Bubble({ message, isWhatsapp }: { message: ChatMessage; isWhatsapp: boolean }) {
  const fromCustomer = message.sender === "customer";

  if (isWhatsapp) {
    return (
      <div className={`flex animate-fade-up ${fromCustomer ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed text-white shadow-sm ${
            fromCustomer ? "rounded-tl-md bg-[#005C4B]" : "rounded-tr-md bg-[#1F2C34]"
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
