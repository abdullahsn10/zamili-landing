"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import { PhoneFrame } from "./PhoneFrame";
import { TelegramFrame } from "./TelegramFrame";
import { BrowserFrame } from "./BrowserFrame";
import { TypingChat } from "./TypingChat";
import type { MultiChannelDemo as MultiChannelDemoData } from "@/i18n/types";

function Column({
  channelLabel,
  vertical,
  children,
}: {
  channelLabel: string;
  vertical: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
        <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/80">
          {channelLabel}
        </span>
        <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-medium text-white/60">
          {vertical}
        </span>
      </div>
      {children}
    </div>
  );
}

export function MultiChannelDemo({ data, active }: { data: MultiChannelDemoData; active: boolean }) {
  const { t } = useLocale();

  return (
    <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-center lg:gap-6">
      <Column channelLabel={data.whatsapp.channelLabel} vertical={data.whatsapp.vertical}>
        <PhoneFrame headerTitle={data.whatsapp.contactName ?? ""} headerSub={t.demoCanvas.viaLabel}>
          <TypingChat messages={data.whatsapp.messages} variant="whatsapp" active={active} />
        </PhoneFrame>
      </Column>

      <Column channelLabel={data.telegram.channelLabel} vertical={data.telegram.vertical}>
        <TelegramFrame headerTitle={data.telegram.contactName ?? ""} headerSub={t.demoCanvas.viaLabel}>
          <TypingChat messages={data.telegram.messages} variant="telegram" active={active} />
        </TelegramFrame>
      </Column>

      <Column channelLabel={data.webWidget.channelLabel} vertical={data.webWidget.vertical}>
        <BrowserFrame url="zamili.example">
          <TypingChat messages={data.webWidget.messages} variant="widget" active={active} />
        </BrowserFrame>
      </Column>
    </div>
  );
}
