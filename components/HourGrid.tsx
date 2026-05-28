"use client";

import { useEffect, useState } from "react";
import { Waves, Wind, Compass, Thermometer } from "lucide-react";
import type { SpotForecast, Level } from "@/lib/types";
import { bestHoursForDay } from "@/lib/api";
import { SCORE_COLORS, scoreTone } from "@/lib/score";
import { degToCardinal, fmt } from "@/lib/utils";

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
  const best = bestHoursForDay(forecast, dayIdx, level);
  const startH = dayIdx * 24;
  const [selected, setSelected] = useState<number | null>(() => defaultHourFor(dayIdx));

  // Re-set default when user changes day
  useEffect(() => { setSelected(defaultHourFor(dayIdx)); }, [dayIdx]);

  return (
    <>
      {/* Grid: 12 cols × 2 rows on mobile (chunkier cells), 24 cols × 1 row on desktop */}
      <div className="grid grid-cols-12 gap-1.5 sm:[grid-template-columns:repeat(24,minmax(0,1fr))] sm:gap-1">
        {best.scores.map((h) => {
          const isDay = h.hour >= best.dawnHour && h.hour <= best.duskHour;
          const t = scoreTone(h.score);
          const isSelected = selected === h.hour;
          return (
            <button
              key={h.hour}
              onMouseEnter={() => setSelected(h.hour)}
              onClick={() => setSelected(h.hour)}
              className={`relative flex min-h-[36px] flex-col items-center justify-center rounded-md text-[11px] font-bold transition-all sm:min-h-0 sm:aspect-square sm:text-[10px] ${
                isDay ? SCORE_COLORS[t].bg : "bg-white/[0.03]"
              } ${isDay ? "" : "opacity-35"} ${
                isSelected ? "z-10 scale-105 ring-2 ring-ocean-400" : "hover:ring-1 hover:ring-white/30"
              }`}
              style={{ color: isDay ? SCORE_COLORS[t].hex : "rgba(255,255,255,0.4)" }}
              aria-label={`${h.hour}h, score ${h.score}`}
            >
              <span className="leading-none">{h.hour}h</span>
            </button>
          );
        })}
      </div>
      {/* Detail panel — bigger, more readable, default to current hour */}
      <div className="mt-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3 sm:p-4">
        {selected != null ? (
          <HourDetail forecast={forecast} hour={selected} startH={startH} score={best.scores[selected]?.score ?? 0} />
        ) : (
          <p className="text-sm text-white/55">
            <span className="font-script text-base text-sand-200/80">Touche une heure</span> pour voir les conditions.
          </p>
        )}
      </div>
    </>
  );
}

function HourDetail({
  forecast, hour, startH, score,
}: {
  forecast: SpotForecast;
  hour: number;
  startH: number;
  score: number;
}) {
  const i = startH + hour;
  const t = scoreTone(score);
  const color = SCORE_COLORS[t].hex;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-bold text-white">
            {String(hour).padStart(2, "0")}h
          </span>
          <span className="text-xs uppercase tracking-widest text-white/40">conditions</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-bold" style={{ background: `${color}25`, color }}>
          {score}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Metric icon={<Waves className="h-3.5 w-3.5" />} label="Vague" value={`${fmt(forecast.hourly.waveHeight[i])} m`} sub={degToCardinal(forecast.hourly.waveDir[i])} />
        <Metric icon={<Compass className="h-3.5 w-3.5" />} label="Période" value={`${fmt(forecast.hourly.wavePeriod[i], 0)} s`} />
        <Metric icon={<Wind className="h-3.5 w-3.5" />} label="Vent" value={`${fmt(forecast.hourly.windSpeed[i], 0)} km/h`} sub={degToCardinal(forecast.hourly.windDir[i])} />
        <Metric icon={<Thermometer className="h-3.5 w-3.5" />} label="Eau" value={forecast.hourly.seaTemp[i] != null ? `${fmt(forecast.hourly.seaTemp[i], 0)}°C` : "—"} />
      </div>
    </div>
  );
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
