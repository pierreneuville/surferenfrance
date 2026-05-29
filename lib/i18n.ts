/**
 * Lightweight i18n foundation for Yosurf.
 *
 * Approach: dictionary-based translation, locale stored in URL pathname (/, /en, /es, /pt)
 * or localStorage fallback. No external dependency (avoid bloat for now). Migrate to
 * next-intl later if needed.
 */

import { fr } from "./translations/fr";
import { en } from "./translations/en";
import { es } from "./translations/es";
import { pt } from "./translations/pt";

export const LOCALES = ["fr", "en", "es", "pt"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";

export const LOCALE_LABELS: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  es: "Español",
  pt: "Português",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
  es: "🇪🇸",
  pt: "🇵🇹",
};

export const LOCALE_HREFLANG: Record<Locale, string> = {
  fr: "fr-FR",
  en: "en",
  es: "es-ES",
  pt: "pt-PT",
};

const DICT = { fr, en, es, pt } as const;

export type TranslationKey = keyof typeof fr;

/** Translate a key for a given locale. Falls back to FR if missing. */
export function t(locale: Locale, key: TranslationKey): string {
  return DICT[locale]?.[key] ?? DICT.fr[key] ?? key;
}

/** Translation with placeholders. e.g. tf(locale, "spotsCount", { n: 258 }) */
export function tf(
  locale: Locale,
  key: TranslationKey,
  vars: Record<string, string | number>
): string {
  let str = t(locale, key);
  for (const [k, v] of Object.entries(vars)) {
    str = str.replaceAll(`{${k}}`, String(v));
  }
  return str;
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
