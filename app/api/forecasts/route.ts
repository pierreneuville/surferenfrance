import { NextResponse } from "next/server";
import { SPOTS } from "@/lib/spots";
import { computeScore } from "@/lib/score";
import type { Spot, DaySummary, BestWindowSummary, Level, SpotForecast } from "@/lib/types";

// Cached at the edge for 30 min — forecasts from Open-Meteo refresh every 6h anyway.
// stale-while-revalidate lets visitors get instant responses even during revalidation.
export const revalidate = 1800;
export const runtime = "nodejs";

const MARINE_BASE = "https://marine-api.open-meteo.com/v1/marine";
const FORECAST_BASE = "https://api.open-meteo.com/v1/forecast";
const CHUNK_SIZE = 50;
const LEVELS: Level[] = ["beginner", "intermediate", "advanced"];

interface OMResponse {
  daily?: Record<string, (number | string | null)[]>;
  hourly?: Record<string, (number | string | null)[]>;
}

function toArray<T>(x: T | T[]): T[] {
  return Array.isArray(x) ? x : [x];
}

async function fetchChunk(chunk: Spot[]): Promise<Array<{ marine: OMResponse | undefined; wind: OMResponse | undefined }>> {
  const lats = chunk.map((s) => s.lat).join(",");
  const lons = chunk.map((s) => s.lon).join(",");
  const tz = "Europe%2FParis";

  const marineUrl =
    `${MARINE_BASE}?latitude=${lats}&longitude=${lons}` +
    `&hourly=wave_height,wave_period,wave_direction` +
    `&daily=wave_height_max,wave_period_max,wave_direction_dominant` +
    `&timezone=${tz}&forecast_days=7`;

  const windUrl =
    `${FORECAST_BASE}?latitude=${lats}&longitude=${lons}` +
    `&hourly=wind_speed_10m,wind_direction_10m` +
    `&daily=wind_speed_10m_max,wind_direction_10m_dominant,wind_gusts_10m_max,sunrise,sunset` +
    `&timezone=${tz}&forecast_days=7`;

  const [marineRaw, windRaw] = await Promise.all([
    fetch(marineUrl, { next: { revalidate: 1800 } }).then((r) => (r.ok ? r.json() : null)),
    fetch(windUrl, { next: { revalidate: 1800 } }).then((r) => (r.ok ? r.json() : null)),
  ]);

  const marines = marineRaw ? toArray<OMResponse>(marineRaw) : [];
  const winds = windRaw ? toArray<OMResponse>(windRaw) : [];

  return chunk.map((_, i) => ({ marine: marines[i], wind: winds[i] }));
}

function num(x: unknown): number | null {
  return typeof x === "number" && !isNaN(x) ? x : null;
}

