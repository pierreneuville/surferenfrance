import type { SpotForecast } from "./types";

/**
 * Client-side wrappers for our own /api routes.
 * All upstream Open-Meteo calls are made server-side and cached at the Vercel edge
 * — the browser never hits Open-Meteo directly, which avoids rate limits.
 */

export async function fetchHomeForecasts(): Promise<SpotForecast[]> {
  const r = await fetch("/api/forecasts");
  if (!r.ok) throw new Error(`/api/forecasts ${r.status}`);
  return r.json();
}

export async function fetchSpotForecastFromApi(slug: string): Promise<SpotForecast> {
  const r = await fetch(`/api/forecast/${encodeURIComponent(slug)}`);
  if (!r.ok) throw new Error(`/api/forecast/${slug} ${r.status}`);
  return r.json();
}
