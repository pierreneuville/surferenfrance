"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { Filters, SortKey } from "./Filters";
import { QuickActions } from "./QuickActions";
import { HotToday } from "./HotToday";
import { WeekHighlights } from "./WeekHighlights";
import { MySpots } from "./MySpots";
import { MobileBottomBar } from "./MobileBottomBar";
import { captureException } from "@/lib/errorReporting";

// BuoyMiniPanel fetches /api/buoys on mount — keep it out of the initial bundle
// since it's secondary to the spot grid. SSR off because it's purely client-driven.
const BuoyMiniPanel = dynamic(() => import("./BuoyMiniPanel").then((m) => m.BuoyMiniPanel), {
  ssr: false,
  loading: () => (
    <div className="shimmer-wave h-24 rounded-2xl border border-white/[0.06] bg-white/[0.025]" />
  ),
});
import { getFavorites, subscribeFavorites, toggleFavorite } from "@/lib/favorites";
import { getEngagement, recordExploredSpot, subscribeEngagement } from "@/lib/engagement";
import { trackEvent } from "@/lib/analytics";
import { REGION_COUNTRY } from "@/lib/countries";
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
  country: string;
  region: string;
  level: Level;
  sort: SortKey;
  /** "Près de moi" actif par défaut — l'utilisateur cherche d'abord ce qui marche autour. */
  nearMe: boolean;
}

