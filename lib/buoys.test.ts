import { describe, expect, it } from "vitest";
import {
  BUOY_STATIONS,
  BUOY_COUNTRY_PLAN,
  nearestBuoys,
  parseNoaaRealtime,
  type BuoyObservation,
  type BuoyStation,
} from "./buoys";

const SAMPLE_STATION: BuoyStation = {
  id: "62107",
  slug: "test",
  name: "Sevenstones Lightship",
  shortName: "Sevenstones",
  provider: "NOAA_NDBC",
  area: "Manche",
  lat: 50.1,
  lon: -6.1,
  sourceUrl: "https://example.org/62107",
};

// A realistic NDBC realtime2 file. First two lines are headers (starting with #),
// then space-separated values: YY MM DD hh mm WDIR WSPD GST WVHT DPD APD MWD PRES ATMP WTMP DEWP VIS PTDY TIDE
const SAMPLE_LIVE = `#YY  MM DD hh mm WDIR WSPD GST  WVHT  DPD APD MWD PRES  ATMP  WTMP DEWP VIS PTDY TIDE
#yr  mo dy hr mn degT m/s  m/s     m   sec sec deg hPa    degC  degC degC  mi  hPa   ft
2026 01 15 14 30 270  8.0 12.0   1.8  12  10 280  1015  10.2  13.0 11.0  10.0 0.0  MM
2026 01 15 14 00 265  7.5 11.5   1.7  12  10 278  1015  10.1  13.0 11.0  10.0 0.0  MM
`;

const SAMPLE_ALL_MM = `#YY  MM DD hh mm WDIR WSPD GST  WVHT  DPD APD MWD PRES  ATMP  WTMP DEWP VIS PTDY TIDE
2026 01 15 14 30  MM  MM  MM    MM   MM  MM  MM   MM    MM    MM   MM   MM  MM   MM
`;

const SAMPLE_HEADERS_ONLY = `#YY  MM DD hh mm WDIR WSPD GST  WVHT  DPD APD MWD PRES  ATMP  WTMP DEWP VIS PTDY TIDE
#yr  mo dy hr mn degT m/s  m/s     m   sec sec deg hPa    degC  degC degC  mi  hPa   ft
`;

describe("parseNoaaRealtime", () => {
  it("parses a normal NDBC line into a live observation", () => {
    const obs = parseNoaaRealtime(SAMPLE_STATION, SAMPLE_LIVE);
    expect(obs.station.id).toBe("62107");
    expect(obs.waveHeight).toBe(1.8);
    expect(obs.dominantPeriod).toBe(12);
    expect(obs.waveDirection).toBe(280);
    // 8 m/s → 29 km/h (rounded)
    expect(obs.windSpeedKmh).toBe(29);
    expect(obs.waveDirectionCardinal).toBeTruthy();
  });

  it("computes max/min estimates from significant height", () => {
    const obs = parseNoaaRealtime(SAMPLE_STATION, SAMPLE_LIVE);
    expect(obs.waveMax).toBeCloseTo(1.8 * 1.55, 1);
    expect(obs.waveMin).toBeCloseTo(1.8 * 0.55, 1);
  });

  it("treats 'MM' tokens as nulls without crashing", () => {
    const obs = parseNoaaRealtime(SAMPLE_STATION, SAMPLE_ALL_MM);
    expect(obs.waveHeight).toBeNull();
    expect(obs.dominantPeriod).toBeNull();
    expect(obs.windSpeedKmh).toBeNull();
    expect(obs.status).toBe("offline");
  });

  it("returns offline status when only headers are present", () => {
    const obs = parseNoaaRealtime(SAMPLE_STATION, SAMPLE_HEADERS_ONLY);
    expect(obs.status).toBe("offline");
    expect(obs.qualityNote).toMatch(/exploitable/i);
  });

  it("flags reading as stale when older than 6h", () => {
    // Build a line from 8h ago
    const old = new Date(Date.now() - 8 * 60 * 60 * 1000);
    const y = old.getUTCFullYear();
    const mo = String(old.getUTCMonth() + 1).padStart(2, "0");
    const d = String(old.getUTCDate()).padStart(2, "0");
    const h = String(old.getUTCHours()).padStart(2, "0");
    const m = String(old.getUTCMinutes()).padStart(2, "0");
    const oldFile = `#YY MM DD hh mm WDIR WSPD GST WVHT DPD APD MWD PRES ATMP WTMP DEWP VIS PTDY TIDE
${y} ${mo} ${d} ${h} ${m} 270 8 12 1.5 10 8 270 1015 10 13 11 10 0 MM`;
    const obs = parseNoaaRealtime(SAMPLE_STATION, oldFile);
    expect(obs.status).toBe("stale");
  });
});

describe("nearestBuoys", () => {
  it("returns the closest N observations to a given lat/lon", () => {
    // Two fake observations at different distances from Hossegor (43.67, -1.44)
    const close: BuoyObservation = makeObs("close", 43.5, -1.5);
    const far: BuoyObservation = makeObs("far", 50, -8);
    const result = nearestBuoys(43.67, -1.44, [far, close], 2);
    expect(result[0].observation.station.id).toBe("close");
    expect(result[1].observation.station.id).toBe("far");
    expect(result[0].distanceKm).toBeLessThan(result[1].distanceKm);
  });
});

describe("BUOY_STATIONS / BUOY_COUNTRY_PLAN", () => {
  it("ships at least one station per documented area", () => {
    const areas = new Set(BUOY_STATIONS.map((s) => s.area));
    expect(areas.has("Atlantique")).toBe(true);
    expect(areas.has("Manche")).toBe(true);
  });
  it("country plan lists France, Spain, UK, Portugal, Morocco, Ireland, Canaries", () => {
    for (const key of ["france", "spain", "uk", "portugal", "morocco", "ireland", "canaries"]) {
      expect(BUOY_COUNTRY_PLAN[key]).toBeDefined();
    }
  });
});

function makeObs(id: string, lat: number, lon: number): BuoyObservation {
  return {
    station: { ...SAMPLE_STATION, id, slug: id, lat, lon },
    status: "live",
    observedAt: null,
    ageMinutes: 0,
    waveHeight: 1,
    waveMax: 1.55,
    waveMin: 0.55,
    dominantPeriod: 10,
    averagePeriod: 8,
    waveDirection: 280,
    waveDirectionCardinal: "W",
    windSpeedKmh: 20,
    windDirection: 280,
    windDirectionCardinal: "W",
    gustKmh: 25,
    waterTemp: 14,
    pressure: 1015,
    qualityNote: "ok",
  };
}
