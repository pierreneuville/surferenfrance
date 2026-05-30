"use client";

import { useMemo } from "react";
import { Heart } from "lucide-react";
import type { Level, SpotForecast } from "@/lib/types";
import { SCORE_COLORS, scoreTone } from "@/lib/score";
import { REGION_EMOJI } from "@/lib/spots";
import { useLocale } from "@/lib/useLocale";
import { t } from "@/lib/i18n";

interface Props {
  forecasts: SpotForecast[];
  favoritesSet: Set<string>;
  dayIdx: number;
  level: Level;
  onOpen: (slug: string) => void;
}

/**
 * "Mes spots" — surfacing favorites at the top so users get personal context
 * before discovery content (HotToday / WeekHighlights).
 *
 * Rendered only when the user has favorites; otherwise nothing.
 * Compact horizontal scroller — meant as a quick personal status check,
 * not as the main grid.
 */
export function MySpots({ forecasts, favoritesSet, dayIdx, level, onOpen }: Props) {
  const { locale } = useLocale();

  const myForecasts = useMemo(() => {
    return forecasts
      .filter((f) => favoritesSet.has(f.spot.slug))
      .map((f) => ({
        f,
        score: f.days[dayIdx]?.scoresByLevel?.[level] ?? f.days[dayIdx]?.score ?? 0,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [forecasts, favoritesSet, dayIdx, level]);

  if (myForecasts.length === 0) return null;

  return (
    <section className="mb-6" aria-label="Mes spots favoris">
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="flex items-center gap-2 font-display text-base font-bold uppercase tracking-[0.2em] text-white/55">
          <Heart className="h-3.5 w-3.5 fill-coral-400 text-coral-400" />
          {t(locale, "mySpotsTitle")}
        </h2>
        <span className="text-xs text-white/35">
          {myForecasts.length} {myForecasts.length > 1 ? "spots" : "spot"}
        </span>
      </div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide sm:mx-0 sm:px-0">
        {myForecasts.map(({ f, score }) => {
          const tone = scoreTone(score);
          const colors = SCORE_COLORS[tone];
          const d = f.days[dayIdx];
          return (
            <button
              key={f.spot.slug}
              onClick={() => onOpen(f.spot.slug)}
              aria-label={`Voir ${f.spot.name}, score ${score} sur 100`}
              className="group flex shrink-0 items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5 text-left transition hover:border-white/15 hover:bg-white/[0.05]"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl font-display text-lg font-black"
                style={{ background: `${colors.hex}25`, color: colors.hex }}
              >
                {score}
              </span>
              <span className="flex flex-col">
                <span className="font-display text-sm font-bold text-white">
                  {f.spot.shortName}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-white/40">
                  {REGION_EMOJI[f.spot.region] ?? ""} {d?.waveHeight ? `${d.waveHeight.toFixed(1)}m` : ""}
                  {d?.windSpeed != null ? ` · ${d.windSpeed.toFixed(0)}km/h` : ""}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
