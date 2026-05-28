import Link from "next/link";
import { REGION_EMOJI, REGIONS, SPOTS } from "@/lib/spots";
import { REGION_SEO_COPY, REGION_SLUGS } from "@/lib/seo";

export function SeoSpotIndex() {
  return (
    <section className="mx-auto mt-20 max-w-6xl px-4" aria-labelledby="seo-spots-title">
      <div className="border-t border-white/[0.06] pt-10">
        <p className="text-xs uppercase tracking-[0.3em] text-sand-200/60">Guide des spots</p>
        <h2 id="seo-spots-title" className="mt-2 font-display text-3xl font-bold sm:text-4xl">
          Prévisions surf par région
        </h2>
        <p className="mt-3 max-w-3xl text-pretty text-white/65">
          Explore les prévisions surf en France par littoral : meilleur créneau, hauteur de vagues,
          période de houle, vent et niveau conseillé pour chaque spot.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {REGIONS.map((region) => {
            const spots = SPOTS.filter((spot) => spot.region === region);
            const featured = spots.slice(0, 6);
            const copy = REGION_SEO_COPY[region];

            return (
              <article key={region} className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl font-bold">
                      {REGION_EMOJI[region]} {copy.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">{copy.intro}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-white/[0.04] px-2.5 py-1 text-xs text-white/45">
                    {spots.length} spots
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {featured.map((spot) => (
                    <Link
                      key={spot.slug}
                      href={`/spot/${spot.slug}`}
                      className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-white/65 transition hover:border-ocean-400/40 hover:text-ocean-200"
                    >
                      {spot.shortName}
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/region/${REGION_SLUGS[region]}`}
                  className="mt-4 inline-flex text-sm font-medium text-ocean-300 transition hover:text-sand-200"
                >
                  Voir tous les spots {region} →
                </Link>
              </article>
            );
          })}
        </div>

        <div className="mt-8">
          <Link
            href="/spots"
            className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/75 transition hover:border-ocean-400/40 hover:text-ocean-200"
          >
            Index complet des spots de surf →
          </Link>
        </div>
      </div>
    </section>
  );
}
