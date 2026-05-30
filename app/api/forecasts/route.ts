import { NextResponse } from "next/server";
import { SPOTS } from "@/lib/spots";
import { computeScore, computeWavePower, effectiveWaveHeight, isEngagedSurf } from "@/lib/score";
import { detectTideExtremes, tideRangeForDay, tideStateAt } from "@/lib/tide";
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

/** Counts how many entries in a marine bulk response have today's wave_height_max. */
function marineNullRatio(marines: OMResponse[]): number {
  if (!marines.length) return 1;
  const nulls = marines.filter((m) => m?.daily?.wave_height_max?.[0] == null).length;
  return nulls / marines.length;
}

async function fetchMarine(lats: string, lons: string, tz: string): Promise<OMResponse[]> {
  const url =
    `${MARINE_BASE}?latitude=${lats}&longitude=${lons}` +
    `&hourly=wave_height,wave_period,wave_direction,sea_level_height_msl` +
    `&daily=wave_height_max,wave_period_max,wave_direction_dominant` +
    `&timezone=${tz}&forecast_days=7`;
  // No `next: { revalidate }` here — we want to control caching ourselves at the
  // route level after we've validated the data is healthy. Keep the data fresh
  // by relying on the route's `revalidate` + Cache-Control header below.
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];
  const raw = await res.json();
  return raw ? toArray<OMResponse>(raw) : [];
}

async function fetchChunk(chunk: Spot[]): Promise<{
  results: Array<{ marine: OMResponse | undefined; wind: OMResponse | undefined }>;
  marineHealthy: boolean;
}> {
  const lats = chunk.map((s) => s.lat).join(",");
  const lons = chunk.map((s) => s.lon).join(",");
  const tz = "Europe%2FParis";

  const windUrl =
    `${FORECAST_BASE}?latitude=${lats}&longitude=${lons}` +
    `&hourly=wind_speed_10m,wind_direction_10m` +
    `&daily=wind_speed_10m_max,wind_direction_10m_dominant,wind_gusts_10m_max,sunrise,sunset` +
    `&timezone=${tz}&forecast_days=7`;

  // 1st marine attempt
  let marines = await fetchMarine(lats, lons, tz);
  let nullRatio = marineNullRatio(marines);
  // If > 30% nulls, retry once after short backoff — Open-Meteo occasionally
  // returns a partial/empty payload that gets cached for 30min if we don't catch it.
  if (nullRatio > 0.3) {
    await new Promise((r) => setTimeout(r, 250));
    const retry = await fetchMarine(lats, lons, tz);
    if (marineNullRatio(retry) < nullRatio) marines = retry;
    nullRatio = marineNullRatio(marines);
  }
  const marineHealthy = nullRatio < 0.3;

  const windRaw = await fetch(windUrl, { next: { revalidate: 1800 } }).then((r) => (r.ok ? r.json() : null));
  const winds = windRaw ? toArray<OMResponse>(windRaw) : [];

  const results = chunk.map((_, i) => ({ marine: marines[i], wind: winds[i] }));
  return { results, marineHealthy };
}

function num(x: unknown): number | null {
  return typeof x === "number" && !isNaN(x) ? x : null;
}

function buildDays(spot: Spot, marine: OMResponse | undefined, wind: OMResponse | undefined): DaySummary[] {
  const days: DaySummary[] = [];
  const hTimes = (marine?.hourly?.time ?? []) as Array<string | null>;
  const hWaves = (marine?.hourly?.wave_height ?? []) as Array<number | null>;
  const hPeriods = (marine?.hourly?.wave_period ?? []) as Array<number | null>;
  const hTide = (marine?.hourly?.sea_level_height_msl ?? []) as Array<number | null>;
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
      scoresByLevel[level] = computeScore(waveHeight, wavePeriod, windSpeed, windDir, spot.offshore, level, { worldClass: spot.worldClass, tideOptimal: spot.tideOptimal });

      // Hourly scores for that day — pass tide state per hour so best-window aligns with tide
      const hScores: number[] = new Array(24).fill(0);
      for (let h = 0; h < 24; h++) {
        const idx = startH + h;
        hScores[h] = computeScore(
          num(hWaves[idx]),
          num(hPeriods[idx]),
          num(hWindSpd[idx]),
          num(hWindDir[idx]),
          spot.offshore,
          level,
          {
            worldClass: spot.worldClass,
            tideOptimal: spot.tideOptimal,
            tideState: spot.tideOptimal ? tideStateAt(hTide, idx) : undefined,
          }
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

    const dayTimes = hTimes.slice(startH, startH + 24);
    const dayTideHeights = hTide.slice(startH, startH + 24);
    const tideExtremes = detectTideExtremes(dayTimes, dayTideHeights);
    const tideRange = tideRangeForDay(hTide, startH);

    days.push({
      date,
      waveHeight,
      wavePeriod,
      effectiveWaveHeight: effectiveWaveHeight(waveHeight, wavePeriod),
      wavePower: computeWavePower(waveHeight, wavePeriod),
      engagedSurf: isEngagedSurf(waveHeight, wavePeriod, "intermediate"),
      waveDir,
      windSpeed,
      windDir,
      windGusts,
      sunrise,
      sunset,
      tideExtremes,
      tideRange,
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
      effectiveWaveHeight: null, wavePower: null, engagedSurf: false,
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

  let chunkResults: Array<{ results: Array<{ marine: OMResponse | undefined; wind: OMResponse | undefined }>; marineHealthy: boolean }>;
  try {
    chunkResults = await Promise.all(chunks.map(fetchChunk));
  } catch (e) {
    return NextResponse.json(
      { error: "Upstream fetch failed", message: (e as Error).message },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }

  // Track overall data health so we can shorten the cache TTL when too much is null.
  const unhealthyChunks = chunkResults.filter((c) => !c.marineHealthy).length;
  const overallHealthy = unhealthyChunks / chunkResults.length < 0.2;

  const forecasts: SpotForecast[] = [];
  chunks.forEach((chunk, ci) => {
    chunk.forEach((spot, i) => {
      const { marine, wind } = chunkResults[ci].results[i] ?? {};
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

  // Short-cache unhealthy responses (60s) so a transient upstream glitch doesn't
  // poison the CDN for 30 minutes. Healthy → full 30min cache.
  const cacheControl = overallHealthy
    ? "public, s-maxage=1800, stale-while-revalidate=3600"
    : "public, s-maxage=60, stale-while-revalidate=120";

  return NextResponse.json(forecasts, {
    headers: {
      "Cache-Control": cacheControl,
      "CDN-Cache-Control": cacheControl,
      "X-Data-Health": overallHealthy ? "ok" : `degraded-${unhealthyChunks}/${chunkResults.length}`,
    },
  });
}
