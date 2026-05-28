import type { Metadata } from "next";
import Link from "next/link";
import { REGION_EMOJI, REGIONS, SPOTS } from "@/lib/spots";
import { absoluteUrl, DEFAULT_DESCRIPTION, REGION_SEO_COPY, REGION_SLUGS, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Tous les spots de surf en France",
  description:
    "Index des spots de surf en France : retrouvez les prévisions vagues, houle, vent et meilleur créneau pour chaque spot du littoral.",
  alternates: { canonical: "/spots" },
  openGraph: {
    title: `Tous les spots de surf en France · ${SITE_NAME}`,
    description: DEFAULT_DESCRIPTION,
    url: absoluteUrl("/spots"),
  },
};

export default function SpotsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs uppercase tracking-[0.3em] text-sand-200/60">Index surf</p>
      <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Tous les spots de surf</h1>
      <p className="mt-4 max-w-3xl text-pretty text-white/65">
        Accède aux fiches complètes des spots français : score de session, prévisions de vagues,
        période de houle, vent, niveau conseillé et spots proches.
      </p>

      <div className="mt-10 space-y-10">
        {REGIONS.map((region) => {
          const spots = SPOTS.filter((spot) => spot.region === region);
          return (
            <section key={region} aria-labelledby={`region-${REGION_SLUGS[region]}`}>
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/[0.06] pb-3">
                <div>
                  <h2 id={`region-${REGION_SLUGS[region]}`} className="font-display text-2xl font-bold">
                    {REGION_EMOJI[region]} {region}
                  </h2>
                  <p className="mt-1 text-sm text-white/55">{REGION_SEO_COPY[region].season}</p>
                </div>
                <Link href={`/region/${REGION_SLUGS[region]}`} className="text-sm text-ocean-300 hover:text-sand-200">
                  Page région →
                </Link>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {spots.map((spot) => (
                  <Link
                    key={spot.slug}
                    href={`/spot/${spot.slug}`}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-3 transition hover:border-ocean-400/40 hover:bg-white/[0.04]"
                  >
                    <span className="block font-display text-lg font-bold">{spot.name}</span>
                    <span className="mt-1 block text-xs text-white/45">
                      {spot.department} · {spot.type} · niveau {spot.level === "beginner" ? "débutant" : spot.level === "intermediate" ? "intermédiaire" : "confirmé"}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
