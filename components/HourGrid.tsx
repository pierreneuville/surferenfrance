"use client";

import { useEffect, useState } from "react";
import { Waves, Wind, Compass, Thermometer, Droplet } from "lucide-react";
import type { SpotForecast, Level } from "@/lib/types";
import { bestHoursForDay } from "@/lib/api";
import { SCORE_COLORS, scoreTone } from "@/lib/score";
import { degToCardinal, fmt } from "@/lib/utils";
import { useLocale } from "@/lib/useLocale";
import { t } from "@/lib/i18n";
import { tideStateAt, tideStateKey } from "@/lib/tide";

interface Props {
  forecast: SpotForecast;
  dayIdx: number;
  level: Level;
}

// Default highlight: next hour rounded UP — only on day 0 (today)
function defaultHourFor(dayIdx: number): number | null {
  if (dayIdx !== 0) return null;
  const now = new Date();
  const next = now.getMinutes() === 0 ? now.getHours() : now.getHours() + 1;
  return Math.min(23, Math.max(0, next));
}

export function HourGrid({ forecast, dayIdx, level }: Props) {
  const { locale } = useLocale();
  const best = bestHoursForDay(forecast, dayIdx, level);
  const startH = dayIdx * 24;
  const [selected, setSelected] = useState<number | null>(() => defaultHourFor(dayIdx));

  // Re-set default when user changes day
  useEffect(() => { setSelected(defaultHourFor(dayIdx)); }, [dayIdx]);

  // Tide series for the day, normalised 0..1 within day range, for SVG sparkline.
  const tideHeights = forecast.hourly.tideHeight ?? [];
  const dayTide = tideHeights.slice(startH, startH + 24);
  const tideExtremes = forecast.days[dayIdx]?.tideExtremes ?? [];

  return (
    <>
      {/* Grid: 12 cols × 2 rows on mobile (chunkier cells), 24 cols × 1 row on desktop */}
      <div className="grid grid-cols-12 gap-1.5 sm:[grid-template-columns:repeat(24,minmax(0,1fr))] sm:gap-1">
        {best.scores.map((h) => {
          const isDay = h.hour >= best.dawnHour && h.hour <= best.duskHour;
          const tone = scoreTone(h.score);
          const isSelected = selected === h.hour;
          return (
            <button
              key={h.hour}
              onMouseEnter={() => setSelected(h.hour)}
              onClick={() => setSelected(h.hour)}
              className={`relative flex min-h-[36px] flex-col items-center justify-center rounded-md text-[11px] font-bold transition-all sm:min-h-0 sm:aspect-square sm:text-[10px] ${
                isDay ? SCORE_COLORS[tone].bg : "bg-white/[0.03]"
              } ${isDay ? "" : "opacity-35"} ${
                isSelected ? "z-10 scale-105 ring-2 ring-ocean-400" : "hover:ring-1 hover:ring-white/30"
              }`}
              style={{ color: isDay ? SCORE_COLORS[tone].hex : "rgba(255,255,255,0.4)" }}
              aria-label={`${h.hour}h, score ${h.score}`}
            >
              <span className="leading-none">{h.hour}h</span>
            </button>
          );
        })}
      </div>
      {/* Tide sparkline: shows the curve below the hour grid with high/low markers */}
      {dayTide.some((v) => v != null) && (
        <TideSparkline tide={dayTide} extremes={tideExtremes} selected={selected} dawnHour={best.dawnHour} duskHour={best.duskHour} />
      )}
      {/* Detail panel — bigger, more readable, default to current hour */}
      <div className="mt-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3 sm:p-4">
        {selected != null ? (
          <HourDetail
            forecast={forecast}
            hour={selected}
            startH={startH}
            score={best.scores[selected]?.score ?? 0}
            tideHeights={tideHeights}
            locale={locale}
          />
        ) : (
          <p className="text-sm text-white/55">
            <span className="font-script text-base text-sand-200/80">{t(locale, "modalTouchHour")}</span> {t(locale, "modalTouchHint")}
          </p>
        )}
      </div>
    </>
  );
}

