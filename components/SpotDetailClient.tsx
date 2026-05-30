"use client";

import { useEffect, useState } from "react";
import type { Spot, SpotForecast, Level } from "@/lib/types";
import { fetchSpotForecastFromApi } from "@/lib/clientApi";
import { ADSENSE_SLOT_SPOT_DETAIL } from "@/lib/adsense";
import { SCORE_COLORS, scoreLabel, scoreTone, computeScore } from "@/lib/score";
import { degToCardinal, fmt, dayLongLabel } from "@/lib/utils";
import { HourGrid } from "./HourGrid";
import { Waves, Wind, Compass, Sunrise, Zap, Droplet } from "lucide-react";
import { tideOptimalLabel } from "@/lib/tide";
import { AdSlot } from "./AdSlot";
import { useLocale } from "@/lib/useLocale";
import { t } from "@/lib/i18n";

interface Props { spot: Spot }

export function SpotDetailClient({ spot }: Props) {
  const { locale } = useLocale();
  const [forecast, setForecast] = useState<SpotForecast | null>(null);
  const [level, setLevel] = useState<Level>("intermediate");
  const [dayIdx, setDayIdx] = useState(0);

  useEffect(() => {
    let cancel = false;
    setForecast(null);
    // Level change doesn't refetch — scores are recomputed client-side from raw data.
    fetchSpotForecastFromApi(spot.slug).then((f) => { if (!cancel) setForecast(f); });
    return () => { cancel = true; };
  }, [spot.slug]);

  if (!forecast) {
    return (
      <div className="mt-8 space-y-6">
        {/* Day picker skeleton */}
        <div className="flex flex-wrap gap-2">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="shimmer-wave h-[78px] w-[72px] rounded-2xl bg-white/[0.04]" />
          ))}
        </div>
        {/* Level chips skeleton */}
        <div className="flex flex-wrap gap-2">
          <div className="shimmer-wave h-6 w-40 rounded-full bg-white/[0.04]" />
        </div>
        {/* 4 tile grid skeleton */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="shimmer-wave h-20 rounded-xl border border-white/[0.05] bg-white/[0.03]" />
          ))}
        </div>
        {/* Loading hint */}
        <div className="flex items-center gap-2 text-sm text-white/45">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-ocean-400" />
          <span className="font-script text-base text-sand-200/70">{t(locale, "modalLoadingTides")}</span>
        </div>
        {/* Hourly grid skeleton */}
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}
        >
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} className="shimmer-wave aspect-square rounded-md bg-white/[0.03]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-wrap gap-2">
        {forecast.days.map((day, i) => {
          // Prefer server-precomputed scoresByLevel; else recompute from raw values.
          const ds = day.scoresByLevel?.[level]
            ?? computeScore(day.waveHeight, day.wavePeriod, day.windSpeed, day.windDir, spot.offshore, level, { worldClass: spot.worldClass });
          const t = scoreTone(ds);
          return (
            <button
              key={i}
              onClick={() => setDayIdx(i)}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                i === dayIdx
                  ? "border-ocean-400 bg-ocean-500/15"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              }`}
            >
              <div className="text-xs text-white/50 capitalize">{dayLongLabel(i)}</div>
              <div className="mt-1 font-display text-xl font-bold" style={{ color: SCORE_COLORS[t].hex }}>
                {ds}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-white/40">{scoreLabel(ds)}</div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-white/50">{t(locale, "filterLevel")}</span>
        {(["beginner", "intermediate", "advanced"] as Level[]).map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={`rounded-full px-3 py-1 text-xs transition ${
              level === l ? "bg-ocean-500/30 text-ocean-100" : "bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            {t(locale, l === "beginner" ? "filterLevelBeginner" : l === "intermediate" ? "filterLevelIntermediate" : "filterLevelAdvanced")}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
        <Tile
          icon={<Waves className="h-3.5 w-3.5" />}
          label={t(locale, "cardWave")}
          value={`${fmt(forecast.days[dayIdx].waveHeight)} m`}
          sub={forecast.days[dayIdx].effectiveWaveHeight != null && forecast.days[dayIdx].effectiveWaveHeight! > (forecast.days[dayIdx].waveHeight ?? 0) + 0.1
            ? `sets ~${fmt(forecast.days[dayIdx].effectiveWaveHeight)} m`
            : degToCardinal(forecast.days[dayIdx].waveDir)}
        />
        <Tile icon={<Compass className="h-3.5 w-3.5" />} label={t(locale, "cardPeriod")} value={`${fmt(forecast.days[dayIdx].wavePeriod, 0)} s`} />
        <Tile icon={<Wind className="h-3.5 w-3.5" />} label={t(locale, "cardWind")} value={`${fmt(forecast.days[dayIdx].windSpeed, 0)} km/h`} sub={`${t(locale, "tileGust")} ${fmt(forecast.days[dayIdx].windGusts, 0)}`} />
        <Tile
          icon={<Zap className="h-3.5 w-3.5" />}
          label="Puissance"
          value={forecast.days[dayIdx].wavePower != null ? `${fmt(forecast.days[dayIdx].wavePower, 1)} kW/m` : "—"}
          sub={forecast.days[dayIdx].engagedSurf ? "surf engagé" : undefined}
        />
        <Tile
          icon={<Droplet className="h-3.5 w-3.5" />}
          label="Marée"
          value={tideTileValue(forecast.days[dayIdx].tideExtremes)}
          sub={spot.tideOptimal ? `idéale ${tideOptimalLabel(spot.tideOptimal)}` : forecast.days[dayIdx].tideRange != null ? `amplitude ${fmt(forecast.days[dayIdx].tideRange, 1)} m` : undefined}
        />
        <Tile icon={<Sunrise className="h-3.5 w-3.5" />} label="☀" value={`${formatTime(forecast.days[dayIdx].sunrise)} → ${formatTime(forecast.days[dayIdx].sunset)}`} />
      </div>

      <div>
        <div className="mb-3 text-xs uppercase tracking-wider text-white/50">{t(locale, "modalHourly")}</div>
        <HourGrid forecast={forecast} dayIdx={dayIdx} level={level} />
      </div>

      {/* Ad placed AFTER hourly so it doesn't push useful data below the fold */}
      <AdSlot slot={ADSENSE_SLOT_SPOT_DETAIL} format="auto" label="Publicité" className="mt-2" />
    </div>
  );
}

function Tile({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-white/50">
        {icon}
        {label}
      </div>
      <div className="mt-1 font-display text-xl font-bold">{value}</div>
      {sub && <div className="text-[11px] text-white/40">{sub}</div>}
    </div>
  );
}

function formatTime(iso: string | null) {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }); }
  catch { return "—"; }
}

function tideTileValue(extremes: import("@/lib/types").TideExtreme[] | undefined): string {
  if (!extremes || extremes.length === 0) return "—";
  // Show the next two extremes formatted as "▲ 09h · ▼ 15h"
  return extremes
    .slice(0, 2)
    .map((e) => `${e.type === "high" ? "▲" : "▼"} ${new Date(e.time).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`)
    .join(" · ");
}
