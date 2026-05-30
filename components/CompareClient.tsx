"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Plus, Search, Share2, X } from "lucide-react";
import { SPOTS } from "@/lib/spots";
import type { Level, Spot, SpotForecast } from "@/lib/types";
import { fetchHomeForecasts } from "@/lib/clientApi";
import { SCORE_COLORS, scoreLabelKey, scoreTone } from "@/lib/score";
import { useLocale } from "@/lib/useLocale";
import { t, tf } from "@/lib/i18n";
import { degToCardinal, fmt, haversineKm } from "@/lib/utils";
import { tideStateAt, tideStateKey } from "@/lib/tide";

const MAX_SLOTS = 3;

/**
 * Compare page — pick up to 3 spots and read them side-by-side.
 *
 * State syncs with the ?spots=slug1,slug2,slug3 URL param so a comparison is shareable.
 * Mental model: surfer has 3 candidate spots in mind, wants to decide today's session.
 */
export function CompareClient() {
  const { locale } = useLocale();
  const [forecasts, setForecasts] = useState<SpotForecast[] | null>(null);
  const [slots, setSlots] = useState<Array<Spot | null>>([null, null, null]);
  const [adding, setAdding] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<Level>("intermediate");
  const [dayIdx, setDayIdx] = useState(0);
  const [shared, setShared] = useState(false);

  // Read initial selection from ?spots= URL param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("spots");
    if (!raw) return;
    const slugs = raw.split(",").slice(0, MAX_SLOTS);
    const picked = slugs.map((s) => SPOTS.find((sp) => sp.slug === s) ?? null);
    while (picked.length < MAX_SLOTS) picked.push(null);
    setSlots(picked);
  }, []);

  // Sync URL when slots change
  useEffect(() => {
    const slugs = slots.filter(Boolean).map((s) => (s as Spot).slug).join(",");
    const url = new URL(window.location.href);
    if (slugs) url.searchParams.set("spots", slugs);
    else url.searchParams.delete("spots");
    window.history.replaceState({}, "", url);
  }, [slots]);

  // Load forecasts once (uses the home cache)
  useEffect(() => {
    fetchHomeForecasts().then(setForecasts).catch(() => setForecasts([]));
  }, []);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const taken = new Set(slots.filter(Boolean).map((s) => (s as Spot).slug));
    return SPOTS
      .filter((s) => !taken.has(s.slug))
      .filter((s) => s.shortName.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, slots]);

  function pickSpot(spot: Spot) {
    if (adding == null) return;
    const next = [...slots];
    next[adding] = spot;
    setSlots(next);
    setAdding(null);
    setQuery("");
  }

  function clearSlot(idx: number) {
    const next = [...slots];
    next[idx] = null;
    setSlots(next);
  }

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2200);
    } catch { /* ignore */ }
  }

  const activeSpots = slots.filter(Boolean) as Spot[];
  const activeForecasts = activeSpots.map((s) => forecasts?.find((f) => f.spot.slug === s.slug) ?? null);
  const hasAny = activeSpots.length > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-white/55 transition hover:text-sand-200">
        <ArrowLeft className="h-3.5 w-3.5" />
        {t(locale, "compareBack")}
      </Link>

      <header className="mt-6 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-sand-200/70">{t(locale, "compareKicker")}</p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">{t(locale, "compareTitle")}</h1>
          <p className="mt-3 max-w-2xl text-pretty text-white/65">
            {t(locale, "compareIntro")}
          </p>
        </div>
        {hasAny && (
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-white/80 transition hover:border-white/20 hover:text-white"
          >
            {shared ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
            {shared ? t(locale, "compareShareCopied") : t(locale, "compareShare")}
          </button>
        )}
      </header>

      {/* Level + day selector */}
      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3">
        <span className="text-xs uppercase tracking-widest text-white/45">{t(locale, "compareLevel")}</span>
        {(["beginner", "intermediate", "advanced"] as Level[]).map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              level === l ? "bg-ocean-500/25 text-ocean-100" : "bg-white/[0.04] text-white/60 hover:text-white"
            }`}
          >
            {t(locale, l === "beginner" ? "filterLevelBeginner" : l === "intermediate" ? "filterLevelIntermediate" : "filterLevelAdvanced")}
          </button>
        ))}
        <span className="ml-auto text-xs uppercase tracking-widest text-white/45">{t(locale, "compareDay")}</span>
        <select
          value={dayIdx}
          onChange={(e) => setDayIdx(Number(e.target.value))}
          className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-sm text-white/80 outline-none [color-scheme:dark]"
        >
          {Array.from({ length: 7 }, (_, i) => (
            <option key={i} value={i}>
              {i === 0 ? t(locale, "compareToday") : i === 1 ? t(locale, "compareTomorrow") : `J+${i}`}
            </option>
          ))}
        </select>
      </div>

      {/* Slots */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {slots.map((spot, idx) => (
          <CompareSlot
            key={idx}
            slotIdx={idx}
            spot={spot}
            forecast={activeForecasts[idx]}
            dayIdx={dayIdx}
            level={level}
            locale={locale}
            onAdd={() => { setAdding(idx); setQuery(""); }}
            onClear={() => clearSlot(idx)}
          />
        ))}
      </div>

      {/* Distance matrix when 2+ spots picked */}
      {activeSpots.length >= 2 && (
        <section className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
          <h2 className="mb-3 text-xs uppercase tracking-[0.25em] text-sand-200/70">{t(locale, "compareDistanceTitle")}</h2>
          <div className="flex flex-wrap gap-3 text-sm text-white/75">
            {activeSpots.map((a, i) =>
              activeSpots.slice(i + 1).map((b) => {
                const km = Math.round(haversineKm(a.lat, a.lon, b.lat, b.lon));
                return (
                  <span key={`${a.slug}-${b.slug}`} className="rounded-full bg-white/[0.04] px-3 py-1.5">
                    <strong className="text-white">{a.shortName}</strong>
                    <span className="mx-2 text-white/40">↔</span>
                    <strong className="text-white">{b.shortName}</strong>
                    <span className="ml-2 text-white/50">{km} km</span>
                  </span>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* Add-spot search modal */}
      {adding != null && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-md p-4 pt-20" onClick={() => setAdding(null)}>
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-depth-950 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 border-b border-white/[0.06] p-3">
              <Search className="h-4 w-4 text-white/40" />
              <input
                autoFocus
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t(locale, "compareSearchPlaceholder")}
                className="flex-1 bg-transparent text-white outline-none placeholder-white/40"
              />
              <button onClick={() => setAdding(null)} aria-label={t(locale, "compareClose")} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {suggestions.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-white/45">
                  {query.length < 2 ? t(locale, "compareTypeMinChars") : t(locale, "compareNoSpot")}
                </p>
              ) : (
                suggestions.map((s) => (
                  <button
                    key={s.slug}
                    onClick={() => pickSpot(s)}
                    className="block w-full rounded-xl px-3 py-2 text-left text-sm transition hover:bg-white/[0.05]"
                  >
                    <span className="font-display font-bold text-white">{s.shortName}</span>
                    <span className="ml-2 text-xs text-white/45">{s.region} · {s.department}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CompareSlot({
  slotIdx,
  spot,
  forecast,
  dayIdx,
  level,
  locale,
  onAdd,
  onClear,
}: {
  slotIdx: number;
  spot: Spot | null;
  forecast: SpotForecast | null;
  dayIdx: number;
  level: Level;
  locale: import("@/lib/i18n").Locale;
  onAdd: () => void;
  onClear: () => void;
}) {
  if (!spot) {
    return (
      <button
        onClick={onAdd}
        className="flex aspect-[3/4] flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-white/[0.12] bg-white/[0.015] p-6 text-white/55 transition hover:border-ocean-400/50 hover:bg-white/[0.04] hover:text-white"
      >
        <span className="grid h-12 w-12 place-items-center rounded-full bg-white/[0.04]">
          <Plus className="h-5 w-5" />
        </span>
        <span className="text-sm">{t(locale, "compareAddSpot")}</span>
        <span className="text-xs text-white/35">{tf(locale, "compareSlot", { n: slotIdx + 1, total: MAX_SLOTS })}</span>
      </button>
    );
  }

  const day = forecast?.days?.[dayIdx];
  const score = day?.scoresByLevel?.[level] ?? day?.score ?? 0;
  const tone = scoreTone(score);
  const colors = SCORE_COLORS[tone];
  const bestWin = day?.bestWindowByLevel?.[level];
  const tideHeights = forecast?.hourly?.tideHeight ?? [];
  const tideAtBest = bestWin && tideHeights.length > 0
    ? tideStateAt(tideHeights, dayIdx * 24 + bestWin.start)
    : null;

  return (
    <article className="relative flex flex-col rounded-3xl border border-white/[0.06] bg-white/[0.025] p-5">
      <button
        onClick={onClear}
        aria-label={t(locale, "compareRemoveSpot")}
        className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/30 text-white/60 transition hover:bg-black/50 hover:text-white"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <p className="text-xs uppercase tracking-widest text-white/45">{spot.region}</p>
      <h3 className="mt-1 font-display text-2xl font-bold leading-tight">{spot.shortName}</h3>
      <p className="mt-0.5 font-script text-sm text-sand-200/80">{spot.type}</p>

      {/* Score */}
      <div className="mt-5 flex items-end gap-3">
        <div
          className="grid h-20 w-20 place-items-center rounded-2xl font-display text-3xl font-black"
          style={{ background: `${colors.hex}25`, color: colors.hex }}
        >
          {forecast ? score : "…"}
        </div>
        <div className="flex-1 pb-1">
          <div className="text-xs uppercase tracking-widest text-white/45">{t(locale, "tileScoreLabel")}</div>
          <div className="font-display text-lg font-bold" style={{ color: colors.hex }}>
            {forecast ? t(locale, scoreLabelKey(score)) : t(locale, "compareLoading")}
          </div>
        </div>
      </div>

      {/* Condition rows */}
      <dl className="mt-5 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
        <Row label={t(locale, "cardWave")} value={day?.waveHeight != null ? `${fmt(day.waveHeight)} m` : "—"} />
        <Row label={t(locale, "cardPeriod")} value={day?.wavePeriod != null ? `${fmt(day.wavePeriod, 0)} s` : "—"} />
        <Row label={t(locale, "cardWind")} value={day?.windSpeed != null ? `${fmt(day.windSpeed, 0)} km/h` : "—"} />
        <Row label={t(locale, "compareDirection")} value={degToCardinal(day?.waveDir) || "—"} />
        <Row label={t(locale, "tilePower")} value={day?.wavePower != null ? `${fmt(day.wavePower, 0)} ${t(locale, "badgePowerUnit")}` : "—"} />
        <Row
          label={t(locale, "compareBestWindow")}
          value={bestWin ? `${String(bestWin.start).padStart(2, "0")}h–${String(bestWin.end + 1).padStart(2, "0")}h` : "—"}
        />
      </dl>

      {/* Tide */}
      {tideAtBest && (
        <div className="mt-4 rounded-xl border border-lagoon-300/20 bg-lagoon-400/8 px-3 py-2 text-xs text-lagoon-100">
          {tf(locale, "compareBestOnTide", { state: t(locale, tideStateKey(tideAtBest)) })}
        </div>
      )}

      {/* Warning badges */}
      <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
        {spot.worldClass && (
          <span className="rounded-full border border-coral-400/40 bg-coral-500/15 px-2 py-1 font-semibold text-coral-100">
            {t(locale, "badgeForExperts")}
          </span>
        )}
        {day?.engagedSurf && (
          <span className="rounded-full border border-sand-300/30 bg-sand-300/12 px-2 py-1 text-sand-100">
            {t(locale, "badgeHeavy")}
          </span>
        )}
      </div>

      <Link
        href={`/spot/${spot.slug}`}
        className="mt-auto mt-5 inline-flex items-center justify-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-white/80 transition hover:border-white/20 hover:text-white"
      >
        {t(locale, "compareFullSheet")}
      </Link>
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-widest text-white/40">{label}</dt>
      <dd className="font-display text-base font-bold text-white/90">{value}</dd>
    </div>
  );
}
