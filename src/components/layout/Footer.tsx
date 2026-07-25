"use client";

import Image from "next/image";
import { useLocale } from "@/i18n/LocaleProvider";

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-line bg-paper py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 text-center sm:px-8">
        <div className="flex items-center gap-2.5">
          <Image src="/logo-icon.svg" alt="" width={24} height={24} />
          <span className="zamili-name text-base text-ink">Zamili</span>
        </div>
        <p className="max-w-md text-sm text-ink-3">{t.footer.tagline}</p>
        <p className="text-xs text-ink-3">{t.footer.rightsLine}</p>
      </div>
    </footer>
  );
}
