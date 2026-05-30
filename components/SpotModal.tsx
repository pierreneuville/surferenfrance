"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  X, Sunrise, Sunset, Waves, Wind, Thermometer, ExternalLink, Sparkles, Share2, Check, MapPin, Zap, Radio,
} from "lucide-react";
import { BuoyMiniPanel } from "./BuoyMiniPanel";
import type { SpotForecast, Level } from "@/lib/types";
import { bestHoursForDay } from "@/lib/api";
import { fetchSpotForecastFromApi } from "@/lib/clientApi";
import { SCORE_COLORS, computeScore, scoreLabel, scoreTone } from "@/lib/score";
import { useLocale } from "@/lib/useLocale";
import { t, tf } from "@/lib/i18n";
import { degToCardinal, fmt, dayLongLabel, timeFromIso, dayShortLabel, dayDateNumber } from "@/lib/utils";
import { tideStateAt, tideStateLabel } from "@/lib/tide";
import { HourGrid } from "./HourGrid";

const REGION_GRADIENT: Record<string, string> = {
  "Manche & Nord": "from-slate-400 via-ocean-500 to-ocean-800",
  "Bretagne": "from-teal-500 via-ocean-600 to-ocean-900",
  "Atlantique Nord": "from-ocean-300 via-lagoon-500 to-ocean-800",
  "Aquitaine": "from-sand-200 via-sand-500 to-sunset-600",
  "Pays Basque": "from-coral-400 via-sunset-500 to-sand-300",
  "Méditerranée": "from-lagoon-300 via-lagoon-500 to-ocean-700",
  "Corse": "from-emerald-400 via-lagoon-500 to-sand-400",
  "Outre-Mer": "from-emerald-300 via-coral-500 to-sunset-700",
};

interface Props {
  forecast: SpotForecast;
  dayIdx: number;
  level: Level;
  onClose: () => void;
}

