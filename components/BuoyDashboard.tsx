"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp, Clock, ExternalLink, MapPin, Waves, Wind, X as XIcon } from "lucide-react";
import type { BuoyArea, BuoyObservation, BuoyStatus } from "@/lib/buoys";
import { SPOTS } from "@/lib/spots";
import type { Spot } from "@/lib/types";
import { fmt, haversineKm } from "@/lib/utils";
import { useLocale } from "@/lib/useLocale";
import { t, tf, type Locale } from "@/lib/i18n";

type SortKey = "waveHeight" | "dominantPeriod" | "windSpeedKmh" | "ageMinutes" | "name";

interface Props {
  observations: BuoyObservation[];
  updatedAt: string;
}

const AREA_FILTERS: Array<BuoyArea | "Toutes"> = ["Toutes", "Atlantique", "Manche", "Méditerranée", "International"];

function areaLabel(area: BuoyArea | "Toutes", locale: Locale): string {
  switch (area) {
    case "Toutes": return t(locale, "buoysFilterAll");
    case "Atlantique": return t(locale, "buoysAreaAtlantique");
    case "Manche": return t(locale, "buoysAreaManche");
    case "Méditerranée": return t(locale, "buoysAreaMed");
    case "International": return t(locale, "buoysAreaIntl");
  }
}

