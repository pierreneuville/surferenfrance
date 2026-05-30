import type { TideExtreme, TideOptimal, TideState } from "./types";

/**
 * Detect high/low water extremes from a sea-level series (hourly samples).
 * Strategy: any sample that is strictly greater (resp. lower) than both
 * neighbours in a ±2h window is a candidate extreme. We then keep the
 * dominant one per ~6h window to avoid noise.
 */
export function detectTideExtremes(times: (string | null)[], heights: (number | null)[]): TideExtreme[] {
  if (!times.length || times.length !== heights.length) return [];
  const out: TideExtreme[] = [];
  for (let i = 2; i < heights.length - 2; i++) {
    const h = heights[i];
    if (h == null) continue;
    const window = [heights[i - 2], heights[i - 1], heights[i + 1], heights[i + 2]];
    const allNumber = window.every((v) => v != null);
    if (!allNumber) continue;
    const ws = window as number[];
    const max = Math.max(...ws);
    const min = Math.min(...ws);
    if (h > max) out.push({ time: times[i] as string, height: round(h, 2), type: "high" });
    else if (h < min) out.push({ time: times[i] as string, height: round(h, 2), type: "low" });
  }
  // Deduplicate near-identical extremes (within 3h)
  const filtered: TideExtreme[] = [];
  for (const e of out) {
    const last = filtered[filtered.length - 1];
    if (last && last.type === e.type && hourDelta(last.time, e.time) < 3) {
      if (Math.abs(e.height) > Math.abs(last.height)) filtered[filtered.length - 1] = e;
      continue;
    }
    filtered.push(e);
  }
  return filtered;
}

/**
 * Compute the tide state at a given hour from the series.
 * Returns "rising" / "falling" via local slope, and "high"/"low" near extremes,
 * "mid" when neither dominant.
 */
export function tideStateAt(heights: (number | null)[], hourIdx: number): TideState {
  const h = heights[hourIdx];
  const prev = heights[hourIdx - 1];
  const next = heights[hourIdx + 1];
  if (h == null) return "mid";

  // Local slope direction
  let slope = 0;
  if (prev != null && next != null) slope = next - prev;
  else if (next != null) slope = next - h;
  else if (prev != null) slope = h - prev;

  // Detect proximity to an extreme: very small slope + near min/max of a ±3h window
  const window: number[] = [];
  for (let k = -3; k <= 3; k++) {
    const v = heights[hourIdx + k];
    if (v != null) window.push(v);
  }
  if (window.length >= 3) {
    const max = Math.max(...window);
    const min = Math.min(...window);
    const range = max - min;
    if (range > 0.1) {
      const near = 0.15 * range;
      if (Math.abs(h - max) < near && Math.abs(slope) < 0.05) return "high";
      if (Math.abs(h - min) < near && Math.abs(slope) < 0.05) return "low";
    }
  }
  if (slope > 0.02) return "rising";
  if (slope < -0.02) return "falling";
  return "mid";
}

/**
 * Returns 0..1 — how well the live tide state matches the spot's preference.
 * 1 = perfect match, 0.5 = neutral, 0 = wrong tide.
 */
export function tideMatchScore(state: TideState, optimal: TideOptimal | undefined): number {
  if (!optimal || optimal === "any") return 0.5;
  if (state === optimal) return 1;
  // Tolerant matches
  const tolerant: Record<TideOptimal, TideState[]> = {
    rising: ["mid", "high"],
    falling: ["mid", "low"],
    high: ["rising"],
    low: ["falling"],
    "mid-high": ["rising", "high", "mid"],
    "mid-low": ["falling", "low", "mid"],
    mid: ["rising", "falling"],
    any: [],
  };
  if (tolerant[optimal].includes(state)) return 0.65;
  return 0.15;
}

/**
 * Compute the tide range (high - low) over a day window.
 */
export function tideRangeForDay(heights: (number | null)[], startHour: number): number | null {
  const slice: number[] = [];
  for (let h = 0; h < 24; h++) {
    const v = heights[startHour + h];
    if (v != null) slice.push(v);
  }
  if (slice.length < 12) return null;
  return round(Math.max(...slice) - Math.min(...slice), 2);
}

/**
 * Tide labels — FR default, kept for backward compat with non-i18n callers.
 * For i18n, prefer tideStateKey / tideOptimalKey and use `t(locale, key)`.
 */
export function tideStateLabel(state: TideState): string {
  switch (state) {
    case "rising": return "marée monte ↑";
    case "falling": return "marée descend ↓";
    case "high": return "marée haute";
    case "low": return "marée basse";
    case "mid": return "mi-marée";
  }
}

export function tideOptimalLabel(opt: TideOptimal): string {
  switch (opt) {
    case "rising": return "marée montante ↑";
    case "falling": return "marée descendante ↓";
    case "high": return "marée haute";
    case "low": return "marée basse";
    case "mid-high": return "mi-marée montante ↗";
    case "mid-low": return "mi-marée descendante ↘";
    case "mid": return "mi-marée";
    case "any": return "toutes marées";
  }
}

/** Translation key for a tide state — pair with `t(locale, ...)`. */
export function tideStateKey(state: TideState): "tideRising" | "tideFalling" | "tideHigh" | "tideLow" | "tideMid" {
  switch (state) {
    case "rising": return "tideRising";
    case "falling": return "tideFalling";
    case "high": return "tideHigh";
    case "low": return "tideLow";
    case "mid": return "tideMid";
  }
}

/** Translation key for a tide preference — pair with `t(locale, ...)`. */
export function tideOptimalKey(opt: TideOptimal):
  | "tideOptimalRising" | "tideOptimalFalling" | "tideOptimalHigh" | "tideOptimalLow"
  | "tideOptimalMidHigh" | "tideOptimalMidLow" | "tideOptimalMid" | "tideOptimalAny" {
  switch (opt) {
    case "rising": return "tideOptimalRising";
    case "falling": return "tideOptimalFalling";
    case "high": return "tideOptimalHigh";
    case "low": return "tideOptimalLow";
    case "mid-high": return "tideOptimalMidHigh";
    case "mid-low": return "tideOptimalMidLow";
    case "mid": return "tideOptimalMid";
    case "any": return "tideOptimalAny";
  }
}

function hourDelta(a: string, b: string): number {
  return Math.abs(new Date(a).getTime() - new Date(b).getTime()) / 3600_000;
}

function round(v: number, d: number): number {
  const f = 10 ** d;
  return Math.round(v * f) / f;
}
