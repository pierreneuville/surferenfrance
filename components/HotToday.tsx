"use client";

import { ArrowRight, Flame, MapPin } from "lucide-react";
import type { Level, SpotForecast } from "@/lib/types";
import { SCORE_COLORS, scoreTone } from "@/lib/score";
import { REGION_EMOJI } from "@/lib/spots";
import { haversineKm } from "@/lib/utils";
import { useLocale } from "@/lib/useLocale";
import { t, tf } from "@/lib/i18n";

interface Props {
  forecasts: SpotForecast[];
  dayIdx: number;
  level: Level;
  userPos?: { lat: number; lon: number } | null;
  onOpen: (slug: string) => void;
}

/**
 * "Ça envoie maintenant" / "Hot today" banner.
 *
 * Goal: surface the most actionable spot, not just the best of the day.
 *   - Day 0 + current hour inside a spot's best window  → "Ça envoie MAINTENANT à X"
 *   - Day 0 + best window in next 3h                   → "X à l'eau dans Yh"
 *   - Otherwise                                        → top spot of the selected day (current behavior)
 *
 * We score actionability:
 *   - hits-now bonus +25
 *   - starts-soon bonus +10
 * so a 72 spot firing now wins over an 80 spot that fires tomorrow morning.
 */
export function HotToday({ forecasts, dayIdx, level, userPos, onOpen }: Props) {
  const { locale } = useLocale();
  if (!forecasts.length) return null;
  const localForecasts = userPos
    ? forecasts.filter((f) => haversineKm(userPos.lat, userPos.lon, f.spot.lat, f.spot.lon) <= 50)
    : forecasts;
  const candidates = level === "advanced"
    ? localForecasts
    : localForecasts.filter((f) => !f.spot.worldClass);
  if (!candidates.length) return null;

  const isToday = dayIdx === 0;
  const currentHour = new Date().getHours();

  // Pick the most actionable candidate
  let top: SpotForecast | null = null;
  let topScore = 0;
  let topActionability = -1;
  let nowMode: "firing" | "soon" | "later" = "later";
  let hoursUntilStart: number | null = null;

  for (const f of candidates) {
    const day = f.days[dayIdx];
    if (!day) continue;
    const score = day.scoresByLevel?.[level] ?? day.score ?? 0;
    const win = day.bestWindowByLevel?.[level];

    // Build an actionability metric weighted by current-time relevance (day 0 only)
    let actionability = score;
    let mode: "firing" | "soon" | "later" = "later";
    let hUntil: number | null = null;

    if (isToday && win) {
      if (currentHour >= win.start && currentHour <= win.end) {
        actionability += 25;
        mode = "firing";
      } else if (win.start > currentHour && win.start - currentHour <= 3) {
        actionability += 15;
        mode = "soon";
        hUntil = win.start - currentHour;
      }
    }

    if (actionability > topActionability) {
      topActionability = actionability;
      topScore = score;
      top = f;
      nowMode = mode;
      hoursUntilStart = hUntil;
    }
  }
  if (!top || topScore < 70) return null;

  const d = top.days[dayIdx];
  const tone = scoreTone(topScore);
  const colors = SCORE_COLORS[tone];
  const bestWin = d.bestWindowByLevel?.[level];

  // Count other spots ≥ 70 for "abundance" feel
  const otherGood = candidates.filter((f) => {
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
            {t(locale, "hotTodayLabel")}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="hidden text-[10px] uppercase tracking-[0.25em] text-coral-300/90 sm:block">
            {nowMode === "firing"
              ? t(locale, "hotFiringNow")
              : nowMode === "soon"
              ? t(locale, "hotStartingSoon")
              : dayIdx === 0
              ? t(locale, "hotTodayLabel")
              : tf(locale, "hotTodayDayLabel", { n: dayIdx })}
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
            {nowMode === "firing" && bestWin ? (
              <span className="font-semibold text-emerald-300">
                ⏱ {t(locale, "hotUntil")} <strong className="text-emerald-200">{String(bestWin.end + 1).padStart(2, "0")}h</strong>
              </span>
            ) : nowMode === "soon" && hoursUntilStart != null ? (
              <span className="font-semibold text-sand-200">
                ⏱ {tf(locale, "hotInHours", { n: hoursUntilStart })}
              </span>
            ) : bestWin ? (
              <span>
                {t(locale, "hotBestWindow")}{" "}
                <strong className="text-sand-200">
                  {String(bestWin.start).padStart(2, "0")}h–{String(bestWin.end + 1).padStart(2, "0")}h
                </strong>
              </span>
            ) : null}
            {otherGood > 0 && (
              <span className="text-white/50">· {tf(locale, "hotMore", { n: otherGood, s: otherGood > 1 ? "s" : "" })}</span>
            )}
          </p>
        </div>

        <button
          onClick={() => onOpen(top!.spot.slug)}
          className="tap-target inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-coral-500 via-sunset-500 to-sand-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-coral-500/30 transition hover:scale-[1.02] active:scale-[0.98]"
        >
          {t(locale, "hotTodayCta")}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
