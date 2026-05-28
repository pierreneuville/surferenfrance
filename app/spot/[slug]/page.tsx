import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, MapPin, Waves, Wind, AlertTriangle, Compass } from "lucide-react";
import type { Metadata } from "next";
import { getSpotBySlug, getNearbySpots, SPOTS, REGION_EMOJI } from "@/lib/spots";
import { SpotDetailClient } from "@/components/SpotDetailClient";
import type { Level } from "@/lib/types";

interface PageProps { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return SPOTS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const spot = getSpotBySlug(slug);
  if (!spot) return { title: "Spot introuvable" };
  return {
    title: `Surf ${spot.shortName} — prévisions vagues, houle et vent`,
    description: `Prévisions de surf en temps réel à ${spot.name} (${spot.department}) : hauteur de vagues, période de houle, vent, meilleur créneau du jour. Spots à proximité.`,
    alternates: { canonical: `/spot/${spot.slug}` },
    openGraph: {
      title: `Surf à ${spot.shortName} — prévisions du jour`,
      description: spot.description,
    },
  };
}

const LEVEL_LABEL: Record<Level, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  advanced: "Confirmé",
};

const LEVEL_ADVICE: Record<Level, string> = {
  beginner: "Idéal pour démarrer ou pour le longboard. Vagues douces, peu de courant, école souvent sur place.",
  intermediate: "Bon niveau requis. Tu sais déjà te lever, ramer et lire un peak. Quand ça envoie, mieux vaut savoir ce qu'on fait.",
  advanced: "Pour confirmés uniquement. Vagues puissantes, courants forts ou fond technique. Renseigne-toi sur place.",
};

function whenToSurf(spot: ReturnType<typeof getSpotBySlug>): string {
  if (!spot) return "";
  // Med spots are mostly winter swell
  if (spot.region === "Méditerranée") {
    return "Surfable principalement de fin d'automne à début printemps, par tempête de SE ou SW selon le spot. Sessions rares mais marquantes.";
  }
  if (spot.region === "Corse") {
    return "Fenêtres de surf en automne-hiver, par grosse houle d'ouest ou tempête méditerranéenne.";
  }
  if (spot.region === "Manche & Nord") {
    return "Meilleure saison de septembre à mars, quand les grosses dépressions atlantiques envoient une houle qui entre dans la Manche.";
  }
  if (spot.region === "Bretagne") {
    return "Fonctionne toute l'année, avec un sweet spot d'avril à novembre. Capricieux : la qualité dépend fortement de l'orientation de la houle.";
  }
  // Atlantique
  return "Surfable toute l'année. L'automne (sept-nov) est la meilleure saison : houles puissantes, eau encore tiède, moins de monde.";
}

function accessTip(spot: ReturnType<typeof getSpotBySlug>): string {
  if (!spot) return "";
  if (spot.type.toLowerCase().includes("reef")) {
    return "Accès direct par la plage, mais attention au fond rocheux. Combinaison + chaussons recommandés, ne pas surfer à marée basse.";
  }
  if (spot.type.toLowerCase().includes("galets")) {
    return "Plage de galets — attention aux entrées/sorties de l'eau et aux chocs. Chaussons utiles.";
  }
  if (spot.type.toLowerCase().includes("jetée")) {
    return "Spot à côté d'une jetée ou enrochement. Reste à distance des structures, surtout par grosse houle.";
  }
  return "Accès facile par la plage, parking généralement à proximité. Renseigne-toi en local sur les courants saisonniers.";
}

