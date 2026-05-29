"use client";

import { useEffect } from "react";
import { ArrowUpDown, Globe, MapPin, RotateCcw, Target, X } from "lucide-react";
import type { Level } from "@/lib/types";
import { REGIONS, REGION_EMOJI } from "@/lib/spots";
import { COUNTRIES, COUNTRY_FLAG, COUNTRY_LABEL, REGION_COUNTRY } from "@/lib/countries";
import { useLocale } from "@/lib/useLocale";
import { t } from "@/lib/i18n";
import type { SortKey } from "./Filters";

const LEVELS: { value: Level; emoji: string }[] = [
  { value: "beginner", emoji: "🌱" },
  { value: "intermediate", emoji: "🤙" },
  { value: "advanced", emoji: "🔥" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  // current filter values
  country: string;
  region: string;
  level: Level;
  sort: SortKey;
  // setters
  onCountryChange: (c: string) => void;
  onRegionChange: (r: string) => void;
  onLevelChange: (l: Level) => void;
  onSortChange: (s: SortKey) => void;
  onReset: () => void;
}

/**
 * Bottom sheet (mobile) / centered modal (desktop unused) regrouping advanced filters
 * to declutter the mobile view. All changes apply immediately — no "Apply" step.
 */
export function FilterSheet({
  open, onClose, country, region, level, sort,
  onCountryChange, onRegionChange, onLevelChange, onSortChange, onReset,
}: Props) {
  const { locale } = useLocale();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const availableRegions = REGIONS.filter((r) => country === "all" || REGION_COUNTRY[r] === country);
  // Hide region section when the selected country has ≤ 1 region (the region picker
  // would be redundant — only "All" + the single region).
  const hideRegionSection = country !== "all" && availableRegions.length <= 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[55] flex items-end justify-center bg-black/80 backdrop-blur-md sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[88dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-depth-950 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div className="mx-auto mb-0 h-1 w-12 rounded-full bg-white/20 absolute left-1/2 top-2 -translate-x-1/2 sm:hidden" />
          <h2 className="font-display text-xl font-bold">{t(locale, "filterSheetTitle")}</h2>
          <button
            onClick={onClose}
            aria-label={t(locale, "filterSheetClose")}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-white/15"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          {/* Country */}
          <section>
            <div className="mb-2 flex items-center gap-1.5 text-xs uppercase tracking-widest text-white/45">
              <Globe className="h-3 w-3" />
              {t(locale, "filterSheetCountry")}
            </div>
            <div className="flex flex-wrap gap-2">
              <Chip
                active={country === "all"}
                onClick={() => onCountryChange("all")}
                label="🌍 All"
              />
              {COUNTRIES.map((c) => (
                <Chip
                  key={c}
                  active={country === c}
                  onClick={() => onCountryChange(c)}
                  label={`${COUNTRY_FLAG[c]} ${COUNTRY_LABEL[c]}`}
                />
              ))}
            </div>
          </section>

          {/* Region — hidden when the selected country has only 1 region */}
          {!hideRegionSection && (
            <section>
              <div className="mb-2 flex items-center gap-1.5 text-xs uppercase tracking-widest text-white/45">
                <MapPin className="h-3 w-3" />
                {t(locale, "filterSheetRegion")}
              </div>
              <div className="flex flex-wrap gap-2">
                <Chip
                  active={region === "all"}
                  onClick={() => onRegionChange("all")}
                  label={t(locale, "filterAllRegions")}
                />
                {availableRegions.map((r) => (
                  <Chip
                    key={r}
                    active={region === r}
                    onClick={() => onRegionChange(r)}
                    label={`${REGION_EMOJI[r]} ${r}`}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Level (segmented control) */}
          <section>
            <div className="mb-2 flex items-center gap-1.5 text-xs uppercase tracking-widest text-white/45">
              <Target className="h-3 w-3" />
              {t(locale, "filterSheetLevel")}
            </div>
            <div className="grid grid-cols-3 gap-1.5 rounded-full border border-white/10 bg-white/[0.03] p-1">
              {LEVELS.map((lv) => (
                <button
                  key={lv.value}
                  onClick={() => onLevelChange(lv.value)}
                  className={`tap-target rounded-full px-2 py-2 text-xs font-medium transition ${
                    level === lv.value
                      ? "bg-gradient-to-r from-coral-500 to-sunset-500 text-white shadow"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <span className="mr-1">{lv.emoji}</span>
                  {t(locale, lv.value === "beginner" ? "filterLevelBeginner" : lv.value === "intermediate" ? "filterLevelIntermediate" : "filterLevelAdvanced")}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] italic text-white/35">{t(locale, "filterLevelHint")}</p>
          </section>

          {/* Sort */}
          <section>
            <div className="mb-2 flex items-center gap-1.5 text-xs uppercase tracking-widest text-white/45">
              <ArrowUpDown className="h-3 w-3" />
              {t(locale, "filterSheetSort")}
            </div>
            <div className="space-y-1.5">
              {([
                ["score", "filterSortScore"],
                ["wave", "filterSortWave"],
                ["name", "filterSortName"],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => onSortChange(key)}
                  className={`tap-target flex w-full items-center justify-between rounded-2xl border px-4 py-2.5 text-sm transition ${
                    sort === key
                      ? "border-ocean-400 bg-ocean-500/20 text-white"
                      : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20"
                  }`}
                >
                  <span>{t(locale, label).replace(/^[^:]*:\s*/, "")}</span>
                  {sort === key && <span className="text-ocean-300">●</span>}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div
          className="flex shrink-0 gap-2 border-t border-white/[0.06] bg-depth-950 p-3 sm:p-4"
          style={{ paddingBottom: "max(0.75rem, calc(0.75rem + env(safe-area-inset-bottom)))" }}
        >
          <button
            onClick={onReset}
            className="tap-target inline-flex items-center justify-center gap-1.5 rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/85 transition hover:bg-white/10"
          >
            <RotateCcw className="h-4 w-4" />
            {t(locale, "filterSheetReset")}
          </button>
          <button
            onClick={onClose}
            className="tap-target flex-1 rounded-2xl bg-gradient-to-r from-coral-500 via-sunset-500 to-sand-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-coral-500/30 transition hover:scale-[1.01] active:scale-[0.98]"
          >
            {t(locale, "filterSheetClose")}
          </button>
        </div>
      </div>
    </div>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`tap-target shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition active:scale-95 ${
        active
          ? "border-ocean-400 bg-ocean-500/25 text-white shadow-md shadow-ocean-500/20"
          : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}
