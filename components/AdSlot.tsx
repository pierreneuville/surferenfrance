"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT } from "@/lib/adsense";

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

interface AdSlotProps {
  slot?: string;
  format?: "auto" | "horizontal" | "vertical" | "rectangle";
  className?: string;
  label?: string;
}

export function AdSlot({ slot, format = "auto", className, label = "Publicité" }: AdSlotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const pushedSlotRef = useRef<string | null>(null);
  const isConfigured = Boolean(ADSENSE_CLIENT && slot);

  useEffect(() => {
    if (!isConfigured || !slot || pushedSlotRef.current === slot) return;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      pushedSlotRef.current = slot;
    } catch {
      pushedSlotRef.current = null;
    }
  }, [isConfigured, slot]);

  if (!isConfigured) {
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
