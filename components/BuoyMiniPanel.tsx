"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Radio, Waves, Wind } from "lucide-react";
import type { BuoyObservation } from "@/lib/buoys";
import { fmt, haversineKm } from "@/lib/utils";

interface ApiResponse {
  observations: BuoyObservation[];
}

interface Props {
  title?: string;
  lat?: number;
  lon?: number;
  limit?: number;
  compact?: boolean;
}

export function BuoyMiniPanel({ title = "Bouées live proches", lat, lon, limit = 3, compact = false }: Props) {
  const [observations, setObservations] = useState<BuoyObservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/buoys")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: ApiResponse | null) => {
        if (cancelled) return;
        setObservations(data?.observations ?? []);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = useMemo(() => {
    return observations
      .map((observation) => ({
        observation,
        distanceKm: lat != null && lon != null
          ? haversineKm(lat, lon, observation.station.lat, observation.station.lon)
          : null,
      }))
      .sort((a, b) => {
        if (a.distanceKm != null && b.distanceKm != null) return a.distanceKm - b.distanceKm;
        if (a.observation.status === "live" && b.observation.status !== "live") return -1;
        if (a.observation.status !== "live" && b.observation.status === "live") return 1;
        return (b.observation.waveHeight ?? -1) - (a.observation.waveHeight ?? -1);
      })
      .slice(0, limit);
  }, [lat, limit, lon, observations]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
        <div className="shimmer-wave h-5 w-40 rounded-full bg-white/[0.04]" />
        <div className="mt-3 shimmer-wave h-16 rounded-xl bg-white/[0.03]" />
      </div>
    );
  }

  if (!visible.length) return null;

  return (
    <section className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4" aria-label={title}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold">
          <Radio className="h-4 w-4 text-ocean-300" />
          {title}
        </h2>
        <Link href="/bouees" className="shrink-0 text-xs text-ocean-300 hover:text-sand-200">
          Tout voir →
        </Link>
      </div>

      <div className={`grid gap-2 ${compact ? "" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {visible.map(({ observation, distanceKm }) => (
          <Link
            key={observation.station.id}
            href="/bouees"
            className="rounded-xl border border-white/[0.05] bg-white/[0.025] p-3 transition hover:border-ocean-400/40 hover:bg-white/[0.04]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="truncate font-display font-bold">{observation.station.shortName}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/35">
                  {distanceKm != null ? `${Math.round(distanceKm)} km` : observation.station.area}
                </div>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[9px] uppercase tracking-widest ${
                observation.status === "live"
                  ? "bg-emerald-500/15 text-emerald-200"
                  : "bg-white/[0.05] text-white/42"
              }`}>
                {observation.status === "live" ? "live" : observation.status}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <span className="flex items-center gap-1 text-white/70">
                <Waves className="h-3 w-3 text-ocean-300" />
                {fmt(observation.waveHeight)} m · {fmt(observation.dominantPeriod, 0)} s
              </span>
              <span className="flex items-center gap-1 text-white/70">
                <Wind className="h-3 w-3 text-ocean-300" />
                {fmt(observation.windSpeedKmh, 0)} km/h
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