function TideSparkline({
  tide, extremes, selected, dawnHour, duskHour,
}: {
  tide: (number | null)[];
  extremes: { time: string; height: number; type: "high" | "low" }[];
  selected: number | null;
  dawnHour: number;
  duskHour: number;
}) {
  const W = 240;
  const H = 32;
  const numeric = tide.filter((v) => v != null) as number[];
  if (numeric.length < 6) return null;
  const min = Math.min(...numeric);
  const max = Math.max(...numeric);
  const range = max - min || 1;
  const pts = tide.map((v, h) => {
    const x = (h / 23) * W;
    const y = v == null ? H / 2 : H - ((v - min) / range) * H;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const path = `M ${pts.join(" L ")}`;
  return (
    <div className="mt-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2">
      <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-widest text-white/40">
        <span>marée</span>
        <span className="text-white/30">{numeric.length > 0 ? `${(max - min).toFixed(1)} m d'amplitude` : ""}</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-8 w-full text-ocean-300/80" preserveAspectRatio="none" aria-hidden>
        {/* daylight band */}
        <rect x={(dawnHour / 23) * W} y={0} width={((duskHour - dawnHour) / 23) * W} height={H} fill="rgba(255,224,170,0.04)" />
        <path d={path} stroke="currentColor" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        {extremes.map((e, i) => {
          const h = new Date(e.time).getHours();
          const x = (h / 23) * W;
          const y = e.type === "high" ? H * 0.15 : H * 0.85;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={2.5} fill={e.type === "high" ? "#10b981" : "#fb923c"} />
              <text x={x} y={e.type === "high" ? y - 4 : y + 9} fontSize={7} textAnchor="middle" fill="rgba(255,255,255,0.55)">
                {e.type === "high" ? "▲" : "▼"} {String(h).padStart(2, "0")}h
              </text>
            </g>
          );
        })}
        {selected != null && (
          <line x1={(selected / 23) * W} x2={(selected / 23) * W} y1={0} y2={H} stroke="#7dd3fc" strokeWidth={1} strokeDasharray="2 2" />
        )}
      </svg>
    </div>
  );
}

function HourDetail({
  forecast, hour, startH, score, tideHeights, locale,
}: {
  forecast: SpotForecast;
  hour: number;
  startH: number;
  score: number;
  tideHeights: (number | null)[];
  locale: import("@/lib/i18n").Locale;
}) {
  const i = startH + hour;
  const tone = scoreTone(score);
  const color = SCORE_COLORS[tone].hex;
  const tideState = tideHeights.length ? tideStateAt(tideHeights, i) : null;
  const matchesSpotTide = forecast.spot.tideOptimal != null && tideState != null && tideMatchesPref(tideState, forecast.spot.tideOptimal);
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-bold text-white">
            {String(hour).padStart(2, "0")}h
          </span>
          {tideState && matchesSpotTide && (
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-emerald-200">
              {t(locale, "tideIdealBadge")}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-bold" style={{ background: `${color}25`, color }}>
          {score}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        <Metric icon={<Waves className="h-3.5 w-3.5" />} label={t(locale, "cardWave")} value={`${fmt(forecast.hourly.waveHeight[i])} m`} sub={degToCardinal(forecast.hourly.waveDir[i])} />
        <Metric icon={<Compass className="h-3.5 w-3.5" />} label={t(locale, "cardPeriod")} value={`${fmt(forecast.hourly.wavePeriod[i], 0)} s`} />
        <Metric icon={<Wind className="h-3.5 w-3.5" />} label={t(locale, "cardWind")} value={`${fmt(forecast.hourly.windSpeed[i], 0)} km/h`} sub={degToCardinal(forecast.hourly.windDir[i])} />
        <Metric icon={<Droplet className="h-3.5 w-3.5" />} label={t(locale, "tileTide")} value={tideState ? t(locale, tideStateKey(tideState)) : "—"} sub={tideHeights[i] != null ? `${fmt(tideHeights[i], 1)} m` : undefined} />
        <Metric icon={<Thermometer className="h-3.5 w-3.5" />} label={t(locale, "tileWaterAir").split(" ")[0]} value={forecast.hourly.seaTemp[i] != null ? `${fmt(forecast.hourly.seaTemp[i], 0)}°C` : "—"} />
      </div>
    </div>
  );
}

function tideMatchesPref(state: import("@/lib/types").TideState, pref: import("@/lib/types").TideOptimal): boolean {
  if (pref === "any") return false;
  if (state === pref) return true;
  const tolerant: Record<import("@/lib/types").TideOptimal, import("@/lib/types").TideState[]> = {
    rising: ["mid", "high"],
    falling: ["mid", "low"],
    high: ["rising"],
    low: ["falling"],
    "mid-high": ["rising", "high"],
    "mid-low": ["falling", "low"],
    mid: ["rising", "falling"],
    any: [],
  };
  return tolerant[pref].includes(state);
}

function Metric({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl bg-black/20 px-2.5 py-2">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-white/45">
        <span className="text-ocean-300/80">{icon}</span>
        {label}
      </div>
      <div className="mt-0.5 font-display text-base font-bold text-white">{value}</div>
      {sub && <div className="text-[10px] text-white/45">{sub}</div>}
    </div>
  );
}
