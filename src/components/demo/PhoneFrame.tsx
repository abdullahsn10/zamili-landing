export function PhoneFrame({
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
      <div className="relative flex h-[560px] flex-col overflow-hidden rounded-[1.75rem] bg-[#0B141A]">
        <div className="flex items-center gap-2.5 bg-[#1F2C34] px-4 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500/80 text-xs font-semibold text-white">
            Z
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-white">{headerTitle}</p>
            <p className="truncate text-[11px] text-white/50">{headerSub}</p>
          </div>
        </div>
        <div
          className="flex-1 space-y-2 overflow-hidden px-3 py-3"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.03) 0, transparent 40%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.03) 0, transparent 40%)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
