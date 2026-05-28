"use client";

import { useEffect, useMemo, useState } from "react";
import { Filters, SortKey } from "./Filters";
import { QuickActions } from "./QuickActions";
import { SpotCard } from "./SpotCard";
import { SpotModal } from "./SpotModal";
import { AdSlot } from "./AdSlot";
import { EmptyState } from "./EmptyState";
import { SkeletonCard } from "./SkeletonCard";
import { SPOTS } from "@/lib/spots";
import { fetchHomeForecasts } from "@/lib/clientApi";
import { ADSENSE_SLOT_IN_FEED } from "@/lib/adsense";
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
  const [progress, setProgress] = useState<{ done: number; total: number }>({ done: 0, total: SPOTS.length });
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

  // Single cached server-side fetch. Scores precomputed for the 3 levels, so changing
  // level does NOT trigger a refetch.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setForecasts([]);
    setProgress({ done: 0, total: SPOTS.length });
    fetchHomeForecasts()
      .then((data) => {
        if (cancelled) return;
        setForecasts(data);
        setProgress({ done: data.length, total: data.length });
        setUpdatedAt(new Date());
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to load forecasts:", err);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

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
        const sa = a.f.days[prefs.dayIdx]?.scoresByLevel?.[prefs.level] ?? a.f.days[prefs.dayIdx]?.score ?? 0;
        const sb = b.f.days[prefs.dayIdx]?.scoresByLevel?.[prefs.level] ?? b.f.days[prefs.dayIdx]?.score ?? 0;
        return sb - sa;
      });
  }, [forecasts, prefs, search, nearMe, userPos]);

  const openForecast = openSlug ? forecasts.find((f) => f.spot.slug === openSlug) : null;

  return (
    <div id="spots" className="mx-auto max-w-6xl px-4 pt-4 sm:pt-6">
      <QuickActions
        dayIdx={prefs.dayIdx}
        sort={prefs.sort}
        nearMe={nearMe}
        hasGeo={hasGeo}
        level={prefs.level}
        onApply={(patch) => setPrefs({ ...prefs, ...patch })}
        onToggleNearMe={requestGeo}
      />
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

      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-white/45">
        <span className="font-script text-base text-sand-200/80 sm:text-lg">
          {loading
            ? `Lecture des marées… ${progress.done}/${progress.total}`
            : `${visible.length} spot${visible.length > 1 ? "s" : ""} en vue 🤙`}
          {updatedAt && !loading && (
            <span className="ml-2 font-sans text-[10px] uppercase tracking-widest text-white/35">
              · maj {updatedAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </span>
        {loading && (
          <div className="h-1 w-32 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full bg-gradient-to-r from-coral-400 via-sunset-400 to-sand-300 transition-all duration-300"
              style={{ width: `${(progress.done / Math.max(1, progress.total)) * 100}%` }}
            />
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.length === 0 && !loading ? (
          <div className="col-span-full">
            <EmptyState message="Aucun spot ne correspond à tes filtres." />
          </div>
        ) : (
          <>
            {visible.flatMap(({ f, distanceKm }, idx) => {
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
                    <AdSlot slot={ADSENSE_SLOT_IN_FEED} label="Publicité in-feed" className="my-2" />
                  </div>,
                ];
              }
              return [card];
            })}
            {loading && Array.from({ length: Math.min(6, progress.total - progress.done) }, (_, i) => (
              <SkeletonCard key={`skel-${i}`} />
            ))}
          </>
        )}
      </div>

      <section id="a-propos" className="mt-20 overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-ocean-950/40 via-depth-950 to-depth-950 p-8 sm:p-10">
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-sand-200/70">À propos du score</div>
        <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
          <span className="text-gradient-ocean">Une note simple,</span>
          <br />
          <span className="font-script text-4xl text-gradient-sunset sm:text-5xl">trois ingrédients.</span>
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Pillar
            icon="🌊"
            title="La vague (40%)"
            text="Sa hauteur. 1 à 2,5 m c'est souvent la zone douce. Trop petit = épuisant. Trop gros = uniquement pour ceux qui savent."
          />
          <Pillar
            icon="⏱️"
            title="La période (30%)"
            text="Le temps entre deux vagues. Au-delà de 10 s, c'est de la vraie houle, formée loin au large — plus puissante, plus propre."
          />
          <Pillar
            icon="💨"
            title="Le vent (30%)"
            text="Idéalement faible. Bonus quand il vient de la terre (offshore) : il sculpte les vagues. Malus s'il vient du large (onshore)."
          />
        </div>
        <p className="mt-6 text-sm text-white/55">
          Le score se recalcule selon ton niveau, pour que <em>Hossegor La Gravière</em> ne ressorte pas en débutant.
          Données <a href="https://open-meteo.com" target="_blank" rel="noreferrer" className="underline hover:text-sand-200">Open-Meteo</a> rafraîchies toutes les 6 h,
          modèle haute résolution 5 km sur les côtes françaises.
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

function Pillar({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">
      <div className="mb-2 text-2xl">{icon}</div>
      <div className="mb-1 font-display text-lg font-bold">{title}</div>
      <p className="text-sm leading-relaxed text-white/65">{text}</p>
    </div>
  );
}
