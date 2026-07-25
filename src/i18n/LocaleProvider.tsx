"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";
import type { Locale, Dictionary } from "./types";
import { dictionaries, dirFor, locales, LOCALE_STORAGE_KEY } from "./dictionaries";

interface LocaleContextValue {
  locale: Locale;
  dir: "rtl" | "ltr";
  t: Dictionary;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

// The page is prerendered statically in `initialLocale` (Arabic by
// default — see layout.tsx). A returning visitor who previously switched to
// English gets synced back to their choice from localStorage here, before
// the browser paints, so there's no visible flash of the wrong language.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const applyToDocument = useCallback((next: Locale) => {
    document.documentElement.lang = next;
    document.documentElement.dir = dirFor(next);
  }, []);

  useIsomorphicLayoutEffect(() => {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    const resolved = locales.includes(stored as Locale) ? (stored as Locale) : initialLocale;
    setLocaleState(resolved);
    applyToDocument(resolved);
    // Runs once on mount to sync a returning visitor's saved preference.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next);
      applyToDocument(next);
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    },
    [applyToDocument]
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      dir: dirFor(locale),
      t: dictionaries[locale],
      setLocale,
    }),
    [locale, setLocale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}
