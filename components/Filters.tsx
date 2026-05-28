"use client";

import { MapPin, Search, Target, X } from "lucide-react";
import type { Level } from "@/lib/types";
import { REGIONS, REGION_EMOJI } from "@/lib/spots";
import { dayShortLabel, dayDateNumber, dayIsWeekend } from "@/lib/utils";

export type SortKey = "score" | "wave" | "distance" | "name";

interface FiltersProps {
  dayIdx: number;
  region: string;
  level: Level;
  sort: SortKey;
  search: string;
  nearMe: boolean;
  hasGeo: boolean;
  onDayChange: (d: number) => void;
  onRegionChange: (r: string) => void;
  onLevelChange: (l: Level) => void;
  onSortChange: (s: SortKey) => void;
  onSearchChange: (q: string) => void;
  onNearMeToggle: () => void;
}

const LEVELS: { value: Level; label: string; emoji: string }[] = [
  { value: "beginner", label: "Débutant", emoji: "🌱" },
  { value: "intermediate", label: "Intermédiaire", emoji: "🤙" },
  { value: "advanced", label: "Confirmé", emoji: "🔥" },
];

export function Filters(props: FiltersProps) {
  const {
    dayIdx, region, level, sort, search, nearMe, hasGeo,
    onDayChange, onRegionChange, onLevelChange, onSortChange, onSearchChange, onNearMeToggle,
  } = props;

  return (
    <div className="sticky top-[57px] z-30 -mx-4 border-y border-white/5 bg-depth-950/85 backdrop-blur-lg">
      <div className="mx-auto max-w-6xl space-y-3 px-4 py-4">
        {/* Day chips — visual with day name + date number */}
        <div className="scrollbar-hide flex gap-2 overflow-x-auto py-0.5">
          {Array.from({ length: 7 }, (_, i) => {
            const isActive = dayIdx === i;
            const weekend = dayIsWeekend(i);
            return (
              <button
                key={i}
                onClick={() => onDayChange(i)}
                className={`tap-target flex shrink-0 flex-col items-center justify-center rounded-2xl border px-3.5 py-2 transition-all active:scale-95 ${
                  isActive
                    ? "border-coral-400/60 bg-gradient-to-br from-coral-500/25 via-sunset-500/15 to-sand-400/20 text-white shadow-lg shadow-coral-500/20"
                    : weekend
                    ? "border-sand-300/20 bg-sand-300/[0.04] text-white/85 hover:border-sand-300/40"
                    : "border-white/10 bg-white/5 text-white/70 hover:border-white/20"
                }`}
              >
                <span className={`text-[10px] uppercase tracking-widest leading-none ${isActive ? "text-sand-200" : "text-white/45"}`}>
                  {dayShortLabel(i)}
                </span>
                <span className={`font-display text-lg font-bold leading-tight ${isActive ? "text-white" : ""}`}>
                  {dayDateNumber(i)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Region chips — bigger touch targets, emoji vivid */}
        <div className="scrollbar-hide flex gap-2 overflow-x-auto py-0.5">
          <button
            onClick={() => onRegionChange("all")}
            className={`tap-target shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition active:scale-95 ${
              region === "all"
                ? "border-ocean-400 bg-ocean-500/25 text-white shadow-md shadow-ocean-500/20"
                : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10"
            }`}
          >
            🌍 Toutes
          </button>
          {REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => onRegionChange(r)}
              className={`tap-target shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition active:scale-95 ${
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

        {/* Filters row : Search, NearMe, Sort */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Chercher un spot…"
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
              Près de moi
            </button>
          )}

          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm outline-none focus:border-ocean-400"
          >
            <option value="score">Tri : meilleur score</option>
            <option value="wave">Tri : hauteur vague</option>
            {nearMe && <option value="distance">Tri : distance</option>}
            <option value="name">Tri : A→Z</option>
          </select>
        </div>

        {/* Settings row : level (not a filter — score calibration) */}
        <div className="flex flex-wrap items-center gap-3 border-t border-dashed border-white/10 pt-3">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Target className="h-4 w-4 text-ocean-300" />
            <span className="font-medium">Score adapté à mon niveau&nbsp;:</span>
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
                {lv.label}
              </button>
            ))}
          </div>
          <span className="text-[11px] italic text-white/40">
            (ne filtre pas la liste, recalibre uniquement le score)
          </span>
        </div>
      </div>
    </div>
  );
}
