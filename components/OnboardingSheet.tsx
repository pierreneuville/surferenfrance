"use client";

import { useEffect, useState } from "react";
import { Heart, MapPin, X } from "lucide-react";
import { Logo, Wordmark } from "./Logo";
import { SPOTS, REGION_EMOJI } from "@/lib/spots";
import { getFavorites, setFavorites } from "@/lib/favorites";
import { haversineKm } from "@/lib/utils";
import type { Spot } from "@/lib/types";

const KEY = "yosurf-onboarded-v1";

// Famous fallback spots if no geolocation
const FAMOUS_SLUGS = [
  "hossegor",
  "biarritz",
  "lacanau",
  "la-torche",
  "anglet",
  "seignosse",
];

/**
 * Welcome sheet on first visit.
 * UX principle: get the user to invest IMMEDIATELY (Hook Model — Investment phase).
 * Once they've tapped 1-3 ❤️, they own a personalized version of the app.
 */
export function OnboardingSheet() {
  const [open, setOpen] = useState(false);
  const [suggested, setSuggested] = useState<Spot[]>([]);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [usingGeo, setUsingGeo] = useState(false);

  useEffect(() => {
    // Skip if already onboarded OR has favorites
    try {
      if (localStorage.getItem(KEY)) return;
      if (getFavorites().length > 0) {
        localStorage.setItem(KEY, "1");
        return;
      }
    } catch {
      return; // localStorage unavailable
    }

    // Default to famous spots
    const famousSpots = FAMOUS_SLUGS
      .map((slug) => SPOTS.find((s) => s.slug === slug))
      .filter((s): s is Spot => Boolean(s))
      .slice(0, 6);
    setSuggested(famousSpots);

    // Optionally enrich with geolocation (does not block the trigger)
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const nearest = [...SPOTS]
            .map((s) => ({
              spot: s,
              d: haversineKm(pos.coords.latitude, pos.coords.longitude, s.lat, s.lon),
            }))
            .sort((a, b) => a.d - b.d)
            .slice(0, 6)
            .map(({ spot }) => spot);
          setSuggested(nearest);
          setUsingGeo(true);
        },
        () => {},
        { timeout: 3000, maximumAge: 60_000 }
      );
    }

    // Defer the trigger: the user must SHOW INTEREST first.
    // Trigger conditions (whichever comes first):
    //  1. user has scrolled past the hero (300px)
    //  2. user has been on the page 25s
    let triggered = false;
    function trigger() {
      if (triggered) return;
      triggered = true;
      setOpen(true);
      cleanup();
    }
    function onScroll() {
      if (window.scrollY > 300) trigger();
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    const timeoutId = window.setTimeout(trigger, 25_000);
    function cleanup() {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timeoutId);
    }
    return cleanup;
  }, []);

  function togglePick(slug: string) {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function finish() {
    if (picked.size > 0) {
      const current = getFavorites();
      const merged = Array.from(new Set([...current, ...picked]));
      setFavorites(merged);
    }
    try { localStorage.setItem(KEY, "1"); } catch {}
    setOpen(false);
  }

  function dismiss() {
    try { localStorage.setItem(KEY, "1"); } catch {}
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[55] flex items-end justify-center bg-black/80 backdrop-blur-md sm:items-center sm:p-4"
      onClick={dismiss}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-white/10 bg-gradient-to-b from-depth-900 to-depth-950 p-6 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismiss}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/5 transition hover:bg-white/15"
          aria-label="Plus tard"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Mobile grabber */}
        <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-white/20 sm:hidden" />

        {/* Brand greeting */}
        <div className="flex items-center gap-3">
          <Logo size={48} />
          <div>
            <Wordmark className="text-xl" />
            <div className="font-script text-sm text-sand-200/70">bienvenue !</div>
          </div>
        </div>

        <h2 className="mt-6 font-display text-2xl font-bold leading-tight">
          <span className="text-gradient-ocean">Quels spots</span>{" "}
          <span className="font-script text-3xl text-gradient-sunset">tu surfes ?</span>
        </h2>
        <p className="mt-2 text-sm text-white/65">
          Ajoute tes spots favoris pour les retrouver instantanément à chaque visite.
          {usingGeo && (
            <span className="mt-1 block text-emerald-300/80">
              <MapPin className="mr-1 inline h-3 w-3" />
              On t'a trouvé près de chez toi
            </span>
          )}
        </p>

        {/* Spot chips */}
        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {suggested.map((spot) => {
            const isPicked = picked.has(spot.slug);
            return (
              <button
                key={spot.slug}
                onClick={() => togglePick(spot.slug)}
                className={`tap-target flex items-center justify-between gap-2 rounded-2xl border px-3 py-3 text-left transition active:scale-[0.98] ${
                  isPicked
                    ? "border-coral-400/60 bg-gradient-to-br from-coral-500/15 to-sunset-500/10"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20"
                }`}
              >
                <div className="min-w-0">
                  <div className="font-display text-sm font-bold leading-tight">
                    {spot.shortName}
                  </div>
                  <div className="text-[10px] text-white/45">
                    {REGION_EMOJI[spot.region]} {spot.region}
                  </div>
                </div>
                <Heart
                  className={`h-5 w-5 shrink-0 transition ${
                    isPicked ? "fill-coral-400 text-coral-400" : "text-white/30"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* CTAs */}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            onClick={finish}
            disabled={picked.size === 0}
            className={`tap-target flex-1 rounded-full px-5 py-3 font-semibold text-white transition active:scale-[0.98] ${
              picked.size > 0
                ? "bg-gradient-to-r from-coral-500 via-sunset-500 to-sand-400 shadow-lg shadow-coral-500/30 hover:scale-[1.01]"
                : "bg-white/10 text-white/40"
            }`}
          >
            {picked.size > 0
              ? `Ajouter ${picked.size} favori${picked.size > 1 ? "s" : ""} →`
              : "Sélectionne au moins 1 spot"}
          </button>
          <button
            onClick={dismiss}
            className="tap-target rounded-full border border-white/10 px-4 py-3 text-sm text-white/60 transition hover:bg-white/5"
          >
            Plus tard
          </button>
        </div>

        <p className="mt-4 text-center text-[10px] text-white/30">
          Aucun compte, aucune donnée envoyée. Les favoris restent sur ton appareil.
        </p>
      </div>
    </div>
  );
}
