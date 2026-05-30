"use client";

import { useMemo } from "react";
import { ArrowRight, CalendarDays, Wind, Waves } from "lucide-react";
import type { Level, SpotForecast } from "@/lib/types";
import { SCORE_COLORS, scoreTone } from "@/lib/score";
import { REGION_EMOJI } from "@/lib/spots";
import { dayShortLabel, dayDateNumber, fmt, haversineKm } from "@/lib/utils";
import { useLocale } from "@/lib/useLocale";
import { t, tf } from "@/lib/i18n";

interface Props {
  forecasts: SpotForecast[];
  level: Level;
  userPos?: { lat: number; lon: number } | null;
  onOpen: (slug: string, dayIdx: number) => void;
}

/**
 * "Cette semaine en mer" — top 5 best spot-day combos in the next 7 days.
 *
 * Psychology:
 * - Anticipation : montre la houle qui arrive → "save the date" mentality
 * - Planning value : surfeurs reviennent pour vérifier l'évolution
 * - Curiosity : "C'est quoi cette session de samedi à La Torche ?"
 * - Variable reward : le contenu change chaque jour à mesure que le futur arrive
 */
export function WeekHighlights({ forecasts, level, userPos, onOpen }: Props) {
  const { locale } = useLocale();
  const sessions = useMemo(() => {
    if (!forecasts.length) return [];
    type Session = { spot: SpotForecast["spot"]; dayIdx: number; score: number; forecast: SpotForecast };
    const candidates: Session[] = [];
    const localForecasts = userPos
      ? forecasts.filter((f) => haversineKm(userPos.lat, userPos.lon, f.spot.lat, f.spot.lon) <= 120)
      : forecasts;
    for (const f of localForecasts) {
      if (level !== "advanced" && f.spot.worldClass) continue;
      let bestDay = 0;
      let bestScore = 0;
      for (let d = 0; d < 7; d++) {
        const s = f.days[d]?.scoresByLevel?.[level] ?? f.days[d]?.score ?? 0;
        if (s > bestScore) {
          bestScore = s;
          bestDay = d;
        }
      }
      if (bestScore >= 65) {
        candidates.push({ spot: f.spot, dayIdx: bestDay, score: bestScore, forecast: f });
      }
    }
    // Top 5 by score, but display chronologically
    return candidates
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .sort((a, b) => a.dayIdx - b.dayIdx);
  }, [forecasts, level, userPos]);

  if (sessions.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="mb-3 flex items-center gap-2 px-1">
        <CalendarDays className="h-4 w-4 text-ocean-300" />
        <h2 className="font-display text-base font-bold tracking-tight">
          <span className="text-gradient-ocean">{t(locale, "weekTitleA")}</span>
          <span className="ml-2 font-script text-lg text-sand-200/70">{t(locale, "weekTitleB")}</span>
        </h2>
        <span className="ml-auto hidden text-[10px] uppercase tracking-widest text-white/35 sm:inline">
          {tf(locale, "weekUpcoming", { n: sessions.length })}
        </span>
      </div>

      <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="scrollbar-hide flex snap-x snap-proximity scroll-px-4 gap-3 overflow-x-auto pb-2">
        {sessions.map((s) => {
          const day = s.forecast.days[s.dayIdx];
          const t = scoreTone(s.score);
          const color = SCORE_COLORS[t].hex;
          const isToday = s.dayIdx === 0;
          return (
            <button
              key={`${s.spot.slug}-${s.dayIdx}`}
              onClick={() => onOpen(s.spot.slug, s.dayIdx)}
              className="group flex w-[220px] shrink-0 snap-start flex-col gap-2 overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-ocean-950/30 via-depth-950 to-depth-950 p-3 text-left transition hover:border-ocean-400/40 hover:-translate-y-0.5 active:scale-[0.98] sm:w-[240px]"
            >
              {/* day chip */}
              <div className="flex items-center justify-between">
                <div
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-widest ${
                    isToday
                      ? "border-coral-400/40 bg-coral-500/15 text-coral-200"
                      : "border-white/15 bg-white/5 text-white/65"
                  }`}
                >
                  <span>{dayShortLabel(s.dayIdx)}</span>
                  <span className="font-display text-xs font-bold">{dayDateNumber(s.dayIdx)}</span>
                </div>
                <div
                  className="font-display text-xl font-extrabold leading-none"
                  style={{ color, filter: `drop-shadow(0 0 8px ${color}55)` }}
                >
                  {s.score}
                </div>
              </div>

              {/* spot name */}
              <div>
                <div className="font-display text-base font-bold leading-tight">
                  {s.spot.shortName}
                </div>
                <div className="text-[10px] text-white/45">
                  {REGION_EMOJI[s.spot.region]} {s.spot.region}
                </div>
              </div>

              {/* conditions teaser */}
              <div className="mt-auto flex items-center justify-between gap-2 border-t border-white/[0.06] pt-2 text-[11px] text-white/65">
                <span className="inline-flex items-center gap-1">
                  <Waves className="h-3 w-3" /> {fmt(day?.waveHeight)} m
                </span>
                <span className="inline-flex items-center gap-1">
                  <Wind className="h-3 w-3" /> {fmt(day?.windSpeed, 0)} km/h
                </span>
                <ArrowRight className="h-3 w-3 text-white/30 transition group-hover:text-sand-200 group-hover:translate-x-0.5" />
              </div>
            </button>
          );
        })}
      </div>
      {/* fade-out affordance */}
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-10 bg-gradient-to-l from-depth-950 to-transparent" />
      </div>
    </section>
  );
}
