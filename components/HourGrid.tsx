"use client";

import { useState } from "react";
import type { SpotForecast, Level } from "@/lib/types";
import { bestHoursForDay } from "@/lib/api";
import { SCORE_COLORS, scoreTone } from "@/lib/score";
import { degToCardinal, fmt } from "@/lib/utils";

interface Props {
  forecast: SpotForecast;
  dayIdx: number;
  level: Level;
}

export function HourGrid({ forecast, dayIdx, level }: Props) {
  const best = bestHoursForDay(forecast, dayIdx, level);
  const startH = dayIdx * 24;
  const [hover, setHover] = useState<number | null>(null);

  return (
    <>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}
      >
        {best.scores.map((h) => {
          const isDay = h.hour >= best.dawnHour && h.hour <= best.duskHour;
          const t = scoreTone(h.score);
          return (
            <button
              key={h.hour}
              onMouseEnter={() => setHover(h.hour)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setHover(h.hour)}
              className={`aspect-square rounded-md text-[9px] transition hover:scale-110 ${
                isDay ? SCORE_COLORS[t].bg : "bg-white/[0.03]"
              } ${isDay ? "" : "opacity-40"}`}
              style={{ outline: hover === h.hour ? "2px solid #36c4f7" : undefined }}
            >
              <span className={isDay ? SCORE_COLORS[t].text : "text-white/50"}>{h.hour}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-3 min-h-[68px] rounded-xl bg-white/[0.04] p-3 text-sm">
        {hover != null ? (
          <HourDetail forecast={forecast} hour={hover} startH={startH} />
        ) : (
          <p className="text-xs text-white/40">Survole une case pour voir le détail.</p>
        )}
      </div>
    </>
  );
}

function HourDetail({ forecast, hour, startH }: { forecast: SpotForecast; hour: number; startH: number }) {
  const i = startH + hour;
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-4">
      <div>
        <div className="text-white/50">Heure</div>
        <div className="font-semibold text-ocean-200">{String(hour).padStart(2, "0")}h00</div>
      </div>
      <div>
        <div className="text-white/50">Vague</div>
        <div className="font-semibold">
          {fmt(forecast.hourly.waveHeight[i])} m ({degToCardinal(forecast.hourly.waveDir[i])})
        </div>
      </div>
      <div>
        <div className="text-white/50">Période</div>
        <div className="font-semibold">{fmt(forecast.hourly.wavePeriod[i], 0)} s</div>
      </div>
      <div>
        <div className="text-white/50">Vent</div>
        <div className="font-semibold">
          {fmt(forecast.hourly.windSpeed[i], 0)} km/h ({degToCardinal(forecast.hourly.windDir[i])})
        </div>
      </div>
    </div>
  );
}