function buildDays(spot: Spot, marine: OMResponse | undefined, wind: OMResponse | undefined): DaySummary[] {
  const days: DaySummary[] = [];
  const hWaves = (marine?.hourly?.wave_height ?? []) as Array<number | null>;
  const hPeriods = (marine?.hourly?.wave_period ?? []) as Array<number | null>;
  const hWindSpd = (wind?.hourly?.wind_speed_10m ?? []) as Array<number | null>;
  const hWindDir = (wind?.hourly?.wind_direction_10m ?? []) as Array<number | null>;

  for (let i = 0; i < 7; i++) {
    const waveHeight = num(marine?.daily?.wave_height_max?.[i]);
    const wavePeriod = num(marine?.daily?.wave_period_max?.[i]);
    const waveDir = num(marine?.daily?.wave_direction_dominant?.[i]);
    const windSpeed = num(wind?.daily?.wind_speed_10m_max?.[i]);
    const windDir = num(wind?.daily?.wind_direction_10m_dominant?.[i]);
    const windGusts = num(wind?.daily?.wind_gusts_10m_max?.[i]);
    const sunriseRaw = wind?.daily?.sunrise?.[i];
    const sunsetRaw = wind?.daily?.sunset?.[i];
    const sunrise = typeof sunriseRaw === "string" ? sunriseRaw : null;
    const sunset = typeof sunsetRaw === "string" ? sunsetRaw : null;
    const date = (marine?.daily?.time?.[i] ?? "") as string;

    // Daylight window
    let dawnHour = 6, duskHour = 21;
    if (sunrise) dawnHour = new Date(sunrise).getHours();
    if (sunset) duskHour = new Date(sunset).getHours();

    // Precompute scores + best window per level
    const scoresByLevel: Record<Level, number> = { beginner: 0, intermediate: 0, advanced: 0 };
    const bestWindowByLevel: Record<Level, BestWindowSummary | null> = {
      beginner: null, intermediate: null, advanced: null,
    };

    const startH = i * 24;
    for (const level of LEVELS) {
      scoresByLevel[level] = computeScore(waveHeight, wavePeriod, windSpeed, windDir, spot.offshore, level);

      // Hourly scores for that day
      const hScores: number[] = new Array(24).fill(0);
      for (let h = 0; h < 24; h++) {
        const idx = startH + h;
        hScores[h] = computeScore(
          num(hWaves[idx]),
          num(hPeriods[idx]),
          num(hWindSpd[idx]),
          num(hWindDir[idx]),
          spot.offshore,
          level
        );
      }
      let bestStart = -1, bestSum = -1;
      for (let h = dawnHour; h <= duskHour - 2; h++) {
        const sum = hScores[h] + hScores[h + 1] + hScores[h + 2];
        if (sum > bestSum) { bestSum = sum; bestStart = h; }
      }
      bestWindowByLevel[level] = bestStart >= 0
        ? { start: bestStart, end: bestStart + 2, avg: Math.round(bestSum / 3) }
        : null;
    }

    days.push({
      date,
      waveHeight,
      wavePeriod,
      waveDir,
      windSpeed,
      windDir,
      windGusts,
      sunrise,
      sunset,
      score: scoresByLevel.intermediate,
      scoresByLevel,
      bestWindowByLevel,
    });
  }
  return days;
}

function emptyForecast(spot: Spot): SpotForecast {
  return {
    spot,
    days: Array.from({ length: 7 }, () => ({
      date: "", waveHeight: null, wavePeriod: null, waveDir: null,
      windSpeed: null, windDir: null, windGusts: null,
      sunrise: null, sunset: null, score: 0,
      scoresByLevel: { beginner: 0, intermediate: 0, advanced: 0 },
      bestWindowByLevel: { beginner: null, intermediate: null, advanced: null },
    })),
    hourly: {
      times: [], waveHeight: [], wavePeriod: [], waveDir: [], seaTemp: [],
      windSpeed: [], windDir: [], windGusts: [], airTemp: [],
    },
  };
}

export async function GET() {
  const chunks: Spot[][] = [];
  for (let i = 0; i < SPOTS.length; i += CHUNK_SIZE) {
    chunks.push(SPOTS.slice(i, i + CHUNK_SIZE));
  }

  let chunkResults: Array<Array<{ marine: OMResponse | undefined; wind: OMResponse | undefined }>>;
  try {
    chunkResults = await Promise.all(chunks.map(fetchChunk));
  } catch (e) {
    return NextResponse.json(
      { error: "Upstream fetch failed", message: (e as Error).message },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }

  const forecasts: SpotForecast[] = [];
  chunks.forEach((chunk, ci) => {
    chunk.forEach((spot, i) => {
      const { marine, wind } = chunkResults[ci][i] ?? {};
      if (!marine && !wind) {
        forecasts.push(emptyForecast(spot));
        return;
      }
      forecasts.push({
        spot,
        days: buildDays(spot, marine, wind),
        // Hourly intentionally empty — fetched on demand via /api/forecast/[slug]
        hourly: {
          times: [], waveHeight: [], wavePeriod: [], waveDir: [], seaTemp: [],
          windSpeed: [], windDir: [], windGusts: [], airTemp: [],
        },
      });
    });
  });

  return NextResponse.json(forecasts, {
    headers: {
      "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      "CDN-Cache-Control": "public, s-maxage=1800",
    },
  });
}