export function SpotModal({ forecast: lightForecast, dayIdx: initialDay, level, onClose }: Props) {
  const { locale } = useLocale();
  const [forecast, setForecast] = useState<SpotForecast>(lightForecast);
  const [hourlyLoading, setHourlyLoading] = useState(true);
  const [dayIdx, setDayIdx] = useState(initialDay);
  const [shared, setShared] = useState(false);
  // Swipe-to-change-day on mobile. Only fire when horizontal delta dominates vertical (avoid
  // hijacking vertical scrolls inside the modal body).
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  function onTouchStart(e: React.TouchEvent) {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX == null || touchStartY == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    // Require horizontal dominance (1.5x) AND a minimum amplitude
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0 && dayIdx < 6) setDayIdx(dayIdx + 1);
      else if (dx > 0 && dayIdx > 0) setDayIdx(dayIdx - 1);
    }
    setTouchStartX(null);
    setTouchStartY(null);
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    setHourlyLoading(true);
    fetchSpotForecastFromApi(lightForecast.spot.slug)
      .then((full) => {
        if (cancelled) return;
        // Preserve the scoresByLevel/bestWindowByLevel from the home payload so the
        // modal shows EXACTLY the same numbers the user saw on the card. Without this,
        // a fresher Open-Meteo refresh (cache miss between the two endpoints) would
        // produce slightly different scores and confuse the user.
        const merged: SpotForecast = {
          ...full,
          days: full.days.map((day, i) => {
            const lightDay = lightForecast.days[i];
            if (!lightDay) return day;
            return {
              ...day,
              // Carry over precomputed level-specific values from the home payload
              scoresByLevel: lightDay.scoresByLevel ?? day.scoresByLevel,
              bestWindowByLevel: lightDay.bestWindowByLevel ?? day.bestWindowByLevel,
              // Fallback intermediate score should also match
              score: lightDay.scoresByLevel?.intermediate ?? lightDay.score ?? day.score,
            };
          }),
        };
        setForecast(merged);
        setHourlyLoading(false);
      })
      .catch(() => { if (!cancelled) setHourlyLoading(false); });
    return () => { cancelled = true; };
  }, [lightForecast.spot.slug]);

  const d = forecast.days[dayIdx];
  // Score for the user's selected level. Priority:
  //   1. server-precomputed scoresByLevel[level] (from /api/forecasts)
  //   2. recompute client-side from raw daily values (when full-spot fetch overrode it)
  //   3. fallback to .score (intermediate)
  const score =
    d.scoresByLevel?.[level]
    ?? (d.waveHeight != null
      ? computeScore(d.waveHeight, d.wavePeriod, d.windSpeed, d.windDir, forecast.spot.offshore, level, { worldClass: forecast.spot.worldClass })
      : d.score);
  const tone = scoreTone(score);
  const colors = SCORE_COLORS[tone];
  const hasHourly = forecast.hourly.times.length > 0;
  const best = hasHourly ? bestHoursForDay(forecast, dayIdx, level) : null;
  const fallbackBest = d.bestWindowByLevel?.[level];
  const gradient = REGION_GRADIENT[forecast.spot.region] ?? "from-ocean-500 to-ocean-900";

  const startH = dayIdx * 24;
  const seaSlice = forecast.hourly.seaTemp.slice(startH, startH + 24).filter((t) => t != null) as number[];
  const airSlice = forecast.hourly.airTemp.slice(startH, startH + 24).filter((t) => t != null) as number[];
  const seaTempAvg = seaSlice.length ? seaSlice.reduce((a, b) => a + b, 0) / seaSlice.length : null;
  const airTempMax = airSlice.length ? Math.max(...airSlice) : null;

  async function handleShare() {
    const url = `${window.location.origin}/spot/${forecast.spot.slug}`;
    const text = score >= 75
      ? `🌊 ${forecast.spot.shortName} : ${score}/100 aujourd'hui. Tu viens ?`
      : `${forecast.spot.shortName} — ${score}/100 sur Yosurf, la carte des vagues.`;
    try {
      if (typeof navigator !== "undefined" && (navigator as Navigator & { share?: unknown }).share) {
        await (navigator as Navigator & { share: (data: ShareData) => Promise<void> }).share({
          title: `${forecast.spot.name} · Yosurf`, text, url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch { /* user cancelled */ }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-depth-950 shadow-2xl sm:max-h-[92vh] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* === HERO === */}
        <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} px-5 pb-20 pt-3 sm:px-6 sm:pb-20 sm:pt-5`}>
          {/* Decorative wave SVG — smaller, lower opacity, pushed down so it stays a thin lip at the bottom */}
          <svg
            className="pointer-events-none absolute -bottom-1 left-0 right-0 z-0 h-4 w-full text-depth-950 sm:h-5"
            viewBox="0 0 1200 60"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path d="M0 45 Q 200 25 400 45 T 800 45 T 1200 45 V60 H0 Z" fill="currentColor" opacity="0.3" />
            <path d="M0 52 Q 200 38 400 52 T 800 52 T 1200 52 V60 H0 Z" fill="currentColor" />
          </svg>

          {/* Mobile grabber */}
          <div className="relative z-10 mx-auto mb-3 h-1 w-12 rounded-full bg-white/30 sm:hidden" />

          {/* Close button — sits inside the modal hero; max-h-[88dvh] keeps the modal top under the notch already. */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60 sm:right-4 sm:top-4"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Region + department — padded right to clear the X button */}
          <div className="relative z-10 flex items-center gap-1.5 pr-14 text-[10px] uppercase tracking-[0.18em] text-white/90 sm:pr-16">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{forecast.spot.region} · {forecast.spot.department}</span>
          </div>

          {/* Spot name + score chip */}
          <div className="relative z-10 mt-3 flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-2xl font-bold leading-[1.05] text-white drop-shadow-md sm:text-3xl">
                {forecast.spot.shortName}
              </h2>
              <p className="mt-1 font-script text-base text-white/90 sm:text-lg">
                {forecast.spot.type}
              </p>
            </div>
            {/* Score chip — opaque + visible border to stand out from any background */}
            <div className="shrink-0 rounded-2xl border border-white/25 bg-depth-950/85 px-3.5 py-2 text-center shadow-lg shadow-black/30 backdrop-blur">
              <div className="font-display text-3xl font-extrabold leading-none text-white drop-shadow sm:text-4xl">
                {score}
              </div>
              <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-widest text-white/85">
                {scoreLabel(score)}
              </div>
              {/* Level reminder — score is calibrated for the user's level */}
              <div className="mt-1.5 flex items-center justify-center gap-1 border-t border-white/15 pt-1 text-[9px] text-white/65">
                <span>{level === "beginner" ? "🌱" : level === "intermediate" ? "🤙" : "🔥"}</span>
                <span className="font-medium">{t(locale, level === "beginner" ? "filterLevelBeginner" : level === "intermediate" ? "filterLevelIntermediate" : "filterLevelAdvanced")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* === DAY PICKER === Moved INSIDE the scrollable body with sticky top, so it stays in view as the user scrolls hourly + tide + buoy. */}
        <div className="flex-1 overflow-y-auto">
          <div className="sticky top-0 z-10 border-b border-white/[0.06] bg-depth-950/95 px-4 py-3 backdrop-blur-md sm:px-6">
            <div className="scrollbar-hide flex gap-2 overflow-x-auto py-0.5">
              {forecast.days.map((day, i) => {
              const ds =
                day.scoresByLevel?.[level]
                ?? (day.waveHeight != null
                  ? computeScore(day.waveHeight, day.wavePeriod, day.windSpeed, day.windDir, forecast.spot.offshore, level, { worldClass: forecast.spot.worldClass })
                  : day.score);
              const isActive = i === dayIdx;
              const t = scoreTone(ds);
              return (
                <button
                  key={i}
                  onClick={() => setDayIdx(i)}
                  className={`tap-target flex shrink-0 flex-col items-center gap-0.5 rounded-2xl border px-3 py-1.5 transition-all active:scale-95 ${
                    isActive
                      ? "border-white/40 bg-white/[0.08]"
                      : "border-white/[0.06] bg-white/[0.02] hover:border-white/15"
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-widest text-white/45">
                    {dayShortLabel(i)}
                  </span>
                  <span className="font-display text-base font-bold text-white">
                    {dayDateNumber(i)}
                  </span>
                  <span className="text-[10px] font-bold" style={{ color: SCORE_COLORS[t].hex }}>{ds}</span>
                </button>
              );
            })}
            </div>
          </div>

          {/* === BODY CONTENT === */}
          <div className="px-4 py-5 sm:px-6">
          {/* Sun / day info */}
          <div className="mb-4 flex items-center justify-between gap-3 text-sm">
            <p className="font-script text-lg text-sand-200/90">{dayLongLabel(dayIdx)}</p>
            <div className="flex items-center gap-2.5 text-xs text-white/55">
              <span className="flex items-center gap-1"><Sunrise className="h-3.5 w-3.5 text-sand-300" /> {timeFromIso(d.sunrise)}</span>
              <span className="flex items-center gap-1"><Sunset className="h-3.5 w-3.5 text-coral-400" /> {timeFromIso(d.sunset)}</span>
            </div>
          </div>

          {/* Best window FIRST — "quand vais-je à l'eau ?" is the question that matters most */}
          {(best?.best || fallbackBest) && (
            <div className="mb-5 overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent p-4">
              <div className="mb-2 flex items-center justify-between gap-2 text-xs uppercase tracking-widest text-emerald-300/90">
                <span className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  {t(locale, "modalBestWindowTitle")}
                </span>
                {(() => {
                  const tideHeights = forecast.hourly.tideHeight ?? [];
                  const startHr = (best?.best?.start ?? fallbackBest?.start ?? null);
                  if (startHr == null || tideHeights.length === 0) return null;
                  const i = dayIdx * 24 + startHr;
                  const state = tideStateAt(tideHeights, i);
                  return (
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] tracking-normal text-emerald-100">
                      sur {tideStateLabel(state)}
                    </span>
                  );
                })()}
              </div>
              {best?.top?.length ? (
                <div className="flex flex-wrap gap-2">
                  {best.top.map((h) => {
                    const i = startH + h.hour;
                    return (
                      <div key={h.hour} className="flex items-center gap-2 rounded-xl bg-emerald-500/15 px-3 py-2 text-sm">
                        <strong className="font-display text-lg text-emerald-200">{String(h.hour).padStart(2, "0")}h</strong>
                        <span className="text-white/70">
                          {fmt(forecast.hourly.waveHeight[i])}m · {fmt(forecast.hourly.windSpeed[i], 0)} km/h
                        </span>
                        <span className="ml-auto rounded-full bg-emerald-500/25 px-2 text-[10px] font-semibold text-emerald-100">
                          {h.score}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : fallbackBest && (
                <div className="text-white/80">
                  <strong className="font-display text-2xl text-emerald-200">
                    {String(fallbackBest.start).padStart(2, "0")}h <span className="text-emerald-400/60">→</span> {String(fallbackBest.end + 1).padStart(2, "0")}h
                  </strong>
                  <span className="ml-2 text-sm text-white/55">{tf(locale, "modalScoreAverage", { n: fallbackBest.avg })}</span>
                </div>
              )}
            </div>
          )}

          {/* Quick stats — second: "à quoi ressemble la session ?" */}
          <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
            <Tile
              icon={<Waves />}
              label={t(locale, "cardWave")}
              value={`${fmt(d.waveHeight)} m`}
              sub={d.effectiveWaveHeight != null && d.effectiveWaveHeight > (d.waveHeight ?? 0) + 0.1
                ? `sets ~${fmt(d.effectiveWaveHeight)} m · ${fmt(d.wavePeriod, 0)}s`
                : `${degToCardinal(d.waveDir)} · ${fmt(d.wavePeriod, 0)}s`}
              accent={colors.hex}
            />
            <Tile icon={<Wind />} label={t(locale, "cardWind")} value={`${fmt(d.windSpeed, 0)} km/h`} sub={`${t(locale, "tileGust")} ${fmt(d.windGusts, 0)} · ${degToCardinal(d.windDir)}`} />
            <Tile icon={<Zap />} label="Puissance" value={d.wavePower != null ? `${fmt(d.wavePower, 1)} kW/m` : "—"} sub={d.engagedSurf ? "costaud" : ""} />
            <Tile icon={<Thermometer />} label={t(locale, "tileWaterAir")} value={seaTempAvg != null ? `${fmt(seaTempAvg, 0)}°C` : "—"} sub={airTempMax != null ? `${t(locale, "tileAir")} ${fmt(airTempMax, 0)}°C` : ""} />
            <Tile icon={<Sparkles />} label="Note" value={scoreLabel(score)} sub={`${score}/100`} />
          </div>

          {/* Hourly grid */}
          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-white/45">
                {t(locale, "modalHourly")}
              </span>
              <span className="text-[10px] text-white/30">{t(locale, "modalHourlyHint")}</span>
            </div>
            {hourlyLoading && !hasHourly ? (
              <div className="grid gap-1 shimmer-wave rounded-md" style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}>
                {Array.from({ length: 24 }, (_, i) => (
                  <div key={i} className="aspect-square rounded-md bg-white/[0.04]" />
                ))}
              </div>
            ) : hasHourly ? (
              <HourGrid forecast={forecast} dayIdx={dayIdx} level={level} />
            ) : (
              <p className="text-xs text-white/40">{t(locale, "modalNoHourly")}</p>
            )}
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="mb-1.5 font-script text-sm text-sand-200/80">{t(locale, "modalAbout")}</div>
            <p className="text-pretty text-sm leading-relaxed text-white/75">{forecast.spot.description}</p>
          </div>

          {/* Live buoy reading — collapsed accordion at the very bottom.
              Surfer's mental model: the forecast above is the decision; the buoy is a confirmation. */}
          <details className="mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] open:bg-white/[0.04]">
            <summary className="cursor-pointer list-none px-4 py-3 text-sm font-display font-bold text-white/85 marker:hidden">
              <span className="inline-flex items-center gap-2">
                <Radio className="h-3.5 w-3.5 text-ocean-300" />
                {t(locale, "buoysMiniNearestSpot")}
              </span>
              <span className="float-right text-ocean-300/70">↓</span>
            </summary>
            <div className="border-t border-white/[0.04] p-2 pt-3">
              <BuoyMiniPanel
                title=""
                lat={forecast.spot.lat}
                lon={forecast.spot.lon}
                limit={1}
                compact
                forecastWaveHeight={d.waveHeight}
              />
            </div>
          </details>
          </div>
        </div>

        {/* === FOOTER ACTIONS === */}
        <div
          className="flex shrink-0 gap-2 border-t border-white/[0.06] bg-depth-950 p-3 sm:p-4"
          style={{
            // Respect iPhone home indicator so the CTA buttons aren't covered.
            paddingBottom: "max(0.75rem, calc(0.75rem + env(safe-area-inset-bottom)))",
          }}
        >
          <button
            onClick={handleShare}
            className="tap-target flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium transition hover:bg-white/10 active:scale-[0.98]"
          >
            {shared ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
            {shared ? "Lien copié !" : "Partager"}
          </button>
          <Link
            href={`/spot/${forecast.spot.slug}`}
            className="tap-target flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-coral-500 via-sunset-500 to-sand-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-coral-500/30 transition hover:scale-[1.01] active:scale-[0.98]"
          >
            {t(locale, "cardFullSheet")}
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function Tile({
  icon, label, value, sub, accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.025] p-3">
      <div className="mb-1 flex items-center gap-1 text-[10px] uppercase tracking-widest text-white/45">
        <span className="text-ocean-300/80">{icon}</span>
        {label}
      </div>
      <div className="font-display text-xl font-bold" style={accent ? { color: accent } : undefined}>{value}</div>
      {sub && <div className="text-[10px] text-white/40">{sub}</div>}
    </div>
  );
}
