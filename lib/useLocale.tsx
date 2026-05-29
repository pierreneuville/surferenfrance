"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from "./i18n";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
});

const STORAGE_KEY = "yosurf-locale";

/** Provider that reads the locale from URL ?lang= or localStorage, with browser-language fallback. */
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    let detected: Locale = DEFAULT_LOCALE;
    try {
      // 1. ?lang query param wins
      const params = new URLSearchParams(window.location.search);
      const fromUrl = params.get("lang");
      if (fromUrl && isLocale(fromUrl)) {
        detected = fromUrl;
      } else {
        // 2. localStorage
        const fromStorage = localStorage.getItem(STORAGE_KEY);
        if (fromStorage && isLocale(fromStorage)) {
          detected = fromStorage;
        } else {
          // 3. browser language
          const browser = navigator.language.slice(0, 2).toLowerCase();
          if (isLocale(browser)) detected = browser;
        }
      }
    } catch { /* SSR or restricted env */ }
    setLocaleState(detected);
    // Reflect to html lang attribute for accessibility & SEO
    if (typeof document !== "undefined") document.documentElement.lang = detected;
  }, []);

  function setLocale(next: Locale) {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
      // Set a cookie so Server Components can pick the right language on next nav
      document.cookie = `yosurf-locale=${next}; path=/; max-age=31536000; SameSite=Lax`;
      if (typeof document !== "undefined") document.documentElement.lang = next;
      // Reflect in URL without full reload so deep links survive
      const url = new URL(window.location.href);
      url.searchParams.set("lang", next);
      window.history.replaceState({}, "", url.toString());
    } catch { /* ignored */ }
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}

export { LOCALES };
