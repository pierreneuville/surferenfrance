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
  // CANDHIS official measurements need a CEREMA habilitation token. Until we have it,
  // we proxy the same coordinates via Open-Meteo Marine — clearly labelled as "modèle"
  // in the UI so users know it's not a real in-situ measurement.
  | "CANDHIS_OPEN_METEO_PROXY"
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
  // ===== NOAA NDBC — vraies mesures in-situ, Atlantique + Manche + Mer du Nord =====
  noaaStation("62163", "brittany-buoy", "Brittany Buoy", "Brittany", "Atlantique", 47.55, -8.47, "Bouée offshore pertinente pour les houles longues qui arrivent sur Bretagne / Atlantique Nord."),
  noaaStation("62029", "k1-buoy", "K1 Buoy", "K1 Atlantique", "Atlantique", 48.72, -12.43, "Point large Atlantique, utile pour lire les trains de houle avant leur arrivée."),
  noaaStation("62107", "sevenstones", "Sevenstones Lightship", "Sevenstones", "Manche", 50.102, -6.1, "Ouest Manche / Cornouailles, intéressant pour les houles qui entrent vers Manche et Bretagne nord."),
  noaaStation("62103", "channel-lightship", "Channel Lightship", "Channel", "Manche", 49.9, -2.9, "Manche occidentale, utile pour estimer le vent et l'état de mer au large."),
  noaaStation("62030", "l4-buoy", "L4 Buoy", "L4", "Manche", 50.25, -4.217, "Entrée de Manche, données partielles selon les périodes."),
  noaaStation("62050", "e1-buoy", "E1", "E1", "Manche", 50.0, -4.4, "Entrée de Manche, complément à L4."),
  noaaStation("62170", "f3-light-vessel", "F3 Light Vessel", "F3", "Manche", 51.24, 2.0, "Mer du Nord sud, utile pour Manche & Nord."),
  noaaStation("62165", "ravenspurn-north", "Ravenspurn North AWS", "Ravenspurn", "Manche", 54.0, 1.1, "Mer du Nord, surtout vent et tendance."),
  noaaStation("62164", "anasuria", "Anasuria AWS", "Anasuria", "International", 57.2, 0.8, "Mer du Nord offshore, surtout indicateur météo large."),
  noaaStation("62105", "k4-buoy", "K4 Buoy", "K4 Atlantique", "International", 55.41, -11.81, "Atlantique nord, très large. Donne une lecture de houle amont plus que côtière."),

  // ===== CANDHIS Méditerranée — positions réelles des houlographes CEREMA, =====
  // données issues du modèle Open-Meteo Marine (en attendant l'accès officiel CANDHIS).
  candhisStation("banyuls", "Banyuls", "Banyuls", "Méditerranée", 42.488, 3.135, "Bouée côtière Banyuls — exposée aux tempêtes de SE catalanes."),
  candhisStation("sete", "Sète", "Sète", "Méditerranée", 43.379, 3.690, "Golfe du Lion central, houles fréquentes par Tramontane et tempêtes E."),
  candhisStation("leucate", "Leucate", "Leucate", "Méditerranée", 42.876, 3.062, "Côte audoise, beach/reef breaks sensibles aux houles E-SE."),
  candhisStation("le-planier", "Le Planier (Marseille)", "Le Planier", "Méditerranée", 43.196, 5.230, "Bouée du Planier, signal Marseille / Calanques."),
  candhisStation("porquerolles", "Porquerolles", "Porquerolles", "Méditerranée", 42.969, 6.218, "Iles d'Hyères, lecture utile pour Var côte d'Azur ouest."),
  candhisStation("cap-ferrat", "Cap Ferrat (Nice)", "Cap Ferrat", "Méditerranée", 43.683, 7.330, "Bouée Nice / Cap Ferrat, état de mer Côte d'Azur."),
  candhisStation("lion", "Lion (Golfe du Lion offshore)", "Lion", "Méditerranée", 42.10, 4.70, "Bouée offshore Golfe du Lion — annonce les houles avant qu'elles touchent la côte."),

  // ===== CANDHIS Atlantique côtier — complète les bouées NOAA offshore =====
  candhisStation("les-pierres-noires", "Les Pierres Noires (Iroise)", "Pierres Noires", "Atlantique", 48.286, -4.973, "Mer d'Iroise, bouée référence pour Crozon / Finistère sud."),
  candhisStation("oleron-large", "Oléron Large", "Oléron Large", "Atlantique", 45.92, -1.83, "Au large d'Oléron, signal Charente-Maritime + Sud Vendée."),
  candhisStation("cap-ferret-large", "Cap Ferret Large", "Cap Ferret Large", "Atlantique", 44.652, -1.450, "Bassin d'Arcachon offshore, houles vers Médoc + Bassin."),
  candhisStation("biscarrosse-large", "Biscarrosse Large", "Biscarrosse Large", "Atlantique", 44.40, -1.45, "Landes nord, houles vers Mimizan / Biscarrosse / Hossegor."),
];

