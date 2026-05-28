import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getSpotBySlug, SPOTS, REGION_EMOJI } from "@/lib/spots";
import { SpotDetailClient } from "@/components/SpotDetailClient";

interface PageProps { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return SPOTS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const spot = getSpotBySlug(slug);
  if (!spot) return { title: "Spot introuvable" };
  return {
    title: `Prévisions surf ${spot.shortName} — vagues, houle et vent`,
    description: `Prévisions de surf en temps réel à ${spot.name} (${spot.department}) : hauteur de vagues, période de houle, vent, meilleur créneau du jour.`,
    alternates: { canonical: `/spot/${spot.slug}` },
    openGraph: {
      title: `Surf à ${spot.shortName} — prévisions du jour`,
      description: spot.description,
    },
  };
}

export default async function SpotPage({ params }: PageProps) {
  const { slug } = await params;
  const spot = getSpotBySlug(slug);
  if (!spot) notFound();

  const ld = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: spot.name,
    description: spot.description,
    address: { "@type": "PostalAddress", addressCountry: "FR", addressRegion: spot.department },
    geo: { "@type": "GeoCoordinates", latitude: spot.lat, longitude: spot.lon },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-ocean-300">
          <ArrowLeft className="h-4 w-4" />
          Tous les spots
        </Link>
        <div className="mb-2 text-sm text-ocean-300">
          {REGION_EMOJI[spot.region]} {spot.region} · {spot.department}
        </div>
        <h1 className="font-display text-4xl font-bold md:text-5xl">{spot.name}</h1>
        <p className="mt-3 text-white/70 text-pretty">{spot.description}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">{spot.type}</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">
            Niveau {spot.level === "beginner" ? "débutant" : spot.level === "intermediate" ? "intermédiaire" : "confirmé"}
          </span>
        </div>

        <SpotDetailClient spot={spot} />
      </div>
    </>
  );
}
