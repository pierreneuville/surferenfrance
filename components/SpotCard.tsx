"use client";

import { useState } from "react";
import { Compass, Sparkles, Waves, Wind, ExternalLink, MapPin, Share2, Check, Heart } from "lucide-react";
import Link from "next/link";
import type { Level, SpotForecast } from "@/lib/types";
import { SCORE_COLORS, scoreLabel, scoreTone } from "@/lib/score";
import { bestHoursForDay } from "@/lib/api";
import { degToCardinal, fmt, dayShortLabel } from "@/lib/utils";
import { useLocale } from "@/lib/useLocale";
import { t, tf } from "@/lib/i18n";

// A signature gradient per region — visual variety without 231 photos.
const REGION_GRADIENT: Record<string, string> = {
  "Manche & Nord": "from-slate-300 via-ocean-300 to-ocean-600",
  "Bretagne": "from-teal-300 via-ocean-500 to-ocean-800",
  "Atlantique Nord": "from-ocean-200 via-lagoon-400 to-ocean-700",
  "Aquitaine": "from-sand-100 via-sand-400 to-sunset-500",
  "Pays Basque": "from-coral-300 via-sunset-500 to-sand-300",
  "Méditerranée": "from-lagoon-300 via-lagoon-500 to-ocean-600",
  "Corse": "from-emerald-300 via-lagoon-400 to-sand-300",
  "Outre-Mer": "from-emerald-300 via-coral-400 to-sunset-500",
};

interface Props {
  forecast: SpotForecast;
  dayIdx: number;
  level: Level;
  distanceKm?: number;
  isFavorite?: boolean;
  onClick: () => void;
  onToggleFavorite?: () => void;
}

