"use client";

import { useEffect, useState } from "react";
import type { Spot, SpotForecast, Level } from "@/lib/types";
import { fetchSpotForecastFromApi } from "@/lib/clientApi";
import { ADSENSE_SLOT_SPOT_DETAIL } from "@/lib/adsense";
import { SCORE_COLORS, scoreLabel, scoreTone, computeScore } from "@/lib/score";
import { degToCardinal, fmt, dayLongLabel } from "@/lib/utils";
import { HourGrid } from "./HourGrid";
import { Waves, Wind, Compass, Sunrise } from "lucide-react";
import { AdSlot } from "./AdSlot";

interface Props { spot: Spot }

export function SpotDetailClient({ spot }: Props) {
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
    return <div className="mt-8 animate-pulse rounded-2xl border border-white/5 bg-white/[0.02] h-64" />;
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-wrap gap-2">
        {forecast.days.map((day, i) => {
          // Prefer server-precomputed scoresByLevel; else recompute from raw values.
          const ds = day.scoresByLevel?.[level]
            ?? computeScore(day.waveHeight, day.wavePeriod, day.windSpeed, day.windDir, spot.offshore, level);
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
        <span className="text-xs text-white/50">Score adapté à mon niveau :</span>
        {(["beginner", "intermediate", "advanced"] as Level[]).map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={`rounded-full px-3 py-1 text-xs transition ${
              level === l ? "bg-ocean-500/30 text-ocean-100" : "bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            {l === "beginner" ? "Débutant" : l === "intermediate" ? "Intermédiaire" : "Confirmé"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile icon={<Waves className="h-3.5 w-3.5" />} label="Vague" value={`${fmt(forecast.days[dayIdx].waveHeight)} m`} sub={degToCardinal(forecast.days[dayIdx].waveDir)} />
        <Tile icon={<Compass className="h-3.5 w-3.5" />} label="Période" value={`${fmt(forecast.days[dayIdx].wavePeriod, 0)} s`} />
        <Tile icon={<Wind className="h-3.5 w-3.5" />} label="Vent" value={`${fmt(forecast.days[dayIdx].windSpeed, 0)} km/h`} sub={`raf. ${fmt(forecast.days[dayIdx].windGusts, 0)}`} />
        <Tile icon={<Sunrise className="h-3.5 w-3.5" />} label="Soleil" value={`${formatTime(forecast.days[dayIdx].sunrise)} → ${formatTime(forecast.days[dayIdx].sunset)}`} />
      </div>

      <AdSlot slot={ADSENSE_SLOT_SPOT_DETAIL} format="rectangle" label="Publicité — page spot" />

      <div>
        <div className="mb-3 text-xs uppercase tracking-wider text-white/50">Heure par heure</div>
        <HourGrid forecast={forecast} dayIdx={dayIdx} level={level} />
      </div>
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
