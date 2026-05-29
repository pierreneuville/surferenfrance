"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Floating "back to top" button — appears after scrolling 600px down.
 * Mobile-only by design (md:hidden) — on desktop a quick scroll is fast enough.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Retour en haut"
      className="tap-target fixed bottom-5 right-4 z-30 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-depth-950/90 text-white shadow-2xl backdrop-blur-xl transition hover:scale-105 hover:border-coral-400/40 md:hidden"
      style={{ bottom: "max(1.25rem, calc(1.25rem + env(safe-area-inset-bottom)))" }}
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
