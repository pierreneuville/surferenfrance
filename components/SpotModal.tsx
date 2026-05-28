"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Sunrise, Sunset, Waves, Wind, Thermometer, ExternalLink, Sparkles } from "lucide-react";
import type { SpotForecast, Level } from "@/lib/types";
import { bestHoursForDay } from "@/lib/api";
import { fetchSpotForecastFromApi } from "@/lib/clientApi";
import { SCORE_COLORS, scoreTone } from "@/lib/score";
import { degToCardinal, fmt, dayLongLabel, timeFromIso } from "@/lib/utils";
import { HourGrid } from "./HourGrid";
import { REGION_EMOJI } from "@/lib/spots";

interface Props {
  forecast: SpotForecast;
  dayIdx: number;
  level: Level;
  onClose: () => void;
}

export function SpotModal({ forecast: lightForecast, dayIdx, level, onClose }: Props) {
  // Light forecast comes from /api/forecasts (no hourly). Fetch full hourly via
  // /api/forecast/[slug] when modal opens. Cached at the edge for 30 min so the
  // first user pays ~500ms, all subsequent users get an instant HIT.
  const [forecast, setForecast] = useState<SpotForecast>(lightForecast);
  const [hourlyLoading, setHourlyLoading] = useState(true);

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
      .then((full) => { if (!cancelled) { setForecast(full); setHourlyLoading(false); } })
      .catch(() => { if (!cancelled) setHourlyLoading(false); });
    return () => { cancelled = true; };
  }, [lightForecast.spot.slug]);

  const d = forecast.days[dayIdx];
  const score = d.scoresByLevel?.[level] ?? d.score;
  const tone = scoreTone(score);
  const hasHourly = forecast.hourly.times.length > 0;
  const best = hasHourly ? bestHoursForDay(forecast, dayIdx, level) : null;

  const startH = dayIdx * 24;
  const seaSlice = forecast.hourly.seaTemp.slice(startH, startH + 24).filter((t) => t != null) as number[];
  const airSlice = forecast.hourly.airTemp.slice(startH, startH + 24).filter((t) => t != null) as number[];
  const seaTempAvg = seaSlice.length ? seaSlice.reduce((a, b) => a + b, 0) / seaSlice.length : null;
  const airTempMax = airSlice.length ? Math.max(...airSlice) : null;

  // Fallback to server-precomputed best window if hourly not loaded yet
  const fallbackBest = d.bestWindowByLevel?.[level];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-md sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-white/10 bg-gradient-to-b from-depth-900 to-depth-950 p-6 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/5 transition hover:bg-white/15"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-1 text-xs text-white/50">
          {REGION_EMOJI[forecast.spot.region]} {forecast.spot.region} · {forecast.spot.department}
        </div>
        <h2 className="font-display text-3xl font-bold leading-tight">{forecast.spot.name}</h2>
        <p className="mt-1 text-sm text-white/60">
          {dayLongLabel(dayIdx)} · {forecast.spot.type}
        </p>
        <div className="mt-2 flex items-center gap-3 text-xs text-white/50">
          <span className="flex items-center gap-1"><Sunrise className="h-3.5 w-3.5" /> {timeFromIso(d.sunrise)}</span>
          <span className="flex items-center gap-1"><Sunset className="h-3.5 w-3.5" /> {timeFromIso(d.sunset)}</span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Tile label="Score" value={score.toString()} sub="" color={SCORE_COLORS[tone].text} />
          <Tile label="Vague" value={`${fmt(d.waveHeight)} m`} sub={`${degToCardinal(d.waveDir)} · ${fmt(d.wavePeriod, 0)}s`} icon={<Waves className="h-3.5 w-3.5" />} />
          <Tile label="Vent" value={`${fmt(d.windSpeed, 0)} km/h`} sub={`raf. ${fmt(d.windGusts, 0)} ${degToCardinal(d.windDir)}`} icon={<Wind className="h-3.5 w-3.5" />} />
          <Tile label="Eau / Air" value={seaTempAvg != null ? `${fmt(seaTempAvg, 0)}°C` : "—"} sub={airTempMax != null ? `air ${fmt(airTempMax, 0)}°C` : ""} icon={<Thermometer className="h-3.5 w-3.5" />} />
        </div>

        {best && best.best ? (
          <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-emerald-200">
              <Sparkles className="h-4 w-4" />
              Meilleur créneau du jour
            </div>
            <div className="flex flex-wrap gap-2">
              {best.top.map((h) => {
                const i = startH + h.hour;
                return (
                  <div key={h.hour} className="rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs">
                    <strong className="text-emerald-200">{String(h.hour).padStart(2, "0")}h</strong>
                    {" · "}{fmt(forecast.hourly.waveHeight[i])}m
                    {" · "}{fmt(forecast.hourly.windSpeed[i], 0)} km/h
                    {" · "}<span className="text-white/70">score {h.score}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : fallbackBest ? (
          <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm">
            <div className="mb-1 flex items-center gap-2 text-emerald-200">
              <Sparkles className="h-4 w-4" />
              Meilleur créneau du jour
            </div>
            <div className="text-white/80">
              <strong className="text-emerald-200">
                {String(fallbackBest.start).padStart(2, "0")}h–{String(fallbackBest.end + 1).padStart(2, "0")}h
              </strong>
              {" · "}score moyen {fallbackBest.avg}
            </div>
          </div>
        ) : null}

        <div className="mt-6">
          <div className="mb-2 text-xs uppercase tracking-wider text-white/50">
            Heure par heure (couleur = score, gris = nuit)
          </div>
          {hourlyLoading && !hasHourly ? (
            <div className="grid gap-1 animate-pulse" style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}>
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="aspect-square rounded-md bg-white/5" />
              ))}
            </div>
          ) : hasHourly ? (
            <HourGrid forecast={forecast} dayIdx={dayIdx} level={level} />
          ) : (
            <p className="text-xs text-white/40">Détail horaire indisponible pour ce spot pour le moment.</p>
          )}
        </div>

        <div className="mt-6 rounded-xl border border-white/5 bg-white/[0.03] p-4 text-sm text-white/70">
          <p className="text-pretty">{forecast.spot.description}</p>
        </div>

        <Link
          href={`/spot/${forecast.spot.slug}`}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-ocean-500/20 px-4 py-2 text-sm text-ocean-200 transition hover:bg-ocean-500/30"
        >
          Voir la page du spot
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function Tile({ label, value, sub, icon, color }: { label: string; value: string; sub?: string; icon?: React.ReactNode; color?: string }) {
  return (
    <div className="rounded-xl bg-white/[0.04] p-3">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-white/50">
        {icon}
        {label}
      </div>
      <div className={`mt-1 font-display text-xl font-bold ${color ?? "text-white"}`}>{value}</div>
      {sub && <div className="text-[11px] text-white/40">{sub}</div>}
    </div>
  );
}
