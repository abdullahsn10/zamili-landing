import type { Locale, Dictionary } from "./types";
import { ar } from "./ar";
import { en } from "./en";

export const dictionaries: Record<Locale, Dictionary> = { ar, en };

export const defaultLocale: Locale = "ar";

export const locales: Locale[] = ["ar", "en"];

export const dirFor = (locale: Locale): "rtl" | "ltr" => (locale === "ar" ? "rtl" : "ltr");

export const LOCALE_STORAGE_KEY = "zamili_locale";
