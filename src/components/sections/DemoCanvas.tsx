"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import { useInView } from "@/lib/hooks";
import { MeshBackground } from "@/components/background/MeshBackground";
import { PhoneFrame } from "@/components/demo/PhoneFrame";
import { BrowserFrame } from "@/components/demo/BrowserFrame";
import { TypingChat } from "@/components/demo/TypingChat";
import { RecordsDemo } from "@/components/demo/RecordsDemo";
import { OrderDemo } from "@/components/demo/OrderDemo";
import type { DemoCard } from "@/i18n/types";

function CardShell({
  card,
  render,
}: {
  card: DemoCard;
  render: (inView: boolean) => React.ReactNode;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
        <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs font-medium text-brand-200">
          {card.chip}
        </span>
        <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-white/70">
          {card.channel}
        </span>
      </div>
      <h3 className="mb-1 text-center text-lg font-semibold text-white">{card.title}</h3>
      <p className="mb-5 max-w-xs text-center text-sm text-white/55">{card.sub}</p>
      {render(inView)}
    </div>
  );
}

export function DemoCanvas() {
  const { t } = useLocale();
  const d = t.demoCanvas;

  return (
    <section id="demo" className="relative overflow-hidden bg-midnight py-24">
      <MeshBackground variant="dark" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-ember-400">
            {d.eyebrow}
          </p>
          <h2 className="balance text-3xl font-bold text-white sm:text-4xl">{d.heading}</h2>
          <p className="mt-4 text-base text-white/60">{d.sub}</p>
        </div>

        <div className="grid gap-16 lg:grid-cols-2">
          <CardShell
            card={d.whatsapp}
            render={(inView) => (
              <PhoneFrame headerTitle={d.whatsapp.contactName} headerSub="عبر Zamili">
                <TypingChat messages={d.whatsapp.messages} variant="whatsapp" active={inView} />
              </PhoneFrame>
            )}
          />

          <CardShell
            card={d.widget}
            render={(inView) => (
              <BrowserFrame>
                <TypingChat messages={d.widget.messages} variant="widget" active={inView} />
              </BrowserFrame>
            )}
          />

          <CardShell
            card={d.records}
            render={(inView) => (
              <BrowserFrame url="admin.zamili.example">
                <RecordsDemo data={d.records} active={inView} />
              </BrowserFrame>
            )}
          />

          <CardShell
            card={d.order}
            render={(inView) => (
              <BrowserFrame url="inbox.zamili.example">
                <OrderDemo data={d.order} active={inView} />
              </BrowserFrame>
            )}
          />
        </div>
      </div>
    </section>
  );
}
