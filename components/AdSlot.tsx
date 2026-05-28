"use client";

import { useEffect, useRef } from "react";

interface AdSlotProps {
  slot?: string;
  format?: "auto" | "horizontal" | "vertical" | "rectangle";
  className?: string;
  label?: string;
}

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export function AdSlot({ slot, format = "auto", className, label = "Publicité" }: AdSlotProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ADSENSE_CLIENT || !slot) return;
    try {
      // @ts-expect-error AdSense injects this global
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch { /* noop */ }
  }, [slot]);

  if (!ADSENSE_CLIENT || !slot) {
    return (
      <div
        ref={ref}
        className={`flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-xs uppercase tracking-widest text-white/30 ${className ?? ""}`}
        role="complementary"
        aria-label={label}
      >
        {label} · emplacement réservé
      </div>
    );
  }

  return (
    <div className={className} ref={ref}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
