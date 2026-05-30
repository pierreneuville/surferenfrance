"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp, Clock, ExternalLink, Waves, Wind } from "lucide-react";
import type { BuoyArea, BuoyObservation, BuoyStatus } from "@/lib/buoys";
import { fmt } from "@/lib/utils";

type SortKey = "waveHeight" | "dominantPeriod" | "windSpeedKmh" | "ageMinutes" | "name";

interface Props {
  observations: BuoyObservation[];
  updatedAt: string;
}

const AREA_FILTERS: Array<BuoyArea | "Toutes"> = ["Toutes", "Atlantique", "Manche", "Méditerranée", "International"];

export function BuoyDashboard({ observations, updatedAt }: Props) {
  const [area, setArea] = useState<BuoyArea | "Toutes">("Toutes");
  const [sort, setSort] = useState<SortKey>("waveHeight");
  const [liveOnly, setLiveOnly] = useState(false);

  const visible = useMemo(() => {
    return observations
      .filter((observation) => area === "Toutes" || observation.station.area === area)
      .filter((observation) => !liveOnly || observation.status === "live")
      .sort((a, b) => compareBuoys(a, b, sort));
  }, [area, liveOnly, observations, sort]);

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-white/[0.06] bg-white/[0.025] p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-sand-200/60">Relevés directs</p>
            <h2 className="mt-1 font-display text-2xl font-bold">Toutes les bouées en un coup d'oeil</h2>
            <p className="mt-1 text-sm text-white/55">
              Dernière synchronisation Yosurf : {formatDate(updatedAt)}
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto] lg:min-w-[760px]">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" aria-label="Filtrer les bouées par zone">
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
                  {item}
                </button>
              ))}
            </div>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="w-full appearance-none rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white/80 outline-none [color-scheme:dark] focus:border-ocean-400 sm:w-auto"
              aria-label="Trier les bouées"
            >
              <option value="waveHeight">Tri : hauteur</option>
              <option value="dominantPeriod">Tri : période</option>
              <option value="windSpeedKmh">Tri : vent</option>
              <option value="ageMinutes">Tri : fraîcheur</option>
              <option value="name">Tri : A-Z</option>
            </select>
            <button
              onClick={() => setLiveOnly((value) => !value)}
              className={`rounded-full border px-3 py-2 text-sm transition ${
                liveOnly
                  ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-100"
                  : "border-white/[0.08] bg-white/[0.03] text-white/60 hover:text-white"
              }`}
            >
              Live seulement
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 lg:hidden">
        {visible.map((observation) => (
          <BuoyMobileCard key={observation.station.id} observation={observation} />
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.025] lg:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/[0.06] bg-white/[0.025] text-xs uppercase tracking-widest text-white/40">
            <tr>
              <Th label="Bouée" />
              <Th label="Zone" />
              <Th label="H moy" />
              <Th label="H max" />
              <Th label="H min" />
              <Th label="Période" />
              <Th label="Dir" />
              <Th label="Vent" />
              <Th label="Relevé" />
              <Th label="État" />
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
                  <div className="text-xs text-white/35">NOAA {observation.station.id}</div>
                </td>
                <td className="px-4 py-3 text-white/65">{observation.station.area}</td>
                <td className="px-4 py-3 font-semibold">{fmt(observation.waveHeight)} m</td>
                <td className="px-4 py-3 text-white/70">{fmt(observation.waveMax)} m</td>
                <td className="px-4 py-3 text-white/70">{fmt(observation.waveMin)} m</td>
                <td className="px-4 py-3">{fmt(observation.dominantPeriod, 0)} s</td>
                <td className="px-4 py-3">{observation.waveDirectionCardinal || "—"}</td>
                <td className="px-4 py-3">
                  {fmt(observation.windSpeedKmh, 0)} km/h {observation.windDirectionCardinal}
                </td>
                <td className="px-4 py-3 text-white/60">{formatAge(observation.ageMinutes)}</td>
                <td className="px-4 py-3"><StatusPill status={observation.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visible.length === 0 && (
        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.025] p-8 text-center text-white/55">
          Aucune bouée ne correspond aux filtres.
        </div>
      )}
    </div>
  );
}

export function BuoyMobileCard({ observation }: { observation: BuoyObservation }) {
  return (
    <article className="rounded-3xl border border-white/[0.06] bg-white/[0.025] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-white/35">
            {observation.station.area} · NOAA {observation.station.id}
          </div>
          <h3 className="mt-1 font-display text-xl font-bold">{observation.station.name}</h3>
          <p className="mt-1 text-xs text-white/45">{observation.station.note}</p>
        </div>
        <StatusPill status={observation.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Metric icon={<Waves className="h-3.5 w-3.5" />} label="Houle" value={`${fmt(observation.waveHeight)} m`} sub={`max ${fmt(observation.waveMax)} m`} />
        <Metric icon={<ArrowDownUp className="h-3.5 w-3.5" />} label="Période" value={`${fmt(observation.dominantPeriod, 0)} s`} sub={observation.waveDirectionCardinal || "direction —"} />
        <Metric icon={<Wind className="h-3.5 w-3.5" />} label="Vent" value={`${fmt(observation.windSpeedKmh, 0)} km/h`} sub={observation.windDirectionCardinal || "direction —"} />
        <Metric icon={<Clock className="h-3.5 w-3.5" />} label="Relevé" value={formatAge(observation.ageMinutes)} sub={formatDate(observation.observedAt)} />
      </div>

      <p className="mt-3 text-xs text-white/42">{observation.qualityNote}</p>
      <a
        href={observation.station.sourceUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-white/60 hover:text-ocean-200"
      >
        Source NOAA
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

function StatusPill({ status }: { status: BuoyStatus }) {
  const styles: Record<BuoyStatus, string> = {
    live: "border-emerald-400/40 bg-emerald-500/15 text-emerald-200",
    partial: "border-sand-300/35 bg-sand-300/10 text-sand-100",
    stale: "border-orange-300/35 bg-orange-500/10 text-orange-100",
    offline: "border-white/[0.08] bg-white/[0.03] text-white/45",
  };
  const labels: Record<BuoyStatus, string> = {
    live: "Live",
    partial: "Partiel",
    stale: "Ancien",
    offline: "Offline",
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