const DEFAULT_PREFS: Prefs = {
  dayIdx: 0,
  country: "FR",
  region: "all",
  level: "intermediate",
  sort: "score",
  nearMe: true,
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
  const [geoPrecise, setGeoPrecise] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  // nearMe lives on prefs (persisted) — derived getter/setter for compat with existing handlers
  const nearMe = prefs.nearMe;
  const setNearMe = (next: boolean | ((v: boolean) => boolean)) => {
    setPrefs((p) => ({ ...p, nearMe: typeof next === "function" ? next(p.nearMe) : next }));
  };
  const [hasGeo, setHasGeo] = useState(false);
  const [favorites, setFavoritesState] = useState<string[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [exploredCount, setExploredCount] = useState(0);

  useEffect(() => { setHasGeo(typeof navigator !== "undefined" && !!navigator.geolocation); }, []);

  // Non-blocking IP-based geo via Vercel edge headers. Fires once on mount,
  // gives us an approximate position without showing a permission prompt.
  // The precise browser geolocation is still requested when the user taps "Near me".
  useEffect(() => {
    let cancelled = false;
    fetch("/api/geo")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { lat: number | null; lon: number | null } | null) => {
        if (cancelled || !data || data.lat == null || data.lon == null) return;
        // Only set if precise geo hasn't already been resolved
        setUserPos((prev) => prev ?? { lat: data.lat as number, lon: data.lon as number });
      })
      .catch(() => { /* silent */ });
    return () => { cancelled = true; };
  }, []);

  // Sync favorites from localStorage + listen to changes
  useEffect(() => {
    setFavoritesState(getFavorites());
    const unsub = subscribeFavorites(() => setFavoritesState(getFavorites()));
    return unsub;
  }, []);

  // Sync engagement (explored count)
  useEffect(() => {
    setExploredCount(getEngagement().exploredSlugs.length);
    const unsub = subscribeEngagement(() => setExploredCount(getEngagement().exploredSlugs.length));
    return unsub;
  }, []);

  // Track spot exploration when a modal opens
  useEffect(() => {
    if (openSlug) {
      recordExploredSpot(openSlug);
      trackEvent("spot_modal_open", { slug: openSlug });
    }
  }, [openSlug]);

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
        captureException(err, { area: "home/fetchForecasts" });
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const requestGeo = () => {
    if (!hasGeo) {
      setNearMe((v) => !v);
      return;
    }
    // Already have precise browser geo → just toggle the filter
    if (geoPrecise) {
      setNearMe((v) => !v);
      return;
    }
    // We may have IP-based geo (silent fallback); request precise to upgrade
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setGeoPrecise(true);
        setNearMe(true);
        setGeoError(null);
      },
      () => {
        // Browser geo denied/failed: keep IP position if we have one, still toggle the filter,
        // surface a non-blocking hint instead of an alert dialog.
        setNearMe((v) => !v);
        setGeoError("Position approximative (IP). Active la géoloc pour plus de précision.");
        setTimeout(() => setGeoError(null), 4500);
      },
      { timeout: 8000 }
    );
  };

  const favoritesSet = useMemo(() => new Set(favorites), [favorites]);

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
        if (prefs.level !== "advanced" && f.spot.worldClass) return false;
        if (favoritesOnly && !favoritesSet.has(f.spot.slug)) return false;
        if (!favoritesOnly && prefs.country !== "all" && REGION_COUNTRY[f.spot.region as keyof typeof REGION_COUNTRY] !== prefs.country) return false;
        if (!favoritesOnly && prefs.region !== "all" && f.spot.region !== prefs.region) return false;
        if (q && !f.spot.name.toLowerCase().includes(q) && !f.spot.shortName.toLowerCase().includes(q)) return false;
        if (nearMe && distanceKm != null && distanceKm > 200) return false;
        return true;
      })
      .sort((a, b) => {
        if (prefs.sort === "name") return a.f.spot.shortName.localeCompare(b.f.spot.shortName);
        if (prefs.sort === "wave") return (b.f.days[prefs.dayIdx]?.waveHeight ?? 0) - (a.f.days[prefs.dayIdx]?.waveHeight ?? 0);
        if (prefs.sort === "distance" && userPos) return (a.distanceKm ?? 1e9) - (b.distanceKm ?? 1e9);
        // Score sort: when the user has a position, apply a distance-aware bonus so
        // "good spots near me" surface above "perfect spots 800 km away".
        const sa = a.f.days[prefs.dayIdx]?.scoresByLevel?.[prefs.level] ?? a.f.days[prefs.dayIdx]?.score ?? 0;
        const sb = b.f.days[prefs.dayIdx]?.scoresByLevel?.[prefs.level] ?? b.f.days[prefs.dayIdx]?.score ?? 0;
        if (userPos) {
          const boost = (km: number | undefined) => {
            if (km == null) return 0;
            if (km < 30) return 20;
            if (km < 100) return 10;
            if (km < 300) return 0;
            return -10;
          };
          return (sb + boost(b.distanceKm)) - (sa + boost(a.distanceKm));
        }
        return sb - sa;
      });
  }, [forecasts, prefs, search, nearMe, userPos, favoritesOnly, favoritesSet]);

  // Hook: "X de tes favoris en feu" — return reason for users with favorites
  const favsInFire = useMemo(() => {
    if (!favorites.length || !forecasts.length) return 0;
    return forecasts.filter(
      (f) =>
        favoritesSet.has(f.spot.slug) &&
        (prefs.level === "advanced" || !f.spot.worldClass) &&
        (f.days[prefs.dayIdx]?.scoresByLevel?.[prefs.level] ?? f.days[prefs.dayIdx]?.score ?? 0) >= 70
    ).length;
  }, [forecasts, favoritesSet, favorites.length, prefs.dayIdx, prefs.level]);

  const openForecast = openSlug ? forecasts.find((f) => f.spot.slug === openSlug) : null;

  return (
    <div id="spots" className="mx-auto max-w-6xl px-4 pt-4 sm:pt-6">
      {geoError && (
        <div className="mb-3 rounded-2xl border border-sand-300/30 bg-sand-300/10 px-4 py-2.5 text-sm text-sand-100">
          {geoError}
        </div>
      )}

      {/* "Mes spots" — personal context FIRST when user has favorites */}
      {!loading && favorites.length > 0 && (
        <MySpots
          forecasts={forecasts}
          favoritesSet={favoritesSet}
          dayIdx={prefs.dayIdx}
          level={prefs.level}
          onOpen={(slug) => setOpenSlug(slug)}
        />
      )}

      {/* Hot today — variable reward, FOMO trigger (only when conditions warrant) */}
      {!loading && (
        <HotToday
          forecasts={forecasts}
          dayIdx={prefs.dayIdx}
          level={prefs.level}
          userPos={userPos}
          onOpen={(slug) => setOpenSlug(slug)}
        />
      )}

      {/* This week — anticipation + planning behavior */}
      {!loading && (
        <WeekHighlights
          forecasts={forecasts}
          level={prefs.level}
          userPos={userPos}
          onOpen={(slug, dayIdx) => {
            setPrefs((p) => ({ ...p, dayIdx }));
            setOpenSlug(slug);
          }}
        />
      )}

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
        country={prefs.country}
        region={prefs.region}
        level={prefs.level}
        sort={prefs.sort}
        search={search}
        nearMe={nearMe}
        hasGeo={hasGeo}
        favoritesOnly={favoritesOnly}
        favoritesCount={favorites.length}
        onDayChange={(d) => setPrefs({ ...prefs, dayIdx: d })}
        onCountryChange={(c) => {
          setFavoritesOnly(false);
          setPrefs({ ...prefs, country: c, region: "all" });
        }}
        onRegionChange={(r) => {
          setFavoritesOnly(false);
          setPrefs({ ...prefs, region: r });
        }}
        onLevelChange={(l) => setPrefs({ ...prefs, level: l })}
        onSortChange={(s) => setPrefs({ ...prefs, sort: s })}
        onSearchChange={setSearch}
        onNearMeToggle={requestGeo}
        onFavoritesToggle={() => setFavoritesOnly((v) => !v)}
      />

      {/* Personalized hook for users with favorites */}
      {favorites.length > 0 && favsInFire > 0 && !favoritesOnly && (
        <button
          onClick={() => setFavoritesOnly(true)}
          className="mt-3 w-full rounded-2xl border border-coral-500/30 bg-gradient-to-r from-coral-500/10 via-sunset-500/8 to-transparent px-4 py-2.5 text-left text-sm transition hover:from-coral-500/15 hover:via-sunset-500/12"
        >
          <span className="font-script text-lg text-coral-200">
            🔥 {favsInFire} de tes favoris {favsInFire > 1 ? "sont en feu" : "est en feu"}
          </span>
          <span className="ml-2 text-xs text-white/50">— afficher mes favoris</span>
        </button>
      )}

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
        {loading ? (
          <div className="h-1 w-32 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full bg-gradient-to-r from-coral-400 via-sunset-400 to-sand-300 transition-all duration-300"
              style={{ width: `${(progress.done / Math.max(1, progress.total)) * 100}%` }}
            />
          </div>
        ) : exploredCount > 0 && SPOTS.length > 0 ? (
          <span
            className="hidden items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.025] px-2.5 py-1 text-[10px] uppercase tracking-widest text-white/45 sm:inline-flex"
            title="Spots que tu as ouverts au moins une fois"
          >
            <span className="font-display text-xs font-bold text-sand-200">{exploredCount}</span>
            <span className="text-white/30">/</span>
            <span>{SPOTS.length} explorés</span>
          </span>
        ) : null}
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
                  isFavorite={favoritesSet.has(f.spot.slug)}
                  onClick={() => setOpenSlug(f.spot.slug)}
                  onToggleFavorite={() => {
                    const wasFav = favoritesSet.has(f.spot.slug);
                    toggleFavorite(f.spot.slug);
                    trackEvent(wasFav ? "spot_favorite_remove" : "spot_favorite_add", { slug: f.spot.slug });
                  }}
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

      {/* Live buoy readings — secondary confirmation data, AFTER the main spot grid.
          A surfer first picks a spot from the forecast, THEN checks if the live buoy confirms it. */}
      {!loading && visible.length > 0 && (
        <div className="mt-10">
          <BuoyMiniPanel
            lat={userPos?.lat}
            lon={userPos?.lon}
            limit={3}
          />
        </div>
      )}

      <section id="a-propos" className="mt-20 overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-ocean-950/40 via-depth-950 to-depth-950 p-8 sm:p-10">
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-sand-200/70">À propos du score</div>
        <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
          <span className="text-gradient-ocean">Une note simple,</span>
          <br />
          <span className="font-script text-4xl text-gradient-sunset sm:text-5xl">trois ingrédients.</span>
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Pillar
            icon="🌊"
            title="La vague"
            text="Sa hauteur réelle, puis sa hauteur ressentie quand la période allonge les sets. Trop petit = épuisant, trop gros = réservé."
          />
          <Pillar
            icon="⏱️"
            title="La période"
            text="Au-delà de 9 s, les séries peuvent être nettement plus grosses que la moyenne. Le score le prend en compte."
          />
          <Pillar
            icon="💨"
            title="Le vent"
            text="Idéalement faible. Bonus quand il vient de la terre (offshore) : il sculpte les vagues. Malus s'il vient du large (onshore)."
          />
          <Pillar
            icon="⚡"
            title="La puissance"
            text="Un proxy d'énergie de houle en kW/m évite de confondre une petite vague molle avec une vraie houle longue."
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

      {/* Persistent mobile bottom bar — quick access to Filtres / Favoris / Près de moi */}
      <MobileBottomBar
        onFiltersOpen={() => window.dispatchEvent(new CustomEvent("yosurf:open-filters"))}
        onFavoritesToggle={() => setFavoritesOnly((v) => !v)}
        favoritesActive={favoritesOnly}
        favoritesCount={favorites.length}
        onNearMe={requestGeo}
        nearMeActive={nearMe}
      />
      {/* Extra spacer so the page content can scroll past the fixed bottom bar */}
      <div className="h-16 md:hidden" aria-hidden />
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
