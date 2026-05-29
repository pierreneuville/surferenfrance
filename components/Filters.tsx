"use client";

import { useState } from "react";
import { Heart, MapPin, Search, SlidersHorizontal, Target, X } from "lucide-react";
import type { Level } from "@/lib/types";
import { REGIONS, REGION_EMOJI } from "@/lib/spots";
import { COUNTRIES, COUNTRY_FLAG, COUNTRY_LABEL, REGION_COUNTRY } from "@/lib/countries";
import { dayShortLabel, dayDateNumber, dayIsWeekend } from "@/lib/utils";
import { useLocale } from "@/lib/useLocale";
import { t } from "@/lib/i18n";
import { FilterSheet } from "./FilterSheet";

export type SortKey = "score" | "wave" | "distance" | "name";

interface FiltersProps {
  dayIdx: number;
  country: string;
  region: string;
  level: Level;
  sort: SortKey;
  search: string;
  nearMe: boolean;
  hasGeo: boolean;
  favoritesOnly: boolean;
  favoritesCount: number;
  onDayChange: (d: number) => void;
  onCountryChange: (c: string) => void;
  onRegionChange: (r: string) => void;
  onLevelChange: (l: Level) => void;
  onSortChange: (s: SortKey) => void;
  onSearchChange: (q: string) => void;
  onNearMeToggle: () => void;
  onFavoritesToggle: () => void;
}

const LEVEL_EMOJI: Record<Level, string> = {
  beginner: "🌱",
  intermediate: "🤙",
  advanced: "🔥",
};

