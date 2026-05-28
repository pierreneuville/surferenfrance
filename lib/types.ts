export type Level = "beginner" | "intermediate" | "advanced";

export type Region =
  | "Manche & Nord"
  | "Bretagne"
  | "Atlantique Nord"
  | "Côte d'Argent"
  | "Pays Basque"
  | "Méditerranée"
  | "Corse";

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
}

export interface DaySummary {
  date: string;
  waveHeight: number | null;
  wavePeriod: number | null;
  waveDir: number | null;
  windSpeed: number | null;
  windDir: number | null;
  windGusts: number | null;
  sunrise: string | null;
  sunset: string | null;
  score: number;
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
}

export interface SpotForecast {
  spot: Spot;
  days: DaySummary[];
  hourly: HourlyData;
}
