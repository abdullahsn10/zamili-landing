"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import { useInView } from "@/lib/hooks";
import { MeshBackground } from "@/components/background/MeshBackground";
import { PhoneFrame } from "@/components/demo/PhoneFrame";
import { BrowserFrame } from "@/components/demo/BrowserFrame";
import { TypingChat } from "@/components/demo/TypingChat";
import { SocialMediaDemo } from "@/components/demo/SocialMediaDemo";
import { DashboardDemo } from "@/components/demo/DashboardDemo";
import { AnalyticsDemo } from "@/components/demo/AnalyticsDemo";
import { KnowledgeDemo } from "@/components/demo/KnowledgeDemo";
import { DocumentsDemo } from "@/components/demo/DocumentsDemo";
import { CustomSolutionDemo } from "@/components/demo/CustomSolutionDemo";
import type { DemoCard } from "@/i18n/types";

/** One capability, one full-height scroll slide. `reverse` alternates which
 * side the marketing copy sits on from slide to slide (independent of
 * locale direction) so the page doesn't read as a monotonous single column. */
function Slide({
  card,
  reverse,
  render,
}: {
  card: DemoCard;
  reverse: boolean;
  render: (inView: boolean) => React.ReactNode;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);

  return (
    <div ref={ref} className="scroll-mt-24 snap-start flex min-h-[92vh] items-center py-12">
      <div className="grid w-full items-center gap-12 lg:grid-cols-2">
        <div className={reverse ? "lg:order-2" : "lg:order-1"}>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs font-medium text-brand-200">
              {card.chip}
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-white/70">
              {card.channel}
            </span>
          </div>
          <h3 className="balance mb-3 text-2xl font-bold text-white sm:text-3xl">{card.title}</h3>
          <p className="mb-6 max-w-md text-base leading-relaxed text-white/60">{card.sub}</p>
          <ul className="space-y-3">
            {card.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-white/75">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ember-500/15 text-[11px] text-ember-400">
                  ✓
                </span>
                <span className="leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={`mx-auto ${reverse ? "lg:order-1" : "lg:order-2"}`}>{render(inView)}</div>
      </div>
    </div>
  );
}

export function DemoCanvas() {
  const { t } = useLocale();
  const d = t.demoCanvas;

  return (
    <section id="demo" className="relative overflow-hidden bg-midnight py-16">
      <MeshBackground variant="dark" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-ember-400">
            {d.eyebrow}
          </p>
          <h2 className="balance text-3xl font-bold text-white sm:text-4xl">{d.heading}</h2>
          <p className="mt-4 text-base text-white/60">{d.sub}</p>
        </div>

        <div className="mx-auto mb-4 max-w-2xl rounded-2xl border border-ember-500/25 bg-ember-500/[0.06] px-6 py-4 text-center text-sm leading-relaxed text-white/80">
          {d.actionsNote}
        </div>

        <Slide
          card={d.ordering}
          reverse={false}
          render={(inView) => (
            <PhoneFrame headerTitle={d.ordering.contactName} headerSub="عبر Zamili">
              <TypingChat messages={d.ordering.messages} variant="whatsapp" active={inView} />
            </PhoneFrame>
          )}
        />

        <Slide
          card={d.social}
          reverse={true}
          render={(inView) => (
            <BrowserFrame url="facebook.com/YourBusiness">
              <SocialMediaDemo data={d.social} active={inView} />
            </BrowserFrame>
          )}
        />

        <Slide
          card={d.dashboard}
          reverse={false}
          render={(inView) => (
            <BrowserFrame url="dashboard.zamili.example">
              <DashboardDemo data={d.dashboard} active={inView} />
            </BrowserFrame>
          )}
        />

        <Slide
          card={d.analytics}
          reverse={true}
          render={(inView) => (
            <BrowserFrame url="insights.zamili.example">
              <AnalyticsDemo data={d.analytics} active={inView} />
            </BrowserFrame>
          )}
        />

        <Slide
          card={d.knowledge}
          reverse={false}
          render={(inView) => (
            <BrowserFrame url="admin.zamili.example">
              <KnowledgeDemo data={d.knowledge} active={inView} />
            </BrowserFrame>
          )}
        />

        <Slide
          card={d.documents}
          reverse={true}
          render={(inView) => (
            <BrowserFrame url="docs.zamili.example">
              <DocumentsDemo data={d.documents} active={inView} />
            </BrowserFrame>
          )}
        />

        <Slide
          card={d.customSolution}
          reverse={false}
          render={(inView) => (
            <BrowserFrame url="builder.zamili.example">
              <CustomSolutionDemo data={d.customSolution} active={inView} />
            </BrowserFrame>
          )}
        />
      </div>
    </section>
  );
}
