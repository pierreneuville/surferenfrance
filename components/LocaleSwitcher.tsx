"use client";

import { useState } from "react";
import { Check, Globe } from "lucide-react";
import { useLocale, LOCALES } from "@/lib/useLocale";
import { LOCALE_LABELS, LOCALE_FLAGS } from "@/lib/i18n";

/** Compact locale switcher — flag-only chip that opens a dropdown. */
export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="tap-target inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/5 px-2.5 py-1.5 text-xs transition hover:bg-white/10"
        aria-label="Change language"
        aria-expanded={open}
      >
        <span className="text-sm leading-none">{LOCALE_FLAGS[locale]}</span>
        <Globe className="h-3 w-3 text-white/40" />
      </button>
      {open && (
        <>
          <button
            className="fixed inset-0 z-30 cursor-default"
            onClick={() => setOpen(false)}
            aria-label="Close language menu"
            tabIndex={-1}
          />
          <div className="absolute right-0 top-full z-40 mt-2 w-44 overflow-hidden rounded-xl border border-white/10 bg-depth-950/95 shadow-2xl backdrop-blur-xl">
            {LOCALES.map((l) => (
              <button
                key={l}
                onClick={() => { setLocale(l); setOpen(false); }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition hover:bg-white/5 ${
                  locale === l ? "text-sand-200" : "text-white/80"
                }`}
              >
                <span className="text-base">{LOCALE_FLAGS[l]}</span>
                <span className="flex-1 text-left">{LOCALE_LABELS[l]}</span>
                {locale === l && <Check className="h-3.5 w-3.5 text-sand-200" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
