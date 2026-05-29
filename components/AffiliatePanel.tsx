"use client";

import { ExternalLink, Home, MapPin, ShoppingBag, Waves } from "lucide-react";
import type { Spot } from "@/lib/types";
import { affiliatesFor } from "@/lib/affiliates";
import { trackEvent } from "@/lib/analytics";

interface Props {
  spot: Spot;
}

/**
 * Affiliate panel — shown in the spot page aside. Revenue path beyond ads.
 * Displays 1-3 relevant booking/affiliate slots per region.
 */
export function AffiliatePanel({ spot }: Props) {
  const aff = affiliatesFor(spot);
  const items: Array<{ kind: keyof typeof aff; icon: React.ReactNode }> = [
    { kind: "surfCamp", icon: <Waves className="h-3.5 w-3.5" /> },
    { kind: "hotel", icon: <Home className="h-3.5 w-3.5" /> },
    { kind: "surfSchool", icon: <MapPin className="h-3.5 w-3.5" /> },
    { kind: "boardShop", icon: <ShoppingBag className="h-3.5 w-3.5" /> },
  ];
  const present = items.filter(({ kind }) => aff[kind]);
  if (present.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
      <h2 className="mb-3 text-xs uppercase tracking-widest text-white/45">Bons plans</h2>
      <div className="space-y-2">
        {present.map(({ kind, icon }) => {
          const link = aff[kind]!;
          return (
            <a
              key={kind}
              href={link.url}
              target="_blank"
              rel="noopener sponsored"
              onClick={() => trackEvent("affiliate_click", { slug: spot.slug, kind })}
              className="group flex items-start gap-2.5 rounded-xl border border-white/[0.05] bg-white/[0.03] px-3 py-2.5 transition hover:border-coral-400/40 hover:bg-white/[0.05]"
            >
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-coral-500 to-sunset-500 text-white">
                {icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-white">{link.label}</div>
                <div className="text-[11px] text-white/55">{link.description}</div>
                <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-coral-300">
                  {link.cta}
                  <ExternalLink className="h-3 w-3" />
                </div>
              </div>
            </a>
          );
        })}
      </div>
      <p className="mt-3 text-[10px] text-white/30">
        Liens partenaires — la réservation se fait sur le site marchand.
      </p>
    </div>
  );
}
