"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Radio, Waves, Wind } from "lucide-react";
import type { BuoyObservation } from "@/lib/buoys";
import { fmt, haversineKm } from "@/lib/utils";
import { useLocale } from "@/lib/useLocale";
import { t, tf, type Locale } from "@/lib/i18n";

interface ApiResponse {
  observations: BuoyObservation[];
}

interface Props {
  /** When omitted, the component falls back to a locale-aware default. */
  title?: string;
  lat?: number;
  lon?: number;
  limit?: number;
  compact?: boolean;
  /** Forecast wave height for the spot at the current moment, for delta vs live comparison. */
  forecastWaveHeight?: number | null;
}

export function BuoyMiniPanel({ title, lat, lon, limit = 3, compact = false, forecastWaveHeight }: Props) {
  const { locale } = useLocale();
  // title === "" → caller is providing its own heading (e.g. accordion summary). Hide the inner header.
  const showHeader = title !== "";
  const resolvedTitle = title ?? (lat != null && lon != null ? t(locale, "buoysMiniTitleNear") : t(locale, "buoysMiniTitleWatch"));
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
    <section
      className={showHeader ? "rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4" : ""}
      aria-label={resolvedTitle || t(locale, "buoysMiniNearestSpot")}
    >
      {showHeader && (
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold">
            <Radio className="h-4 w-4 text-ocean-300" />
            {resolvedTitle}
          </h2>
          <Link href="/bouees" className="shrink-0 text-xs text-ocean-300 hover:text-sand-200">
            {t(locale, "buoysMiniViewAll")}
          </Link>
        </div>
      )}

      <div className={`grid gap-2 ${compact ? "" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {visible.map(({ observation, distanceKm }) => {
          // Forecast-vs-live delta: only when we have both numbers and a sensible buoy nearby (<200km offshore).
          const delta = forecastWaveHeight != null && observation.waveHeight != null
            ? observation.waveHeight - forecastWaveHeight
            : null;
          const deltaLabel = delta == null ? null
            : Math.abs(delta) < 0.2 ? t(locale, "buoysDeltaOk")
            : delta > 0 ? tf(locale, "buoysDeltaAbove", { n: delta.toFixed(1) })
            : tf(locale, "buoysDeltaBelow", { n: delta.toFixed(1) });
          return (
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
                  {buoyStatusLabel(observation.status, locale)}
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
              {deltaLabel && (
                <div className={`mt-2 text-[10px] font-semibold ${
                  delta != null && Math.abs(delta) < 0.2 ? "text-emerald-300" : "text-sand-200/80"
                }`}>
                  {deltaLabel}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function buoyStatusLabel(status: BuoyObservation["status"], locale: Locale): string {
  switch (status) {
    case "live": return t(locale, "buoysStatusLive");
    case "partial": return t(locale, "buoysStatusPartial");
    case "stale": return t(locale, "buoysStatusStale");
    case "offline": return t(locale, "buoysStatusOffline");
  }
}
