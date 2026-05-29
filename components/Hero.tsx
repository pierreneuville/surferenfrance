"use client";

import Image from "next/image";
import { ArrowDown, MapPin, Waves } from "lucide-react";
import { SPOTS } from "@/lib/spots";
import { useLocale } from "@/lib/useLocale";
import { t, tf } from "@/lib/i18n";

const HERO_IMG = "https://images.unsplash.com/photo-1502933691298-84fc14542831?auto=format&fit=crop&w=2400&q=80";

export function Hero() {
  const { locale } = useLocale();
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background — full-bleed surf shot with cinematic overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={HERO_IMG}
          alt="Surfeur dans une vague au coucher du soleil sur la côte française"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-depth-950/60 via-depth-950/30 to-depth-950" />
        <div className="absolute inset-0 bg-gradient-to-tr from-ocean-950/60 via-transparent to-coral-500/15" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_30%,rgba(251,191,36,0.18),transparent_70%)]" />
      </div>

      {/* Top hairline accent */}
      <div className="absolute left-1/2 top-12 -translate-x-1/2 text-sand-200/70 text-xs uppercase tracking-[0.4em] font-medium">
        {t(locale, "taglineMap")}
      </div>

      <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col items-center justify-center px-5 pb-12 pt-24 text-center md:min-h-[72vh] md:pt-28">
        {/* Live badge */}
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          {tf(locale, "heroBadgeLive", { n: SPOTS.length })}
        </span>

        {/* Headline — display font + script accent */}
        <h1 className="font-display text-balance text-[clamp(2.6rem,8vw,5.5rem)] font-bold leading-[0.95] tracking-tight">
          <span className="text-gradient-ocean drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            {t(locale, "heroTitleA")}
          </span>
          <br />
          <span className="font-script font-semibold text-[1.15em] leading-[0.85] text-gradient-sunset drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            {t(locale, "heroTitleB")}
          </span>
        </h1>

        {/* Tagline */}
        <p className="mt-7 max-w-xl text-pretty text-base text-white/85 sm:text-lg md:text-xl">
          {t(locale, "heroDescription")}
          <br className="hidden sm:block" />
          {tf(locale, "heroDescriptionRange", { from: t(locale, "heroFrom"), to: t(locale, "heroTo") })}
        </p>

        {/* Primary CTA + secondary */}
        <div className="mt-10 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <a
            href="#spots"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-coral-500 via-sunset-500 to-sand-400 px-7 py-3.5 text-base font-semibold text-white shadow-2xl shadow-coral-500/40 transition hover:scale-[1.02] hover:shadow-coral-500/60 active:scale-[0.98] sm:w-auto sm:text-lg"
          >
            <Waves className="h-4 w-4" />
            {t(locale, "heroCta")}
            <span className="transition group-hover:translate-x-0.5">→</span>
          </a>
          <a
            href="#a-propos"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm text-white/80 backdrop-blur-md transition hover:bg-white/10 sm:py-3.5"
          >
            <MapPin className="h-4 w-4" />
            {t(locale, "heroCtaSecondary")}
          </a>
        </div>

        {/* Mini stats — desktop only */}
        <div className="mt-14 hidden gap-10 text-center md:flex">
          <Stat number={SPOTS.length.toString()} label={t(locale, "heroStatsSpots")} />
          <Stat number="7" label={t(locale, "heroStatsRegions")} />
          <Stat number="7j" label={t(locale, "heroStatsForecast")} />
          <Stat number="24h" label={t(locale, "heroStatsHourly")} />
        </div>

        <a href="#spots" className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float text-white/60">
          <ArrowDown className="h-5 w-5" />
        </a>
      </div>

      <svg
        className="absolute bottom-0 left-0 right-0 h-16 w-full text-depth-950"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 50 Q 150 0 300 40 T 600 40 T 900 40 T 1200 40 V80 H0 Z" fill="currentColor" />
      </svg>
    </section>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl font-bold text-gradient-golden">{number}</div>
      <div className="mt-0.5 text-xs uppercase tracking-widest text-white/50">{label}</div>
    </div>
  );
}
