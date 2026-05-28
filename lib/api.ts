import type { Spot, SpotForecast, DaySummary, HourlyData, Level } from "./types";
import { computeScore } from "./score";

const MARINE_BASE = "https://marine-api.open-meteo.com/v1/marine";
const FORECAST_BASE = "https://api.open-meteo.com/v1/forecast";

export async function fetchSpotForecast(spot: Spot, level: Level = "intermediate"): Promise<SpotForecast> {
  const marineUrl =
    `${MARINE_BASE}?latitude=${spot.lat}&longitude=${spot.lon}` +
    `&hourly=wave_height,wave_period,wave_direction,sea_surface_temperature` +
    `&daily=wave_height_max,wave_period_max,wave_direction_dominant` +
    `&timezone=Europe%2FParis&forecast_days=7`;

  const windUrl =
    `${FORECAST_BASE}?latitude=${spot.lat}&longitude=${spot.lon}` +
    `&hourly=wind_speed_10m,wind_direction_10m,wind_gusts_10m,temperature_2m` +
    `&daily=wind_speed_10m_max,wind_direction_10m_dominant,wind_gusts_10m_max,sunrise,sunset` +
    `&timezone=Europe%2FParis&forecast_days=7`;

  // next.revalidate is a server-side hint (ignored in browser) — when this runs in a
  // Next.js Route Handler, the upstream response is cached at the edge for 30 min.
  const fetchOpts = { next: { revalidate: 1800 } } as const;
  const [marineRes, windRes] = await Promise.all([
    fetch(marineUrl, fetchOpts).then((r) => r.json()),
    fetch(windUrl, fetchOpts).then((r) => r.json()),
  ]);

  const days: DaySummary[] = [];
  for (let i = 0; i < 7; i++) {
    const waveHeight = marineRes.daily?.wave_height_max?.[i] ?? null;
    const wavePeriod = marineRes.daily?.wave_period_max?.[i] ?? null;
    const waveDir = marineRes.daily?.wave_direction_dominant?.[i] ?? null;
    const windSpeed = windRes.daily?.wind_speed_10m_max?.[i] ?? null;
    const windDir = windRes.daily?.wind_direction_10m_dominant?.[i] ?? null;
    const windGusts = windRes.daily?.wind_gusts_10m_max?.[i] ?? null;
    days.push({
      date: marineRes.daily?.time?.[i] ?? "",
      waveHeight,
      wavePeriod,
      waveDir,
      windSpeed,
      windDir,
      windGusts,
      sunrise: windRes.daily?.sunrise?.[i] ?? null,
      sunset: windRes.daily?.sunset?.[i] ?? null,
      score: computeScore(waveHeight, wavePeriod, windSpeed, windDir, spot.offshore, level),
    });
  }

  const hourly: HourlyData = {
    times: marineRes.hourly?.time ?? [],
    waveHeight: marineRes.hourly?.wave_height ?? [],
    wavePeriod: marineRes.hourly?.wave_period ?? [],
    waveDir: marineRes.hourly?.wave_direction ?? [],
    seaTemp: marineRes.hourly?.sea_surface_temperature ?? [],
    windSpeed: windRes.hourly?.wind_speed_10m ?? [],
    windDir: windRes.hourly?.wind_direction_10m ?? [],
    windGusts: windRes.hourly?.wind_gusts_10m ?? [],
    airTemp: windRes.hourly?.temperature_2m ?? [],
  };

  return { spot, days, hourly };
}

function emptyForecast(spot: Spot): SpotForecast {
  return {
    spot,
    days: Array.from({ length: 7 }, () => ({
      date: "",
      waveHeight: null,
      wavePeriod: null,
      waveDir: null,
      windSpeed: null,
      windDir: null,
      windGusts: null,
      sunrise: null,
      sunset: null,
      score: 0,
    })),
    hourly: {
      times: [], waveHeight: [], wavePeriod: [], waveDir: [], seaTemp: [],
      windSpeed: [], windDir: [], windGusts: [], airTemp: [],
    },
  };
}

export async function fetchAllForecasts(spots: Spot[], level: Level = "intermediate"): Promise<SpotForecast[]> {
  return Promise.all(
    spots.map(async (spot) => {
      try { return await fetchSpotForecast(spot, level); }
      catch { return emptyForecast(spot); }
    })
  );
}

export interface ProgressUpdate {
  results: SpotForecast[];
  done: number;
  total: number;
}

/**
 * Fetch all spots with a concurrency-limited worker pool.
 * onProgress fires after every completed fetch.
 * cancelled() lets the caller abort cleanly.
 */
export async function fetchAllForecastsProgressive(
  spots: Spot[],
  level: Level,
  onProgress: (u: ProgressUpdate) => void,
  cancelled: () => boolean = () => false,
  concurrency = 20
): Promise<SpotForecast[]> {
  const results: SpotForecast[] = [];
  let nextIdx = 0;
  const total = spots.length;

  async function worker() {
    while (true) {
      if (cancelled()) return;
      const idx = nextIdx++;
      if (idx >= total) return;
      const spot = spots[idx];
      let res: SpotForecast;
      try { res = await fetchSpotForecast(spot, level); }
      catch { res = emptyForecast(spot); }
      if (cancelled()) return;
      results.push(res);
      onProgress({ results: [...results], done: results.length, total });
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, total) }, () => worker()));
  return results;
}

export interface BestWindow {
  start: number;
  end: number;
  avg: number;
}

export interface HourScore {
  hour: number;
  score: number;
}

export interface DaylightWindow {
  scores: HourScore[];
  best: BestWindow | null;
  top: HourScore[];
  dawnHour: number;
  duskHour: number;
}

export function bestHoursForDay(
  forecast: SpotForecast,
  dayIdx: number,
  level: Level = "intermediate"
): DaylightWindow {
  const start = dayIdx * 24;
  const scores: HourScore[] = [];
  for (let h = 0; h < 24; h++) {
    const i = start + h;
    scores.push({
      hour: h,
      score: computeScore(
        forecast.hourly.waveHeight[i],
        forecast.hourly.wavePeriod[i],
        forecast.hourly.windSpeed[i],
        forecast.hourly.windDir[i],
        forecast.spot.offshore,
        level
      ),
    });
  }

  const sunrise = forecast.days[dayIdx]?.sunrise;
  const sunset = forecast.days[dayIdx]?.sunset;
  let dawnHour = 6, duskHour = 21;
  if (sunrise) dawnHour = new Date(sunrise).getHours();
  if (sunset) duskHour = new Date(sunset).getHours();

  let best: BestWindow | null = null;
  let bestSum = -1;
  for (let h = dawnHour; h <= duskHour - 2; h++) {
    const sum = scores[h].score + scores[h + 1].score + scores[h + 2].score;
    if (sum > bestSum) {
      bestSum = sum;
      best = { start: h, end: h + 2, avg: Math.round(sum / 3) };
    }
  }
  const top = best ? [best.start, best.start + 1, best.start + 2].map((h) => scores[h]) : [];
  return { scores, best, top, dawnHour, duskHour };
}
