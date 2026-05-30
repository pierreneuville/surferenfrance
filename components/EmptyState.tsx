import { Compass, MapPin, Sparkles } from "lucide-react";
import { t, tf } from "@/lib/i18n";
import { useLocale } from "@/lib/useLocale";

const PUNCHLINES = [
  "Ça plate par ici.",
  "Personne n'envoie aujourd'hui.",
  "La houle dort, à toi de la réveiller ailleurs.",
  "Pas de vague dans ce coin — encore.",
  "Le banc s'est fait la malle.",
  "Élargis le scan, ça envoie peut-être plus loin.",
];

const SUGGESTION_KEYS = [
  "emptyTipRegionDay",
  "emptyTipLevel",
  "emptyTipNearMe",
  "emptyTipTomorrow",
  "emptyTipCountry",
] as const;

export function EmptyState({ message }: { message?: string }) {
  const { locale } = useLocale();
  const punchline = message ?? PUNCHLINES[Math.floor(Math.random() * PUNCHLINES.length)];
  const tip = t(locale, SUGGESTION_KEYS[Math.floor(Math.random() * SUGGESTION_KEYS.length)]);
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-ocean-950/40 via-depth-950 to-depth-950 px-6 py-16 text-center">
      {/* glow */}
      <div className="pointer-events-none absolute -top-12 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-coral-500/15 blur-3xl" />

      {/* decorative wave */}
      <svg
        viewBox="0 0 200 60"
        className="relative mx-auto mb-6 h-12 w-32 text-ocean-400/70"
        aria-hidden
      >
        <path
          d="M0 30 Q 25 5 50 30 T 100 30 T 150 30 T 200 30"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M0 45 Q 25 20 50 45 T 100 45 T 150 45 T 200 45"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
      <p className="relative font-script text-2xl text-sand-200/90">{punchline}</p>
      <p className="relative mt-2 inline-flex items-center gap-1.5 text-sm text-white/45">
        <Sparkles className="h-3.5 w-3.5 text-coral-300/70" />
        {tip}
      </p>
      <p className="relative mt-1 inline-flex items-center gap-1.5 text-xs text-white/30">
        <Compass className="h-3 w-3" />
        {t(locale, "emptySearchHint")}
      </p>
    </div>
  );
}

/** Empty state for /spots filter or other list views. */
export function EmptySpotsForRegion({ regionName }: { regionName: string }) {
  const { locale } = useLocale();
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] px-6 py-12 text-center">
      <MapPin className="mx-auto mb-3 h-8 w-8 text-white/30" />
      <p className="font-script text-xl text-sand-200/90">
        {tf(locale, "emptyRegionNone", { region: regionName })}
      </p>
      <p className="mt-2 text-xs text-white/40">
        {t(locale, "emptyRegionSoon")}
      </p>
    </div>
  );
}
