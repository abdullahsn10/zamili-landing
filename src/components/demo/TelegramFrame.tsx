export function TelegramFrame({
  children,
  headerTitle,
  headerSub,
}: {
  children: React.ReactNode;
  headerTitle: string;
  headerSub: string;
}) {
  return (
    <div className="mx-auto w-[300px] max-w-full rounded-[2.25rem] border border-white/10 bg-midnight/90 p-2 shadow-glow">
      <div className="relative flex h-[560px] flex-col overflow-hidden rounded-[1.75rem] bg-[#0E1621]">
        <div className="flex items-center gap-2.5 bg-[#17212B] px-4 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#2AABEE] to-[#229ED9] text-xs font-semibold text-white">
            Z
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-white">{headerTitle}</p>
            <p className="truncate text-[11px] text-[#2AABEE]">{headerSub}</p>
          </div>
        </div>
        <div className="flex-1 space-y-2 overflow-hidden px-3 py-3">{children}</div>
      </div>
    </div>
  );
}