export function BuoyDashboard({ observations, updatedAt }: Props) {
  const { locale } = useLocale();
  const [area, setArea] = useState<BuoyArea | "Toutes">("Toutes");
  const [sort, setSort] = useState<SortKey>("waveHeight");
  const [liveOnly, setLiveOnly] = useState(false);
  const [spotQuery, setSpotQuery] = useState("");
  const [pinnedSpot, setPinnedSpot] = useState<Spot | null>(null);

  // Spot autocomplete suggestions (top 6 matches, name match insensitive)
  const spotSuggestions = useMemo(() => {
    const q = spotQuery.trim().toLowerCase();
    if (q.length < 2 || pinnedSpot) return [];
    return SPOTS
      .filter((s) => s.shortName.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
      .slice(0, 6);
  }, [spotQuery, pinnedSpot]);

  const visible = useMemo(() => {
    let base = observations
      .filter((observation) => area === "Toutes" || observation.station.area === area)
      .filter((observation) => !liveOnly || observation.status === "live");
    // When a spot is pinned, sort by distance to that spot (overrides other sorts)
    if (pinnedSpot) {
      return base
        .map((obs) => ({
          obs,
          distance: haversineKm(pinnedSpot.lat, pinnedSpot.lon, obs.station.lat, obs.station.lon),
        }))
        .sort((a, b) => a.distance - b.distance)
        .map(({ obs }) => obs);
    }
    return base.sort((a, b) => compareBuoys(a, b, sort));
  }, [area, liveOnly, observations, sort, pinnedSpot]);

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-white/[0.06] bg-white/[0.025] p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.25em] text-sand-200/60">{t(locale, "buoysDashboardKicker")}</p>
            <h2 className="mt-1 font-display text-2xl font-bold">{t(locale, "buoysDashboardTitle")}</h2>
            <p className="mt-1 text-sm text-white/55">
              {tf(locale, "buoysDashboardSync", { date: formatDate(updatedAt) })}
            </p>

            {/* Spot-anchored search: surfer mental model — "trouve la bouée pour MON spot" */}
            <div className="relative mt-3 max-w-md">
              {pinnedSpot ? (
                <div className="flex items-center gap-2 rounded-full border border-ocean-400/40 bg-ocean-500/15 px-3 py-2 text-sm text-ocean-100">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="font-display font-bold">{pinnedSpot.shortName}</span>
                  <span className="text-ocean-200/60">— {t(locale, "buoysPinnedNearest")}</span>
                  <button
                    onClick={() => { setPinnedSpot(null); setSpotQuery(""); }}
                    className="ml-auto rounded-full p-1 transition hover:bg-ocean-500/25"
                    aria-label={t(locale, "buoysRemovePinnedSpot")}
                  >
                    <XIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="search"
                    value={spotQuery}
                    onChange={(e) => setSpotQuery(e.target.value)}
                    placeholder={t(locale, "buoysSpotSearchPlaceholder")}
                    className="w-full rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-white placeholder-white/40 outline-none transition focus:border-ocean-400 focus:bg-white/[0.05]"
                  />
                  {spotSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-60 overflow-y-auto rounded-2xl border border-white/[0.08] bg-depth-950 p-1 shadow-2xl">
                      {spotSuggestions.map((s) => (
                        <button
                          key={s.slug}
                          onClick={() => { setPinnedSpot(s); setSpotQuery(""); }}
                          className="block w-full rounded-xl px-3 py-2 text-left text-sm transition hover:bg-white/[0.05]"
                        >
                          <span className="font-display font-bold text-white">{s.shortName}</span>
                          <span className="ml-2 text-xs text-white/45">{s.region} · {s.department}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto] lg:min-w-[760px]">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" aria-label={t(locale, "buoysKicker")}>
              {AREA_FILTERS.map((item) => (
                <button
                  key={item}
                  onClick={() => setArea(item)}
                  className={`shrink-0 rounded-full border px-3 py-2 text-sm transition ${
                    area === item
                      ? "border-ocean-400 bg-ocean-500/20 text-ocean-100"
                      : "border-white/[0.08] bg-white/[0.03] text-white/60 hover:text-white"
                  }`}
                >
                  {areaLabel(item, locale)}
                </button>
              ))}
            </div>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="w-full appearance-none rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white/80 outline-none [color-scheme:dark] focus:border-ocean-400 sm:w-auto"
              aria-label={t(locale, "buoysSortWave")}
            >
              <option value="waveHeight">{t(locale, "buoysSortWave")}</option>
              <option value="dominantPeriod">{t(locale, "buoysSortPeriod")}</option>
              <option value="windSpeedKmh">{t(locale, "buoysSortWind")}</option>
              <option value="ageMinutes">{t(locale, "buoysSortAge")}</option>
              <option value="name">{t(locale, "buoysSortName")}</option>
            </select>
            <button
              onClick={() => setLiveOnly((value) => !value)}
              className={`rounded-full border px-3 py-2 text-sm transition ${
                liveOnly
                  ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-100"
                  : "border-white/[0.08] bg-white/[0.03] text-white/60 hover:text-white"
              }`}
            >
              {t(locale, "buoysFilterLiveOnly")}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 lg:hidden">
        {visible.map((observation) => (
          <BuoyMobileCard key={observation.station.id} observation={observation} locale={locale} />
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.025] lg:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/[0.06] bg-white/[0.025] text-xs uppercase tracking-widest text-white/40">
            <tr>
              <Th label={t(locale, "buoysColBuoy")} />
              <Th label={t(locale, "buoysColZone")} />
              <Th label={t(locale, "buoysColAvgH")} />
              <Th label={t(locale, "buoysColMaxH")} />
              <Th label={t(locale, "buoysColMinH")} />
              <Th label={t(locale, "buoysColPeriod")} />
              <Th label={t(locale, "buoysColDir")} />
              <Th label={t(locale, "buoysColWind")} />
              <Th label={t(locale, "buoysColAge")} />
              <Th label={t(locale, "buoysColStatus")} />
            </tr>
          </thead>
          <tbody>
            {visible.map((observation) => (
              <tr key={observation.station.id} className="border-b border-white/[0.04] last:border-b-0">
                <td className="px-4 py-3">
                  <a
                    href={observation.station.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1 font-display text-base font-bold hover:text-ocean-200"
                  >
                    {observation.station.name}
                    <ExternalLink className="h-3 w-3 text-white/30 transition group-hover:text-ocean-200" />
                  </a>
                  <div className="text-xs text-white/35" title={`Station NOAA ${observation.station.id}`}>{t(locale, "buoysLiveMeasure")} · {observation.station.id}</div>
                </td>
                <td className="px-4 py-3 text-white/65">{areaLabel(observation.station.area, locale)}</td>
                <td className="px-4 py-3 font-semibold">{fmt(observation.waveHeight)} m</td>
                <td className="px-4 py-3 text-white/70">{fmt(observation.waveMax)} m</td>
                <td className="px-4 py-3 text-white/70">{fmt(observation.waveMin)} m</td>
                <td className="px-4 py-3">{fmt(observation.dominantPeriod, 0)} s</td>
                <td className="px-4 py-3">{observation.waveDirectionCardinal || "—"}</td>
                <td className="px-4 py-3">
                  {fmt(observation.windSpeedKmh, 0)} km/h {observation.windDirectionCardinal}
                </td>
                <td className="px-4 py-3 text-white/60">{formatAge(observation.ageMinutes)}</td>
                <td className="px-4 py-3"><StatusPill status={observation.status} locale={locale} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visible.length === 0 && (
        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.025] p-8 text-center text-white/55">
          {t(locale, "buoysEmpty")}
        </div>
      )}
    </div>
  );
}

export function BuoyMobileCard({ observation, locale }: { observation: BuoyObservation; locale: Locale }) {
  return (
    <article className="rounded-3xl border border-white/[0.06] bg-white/[0.025] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-white/35">
            {areaLabel(observation.station.area, locale)} · {t(locale, "buoysLiveMeasure")}
          </div>
          <h3 className="mt-1 font-display text-xl font-bold">{observation.station.name}</h3>
          <p className="mt-1 text-xs text-white/45">{observation.station.note}</p>
        </div>
        <StatusPill status={observation.status} locale={locale} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Metric icon={<Waves className="h-3.5 w-3.5" />} label={t(locale, "buoysMobileSwell")} value={`${fmt(observation.waveHeight)} m`} sub={`${t(locale, "buoysMaxShort")} ${fmt(observation.waveMax)} m`} />
        <Metric icon={<ArrowDownUp className="h-3.5 w-3.5" />} label={t(locale, "buoysMobilePeriod")} value={`${fmt(observation.dominantPeriod, 0)} s`} sub={observation.waveDirectionCardinal || "—"} />
        <Metric icon={<Wind className="h-3.5 w-3.5" />} label={t(locale, "buoysMobileWind")} value={`${fmt(observation.windSpeedKmh, 0)} km/h`} sub={observation.windDirectionCardinal || "—"} />
        <Metric icon={<Clock className="h-3.5 w-3.5" />} label={t(locale, "buoysMobileReading")} value={formatAge(observation.ageMinutes)} sub={formatDate(observation.observedAt)} />
      </div>

      <p className="mt-3 text-xs text-white/42">{observation.qualityNote}</p>
      <a
        href={observation.station.sourceUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-white/60 hover:text-ocean-200"
      >
        {t(locale, "buoysSourceNoaa")}
        <ExternalLink className="h-3 w-3" />
      </a>
    </article>
  );
}

function Metric({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.025] p-3">
      <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-white/35">
        <span className="text-ocean-300">{icon}</span>
        {label}
      </div>
      <div className="font-display text-lg font-bold">{value}</div>
      {sub && <div className="text-xs text-white/38">{sub}</div>}
    </div>
  );
}

function Th({ label }: { label: string }) {
  return <th className="px-4 py-3 font-medium">{label}</th>;
}

function StatusPill({ status, locale }: { status: BuoyStatus; locale: Locale }) {
  const styles: Record<BuoyStatus, string> = {
    live: "border-emerald-400/40 bg-emerald-500/15 text-emerald-200",
    partial: "border-sand-300/35 bg-sand-300/10 text-sand-100",
    stale: "border-orange-300/35 bg-orange-500/10 text-orange-100",
    offline: "border-white/[0.08] bg-white/[0.03] text-white/45",
  };
  const labels: Record<BuoyStatus, string> = {
    live: t(locale, "buoysStatusLive"),
    partial: t(locale, "buoysStatusPartial"),
    stale: t(locale, "buoysStatusStale"),
    offline: t(locale, "buoysStatusOffline"),
  };
  return (
    <span className={`inline-flex shrink-0 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-widest ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function compareBuoys(a: BuoyObservation, b: BuoyObservation, sort: SortKey) {
  if (sort === "name") return a.station.name.localeCompare(b.station.name);
  if (sort === "ageMinutes") return (a.ageMinutes ?? 1e9) - (b.ageMinutes ?? 1e9);
  return ((b[sort] as number | null) ?? -1) - ((a[sort] as number | null) ?? -1);
}

function formatAge(ageMinutes: number | null) {
  if (ageMinutes == null) return "—";
  if (ageMinutes < 60) return `${ageMinutes} min`;
  return `${Math.floor(ageMinutes / 60)}h${String(ageMinutes % 60).padStart(2, "0")}`;
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}
