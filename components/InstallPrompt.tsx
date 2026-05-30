"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { useLocale } from "@/lib/useLocale";
import { t } from "@/lib/i18n";
import { getEngagement, subscribeEngagement } from "@/lib/engagement";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const STORAGE_KEY = "yosurf-install-prompt-v1";
const DELAY_MS = 30_000;          // 30s engagement delay
const MIN_SPOT_OPENS = 3;         // OR after exploring 3 distinct spots — proves real interest

/**
 * PWA install prompt — appears either after 30s of engagement OR after the user opened
 * 3 distinct spots, whichever comes first. Engagement-based triggers convert better than
 * pure time-based ones because they catch the "moment of intent".
 * Once dismissed, never bothers again.
 */
export function InstallPrompt() {
  const { locale } = useLocale();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch { return; }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      // Time-based trigger
      const timer = setTimeout(() => setVisible(true), DELAY_MS);
      // Engagement-based trigger: surface as soon as 3 spots were explored
      const checkExploration = () => {
        if (getEngagement().exploredSlugs.length >= MIN_SPOT_OPENS) {
          setVisible(true);
        }
      };
      checkExploration();
      const unsub = subscribeEngagement(checkExploration);
      return () => { clearTimeout(timer); unsub(); };
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Detect if user already installed
    const installed = (window.matchMedia("(display-mode: standalone)")?.matches) ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (installed) {
      try { localStorage.setItem(STORAGE_KEY, "installed"); } catch {}
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function install() {
    if (!deferred) return;
    try {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      try { localStorage.setItem(STORAGE_KEY, outcome); } catch {}
    } catch { /* ignored */ }
    setVisible(false);
    setDeferred(null);
  }

  function dismiss() {
    try { localStorage.setItem(STORAGE_KEY, "dismissed"); } catch {}
    setVisible(false);
  }

  if (!visible || !deferred) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[55] flex justify-center px-3">
      <div className="pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl border border-white/10 bg-depth-950/95 px-4 py-3 shadow-2xl backdrop-blur-xl">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-coral-500 via-sunset-500 to-sand-400">
          <Download className="h-4 w-4 text-white" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white">{t(locale, "installTitle")}</div>
          <div className="text-xs text-white/55">{t(locale, "installDescription")}</div>
        </div>
        <button
          onClick={install}
          className="tap-target rounded-full bg-gradient-to-r from-coral-500 via-sunset-500 to-sand-400 px-3.5 py-1.5 text-xs font-semibold text-white"
        >
          {t(locale, "installCta")}
        </button>
        <button onClick={dismiss} aria-label={t(locale, "onboardingLater")} className="grid h-7 w-7 place-items-center rounded-full text-white/40 hover:bg-white/10">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
