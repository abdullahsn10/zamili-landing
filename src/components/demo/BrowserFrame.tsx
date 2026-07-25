export function BrowserFrame({
  children,
  url = "zamili.example",
}: {
  children: React.ReactNode;
  url?: string;
}) {
  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-line/60 bg-white shadow-glow">
      <div className="flex items-center gap-2 border-b border-line/70 bg-paper-2 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF6157]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FFC02E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C93F]" />
        </div>
        <div className="mx-auto flex max-w-[220px] flex-1 items-center justify-center rounded-md bg-white px-3 py-1 text-[11px] text-ink-3 ltr:font-latin">
          {url}
        </div>
      </div>
      <div className="relative flex h-[420px] flex-col justify-end bg-paper p-4">{children}</div>
      <div className="flex items-center justify-between border-t border-line/70 bg-paper-2 px-4 py-2 text-[11px] text-ink-3">
        <span>Zamili widget</span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-teal-500" />
          متصل الآن
        </span>
      </div>
    </div>
  );
}
