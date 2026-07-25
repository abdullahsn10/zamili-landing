"use client";

import Image from "next/image";
import { useLocale } from "@/i18n/LocaleProvider";

export function Header() {
  const { t, locale, setLocale } = useLocale();

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
        <a href="#top" className="focus-ring flex items-center gap-2.5">
          <Image src="/logo-icon.svg" alt="" width={30} height={30} priority />
          <span className="zamili-name text-lg text-ink">Zamili</span>
        </a>

        <nav className="hidden items-center gap-7 text-sm text-ink-2 md:flex">
          <a className="focus-ring transition-colors hover:text-ink" href="#demo">
            {t.nav.demo}
          </a>
          <a className="focus-ring transition-colors hover:text-ink" href="#packs">
            {t.nav.solutions}
          </a>
          <a className="focus-ring transition-colors hover:text-ink" href="#trust">
            {t.nav.trust}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
            className="focus-ring rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-2 transition-colors hover:border-brand-300 hover:text-brand-700"
            aria-label={t.nav.toggleTo}
          >
            {t.nav.toggleTo}
          </button>
          <a
            href="#book-demo"
            className="focus-ring hidden rounded-full bg-brand-600 px-4 py-1.5 text-sm font-medium text-white shadow-soft transition-transform hover:scale-[1.03] hover:bg-brand-700 sm:inline-block"
          >
            {t.nav.bookDemo}
          </a>
        </div>
      </div>
    </header>
  );
}
