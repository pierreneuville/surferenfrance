"use client";

import { ArrowRight, Flame, MapPin } from "lucide-react";
import type { Level, SpotForecast } from "@/lib/types";
import { SCORE_COLORS, scoreTone } from "@/lib/score";
import { REGION_EMOJI } from "@/lib/spots";

interface Props {
  forecasts: SpotForecast[];
  dayIdx: number;
  level: Level;
  onOpen: (slug: string) => void;
}

/**
 * Variable-reward "Hot today" banner.
 * Surfaces the best spot of the selected day if its score >= 75.
 * Different each day → reason to return; surfeurs scrollent et "découvrent" leur prochaine session.
 */
export function HotToday({ forecasts, dayIdx, level, onOpen }: Props) {
  if (!forecasts.length) return null;

  // Find the top scorer for the selected day
  let top: SpotForecast | null = null;
  let topScore = 0;
  for (const f of forecasts) {
    const s = f.days[dayIdx]?.scoresByLevel?.[level] ?? f.days[dayIdx]?.score ?? 0;
    if (s > topScore) {
      topScore = s;
      top = f;
    }
  }
  if (!top || topScore < 75) return null;

  const d = top.days[dayIdx];
  const tone = scoreTone(topScore);
  const colors = SCORE_COLORS[tone];
  const bestWin = d.bestWindowByLevel?.[level];

  // Count other spots ≥ 70 for "abundance" feel
  const otherGood = forecasts.filter((f) => {
    const s = f.days[dayIdx]?.scoresByLevel?.[level] ?? f.days[dayIdx]?.score ?? 0;
    return s >= 70 && f.spot.slug !== top!.spot.slug;
  }).length;

  return (
    <div className="relative mb-6 overflow-hidden rounded-3xl border border-coral-500/30 bg-gradient-to-br from-coral-500/15 via-sunset-500/8 to-sand-300/5 p-5 sm:p-6">
      {/* glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-coral-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 left-1/3 h-32 w-32 rounded-full bg-sand-300/20 blur-3xl" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3 sm:flex-col sm:items-start">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-coral-500 via-sunset-500 to-sand-400 shadow-lg shadow-coral-500/40">
            <Flame className="h-5 w-5 text-white" />
          </span>
          <div className="text-[10px] uppercase tracking-[0.25em] text-coral-300/90 sm:hidden">
            Hot today
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="hidden text-[10px] uppercase tracking-[0.25em] text-coral-300/90 sm:block">
            🔥 Hot today {dayIdx === 0 ? "" : `· J+${dayIdx}`}
          </div>
          <h3 className="mt-1 font-display text-2xl font-bold leading-tight">
            <span className="text-gradient-sunset">{top.spot.shortName}</span>
            <span className="ml-2 text-white/30">·</span>
            <span className="ml-2 font-extrabold" style={{ color: colors.hex }}>{topScore}/100</span>
          </h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/65">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {REGION_EMOJI[top.spot.region]} {top.spot.region}
            </span>
            {bestWin && (
              <span>
                ⭐ Meilleur créneau{" "}
                <strong className="text-sand-200">
                  {String(bestWin.start).padStart(2, "0")}h–{String(bestWin.end + 1).padStart(2, "0")}h
                </strong>
              </span>
            )}
            {otherGood > 0 && (
              <span className="text-white/50">
                · et {otherGood} autre{otherGood > 1 ? "s" : ""} spot{otherGood > 1 ? "s" : ""} ≥ 70
              </span>
            )}
          </p>
        </div>

        <button
          onClick={() => onOpen(top!.spot.slug)}
          className="tap-target inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-coral-500 via-sunset-500 to-sand-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-coral-500/30 transition hover:scale-[1.02] active:scale-[0.98]"
        >
          Voir
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
