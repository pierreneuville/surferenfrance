"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "surf-cookie-consent-v1";

export function CookieBanner() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setShown(true);
    } catch { /* ignored: localStorage unavailable */ }
  }, []);

  const choose = (value: "all" | "essential") => {
    try { localStorage.setItem(STORAGE_KEY, value); } catch {}
    setShown(false);
    if (value === "all") {
      // hook for analytics/AdSense activation goes here
    }
  };

  if (!shown) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-white/10 bg-depth-900/95 p-4 shadow-2xl backdrop-blur-lg sm:flex-row sm:items-center">
        <Cookie className="hidden h-6 w-6 shrink-0 text-sand-300 sm:block" />
        <div className="flex-1 text-sm text-white/80">
          On utilise des cookies pour mesurer l'audience et afficher de la publicité personnalisée.
          {" "}
          <Link href="/politique-confidentialite" className="underline hover:text-ocean-300">
            En savoir plus
          </Link>
          .
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => choose("essential")}
            className="rounded-full border border-white/15 px-4 py-2 text-sm hover:bg-white/5"
          >
            Refuser
          </button>
          <button
            onClick={() => choose("all")}
            className="rounded-full bg-gradient-to-r from-ocean-400 to-ocean-600 px-4 py-2 text-sm font-medium text-white"
          >
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  );
}