export default async function SpotPage({ params }: PageProps) {
  const { slug } = await params;
  const spot = getSpotBySlug(slug);
  if (!spot) notFound();
  const nearby = getNearbySpots(spot, 4);
  const levelKey = spot.level as Level;

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
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-sand-200">
          <ArrowLeft className="h-4 w-4" />
          Tous les spots
        </Link>

        {/* Header */}
        <div className="mb-2 text-sm text-ocean-300">
          {REGION_EMOJI[spot.region]} {spot.region} · {spot.department}
        </div>
        <h1 className="font-display text-4xl font-bold md:text-5xl">{spot.name}</h1>
        <p className="mt-3 max-w-2xl text-pretty text-white/70">{spot.description}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">{spot.type}</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">
            Niveau {LEVEL_LABEL[levelKey].toLowerCase()}
          </span>
        </div>

        {/* Main 2-column layout on lg+ */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Left: forecast (data) */}
          <div className="min-w-0">
            <SpotDetailClient spot={spot} />

            {/* SEO sections */}
            <section className="mt-10 grid gap-4 sm:grid-cols-2">
              <SeoBlock icon={<Waves className="h-4 w-4" />} title="Quand surfer ici">
                {whenToSurf(spot)}
              </SeoBlock>
              <SeoBlock icon={<Compass className="h-4 w-4" />} title={`Niveau ${LEVEL_LABEL[levelKey].toLowerCase()}`}>
                {LEVEL_ADVICE[levelKey]}
              </SeoBlock>
              <SeoBlock icon={<MapPin className="h-4 w-4" />} title="Accès & repères">
                {accessTip(spot)}
              </SeoBlock>
              <SeoBlock icon={<AlertTriangle className="h-4 w-4" />} title="Sécurité">
                Surfe avec une combinaison adaptée. Repère les courants avant d'aller à l'eau. Respecte les locaux et la priorité. Vérifie la météo et la marée.
              </SeoBlock>
            </section>
          </div>

          {/* Right: aside (key info, sticky on lg+) */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {/* Nearby spots */}
            <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
              <h2 className="mb-3 text-xs uppercase tracking-widest text-white/45">
                Spots à proximité
              </h2>
              <div className="space-y-2">
                {nearby.map(({ spot: n, km }) => (
                  <Link
                    key={n.slug}
                    href={`/spot/${n.slug}`}
                    className="group flex items-center justify-between gap-2 rounded-xl border border-white/[0.05] bg-white/[0.03] px-3 py-2.5 transition hover:border-ocean-400/40 hover:bg-white/[0.06]"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-display text-sm font-bold">
                        {n.shortName}
                      </div>
                      <div className="text-[10px] text-white/45">
                        {REGION_EMOJI[n.region]} {n.region}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1 text-xs text-ocean-300">
                      {Math.round(km)} km
                      <ExternalLink className="h-3 w-3 opacity-50 transition group-hover:opacity-100" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Spot meta card */}
            <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
              <h2 className="mb-3 text-xs uppercase tracking-widest text-white/45">
                Repères
              </h2>
              <ul className="space-y-2 text-sm">
                <Row icon={<Waves className="h-3.5 w-3.5" />} label="Type" value={spot.type} />
                <Row icon={<Compass className="h-3.5 w-3.5" />} label="Niveau" value={LEVEL_LABEL[levelKey]} />
                <Row icon={<MapPin className="h-3.5 w-3.5" />} label="Région" value={spot.region} />
                <Row icon={<Wind className="h-3.5 w-3.5" />} label="Vent idéal" value={offshoreCardinal(spot.offshore)} />
                <Row icon={<MapPin className="h-3.5 w-3.5" />} label="Coordonnées" value={`${spot.lat.toFixed(3)}, ${spot.lon.toFixed(3)}`} />
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

function SeoBlock({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-sand-200/90">
        <span className="text-ocean-300/80">{icon}</span>
        {title}
      </div>
      <p className="text-pretty text-sm leading-relaxed text-white/65">{children}</p>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <li className="flex items-center justify-between gap-2 text-white/70">
      <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/45">
        <span className="text-ocean-300/70">{icon}</span>
        {label}
      </span>
      <span className="text-right font-medium text-white">{value}</span>
    </li>
  );
}

function offshoreCardinal(deg: number): string {
  const dirs = ["Nord", "Nord-Est", "Est", "Sud-Est", "Sud", "Sud-Ouest", "Ouest", "Nord-Ouest"];
  return dirs[Math.round(deg / 45) % 8];
}
