import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, IBM_Plex_Sans } from "next/font/google";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { defaultLocale, dirFor, dictionaries } from "@/i18n/dictionaries";
import "./globals.css";

const fontArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

const fontLatin = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-latin",
  display: "swap",
});

// The site is prerendered statically in the default locale (Arabic). A
// returning visitor's language choice is restored client-side from
// localStorage before paint — see i18n/LocaleProvider.tsx.
const t = dictionaries[defaultLocale];

export const metadata: Metadata = {
  title: t.meta.title,
  description: t.meta.description,
  icons: {
    icon: "/logo-icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#4C3BCF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={defaultLocale}
      dir={dirFor(defaultLocale)}
      className={`${fontArabic.variable} ${fontLatin.variable}`}
    >
      <body>
        <LocaleProvider initialLocale={defaultLocale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
