import { SPOTS } from "./spots";
import type { Spot } from "./types";
import { degToCardinal, haversineKm } from "./utils";

// Providers — multi-API strategy per country. Free first, paid only where ROI justifies it.
//   NOAA_NDBC      free, global, used today (Atlantique, Manche, North Sea, large offshore)
//   CANDHIS_READY  France, CEREMA, requires habilitation token — architecture is wired, awaiting access
//   WAVENET_READY  UK, Cefas, free with attribution — planned for v1.1
//   PUERTOS_READY  Spain (Atlantic + Med), Puertos del Estado free CSV — planned for v1.1
//   IH_READY       Portugal, Instituto Hidrográfico — paid, deferred to v2 (start without)
//   NONE           country deliberately ships without live buoys (e.g. Maroc, Canaries) — forecast only
export type BuoyProvider =
  | "NOAA_NDBC"
  | "CANDHIS_READY"
  | "WAVENET_READY"
  | "PUERTOS_READY"
  | "IH_READY"
  | "NONE";

export type BuoyArea = "Atlantique" | "Manche" | "Méditerranée" | "International";
export type BuoyStatus = "live" | "stale" | "partial" | "offline";

// Country → provider plan. Single source of truth for "where do we have / will we have / will we skip buoys".
// Used by docs, ops, and future regional fetchers. The runtime only reads NOAA today.
export const BUOY_COUNTRY_PLAN: Record<string, { provider: BuoyProvider; status: "live" | "planned" | "deferred" | "skipped"; note: string }> = {
  france:    { provider: "CANDHIS_READY",  status: "planned",  note: "NOAA offshore stations cover France today. CANDHIS coastal buoys planned when token granted." },
  uk:        { provider: "WAVENET_READY",  status: "planned",  note: "Cefas WaveNet free with attribution — high ROI, ships next." },
  ireland:   { provider: "NOAA_NDBC",      status: "live",     note: "NOAA Atlantic stations already useful for west coast (Aileens, Mullaghmore)." },
  spain:     { provider: "PUERTOS_READY",  status: "planned",  note: "Puertos del Estado free CSV — covers Atlantic + Mediterranean." },
  portugal:  { provider: "IH_READY",       status: "deferred", note: "Instituto Hidrográfico is paid. Ship Portugal without buoys in v1; consider once revenue covers cost." },
  morocco:   { provider: "NONE",           status: "skipped",  note: "No accessible national network. Spot pages stay forecast-only." },
  canaries:  { provider: "PUERTOS_READY",  status: "planned",  note: "Covered by Puertos del Estado (Spanish jurisdiction)." },
};

export interface BuoyStation {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  provider: BuoyProvider;
  area: BuoyArea;
  lat: number;
  lon: number;
  sourceUrl: string;
  note?: string;
}

export interface BuoyObservation {
  station: BuoyStation;
  status: BuoyStatus;
  observedAt: string | null;
  ageMinutes: number | null;
  waveHeight: number | null;
  waveMax: number | null;
  waveMin: number | null;
  dominantPeriod: number | null;
  averagePeriod: number | null;
  waveDirection: number | null;
  waveDirectionCardinal: string;
  windSpeedKmh: number | null;
  windDirection: number | null;
  windDirectionCardinal: string;
  gustKmh: number | null;
  waterTemp: number | null;
  pressure: number | null;
  qualityNote: string;
}

const NOAA_BASE = "https://www.ndbc.noaa.gov/data/realtime2";

export const BUOY_STATIONS: BuoyStation[] = [
  station("62163", "brittany-buoy", "Brittany Buoy", "Brittany", "Atlantique", 47.55, -8.47, "Bouée offshore pertinente pour les houles longues qui arrivent sur Bretagne / Atlantique Nord."),
  station("62029", "k1-buoy", "K1 Buoy", "K1 Atlantique", "Atlantique", 48.72, -12.43, "Point large Atlantique, utile pour lire les trains de houle avant leur arrivée."),
  station("62107", "sevenstones", "Sevenstones Lightship", "Sevenstones", "Manche", 50.102, -6.1, "Ouest Manche / Cornouailles, intéressant pour les houles qui entrent vers Manche et Bretagne nord."),
  station("62103", "channel-lightship", "Channel Lightship", "Channel", "Manche", 49.9, -2.9, "Manche occidentale, utile pour estimer le vent et l'état de mer au large."),
  station("62030", "l4-buoy", "L4 Buoy", "L4", "Manche", 50.25, -4.217, "Entrée de Manche, données partielles selon les périodes."),
  station("62050", "e1-buoy", "E1", "E1", "Manche", 50.0, -4.4, "Entrée de Manche, complément à L4."),
  station("62170", "f3-light-vessel", "F3 Light Vessel", "F3", "Manche", 51.24, 2.0, "Mer du Nord sud, utile pour Manche & Nord."),
  station("62165", "ravenspurn-north", "Ravenspurn North AWS", "Ravenspurn", "Manche", 54.0, 1.1, "Mer du Nord, surtout vent et tendance."),
  station("62164", "anasuria", "Anasuria AWS", "Anasuria", "International", 57.2, 0.8, "Mer du Nord offshore, surtout indicateur météo large."),
  station("62105", "k4-buoy", "K4 Buoy", "K4 Atlantique", "International", 55.41, -11.81, "Atlantique nord, très large. Donne une lecture de houle amont plus que côtière."),
];

export const CANDHIS_NOTE =
  "CANDHIS/Cerema expose les bouées françaises temps réel via une API officielle avec habilitation. Yosurf est prêt à brancher ce fournisseur dès qu'un jeton est disponible.";

