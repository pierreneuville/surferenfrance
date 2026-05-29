"use client";

import { Flame, MapPin, Sparkles, Waves } from "lucide-react";
import type { Level } from "@/lib/types";
import type { SortKey } from "./Filters";
import { useLocale } from "@/lib/useLocale";
import { t, tf } from "@/lib/i18n";

interface Props {
  dayIdx: number;
  sort: SortKey;
  nearMe: boolean;
  hasGeo: boolean;
  level: Level;
  onApply: (patch: { dayIdx?: number; sort?: SortKey; region?: string }) => void;
  onToggleNearMe: () => void;
}

// next Saturday: returns 0..6 dayIdx
function nextSaturdayOffset(): number {
  const today = new Date().getDay();
  return (6 - today + 7) % 7;
}

export function QuickActions({ dayIdx, sort, nearMe, hasGeo, onApply, onToggleNearMe }: Props) {
  const { locale } = useLocale();
  const satOffset = nextSaturdayOffset();
  const isTodayActive = dayIdx === 0 && sort === "score";
  const isWeekendActive = dayIdx === satOffset && sort === "score";
  const isWavesActive = sort === "wave";

  return (
    <div className="scrollbar-hide mb-4 -mx-4 flex snap-x snap-proximity gap-2 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0">
      <Action
        icon={<Flame className="h-4 w-4" />}
        title={t(locale, "quickTopToday")}
        subtitle={t(locale, "quickTopTodaySub")}
        gradient="from-coral-500 to-sunset-500"
        active={isTodayActive}
        onClick={() => onApply({ dayIdx: 0, sort: "score" })}
      />
      <Action
        icon={<Sparkles className="h-4 w-4" />}
        title={t(locale, "quickWeekend")}
        subtitle={satOffset === 0 ? t(locale, "quickWeekendToday") : tf(locale, "quickWeekendSub", { n: satOffset })}
        gradient="from-sand-400 to-sunset-500"
        active={isWeekendActive}
        onClick={() => onApply({ dayIdx: satOffset, sort: "score" })}
      />
      <Action
        icon={<MapPin className="h-4 w-4" />}
        title={t(locale, "quickNearMe")}
        subtitle={nearMe ? t(locale, "quickNearMeActive") : t(locale, "quickNearMeSub")}
        gradient="from-emerald-500 to-lagoon-500"
        active={nearMe}
        disabled={!hasGeo}
        onClick={onToggleNearMe}
      />
      <Action
        icon={<Waves className="h-4 w-4" />}
        title={t(locale, "quickBigWaves")}
        subtitle={t(locale, "quickBigWavesSub")}
        gradient="from-ocean-500 to-ocean-700"
        active={isWavesActive}
        onClick={() => onApply({ sort: "wave" })}
      />
    </div>
  );
}

function Action({
  icon, title, subtitle, gradient, active, disabled, onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  gradient: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative tap-target flex shrink-0 snap-start flex-col items-start gap-1 overflow-hidden rounded-2xl border p-2.5 text-left transition-all active:scale-[0.97] sm:p-3 ${
        active
          ? "border-white/30 bg-white/[0.06] shadow-xl shadow-ocean-500/10"
          : "border-white/[0.07] bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.04]"
      } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
      style={{ minWidth: "9.5rem" }}
    >
      {/* glow */}
      <div className={`pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${gradient} ${active ? "opacity-30" : "opacity-10"} blur-2xl transition-opacity group-hover:opacity-40`} />

      <span className={`relative grid h-7 w-7 place-items-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg sm:h-8 sm:w-8`}>
        {icon}
      </span>
      <div className="relative">
        <div className="font-display text-xs font-bold leading-tight text-white sm:text-sm">{title}</div>
        <div className="text-[9px] uppercase tracking-wider text-white/45 sm:text-[10px]">{subtitle}</div>
      </div>
    </button>
  );
}
