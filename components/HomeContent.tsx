"use client";

import { useEffect, useMemo, useState } from "react";
import { Filters, SortKey } from "./Filters";
import { SpotCard } from "./SpotCard";
import { SpotModal } from "./SpotModal";
import { AdSlot } from "./AdSlot";
import { EmptyState } from "./EmptyState";
import { SkeletonCard } from "./SkeletonCard";
import { SPOTS } from "@/lib/spots";
import { fetchAllForecasts } from "@/lib/api";
import { haversineKm } from "@/lib/utils";
import type { Level, SpotForecast } from "@/lib/types";

const PREFS_KEY = "surf-prefs-v2";

interface Prefs {
  dayIdx: number;
  region: string;
  level: Level;
  sort: SortKey;
}

const DEFAULT_PREFS: Prefs = {
  dayIdx: 0,
  region: "all",
  level: "intermediate",
  sort: "score",
};

export function HomeContent() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [search, setSearch] = useState("");
  const [forecasts, setForecasts] = useState<SpotForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [userPos, setUserPos] = useState<{ lat: number; lon: number } | null>(null);
  const [nearMe, setNearMe] = useState(false);
  const [hasGeo, setHasGeo] = useState(false);

  useEffect(() => { setHasGeo(typeof navigator !== "undefined" && !!navigator.geolocation); }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (raw) setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(raw) });
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch {}
  }, [prefs]);

  // Refetch when level changes (score depends on it)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchAllForecasts(SPOTS, prefs.level).then((data) => {
      if (cancelled) return;
      setForecasts(data);
      setUpdatedAt(new Date());
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [prefs.level]);

  const requestGeo = () => {
    if (!hasGeo) return;
    if (userPos) { setNearMe((v) => !v); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setNearMe(true);
      },
      () => alert("Géolocalisation refusée ou indisponible."),
      { timeout: 8000 }
    );
  };

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return forecasts
      .map((f) => {
        const distanceKm = userPos
          ? haversineKm(userPos.lat, userPos.lon, f.spot.lat, f.spot.lon)
          : undefined;
        return { f, distanceKm };
      })
      .filter(({ f, distanceKm }) => {
        if (prefs.region !== "all" && f.spot.region !== prefs.region) return false;
        if (q && !f.spot.name.toLowerCase().includes(q) && !f.spot.shortName.toLowerCase().includes(q)) return false;
        if (nearMe && distanceKm != null && distanceKm > 200) return false;
        return true;
      })
      .sort((a, b) => {
        if (prefs.sort === "name") return a.f.spot.shortName.localeCompare(b.f.spot.shortName);
        if (prefs.sort === "wave") return (b.f.days[prefs.dayIdx]?.waveHeight ?? 0) - (a.f.days[prefs.dayIdx]?.waveHeight ?? 0);
        if (prefs.sort === "distance" && nearMe) return (a.distanceKm ?? 1e9) - (b.distanceKm ?? 1e9);
        return (b.f.days[prefs.dayIdx]?.score ?? 0) - (a.f.days[prefs.dayIdx]?.score ?? 0);
      });
  }, [forecasts, prefs, search, nearMe, userPos]);

  const openForecast = openSlug ? forecasts.find((f) => f.spot.slug === openSlug) : null;

  return (
    <div id="spots" className="mx-auto max-w-6xl px-4">
      <Filters
        dayIdx={prefs.dayIdx}
        region={prefs.region}
        level={prefs.level}
        sort={prefs.sort}
        search={search}
        nearMe={nearMe}
        hasGeo={hasGeo}
        onDayChange={(d) => setPrefs({ ...prefs, dayIdx: d })}
        onRegionChange={(r) => setPrefs({ ...prefs, region: r })}
        onLevelChange={(l) => setPrefs({ ...prefs, level: l })}
        onSortChange={(s) => setPrefs({ ...prefs, sort: s })}
        onSearchChange={setSearch}
        onNearMeToggle={requestGeo}
      />

      <div className="mt-4 flex items-center justify-between text-xs text-white/40">
        <span>
          {loading ? "Chargement…" : `${visible.length} spot${visible.length > 1 ? "s" : ""}`}
          {updatedAt && !loading && (
            <span className="ml-2">
              · mis à jour à {updatedAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 9 }, (_, i) => <SkeletonCard key={i} />)
          : visible.length === 0
          ? (
            <div className="col-span-full">
              <EmptyState message="Aucun spot ne correspond à tes filtres." />
            </div>
          )
          : visible.flatMap(({ f, distanceKm }, idx) => {
              const card = (
                <SpotCard
                  key={f.spot.slug}
                  forecast={f}
                  dayIdx={prefs.dayIdx}
                  level={prefs.level}
                  distanceKm={distanceKm}
                  onClick={() => setOpenSlug(f.spot.slug)}
                />
              );
              if ((idx + 1) % 6 === 0) {
                return [
                  card,
                  <div key={`ad-${idx}`} className="col-span-full">
                    <AdSlot label="Publicité in-feed" className="my-2" />
                  </div>,
                ];
              }
              return [card];
            })}
      </div>

      <section id="a-propos" className="mt-20 rounded-3xl border border-white/5 bg-white/[0.02] p-8">
        <h2 className="font-display text-2xl font-bold">Comment on calcule le score ?</h2>
        <p className="mt-3 text-white/70 text-pretty">
          Le score 0–100 combine trois facteurs : la <strong>hauteur des vagues</strong> (40 %),
          la <strong>période de la houle</strong> (30 %, plus c'est long, plus c'est puissant) et
          le <strong>vent</strong> (30 %, avec bonus quand il est offshore — vent de terre vers la mer). Le score est
          ajusté selon ton niveau (débutant, intermédiaire, confirmé) pour t'éviter de te retrouver
          dans des conditions trop puissantes — ou trop molles.
        </p>
        <p className="mt-3 text-sm text-white/50">
          Données fournies par <a href="https://open-meteo.com" target="_blank" rel="noreferrer" className="underline hover:text-ocean-300">Open-Meteo</a>,
          mises à jour toutes les 6 heures. Modèle haute résolution 5 km sur les côtes européennes.
        </p>
      </section>

      {openForecast && (
        <SpotModal
          forecast={openForecast}
          dayIdx={prefs.dayIdx}
          level={prefs.level}
          onClose={() => setOpenSlug(null)}
        />
      )}
    </div>
  );
}