export function SpotCard({ forecast, dayIdx, level, distanceKm, isFavorite, onClick, onToggleFavorite }: Props) {
  const { locale } = useLocale();
  const d = forecast.days[dayIdx];
  const score = d.scoresByLevel?.[level] ?? d.score;
  const bestWindow = d.bestWindowByLevel?.[level]
    ?? (forecast.hourly?.times?.length ? bestHoursForDay(forecast, dayIdx, level).best : null);
  const tone = scoreTone(score);
  const colors = SCORE_COLORS[tone];
  const gradient = REGION_GRADIENT[forecast.spot.region] ?? "from-ocean-400 to-ocean-700";
  const [shared, setShared] = useState(false);

  // Compute the max score over 7 days for normalizing the mini chart
  const maxScore = Math.max(...forecast.days.map((day) => day.scoresByLevel?.[level] ?? day.score), 1);

  async function handleShare(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    const url = `${window.location.origin}/spot/${forecast.spot.slug}`;
    const text = score >= 75
      ? tf(locale, "modalShareScoreText", { name: forecast.spot.shortName, score })
      : tf(locale, "modalShareNeutralText", { name: forecast.spot.shortName, score });
    try {
      const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
      if (nav.share) {
        await nav.share({ title: `${forecast.spot.name} · Yosurf`, text, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 1800);
      }
    } catch { /* user cancelled */ }
  }

  return (
    <article
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025] transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-ocean-500/10 active:scale-[0.99]"
    >
      {/* Region accent strip */}
      <div className={`h-1 bg-gradient-to-r ${gradient}`} />

      {/* Favorite heart — top-right corner */}
      {onToggleFavorite && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onToggleFavorite();
          }}
          className="tap-target absolute right-2 top-2 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/30 backdrop-blur transition hover:scale-110 hover:bg-black/50 active:scale-90"
          aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart
            className={`h-4 w-4 transition ${
              isFavorite ? "fill-coral-400 text-coral-400" : "text-white/60 hover:text-white"
            }`}
          />
        </button>
      )}

      {/* Glow follows hover */}
      <div className={`pointer-events-none absolute -top-12 right-0 h-48 w-48 rounded-full bg-gradient-to-br ${gradient} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20`} />

      <div className="relative p-5">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] text-white/45">
              <MapPin className="h-2.5 w-2.5" />
              {forecast.spot.region}
              {distanceKm != null && (
                <span className="ml-1.5 rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-emerald-300 normal-case tracking-normal">
                  · {Math.round(distanceKm)} km
                </span>
              )}
            </div>
            <h3 className="font-display text-xl font-bold leading-tight tracking-tight">
              {forecast.spot.shortName}
            </h3>
            <p className="mt-0.5 text-[11px] text-white/40">
              {forecast.spot.type}
            </p>
          </div>

          {/* Circular gauge + level marker */}
          <div className="flex flex-col items-center gap-1">
            <ScoreGauge score={score} color={colors.hex} tone={tone} />
            <span
              className="rounded-full border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[8px] uppercase tracking-widest text-white/55"
              title={t(locale, level === "beginner" ? "filterLevelBeginner" : level === "intermediate" ? "filterLevelIntermediate" : "filterLevelAdvanced")}
            >
              {level === "beginner" ? "🌱" : level === "intermediate" ? "🤙" : "🔥"}
              {" "}
              {t(locale, level === "beginner" ? "filterLevelBeginner" : level === "intermediate" ? "filterLevelIntermediate" : "filterLevelAdvanced").slice(0, 5)}.
            </span>
          </div>
        </div>

        {/* Best window — the hero info */}
        {bestWindow && bestWindow.avg >= 35 ? (
          <div className="mb-4 overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/12 via-emerald-500/5 to-transparent p-3">
            <div className="flex items-baseline justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-emerald-300/80">
                <Sparkles className="h-3 w-3" />
                {t(locale, "cardBestWindow").replace(/\s*:\s*$/, "")}
              </div>
              <span className="text-[10px] text-white/40">moy. {bestWindow.avg}</span>
            </div>
            <div className="mt-1 font-display text-lg font-bold text-emerald-100">
              {String(bestWindow.start).padStart(2, "0")}h
              <span className="mx-1.5 text-emerald-400/60">→</span>
              {String(bestWindow.end + 1).padStart(2, "0")}h
            </div>
          </div>
        ) : (
          <div className="mb-4 rounded-2xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5 text-xs text-white/30">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              {t(locale, "cardNoWindow")}
            </span>
          </div>
        )}

        {/* Stats triplet */}
        <div className="mb-4 grid grid-cols-3 gap-2">
          <Stat
            icon={<Waves className="h-3.5 w-3.5" />}
            label={t(locale, "cardWave")}
            value={`${fmt(d.waveHeight)} m`}
            sub={setLabel(d.waveHeight, d.effectiveWaveHeight) ?? degToCardinal(d.waveDir)}
          />
          <Stat icon={<Compass className="h-3.5 w-3.5" />} label={t(locale, "cardPeriod")} value={`${fmt(d.wavePeriod, 0)} s`} sub={periodLabel(d.wavePeriod, locale)} />
          <Stat icon={<Wind className="h-3.5 w-3.5" />} label={t(locale, "cardWind")} value={`${fmt(d.windSpeed, 0)} km/h`} sub={degToCardinal(d.windDir)} />
        </div>

        {(d.wavePower != null || d.engagedSurf || forecast.spot.worldClass || (d.tideExtremes && d.tideExtremes.length)) && (
          <div className="mb-4 flex flex-wrap gap-1.5 text-[10px]">
            {d.wavePower != null && (
              <span className="rounded-full border border-ocean-300/20 bg-ocean-400/10 px-2 py-1 text-ocean-100/80">
                puissance {fmt(d.wavePower, 1)} kW/m
              </span>
            )}
            {d.tideExtremes && d.tideExtremes.length > 0 && (
              <span className="rounded-full border border-lagoon-300/25 bg-lagoon-400/10 px-2 py-1 text-lagoon-100">
                {tideBadge(d.tideExtremes)}
              </span>
            )}
            {d.engagedSurf && (
              <span className="rounded-full border border-sand-300/25 bg-sand-300/10 px-2 py-1 text-sand-100">
                surf engagé
              </span>
            )}
            {forecast.spot.worldClass && (
              <span className="rounded-full border border-coral-300/25 bg-coral-500/10 px-2 py-1 text-coral-100">
                expert only
              </span>
            )}
          </div>
        )}

        {/* 7-day mini-bars */}
        <div className="grid grid-cols-7 gap-1 border-t border-white/[0.05] pt-3">
          {forecast.days.map((day, i) => {
            const ds = day.scoresByLevel?.[level] ?? day.score;
            const t = scoreTone(ds);
            const hex = SCORE_COLORS[t].hex;
            const heightPct = Math.max(8, (ds / maxScore) * 100);
            const isToday = i === dayIdx;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`relative flex h-8 w-full items-end justify-center rounded-md ${isToday ? "bg-white/5" : ""}`}>
                  <div
                    className="w-full rounded-md transition-all duration-500"
                    style={{
                      height: `${heightPct}%`,
                      backgroundColor: hex,
                      opacity: isToday ? 1 : 0.65,
                      boxShadow: isToday ? `0 0 12px ${hex}66` : "none",
                    }}
                  />
                </div>
                <div className={`text-[9px] font-semibold uppercase ${isToday ? "text-white" : "text-white/40"}`}>
                  {dayShortLabel(i)}
                </div>
                <div className="text-[9px] font-bold leading-none" style={{ color: hex }}>{ds}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom links — fiche + partage */}
      <div className="flex border-t border-white/[0.05]">
        <Link
          href={`/spot/${forecast.spot.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="flex flex-1 items-center justify-center gap-1.5 bg-white/[0.015] px-3 py-2.5 text-[11px] text-white/40 transition hover:bg-white/[0.04] hover:text-sand-200"
        >
          {t(locale, "cardFullSheet")}
          <ExternalLink className="h-3 w-3" />
        </Link>
        <button
          onClick={handleShare}
          className="tap-target flex items-center justify-center gap-1.5 border-l border-white/[0.05] bg-white/[0.015] px-4 py-2.5 text-[11px] text-white/40 transition hover:bg-white/[0.04] hover:text-sand-200"
          aria-label={t(locale, "cardShare")}
          title={t(locale, "cardShare")}
        >
          {shared ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
          {shared ? t(locale, "cardShareCopied") : t(locale, "cardShare")}
        </button>
      </div>
    </article>
  );
}

function Stat({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl bg-white/[0.025] px-2 py-2 text-center">
      <div className="mx-auto mb-1 flex h-5 w-5 items-center justify-center text-ocean-300/80">
        {icon}
      </div>
      <div className="text-[9px] uppercase tracking-widest text-white/35">{label}</div>
      <div className="mt-0.5 font-semibold text-white">{value}</div>
      {sub && <div className="text-[9px] text-white/35">{sub}</div>}
    </div>
  );
}

function periodLabel(period: number | null | undefined, locale: import("@/lib/i18n").Locale = "fr"): string {
  if (period == null) return "—";
  if (period >= 11) return t(locale, "cardTopGood");
  if (period >= 8) return t(locale, "cardTopMedium");
  return t(locale, "cardTopLow");
}

function setLabel(waveHeight: number | null | undefined, effective: number | null | undefined): string | null {
  if (waveHeight == null || effective == null || effective <= waveHeight + 0.1) return null;
  return `sets ~${fmt(effective)} m`;
}

function tideBadge(extremes: import("@/lib/types").TideExtreme[]): string {
  // Pick the next extreme from "now" if today, else the day's first extreme.
  const now = new Date();
  const upcoming = extremes.find((e) => new Date(e.time) >= now) ?? extremes[0];
  const label = upcoming.type === "high" ? "marée haute" : "marée basse";
  const t = new Date(upcoming.time).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return `${label} ${t}`;
}

function ScoreGauge({ score, color, tone }: { score: number; color: string; tone: string }) {
  // Circular gauge — SVG arc proportional to score
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;
  return (
    <div className="relative grid h-16 w-16 shrink-0 place-items-center sm:h-[68px] sm:w-[68px]">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 50 50" aria-hidden>
        <circle
          cx="25"
          cy="25"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="4"
        />
        <circle
          cx="25"
          cy="25"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          style={{
            filter: `drop-shadow(0 0 6px ${color}88)`,
            transition: "stroke-dasharray 0.6s ease",
          }}
        />
      </svg>
      <div className="flex flex-col items-center leading-none">
        <span className="font-display text-xl font-bold" style={{ color }}>{score}</span>
        <span className="text-[8px] uppercase tracking-widest text-white/40">{scoreLabel(score).slice(0, 4)}</span>
      </div>
      {tone === "excellent" && (
        <div className="pointer-events-none absolute -inset-2 rounded-full" style={{ boxShadow: `0 0 24px ${color}55` }} />
      )}
    </div>
  );
}