function station(id: string, slug: string, name: string, shortName: string, area: BuoyArea, lat: number, lon: number, note?: string): BuoyStation {
  return {
    id,
    slug,
    name,
    shortName,
    area,
    lat,
    lon,
    note,
    provider: "NOAA_NDBC",
    sourceUrl: `https://www.ndbc.noaa.gov/station_page.php?station=${id}`,
  };
}

export async function fetchBuoyObservations(): Promise<BuoyObservation[]> {
  const observations = await Promise.all(BUOY_STATIONS.map(fetchNoaaObservation));
  return observations.sort((a, b) => {
    if (a.status === "live" && b.status !== "live") return -1;
    if (a.status !== "live" && b.status === "live") return 1;
    return (b.waveHeight ?? -1) - (a.waveHeight ?? -1);
  });
}

export function nearestBuoys(lat: number, lon: number, observations: BuoyObservation[], limit = 3) {
  return observations
    .map((observation) => ({
      observation,
      distanceKm: haversineKm(lat, lon, observation.station.lat, observation.station.lon),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}

export function nearestBuoyForSpot(spot: Spot, observations: BuoyObservation[]) {
  return nearestBuoys(spot.lat, spot.lon, observations, 1)[0] ?? null;
}

export function nearestSpotsForBuoy(observation: BuoyObservation, limit = 4) {
  return SPOTS
    .map((spot) => ({
      spot,
      distanceKm: haversineKm(observation.station.lat, observation.station.lon, spot.lat, spot.lon),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}

async function fetchNoaaObservation(station: BuoyStation): Promise<BuoyObservation> {
  try {
    const response = await fetch(`${NOAA_BASE}/${station.id}.txt`, { next: { revalidate: 900 } });
    if (!response.ok) return emptyObservation(station, "offline", "Fichier NOAA indisponible.");
    const text = await response.text();
    return parseNoaaRealtime(station, text);
  } catch {
    return emptyObservation(station, "offline", "Erreur réseau pendant la lecture NOAA.");
  }
}

// Exported for unit tests + potential future reuse.
export function parseNoaaRealtime(station: BuoyStation, text: string): BuoyObservation {
  const line = text
    .split("\n")
    .map((item) => item.trim())
    .find((item) => item && !item.startsWith("#"));

  if (!line) return emptyObservation(station, "offline", "Aucune mesure exploitable dans le flux NOAA.");

  const parts = line.split(/\s+/);
  const year = parseNumber(parts[0]);
  const month = parseNumber(parts[1]);
  const day = parseNumber(parts[2]);
  const hour = parseNumber(parts[3]);
  const minute = parseNumber(parts[4]);
  const observedAt = year && month && day && hour != null && minute != null
    ? new Date(Date.UTC(year, month - 1, day, hour, minute)).toISOString()
    : null;
  const ageMinutes = observedAt ? Math.max(0, Math.round((Date.now() - new Date(observedAt).getTime()) / 60000)) : null;

  const windDirection = parseNumber(parts[5]);
  const windSpeedKmh = msToKmh(parseNumber(parts[6]));
  const gustKmh = msToKmh(parseNumber(parts[7]));
  const waveHeight = parseNumber(parts[8]);
  const dominantPeriod = parseNumber(parts[9]);
  const averagePeriod = parseNumber(parts[10]);
  const waveDirection = parseNumber(parts[11]);
  const pressure = parseNumber(parts[12]);
  const waterTemp = parseNumber(parts[14]);

  const hasWave = waveHeight != null || dominantPeriod != null || averagePeriod != null;
  const hasWind = windSpeedKmh != null || windDirection != null;
  const status: BuoyStatus = !hasWave && !hasWind
    ? "offline"
    : ageMinutes != null && ageMinutes > 360
    ? "stale"
    : !hasWave || !hasWind
    ? "partial"
    : "live";

  return {
    station,
    status,
    observedAt,
    ageMinutes,
    waveHeight,
    waveMax: waveHeight != null ? round(waveHeight * 1.55, 1) : null,
    waveMin: waveHeight != null ? round(waveHeight * 0.55, 1) : null,
    dominantPeriod,
    averagePeriod,
    waveDirection,
    waveDirectionCardinal: degToCardinal(waveDirection),
    windSpeedKmh,
    windDirection,
    windDirectionCardinal: degToCardinal(windDirection),
    gustKmh,
    waterTemp,
    pressure,
    qualityNote: qualityNote(status, hasWave, hasWind, ageMinutes),
  };
}

function emptyObservation(station: BuoyStation, status: BuoyStatus, qualityNote: string): BuoyObservation {
  return {
    station,
    status,
    observedAt: null,
    ageMinutes: null,
    waveHeight: null,
    waveMax: null,
    waveMin: null,
    dominantPeriod: null,
    averagePeriod: null,
    waveDirection: null,
    waveDirectionCardinal: "",
    windSpeedKmh: null,
    windDirection: null,
    windDirectionCardinal: "",
    gustKmh: null,
    waterTemp: null,
    pressure: null,
    qualityNote,
  };
}

function parseNumber(value: string | undefined) {
  if (!value || value === "MM") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function msToKmh(value: number | null) {
  return value == null ? null : round(value * 3.6, 0);
}

function round(value: number, digits: number) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function qualityNote(status: BuoyStatus, hasWave: boolean, hasWind: boolean, ageMinutes: number | null) {
  if (status === "offline") return "Station hors ligne ou mesures manquantes.";
  if (status === "stale") return `Dernier relevé ancien (${ageMinutes} min). À confirmer avant décision.`;
  if (!hasWave) return "Mesure vent disponible, mais houle absente sur le dernier relevé.";
  if (!hasWind) return "Mesure houle disponible, mais vent absent sur le dernier relevé.";
  return "Dernier relevé exploitable.";
}
