import type { Level } from "./types";

interface IdealRange {
  waveMin: number;
  waveOptimal: number;
  waveMax: number;
  periodOptimal: number;
  windMax: number;
}

const LEVEL_PROFILES: Record<Level, IdealRange> = {
  beginner: { waveMin: 0.3, waveOptimal: 0.8, waveMax: 1.5, periodOptimal: 8, windMax: 15 },
  intermediate: { waveMin: 0.5, waveOptimal: 1.5, waveMax: 2.5, periodOptimal: 10, windMax: 20 },
  advanced: { waveMin: 1.0, waveOptimal: 2.0, waveMax: 4.5, periodOptimal: 12, windMax: 25 },
};

export function computeScore(
  waveHeight: number | null | undefined,
  wavePeriod: number | null | undefined,
  windSpeed: number | null | undefined,
  windDir: number | null | undefined,
  offshore: number,
  level: Level = "intermediate"
): number {
  if (waveHeight == null) return 0;
  const profile = LEVEL_PROFILES[level];

  let waveScore: number;
  if (waveHeight < profile.waveMin) {
    waveScore = (waveHeight / profile.waveMin) * 30;
  } else if (waveHeight <= profile.waveOptimal) {
    waveScore = 60 + ((waveHeight - profile.waveMin) / (profile.waveOptimal - profile.waveMin)) * 40;
  } else if (waveHeight <= profile.waveMax) {
    waveScore = 100 - ((waveHeight - profile.waveOptimal) / (profile.waveMax - profile.waveOptimal)) * 30;
  } else {
    waveScore = Math.max(10, 70 - (waveHeight - profile.waveMax) * 20);
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

  return Math.round(waveScore * 0.4 + periodScore * 0.3 + windScore * 0.3);
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
