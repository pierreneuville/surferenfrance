export function fmt(num: number | null | undefined, digits = 1): string {
  return num == null || isNaN(num) ? "—" : Number(num).toFixed(digits);
}

export function degToCardinal(deg: number | null | undefined): string {
  if (deg == null || isNaN(deg)) return "";
  const dirs = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  return dirs[Math.round(deg / 45) % 8];
}

const EARTH_KM = 6371;
export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_KM * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const DAY_LABELS_SHORT = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"];

export function dayShortLabel(offset: number): string {
  if (offset === 0) return "Auj.";
  if (offset === 1) return "Dem.";
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return DAY_LABELS_SHORT[d.getDay()];
}

export function dayLongLabel(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  if (offset === 0) return "Aujourd'hui";
  if (offset === 1) return "Demain";
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

export function timeFromIso(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "—";
  }
}
