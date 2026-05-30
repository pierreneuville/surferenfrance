import type { Level, TideOptimal, TideState } from "./types";
import { tideMatchScore } from "./tide";

interface IdealRange {
  waveMin: number;
  waveOptimal: number;
  waveMax: number;
  periodOptimal: number;
  windMax: number;
  powerOptimal: number;
  powerMax: number;
}

const LEVEL_PROFILES: Record<Level, IdealRange> = {
  beginner: { waveMin: 0.3, waveOptimal: 0.8, waveMax: 1.5, periodOptimal: 8, windMax: 15, powerOptimal: 2.5, powerMax: 7 },
  intermediate: { waveMin: 0.5, waveOptimal: 1.5, waveMax: 2.5, periodOptimal: 10, windMax: 20, powerOptimal: 10, powerMax: 25 },
  advanced: { waveMin: 1.0, waveOptimal: 2.0, waveMax: 4.5, periodOptimal: 12, windMax: 25, powerOptimal: 25, powerMax: 70 },
};

interface ScoreOptions {
  worldClass?: boolean;
  /** Live tide state at the moment we're scoring (hourly resolution). */
  tideState?: TideState;
  /** Spot's preferred tide profile. */
  tideOptimal?: TideOptimal;
}

export function computeWavePower(
  waveHeight: number | null | undefined,
  wavePeriod: number | null | undefined
): number | null {
  if (waveHeight == null || wavePeriod == null) return null;
  return round(0.49 * waveHeight * waveHeight * wavePeriod, 1);
}

export function effectiveWaveHeight(
  waveHeight: number | null | undefined,
  wavePeriod: number | null | undefined
): number | null {
  if (waveHeight == null) return null;
  if (wavePeriod == null || wavePeriod <= 9) return round(waveHeight, 1);
  return round(waveHeight * (1 + 0.175 * (wavePeriod - 9)), 1);
}

export function isEngagedSurf(
  waveHeight: number | null | undefined,
  wavePeriod: number | null | undefined,
  level: Level
): boolean {
  const effective = effectiveWaveHeight(waveHeight, wavePeriod);
  if (effective == null || wavePeriod == null || level === "advanced") return false;
  if (level === "beginner") return effective > 1.4 || (waveHeight ?? 0) > 1.2 || wavePeriod > 10;
  return effective > 2.3 || ((waveHeight ?? 0) > 1.5 && wavePeriod > 12);
}

export function computeScore(
  waveHeight: number | null | undefined,
  wavePeriod: number | null | undefined,
  windSpeed: number | null | undefined,
  windDir: number | null | undefined,
  offshore: number,
  level: Level = "intermediate",
  options: ScoreOptions = {}
): number {
  if (waveHeight == null) return 0;
  if (options.worldClass && level !== "advanced") return 0;
  if (level === "beginner" && isEngagedSurf(waveHeight, wavePeriod, level)) return 0;

  const profile = LEVEL_PROFILES[level];
  const effectiveHeight = effectiveWaveHeight(waveHeight, wavePeriod) ?? waveHeight;

  let waveScore: number;
  if (effectiveHeight < profile.waveMin) {
    waveScore = (effectiveHeight / profile.waveMin) * 30;
  } else if (effectiveHeight <= profile.waveOptimal) {
    waveScore = 60 + ((effectiveHeight - profile.waveMin) / (profile.waveOptimal - profile.waveMin)) * 40;
  } else if (effectiveHeight <= profile.waveMax) {
    waveScore = 100 - ((effectiveHeight - profile.waveOptimal) / (profile.waveMax - profile.waveOptimal)) * 30;
  } else {
    waveScore = Math.max(10, 70 - (effectiveHeight - profile.waveMax) * 20);
  }
  waveScore = Math.max(0, Math.min(100, waveScore));

  let periodScore: number;
  if (wavePeriod == null) periodScore = 50;
  else if (wavePeriod < 5) periodScore = 20;
  else if (wavePeriod < profile.periodOptimal - 2) periodScore = 50;
  else if (wavePeriod < profile.periodOptimal) periodScore = 80;
  else periodScore = 100;

  let windScore: number;
  if (windSpeed == null) windScore = 50;
  else if (windSpeed < 8) windScore = 100;
  else if (windSpeed < profile.windMax) windScore = 80 - ((windSpeed - 8) / (profile.windMax - 8)) * 30;
  else if (windSpeed < profile.windMax + 10) windScore = 40;
  else windScore = Math.max(5, 30 - (windSpeed - profile.windMax - 10));

  if (windDir != null && windSpeed != null && windSpeed > 5) {
    let diff = Math.abs(windDir - offshore);
    if (diff > 180) diff = 360 - diff;
    if (diff < 45) windScore = Math.min(100, windScore + 15);
    else if (diff > 135) windScore = Math.max(0, windScore - 25);
  }

  const wavePower = computeWavePower(waveHeight, wavePeriod);
  let powerScore = 55;
  if (wavePower != null) {
    if (wavePower <= profile.powerOptimal) {
      powerScore = 55 + (wavePower / profile.powerOptimal) * 45;
    } else if (wavePower <= profile.powerMax) {
      powerScore = 100 - ((wavePower - profile.powerOptimal) / (profile.powerMax - profile.powerOptimal)) * 45;
    } else {
      powerScore = Math.max(0, 55 - (wavePower - profile.powerMax) * 2);
    }
  }

  // Tide. Only applied when we have BOTH a spot preference AND a live tide state.
  // Otherwise we fall back to 4-criteria weighting (35/25/25/15) so the daily
  // summary isn't artificially flattened toward 50 when tide is unknown.
  const tideEligible = options.tideOptimal != null && options.tideState != null;
  let score: number;
  if (tideEligible) {
    const match = tideMatchScore(options.tideState as TideState, options.tideOptimal!);
    const tideScore = Math.round(match * 100);
    score = Math.round(
      waveScore * 0.30 +
      periodScore * 0.20 +
      windScore * 0.20 +
      powerScore * 0.15 +
      tideScore * 0.15
    );
  } else {
    score = Math.round(waveScore * 0.35 + periodScore * 0.25 + windScore * 0.25 + powerScore * 0.15);
  }
  if (level === "intermediate" && isEngagedSurf(waveHeight, wavePeriod, level)) score = Math.min(score, 45);
  return score;
}

function round(value: number, digits: number) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function scoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Bien";
  if (score >= 40) return "Moyen";
  if (score >= 20) return "Faible";
  return "Plat";
}

export function scoreTone(score: number): "excellent" | "good" | "medium" | "poor" {
  if (score >= 80) return "excellent";
  if (score >= 60) return "good";
  if (score >= 40) return "medium";
  return "poor";
}

export const SCORE_COLORS = {
  excellent: { text: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/40", hex: "#10b981" },
  good: { text: "text-yellow-400", bg: "bg-yellow-500/20", border: "border-yellow-500/40", hex: "#eab308" },
  medium: { text: "text-orange-400", bg: "bg-orange-500/20", border: "border-orange-500/40", hex: "#fb923c" },
  poor: { text: "text-red-400", bg: "bg-red-500/15", border: "border-red-500/30", hex: "#ef4444" },
} as const;