export const CANDHIS_NOTE =
  "Les bouées CANDHIS (CEREMA) sont indiquées aux vraies positions des houlographes du réseau national. Les valeurs affichées sont issues du modèle Open-Meteo Marine en attendant l'habilitation CEREMA officielle.";

function noaaStation(id: string, slug: string, name: string, shortName: string, area: BuoyArea, lat: number, lon: number, note?: string): BuoyStation {
  return {
    id, slug, name, shortName, area, lat, lon, note,
    provider: "NOAA_NDBC",
    sourceUrl: `https://www.ndbc.noaa.gov/station_page.php?station=${id}`,
  };
}

function candhisStation(slug: string, name: string, shortName: string, area: BuoyArea, lat: number, lon: number, note?: string): BuoyStation {
  return {
    id: `candhis-${slug}`, slug, name, shortName, area, lat, lon, note,
    provider: "CANDHIS_OPEN_METEO_PROXY",
    sourceUrl: "https://candhis.cerema.fr/",
  };
}

export async function fetchBuoyObservations(): Promise<BuoyObservation[]> {
  const observations = await Promise.all(
    BUOY_STATIONS.map((s) =>
      s.provider === "NOAA_NDBC"
        ? fetchNoaaObservation(s)
        : s.provider === "CANDHIS_OPEN_METEO_PROXY"
          ? fetchOpenMeteoProxyObservation(s)
          : emptyObservation(s, "offline", `Provider ${s.provider} pas encore branché.`)
    )
  );
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

/**
 * Open-Meteo Marine proxy at the real coordinates of a CANDHIS station.
 * NOT a measurement — it's the same model we use for spot forecasts, queried at the
 * buoy's location. Once we have a CEREMA token, swap this for the real CANDHIS feed.
 */
async function fetchOpenMeteoProxyObservation(station: BuoyStation): Promise<BuoyObservation> {
  try {
    const url =
      `https://marine-api.open-meteo.com/v1/marine?latitude=${station.lat}&longitude=${station.lon}` +
      `&current=wave_height,wave_period,wave_direction,wind_wave_height,swell_wave_period` +
      `&timezone=UTC`;
    const res = await fetch(url, { next: { revalidate: 900 } });
    if (!res.ok) return emptyObservation(station, "offline", "Open-Meteo Marine indisponible.");
    const data = await res.json();
    const cur = data.current ?? {};
    const waveHeight = numOrNull(cur.wave_height);
    const dominantPeriod = numOrNull(cur.wave_period);
    const waveDirection = numOrNull(cur.wave_direction);
    const observedAtRaw: string | undefined = cur.time;
    const observedAt = observedAtRaw ? new Date(observedAtRaw + (observedAtRaw.endsWith("Z") ? "" : "Z")).toISOString() : null;
    const ageMinutes = observedAt ? Math.max(0, Math.round((Date.now() - new Date(observedAt).getTime()) / 60000)) : null;

    // Wind comes from a different Open-Meteo endpoint (forecast, not marine).
    let windSpeedKmh: number | null = null;
    let windDirection: number | null = null;
    try {
      const windRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${station.lat}&longitude=${station.lon}` +
        `&current=wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=UTC`,
        { next: { revalidate: 900 } }
      );
      if (windRes.ok) {
        const w = (await windRes.json()).current ?? {};
        windSpeedKmh = numOrNull(w.wind_speed_10m);
        windDirection = numOrNull(w.wind_direction_10m);
      }
    } catch { /* silent — wave alone is enough to render */ }

    if (waveHeight == null) return emptyObservation(station, "offline", "Aucune donnée modèle pour cette position.");

    return {
      station,
      // "partial" intentionally — communicates "real signal, but not a true in-situ measurement"
      status: "partial",
      observedAt,
      ageMinutes,
      waveHeight,
      waveMax: waveHeight != null ? round(waveHeight * 1.55, 1) : null,
      waveMin: waveHeight != null ? round(waveHeight * 0.55, 1) : null,
      dominantPeriod,
      averagePeriod: null,
      waveDirection,
      waveDirectionCardinal: degToCardinal(waveDirection),
      windSpeedKmh,
      windDirection,
      windDirectionCardinal: degToCardinal(windDirection),
      gustKmh: null,
      waterTemp: null,
      pressure: null,
      qualityNote: "Modèle Open-Meteo Marine à la position CANDHIS — pas une mesure in-situ.",
    };
  } catch {
    return emptyObservation(station, "offline", "Erreur réseau pendant la lecture modèle.");
  }
}

function numOrNull(v: unknown): number | null {
  return typeof v === "number" && !isNaN(v) ? v : null;
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
