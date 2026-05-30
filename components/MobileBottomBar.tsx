"use client";

import { Filter, Heart, MapPin } from "lucide-react";

interface Props {
  onFiltersOpen: () => void;
  onFavoritesToggle: () => void;
  favoritesActive: boolean;
  favoritesCount: number;
  onNearMe: () => void;
  nearMeActive: boolean;
}

/**
 * Mobile bottom bar — persistent quick-access to the 3 things a surfer reaches for most:
 *  Filters · Favoris · Près de moi.
 *
 * Visible only on mobile (md:hidden). Respects safe-area-inset-bottom so it doesn't
 * sit under the iPhone home indicator.
 */
export function MobileBottomBar({
  onFiltersOpen,
  onFavoritesToggle,
  favoritesActive,
  favoritesCount,
  onNearMe,
  nearMeActive,
}: Props) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-white/[0.08] bg-depth-950/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "max(0.25rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        <button
          onClick={onFiltersOpen}
          aria-label="Ouvrir les filtres"
          className="tap-target flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] uppercase tracking-widest text-white/65 transition active:bg-white/[0.05]"
        >
          <Filter className="h-4 w-4" />
          Filtres
        </button>
        <button
          onClick={onFavoritesToggle}
          aria-label={favoritesActive ? "Voir tous les spots" : "Voir mes favoris"}
          className={`tap-target flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] uppercase tracking-widest transition active:bg-white/[0.05] ${
            favoritesActive ? "text-coral-300" : "text-white/65"
          }`}
        >
          <Heart className={`h-4 w-4 ${favoritesActive ? "fill-coral-400 text-coral-400" : ""}`} />
          Favoris{favoritesCount > 0 ? ` (${favoritesCount})` : ""}
        </button>
        <button
          onClick={onNearMe}
          aria-label={nearMeActive ? "Désactiver près de moi" : "Activer près de moi"}
          className={`tap-target flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] uppercase tracking-widest transition active:bg-white/[0.05] ${
            nearMeActive ? "text-ocean-300" : "text-white/65"
          }`}
        >
          <MapPin className="h-4 w-4" />
          Près de moi
        </button>
      </div>
    </div>
  );
}
