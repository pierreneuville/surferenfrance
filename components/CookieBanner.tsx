"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { ADSENSE_CLIENT } from "@/lib/adsense";
import { useLocale } from "@/lib/useLocale";
import { t } from "@/lib/i18n";

const STORAGE_KEY = "surf-cookie-consent-v1";

export function CookieBanner() {
  // Once AdSense is set up, Funding Choices CMP supersedes this local banner.
  return ADSENSE_CLIENT ? null : <LocalCookieBanner />;
}

function LocalCookieBanner() {
  const { locale } = useLocale();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setShown(true);
    } catch { /* localStorage unavailable */ }
  }, []);

  const choose = (value: "all" | "essential") => {
    try { localStorage.setItem(STORAGE_KEY, value); } catch {}
    setShown(false);
  };

  if (!shown) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-2 pb-2 sm:px-4 sm:pb-4">
      {/* Mobile: slim single-line bar. Desktop: roomier card. */}
      <div className="mx-auto flex max-w-3xl items-center gap-2 rounded-full border border-white/10 bg-depth-900/95 px-3 py-2 shadow-2xl backdrop-blur-lg sm:rounded-2xl sm:px-4 sm:py-3">
        <Cookie className="h-4 w-4 shrink-0 text-sand-300" />
        <div className="flex-1 truncate text-[12px] text-white/75 sm:whitespace-normal sm:text-sm">
          <span className="hidden sm:inline">{t(locale, "cookieTextLong")} </span>
          <span className="sm:hidden">{t(locale, "cookieTextShort")} </span>
          <Link href="/politique-confidentialite" className="underline hover:text-sand-200">
            {t(locale, "cookieMore")}
          </Link>
        </div>
        <button
          onClick={() => choose("essential")}
          className="rounded-full px-2.5 py-1 text-xs text-white/60 hover:bg-white/5 hover:text-white sm:px-3 sm:text-sm"
          aria-label={t(locale, "cookieRefuse")}
        >
          <span className="hidden sm:inline">{t(locale, "cookieRefuse")}</span>
          <X className="h-4 w-4 sm:hidden" />
        </button>
        <button
          onClick={() => choose("all")}
          className="rounded-full bg-gradient-to-r from-coral-500 to-sunset-500 px-3 py-1 text-xs font-semibold text-white sm:px-4 sm:py-1.5 sm:text-sm"
        >
          {t(locale, "cookieAccept")}
        </button>
      </div>
    </div>
  );
}
