export type Level = "beginner" | "intermediate" | "advanced";

export type Region =
  // 🇫🇷 France
  | "Manche & Nord"
  | "Bretagne"
  | "Atlantique Nord"
  | "Aquitaine"
  | "Pays Basque"
  | "Méditerranée"
  | "Corse"
  | "Outre-Mer"
  // 🇪🇸 Espagne
  | "Espagne Atlantique"
  | "Canaries"
  // 🇵🇹 Portugal
  | "Portugal"
  // 🇲🇦 Maroc
  | "Maroc"
  // 🇬🇧 UK + 🇮🇪 Irlande
  | "Royaume-Uni"
  | "Irlande";

/** Tide preference profile per spot. Many breaks only fire on specific tide states. */
export type TideOptimal = "rising" | "falling" | "high" | "mid-high" | "mid" | "mid-low" | "low" | "any";

/** Computed tide state for an hour. Mid covers anything within ~25% of the mean. */
export type TideState = "rising" | "falling" | "high" | "low" | "mid";

export interface Spot {
  slug: string;
  name: string;
  shortName: string;
  region: Region;
  department: string;
  lat: number;
  lon: number;
  offshore: number;
  level: Level;
  description: string;
  type: string;
  /** True for elite / consequential spots that should not be suggested to non-advanced surfers. */
  worldClass?: boolean;
  /** When set, the score is boosted (or penalised) when the live tide matches (or contradicts) this preference. */
  tideOptimal?: TideOptimal;
}

export interface TideExtreme {
  /** ISO local time of the high or low water. */
  time: string;
  /** Height in meters above MSL — relative, not absolute. */
  height: number;
  /** "high" or "low". */
  type: "high" | "low";
}

export interface BestWindowSummary {
  start: number;
  end: number;
  avg: number;
}

export interface DaySummary {
  date: string;
  waveHeight: number | null;
  wavePeriod: number | null;
  /** Wave height adjusted for long-period sets; useful for safety and perceived size. */
  effectiveWaveHeight?: number | null;
  /** Deep-water wave energy proxy in kW/m: ~0.49 * H² * T. */
  wavePower?: number | null;
  /** True when the conditions are beyond the comfort zone of the selected level. */
  engagedSurf?: boolean;
  waveDir: number | null;
  windSpeed: number | null;
  windDir: number | null;
  windGusts: number | null;
  sunrise: string | null;
  sunset: string | null;
  /** Tide extremes for the day (high/low water), local time. */
  tideExtremes?: TideExtreme[];
  /** Range of the day's tide in meters (high - low). Indicates spring vs neap. */
  tideRange?: number | null;
  /** Score at "intermediate" level — kept for backward compat. Prefer scoresByLevel. */
  score: number;
  /** Precomputed scores for each level (server-side). */
  scoresByLevel?: Record<Level, number>;
  /** Precomputed best 3h window per level (server-side, daylight hours). */
  bestWindowByLevel?: Record<Level, BestWindowSummary | null>;
}

export interface HourlyData {
  times: string[];
  waveHeight: (number | null)[];
  wavePeriod: (number | null)[];
  waveDir: (number | null)[];
  seaTemp: (number | null)[];
  windSpeed: (number | null)[];
  windDir: (number | null)[];
  windGusts: (number | null)[];
  airTemp: (number | null)[];
  /** Sea level height above mean (m). Used to derive tide state per hour. */
  tideHeight?: (number | null)[];
}

export interface SpotForecast {
  spot: Spot;
  days: DaySummary[];
  hourly: HourlyData;
}
