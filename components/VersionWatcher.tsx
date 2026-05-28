"use client";

import { useEffect, useState } from "react";
import { RefreshCw, X } from "lucide-react";

const CURRENT = process.env.NEXT_PUBLIC_BUILD_ID;
const CHECK_INTERVAL_MS = 60_000;

export function VersionWatcher() {
  const [staleVersion, setStaleVersion] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!CURRENT) return;
    let active = true;

    const check = async () => {
      if (document.hidden) return;
      try {
        const r = await fetch("/api/version", { cache: "no-store" });
        if (!r.ok) return;
        const { buildId } = (await r.json()) as { buildId?: string };
        if (!active || !buildId) return;
        if (buildId !== CURRENT) setStaleVersion(buildId);
      } catch {
        // network down — ignore, try again next tick
      }
    };

    check();
    const interval = setInterval(check, CHECK_INTERVAL_MS);

    const onVisible = () => { if (!document.hidden) check(); };
    document.addEventListener("visibilitychange", onVisible);

    // bfcache: page restored from back/forward → re-check immediately
    const onPageShow = (e: PageTransitionEvent) => { if (e.persisted) check(); };
    window.addEventListener("pageshow", onPageShow);

    return () => {
      active = false;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  if (!staleVersion || dismissed) return null;

  return (
    <div
      role="status"
      className="fixed left-1/2 top-20 z-[60] flex max-w-[92vw] -translate-x-1/2 items-center gap-3 rounded-full border border-ocean-400/40 bg-depth-900/95 px-4 py-2 text-sm shadow-2xl shadow-ocean-500/20 backdrop-blur-lg"
    >
      <RefreshCw className="h-4 w-4 shrink-0 text-ocean-300" />
      <span className="text-white/90">Nouvelle version disponible</span>
      <button
        onClick={() => window.location.reload()}
        className="rounded-full bg-gradient-to-r from-ocean-400 to-ocean-600 px-3 py-1 text-xs font-medium text-white transition hover:scale-[1.02]"
      >
        Rafraîchir
      </button>
      <button
        onClick={() => setDismissed(true)}
        className="rounded-full p-1 text-white/40 transition hover:bg-white/10 hover:text-white"
        aria-label="Fermer"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
