"use client";

import { useEffect, useState } from "react";
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
}: {
  messages: ChatMessage[];
  variant: "whatsapp" | "widget";
  active: boolean;
}) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [typingSender, setTypingSender] = useState<ChatMessage["sender"] | null>(null);
  const reducedMotion = useReducedMotion();

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
        {message.text}
      </div>
    </div>
  );
}
