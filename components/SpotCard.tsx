"use client";

import { Compass, Sparkles, Waves, Wind, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Level, SpotForecast } from "@/lib/types";
import { SCORE_COLORS, scoreLabel, scoreTone } from "@/lib/score";
import { bestHoursForDay } from "@/lib/api";
import { degToCardinal, fmt, dayShortLabel } from "@/lib/utils";
import { REGION_EMOJI } from "@/lib/spots";

interface Props {
  forecast: SpotForecast;
  dayIdx: number;
  level: Level;
  distanceKm?: number;
  onClick: () => void;
}

export function SpotCard({ forecast, dayIdx, level, distanceKm, onClick }: Props) {
  const d = forecast.days[dayIdx];
  // Prefer server-precomputed values; fall back to live compute if hourly is loaded.
  const score = d.scoresByLevel?.[level] ?? d.score;
  const bestWindow = d.bestWindowByLevel?.[level]
    ?? (forecast.hourly?.times?.length ? bestHoursForDay(forecast, dayIdx, level).best : null);
  const tone = scoreTone(score);
  const colors = SCORE_COLORS[tone];

  return (
    <article
      onClick={onClick}
      className="group glass glass-hover cursor-pointer rounded-2xl p-5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-ocean-500/10"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold leading-tight">
            {forecast.spot.shortName}
          </h3>
          <p className="mt-0.5 text-xs text-white/50">
            {REGION_EMOJI[forecast.spot.region]} {forecast.spot.region}
            {distanceKm != null && (
              <span className="ml-2 text-ocean-300">· {Math.round(distanceKm)} km</span>
            )}
          </p>
        </div>
        <div className={`rounded-xl px-3 py-2 text-center ${colors.bg} ${colors.border} border`}>
          <div className={`font-display text-2xl font-bold leading-none ${colors.text}`}>{score}</div>
          <div className={`mt-0.5 text-[10px] uppercase tracking-wider ${colors.text} opacity-80`}>
            {scoreLabel(score)}
          </div>
        </div>
      </div>

      {bestWindow && bestWindow.avg >= 30 ? (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-ocean-500/30 bg-ocean-500/10 px-3 py-2 text-xs">
          <Sparkles className="h-3.5 w-3.5 text-ocean-300" />
          <span className="text-white/70">Meilleur créneau :</span>
          <span className="font-semibold text-ocean-200">
            {String(bestWindow.start).padStart(2, "0")}h–{String(bestWindow.end + 1).padStart(2, "0")}h
          </span>
          <span className="ml-auto text-white/50">score {bestWindow.avg}</span>
        </div>
      ) : (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-xs text-white/40">
          <Sparkles className="h-3.5 w-3.5" />
          Pas de créneau favorable
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <Stat icon={<Waves className="mx-auto h-3.5 w-3.5 text-ocean-300" />} label="Vague" value={`${fmt(d.waveHeight)} m`} sub={degToCardinal(d.waveDir)} />
        <Stat icon={<Compass className="mx-auto h-3.5 w-3.5 text-ocean-300" />} label="Période" value={`${fmt(d.wavePeriod, 0)} s`} sub={d.wavePeriod && d.wavePeriod >= 10 ? "ground" : d.wavePeriod && d.wavePeriod >= 7 ? "houle" : "v. mer"} />
        <Stat icon={<Wind className="mx-auto h-3.5 w-3.5 text-ocean-300" />} label="Vent" value={`${fmt(d.windSpeed, 0)} km/h`} sub={degToCardinal(d.windDir)} />
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 border-t border-white/5 pt-3">
        {forecast.days.map((day, i) => {
          const ds = day.scoresByLevel?.[level] ?? day.score;
          const t = scoreTone(ds);
          return (
            <div
              key={i}
              className={`rounded text-center text-[10px] ${i === dayIdx ? "bg-ocean-500/15" : ""} py-1`}
            >
              <div className="text-white/40">{dayShortLabel(i)}</div>
              <div className="mt-0.5 font-semibold" style={{ color: SCORE_COLORS[t].hex }}>{ds}</div>
            </div>
          );
        })}
      </div>

      <Link
        href={`/spot/${forecast.spot.slug}`}
        onClick={(e) => e.stopPropagation()}
        className="mt-4 inline-flex items-center gap-1.5 text-xs text-white/40 transition hover:text-ocean-300"
      >
        Page détaillée du spot
        <ExternalLink className="h-3 w-3" />
      </Link>
    </article>
  );
}

function Stat({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg bg-white/5 px-2 py-2">
      {icon}
      <div className="mt-1 text-[10px] uppercase tracking-wider text-white/40">{label}</div>
      <div className="font-semibold text-white">{value}</div>
      {sub && <div className="text-[10px] text-white/40">{sub}</div>}
    </div>
  );
}