export function Filters(props: FiltersProps) {
  const {
    dayIdx, country, region, level, sort, search, nearMe, hasGeo,
    favoritesOnly, favoritesCount,
    onDayChange, onCountryChange, onRegionChange, onLevelChange, onSortChange, onSearchChange, onNearMeToggle, onFavoritesToggle,
  } = props;
  const { locale } = useLocale();
  const LEVELS: { value: Level; labelKey: "filterLevelBeginner" | "filterLevelIntermediate" | "filterLevelAdvanced"; emoji: string }[] = [
    { value: "beginner", labelKey: "filterLevelBeginner", emoji: LEVEL_EMOJI.beginner },
    { value: "intermediate", labelKey: "filterLevelIntermediate", emoji: LEVEL_EMOJI.intermediate },
    { value: "advanced", labelKey: "filterLevelAdvanced", emoji: LEVEL_EMOJI.advanced },
  ];

  // Mobile FilterSheet state
  const [sheetOpen, setSheetOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Count "active" non-default filters to badge the Filtrer button
  const activeCount =
    (country !== "FR" && country !== "all" ? 1 : 0) +
    (region !== "all" ? 1 : 0) +
    (level !== "intermediate" ? 1 : 0) +
    (sort !== "score" ? 1 : 0);

  function resetFilters() {
    onCountryChange("all");
    onRegionChange("all");
    onLevelChange("intermediate");
    onSortChange("score");
  }

  return (
    <>
      {/* STICKY day picker only — preserves vertical space on mobile */}
      <div className="sticky top-[57px] z-30 -mx-4 border-y border-white/[0.06] bg-depth-950/90 px-4 py-2.5 backdrop-blur-xl sm:py-3">
        <div className="mx-auto max-w-6xl">
          <div className="relative">
            <div className="scrollbar-hide flex snap-x snap-proximity gap-1.5 overflow-x-auto scroll-px-4 py-0.5 sm:gap-2">
              {Array.from({ length: 7 }, (_, i) => {
                const isActive = dayIdx === i;
                const weekend = dayIsWeekend(i);
                return (
                  <button
                    key={i}
                    onClick={() => onDayChange(i)}
                    className={`tap-target flex shrink-0 snap-start flex-col items-center justify-center rounded-xl border px-2.5 py-1.5 transition-all active:scale-95 sm:rounded-2xl sm:px-3.5 sm:py-2 ${
                      isActive
                        ? "border-coral-400/60 bg-gradient-to-br from-coral-500/25 via-sunset-500/15 to-sand-400/20 text-white shadow-lg shadow-coral-500/20"
                        : weekend
                        ? "border-sand-300/20 bg-sand-300/[0.04] text-white/85 hover:border-sand-300/40"
                        : "border-white/10 bg-white/5 text-white/70 hover:border-white/20"
                    }`}
                  >
                    <span className={`text-[9px] uppercase tracking-widest leading-none sm:text-[10px] ${isActive ? "text-sand-200" : "text-white/45"}`}>
                      {dayShortLabel(i)}
                    </span>
                    <span className={`font-display text-base font-bold leading-tight sm:text-lg ${isActive ? "text-white" : ""}`}>
                      {dayDateNumber(i)}
                    </span>
                  </button>
                );
              })}
            </div>
            {/* fade-out affordance */}
            <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-8 bg-gradient-to-l from-depth-950 to-transparent" />
          </div>
        </div>
      </div>

      {/* ===== MOBILE: compact action bar (md:hidden) ===== */}
      <div className="mx-auto mt-3 max-w-6xl space-y-2 md:hidden">
        <div className="flex items-center gap-2">
          {/* Filters trigger (opens FilterSheet) */}
          <button
            onClick={() => setSheetOpen(true)}
            className="tap-target relative inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-2 text-sm font-medium text-white/90 transition hover:bg-white/[0.08] active:scale-95"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {t(locale, "filterSheetTrigger")}
            {activeCount > 0 && (
              <span className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-coral-500 to-sunset-500 text-[10px] font-bold text-white">
                {activeCount}
              </span>
            )}
          </button>

          {/* Search toggle */}
          <button
            onClick={() => setMobileSearchOpen((v) => !v)}
            className={`tap-target grid h-9 w-9 place-items-center rounded-full border transition active:scale-95 ${
              search || mobileSearchOpen
                ? "border-ocean-400 bg-ocean-500/20 text-white"
                : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
            }`}
            aria-label={t(locale, "filterSearch")}
          >
            <Search className="h-3.5 w-3.5" />
          </button>

          {/* Near me */}
          {hasGeo && (
            <button
              onClick={onNearMeToggle}
              className={`tap-target grid h-9 w-9 place-items-center rounded-full border transition active:scale-95 ${
                nearMe
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-100"
                  : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
              }`}
              aria-label={t(locale, "filterNearMe")}
            >
              <MapPin className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Favorites */}
          {favoritesCount > 0 && (
            <button
              onClick={onFavoritesToggle}
              className={`tap-target inline-flex items-center gap-1 rounded-full border px-2.5 py-2 text-xs font-medium transition active:scale-95 ${
                favoritesOnly
                  ? "border-coral-400 bg-coral-500/25 text-coral-100"
                  : "border-coral-500/20 bg-coral-500/10 text-coral-200"
              }`}
              aria-label={t(locale, "filterFavorites")}
            >
              <Heart className={`h-3.5 w-3.5 ${favoritesOnly ? "fill-coral-300" : "fill-coral-400"}`} />
              <span className="text-[10px] font-bold">{favoritesCount}</span>
            </button>
          )}

          {/* Active filter pills (compact) shown to right when filters active */}
          <div className="scrollbar-hide ml-auto flex shrink min-w-0 gap-1.5 overflow-x-auto">
            {country !== "all" && country !== "FR" && (
              <ActivePill onClear={() => onCountryChange("FR")}>{COUNTRY_FLAG[country as keyof typeof COUNTRY_FLAG]}</ActivePill>
            )}
            {region !== "all" && (
              <ActivePill onClear={() => onRegionChange("all")}>{REGION_EMOJI[region]}</ActivePill>
            )}
          </div>
        </div>

        {/* Inline search input (toggled) */}
        {mobileSearchOpen && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              autoFocus
              placeholder={t(locale, "filterSearch")}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-full border border-ocean-400/40 bg-white/[0.05] py-2 pl-9 pr-9 text-sm placeholder-white/40 outline-none"
            />
            {search && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/40 hover:bg-white/10 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        country={country}
        region={region}
        level={level}
        sort={sort}
        onCountryChange={onCountryChange}
        onRegionChange={onRegionChange}
        onLevelChange={onLevelChange}
        onSortChange={onSortChange}
        onReset={resetFilters}
      />

      {/* ===== DESKTOP: expanded filters (hidden on mobile) ===== */}
      <div className="mx-auto hidden max-w-6xl space-y-3 pt-3 md:block">
        {/* Country chips */}
        <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="scrollbar-hide flex snap-x snap-proximity gap-2 overflow-x-auto py-0.5">
            <button
              onClick={() => onCountryChange("all")}
              className={`tap-target shrink-0 snap-start rounded-full border px-3 py-1.5 text-xs font-medium transition active:scale-95 ${
                country === "all"
                  ? "border-sand-300 bg-sand-400/15 text-sand-100"
                  : "border-white/10 bg-white/5 text-white/65 hover:border-white/20"
              }`}
            >
              🌍 Pays
            </button>
            {COUNTRIES.map((c) => (
              <button
                key={c}
                onClick={() => onCountryChange(c)}
                className={`tap-target shrink-0 snap-start rounded-full border px-3 py-1.5 text-xs font-medium transition active:scale-95 ${
                  country === c
                    ? "border-sand-300 bg-sand-400/15 text-sand-100"
                    : "border-white/10 bg-white/5 text-white/65 hover:border-white/20"
                }`}
              >
                {COUNTRY_FLAG[c]} {COUNTRY_LABEL[c]}
              </button>
            ))}
          </div>
        </div>

        {/* Region chips — hidden when the selected country has ≤ 1 region (would be redundant) */}
        {(() => {
          const visibleRegions = REGIONS.filter((r) => country === "all" || REGION_COUNTRY[r] === country);
          const hideRegionRow = country !== "all" && visibleRegions.length <= 1;
          if (hideRegionRow && favoritesCount === 0) return null;
          return (
        <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="scrollbar-hide flex snap-x snap-proximity gap-2 overflow-x-auto py-0.5">
          {favoritesCount > 0 && (
            <button
              onClick={onFavoritesToggle}
              className={`tap-target shrink-0 inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition active:scale-95 ${
                favoritesOnly
                  ? "border-coral-400 bg-coral-500/25 text-coral-100 shadow-md shadow-coral-500/20"
                  : "border-coral-500/20 bg-coral-500/10 text-coral-200 hover:border-coral-400/40 hover:bg-coral-500/15"
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${favoritesOnly ? "fill-coral-300" : "fill-coral-400"}`} />
              {t(locale, "filterFavorites")}
              <span className="rounded-full bg-black/30 px-1.5 text-[10px] font-bold">{favoritesCount}</span>
            </button>
          )}
          {!hideRegionRow && (
          <button
            onClick={() => onRegionChange("all")}
            className={`tap-target shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition active:scale-95 ${
              region === "all" && !favoritesOnly
                ? "border-ocean-400 bg-ocean-500/25 text-white shadow-md shadow-ocean-500/20"
                : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10"
            }`}
          >
            🌍 {t(locale, "filterAllRegions")}
          </button>
          )}
          {!hideRegionRow && visibleRegions.map((r) => (
            <button
              key={r}
              onClick={() => onRegionChange(r)}
              className={`tap-target shrink-0 snap-start rounded-full border px-4 py-2 text-sm font-medium transition active:scale-95 ${
                region === r
                  ? "border-ocean-400 bg-ocean-500/25 text-white shadow-md shadow-ocean-500/20"
                  : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              <span className="mr-1.5 text-base">{REGION_EMOJI[r]}</span>
              {r}
            </button>
          ))}
        </div>
        {/* fade-out affordance */}
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-8 bg-gradient-to-l from-depth-950 to-transparent" />
        </div>
          );
        })()}

        {/* Filters row : Search, NearMe, Sort */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder={t(locale, "filterSearch")}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-9 text-sm placeholder-white/40 outline-none focus:border-ocean-400"
            />
            {search && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/40 hover:bg-white/10 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {hasGeo && (
            <button
              onClick={onNearMeToggle}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${
                nearMe
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-100"
                  : "border-white/10 bg-white/5 text-white/70 hover:border-white/20"
              }`}
            >
              <MapPin className="h-3.5 w-3.5" />
              {t(locale, "filterNearMe")}
            </button>
          )}

          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm outline-none focus:border-ocean-400"
          >
            <option value="score">{t(locale, "filterSortScore")}</option>
            <option value="wave">{t(locale, "filterSortWave")}</option>
            {nearMe && <option value="distance">{t(locale, "filterSortDistance")}</option>}
            <option value="name">{t(locale, "filterSortName")}</option>
          </select>
        </div>

        {/* Settings row : level (not a filter — score calibration) */}
        <div className="flex flex-wrap items-center gap-3 border-t border-dashed border-white/10 pt-3">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Target className="h-4 w-4 text-ocean-300" />
            <span className="font-medium">{t(locale, "filterLevel")}</span>
          </div>
          <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-1">
            {LEVELS.map((lv) => (
              <button
                key={lv.value}
                onClick={() => onLevelChange(lv.value)}
                className={`rounded-full px-3.5 py-1 text-xs font-medium transition ${
                  level === lv.value
                    ? "bg-ocean-500/30 text-ocean-100 shadow"
                    : "text-white/60 hover:text-white"
                }`}
                title={`Conditions idéales : ${lv.value === "beginner" ? "vagues 0,5-1,5 m, vent faible" : lv.value === "intermediate" ? "vagues 1-2,5 m, vent < 20 km/h" : "vagues 1,5 m+, conditions techniques"}`}
              >
                <span className="mr-1">{lv.emoji}</span>
                {t(locale, lv.labelKey)}
              </button>
            ))}
          </div>
          <span className="text-[11px] italic text-white/40">
            {t(locale, "filterLevelHint")}
          </span>
        </div>
      </div>
    </>
  );
}

function ActivePill({ children, onClear }: { children: React.ReactNode; onClear: () => void }) {
  return (
    <button
      onClick={onClear}
      className="tap-target inline-flex shrink-0 items-center gap-1 rounded-full border border-ocean-400/30 bg-ocean-500/15 px-2 py-1 text-xs"
    >
      {children}
      <X className="h-3 w-3 text-white/50" />
    </button>
  );
}
