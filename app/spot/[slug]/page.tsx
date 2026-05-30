import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, MapPin, Waves, Wind, AlertTriangle, Compass } from "lucide-react";
import type { Metadata } from "next";
import { getSpotBySlug, getNearbySpots, SPOTS, REGION_EMOJI } from "@/lib/spots";
import { SpotDetailClient } from "@/components/SpotDetailClient";
import { AffiliatePanel } from "@/components/AffiliatePanel";
import { BuoyMiniPanel } from "@/components/BuoyMiniPanel";
import { JsonLd } from "@/components/JsonLd";
import type { Level } from "@/lib/types";
import { REGION_SLUGS, SITE_NAME, absoluteUrl, spotKeywords } from "@/lib/seo";
import { getServerLocale } from "@/lib/serverLocale";
import { t, tf, type Locale, type TranslationKey } from "@/lib/i18n";

interface PageProps { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return SPOTS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const spot = getSpotBySlug(slug);
  if (!spot) return { title: "Spot introuvable" };
  const title = `Prévisions surf ${spot.shortName} — vagues, houle et vent`;
  const description = `Prévisions surf ${spot.name} (${spot.department}) : score de session, hauteur des vagues, période de houle, vent, meilleur créneau du jour et spots à proximité.`;
  return {
    title,
    description,
    alternates: { canonical: `/spot/${spot.slug}` },
    keywords: spotKeywords(spot),
    openGraph: {
      title: `${title} · ${SITE_NAME}`,
      description,
      url: absoluteUrl(`/spot/${spot.slug}`),
      type: "article",
      images: [{ url: `/spot/${spot.slug}/opengraph-image`, width: 1200, height: 630, alt: `Prévisions surf ${spot.name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/spot/${spot.slug}/opengraph-image`],
    },
  };
}

function levelLabel(locale: Locale, level: Level): string {
  return t(locale, level === "beginner" ? "filterLevelBeginner" : level === "intermediate" ? "filterLevelIntermediate" : "filterLevelAdvanced");
}

function whenToSurf(locale: Locale, spot: NonNullable<ReturnType<typeof getSpotBySlug>>): string {
  const key: TranslationKey =
    spot.region === "Méditerranée" ? "spotWhenMediterranee"
    : spot.region === "Corse" ? "spotWhenCorse"
    : spot.region === "Manche & Nord" ? "spotWhenManche"
    : spot.region === "Bretagne" ? "spotWhenBretagne"
    : spot.region === "Canaries" ? "spotWhenCanaries"
    : spot.region === "Portugal" ? "spotWhenPortugal"
    : spot.region === "Maroc" ? "spotWhenMaroc"
    : spot.region === "Royaume-Uni" ? "spotWhenUK"
    : spot.region === "Irlande" ? "spotWhenIrlande"
    : spot.region === "Espagne Atlantique" ? "spotWhenEspagne"
    : "spotWhenAtlantique";
  return t(locale, key);
}

function accessTip(locale: Locale, spot: NonNullable<ReturnType<typeof getSpotBySlug>>): string {
  const type = spot.type.toLowerCase();
  if (type.includes("reef")) return t(locale, "spotAccessReef");
  if (type.includes("galets")) return t(locale, "spotAccessGalets");
  if (type.includes("jetée")) return t(locale, "spotAccessJetee");
  return t(locale, "spotAccessGeneric");
}

function levelAdvice(locale: Locale, level: Level): string {
  return t(locale, level === "beginner" ? "spotLevelBeginner" : level === "intermediate" ? "spotLevelIntermediate" : "spotLevelAdvanced");
}

export default async function SpotPage({ params }: PageProps) {
  const { slug } = await params;
  const spot = getSpotBySlug(slug);
  if (!spot) notFound();
  const nearby = getNearbySpots(spot, 4);
  const levelKey = spot.level as Level;
  const locale = await getServerLocale();
  const faqs = spotFaqs(locale, spot, nearby.map((item) => item.spot));

  const pageUrl = absoluteUrl(`/spot/${spot.slug}`);
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: `Prévisions surf ${spot.name}`,
        description: spot.description,
        isPartOf: { "@id": `${absoluteUrl("/")}#website` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        about: { "@id": `${pageUrl}#spot` },
        inLanguage: "fr-FR",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Spots", item: absoluteUrl("/spots") },
          { "@type": "ListItem", position: 3, name: spot.region, item: absoluteUrl(`/region/${REGION_SLUGS[spot.region]}`) },
          { "@type": "ListItem", position: 4, name: spot.name, item: pageUrl },
        ],
      },
      {
        "@type": ["Place", "TouristAttraction", "SportsActivityLocation"],
        "@id": `${pageUrl}#spot`,
        name: spot.name,
        alternateName: spot.shortName,
        description: spot.description,
        sport: "Surfing",
        address: { "@type": "PostalAddress", addressCountry: "FR", addressRegion: spot.department },
        geo: { "@type": "GeoCoordinates", latitude: spot.lat, longitude: spot.lon },
        url: pageUrl,
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#nearby`,
        name: `Spots de surf proches de ${spot.shortName}`,
        itemListElement: nearby.map(({ spot: nearbySpot }, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: nearbySpot.name,
          url: absoluteUrl(`/spot/${nearbySpot.slug}`),
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      // Dataset descriptor — surf forecast feed produced by the app for this spot.
      // Helps AI search understand the page is updated programmatically and what variables it exposes.
      {
        "@type": "Dataset",
        "@id": `${pageUrl}#dataset`,
        name: `Prévisions surf 7 jours — ${spot.name}`,
        description: `Hauteur de houle, période dominante, direction, puissance (kW/m), vent, rafales, marée et score session 0-100 pour ${spot.name}.`,
        url: pageUrl,
        temporalCoverage: "P7D",
        creator: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
        keywords: spotKeywords(spot).join(", "),
        variableMeasured: [
          "wave height",
          "effective set height",
          "wave power",
          "swell period",
          "wave direction",
          "wind speed",
          "wind direction",
          "wind gusts",
          "tide state",
          "surf session score (0-100)",
        ],
        distribution: [
          {
            "@type": "DataDownload",
            encodingFormat: "application/json",
            contentUrl: absoluteUrl(`/api/forecast/${spot.slug}`),
          },
          {
            "@type": "DataDownload",
            encodingFormat: "text/markdown",
            contentUrl: absoluteUrl(`/spot/${spot.slug}/llms.txt`),
          },
        ],
        spatialCoverage: {
          "@type": "Place",
          geo: { "@type": "GeoCoordinates", latitude: spot.lat, longitude: spot.lon },
        },
      },
    ],
  };

  return (
    <>
      <link rel="alternate" type="text/markdown" href={`/spot/${spot.slug}/llms.txt`} title={`${spot.name} LLM summary`} />
      <JsonLd data={ld} />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-sand-200">
          <ArrowLeft className="h-4 w-4" />
          {t(locale, "spotBackToAll")}
        </Link>

        {/* Header */}
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-ocean-300">
          <Link href={`/region/${REGION_SLUGS[spot.region]}`} className="hover:text-sand-200">
            {REGION_EMOJI[spot.region]} {spot.region}
          </Link>
          <span className="text-white/25">·</span>
          <span>{spot.department}</span>
        </div>
        <h1 className="font-display text-4xl font-bold md:text-5xl">{spot.name}</h1>
        <p className="mt-3 max-w-2xl text-pretty text-white/70">{spot.description}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">{spot.type}</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">
            {tf(locale, "spotSectionLevel", { level: levelLabel(locale, levelKey).toLowerCase() })}
          </span>
        </div>

        {/* Main 2-column layout on lg+ */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Left: forecast (data) */}
          <div className="min-w-0">
            <SpotDetailClient spot={spot} />

            {/* SEO sections */}
            <section className="mt-10 grid gap-4 sm:grid-cols-2">
              <SeoBlock icon={<Waves className="h-4 w-4" />} title={t(locale, "spotSectionWhen")}>
                {whenToSurf(locale, spot)}
              </SeoBlock>
              <SeoBlock icon={<Compass className="h-4 w-4" />} title={tf(locale, "spotSectionLevel", { level: levelLabel(locale, levelKey).toLowerCase() })}>
                {levelAdvice(locale, levelKey)}
              </SeoBlock>
              <SeoBlock icon={<MapPin className="h-4 w-4" />} title={t(locale, "spotSectionAccess")}>
                {accessTip(locale, spot)}
              </SeoBlock>
              <SeoBlock icon={<AlertTriangle className="h-4 w-4" />} title={t(locale, "spotSectionSafety")}>
                {t(locale, "spotSafetyText")}
              </SeoBlock>
            </section>

            <section className="mt-10" aria-labelledby="faq-spot">
              <h2 id="faq-spot" className="font-display text-2xl font-bold">
                {tf(locale, "spotSectionFaq", { name: spot.shortName })}
              </h2>
              <div className="mt-4 grid gap-3">
                {faqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="group rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 open:bg-white/[0.04]"
                  >
                    <summary className="cursor-pointer list-none font-display text-lg font-bold text-white/90">
                      {faq.question}
                      <span className="float-right ml-3 text-ocean-300 transition group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-pretty text-sm leading-relaxed text-white/65">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          {/* Right: aside (key info, sticky on lg+) */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {/* Affiliate panel FIRST — surfer's logistical question once they've decided on the spot */}
            <AffiliatePanel spot={spot} />

            {/* Live measurement = secondary / confirmation. Collapsed by default below the fold of interest. */}
            <details className="rounded-2xl border border-white/[0.06] bg-white/[0.025] open:bg-white/[0.04]">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-display font-bold text-white/85 marker:hidden">
                {t(locale, "buoysMiniNearestSpot")}
                <span className="float-right text-ocean-300/70 transition group-open:rotate-180">↓</span>
              </summary>
              <div className="border-t border-white/[0.04] p-2 pt-3">
                <BuoyMiniPanel
                  title=""
                  lat={spot.lat}
                  lon={spot.lon}
                  limit={1}
                  compact
                />
              </div>
            </details>

            {/* Nearby spots */}
            <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
              <h2 className="mb-3 text-xs uppercase tracking-widest text-white/45">
                {t(locale, "spotSectionNearby")}
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
                {t(locale, "spotSectionMarkers")}
              </h2>
              <ul className="space-y-2 text-sm">
                <Row icon={<Waves className="h-3.5 w-3.5" />} label={t(locale, "spotRowType")} value={spot.type} />
                <Row icon={<Compass className="h-3.5 w-3.5" />} label={t(locale, "spotRowLevel")} value={levelLabel(locale, levelKey)} />
                <Row icon={<MapPin className="h-3.5 w-3.5" />} label={t(locale, "spotRowRegion")} value={spot.region} />
                <Row icon={<Wind className="h-3.5 w-3.5" />} label={t(locale, "spotRowWind")} value={offshoreCardinal(locale, spot.offshore)} />
                <Row icon={<MapPin className="h-3.5 w-3.5" />} label={t(locale, "spotRowCoords")} value={`${spot.lat.toFixed(3)}, ${spot.lon.toFixed(3)}`} />
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

function offshoreCardinal(locale: Locale, deg: number): string {
  const keys: TranslationKey[] = ["cardN", "cardNE", "cardE", "cardSE", "cardS", "cardSW", "cardW", "cardNW"];
  return t(locale, keys[Math.round(deg / 45) % 8]);
}

function spotFaqs(
  locale: Locale,
  spot: NonNullable<ReturnType<typeof getSpotBySlug>>,
  nearby: NonNullable<ReturnType<typeof getSpotBySlug>>[]
) {
  const lvl = levelLabel(locale, spot.level as Level).toLowerCase();
  const nearbyNames = nearby.slice(0, 3).map((item) => item.shortName).join(", ");

  return [
    {
      question: tf(locale, "faqWhenQ", { name: spot.shortName }),
      answer: whenToSurf(locale, spot),
    },
    {
      question: tf(locale, "faqBeginnerQ", { name: spot.shortName }),
      answer:
        spot.level === "beginner"
          ? tf(locale, "faqBeginnerAYes", { name: spot.shortName })
          : tf(locale, "faqBeginnerANo", { name: spot.shortName, level: lvl }),
    },
    {
      question: tf(locale, "faqWindQ", { name: spot.shortName }),
      answer: tf(locale, "faqWindA", { name: spot.shortName, dir: offshoreCardinal(locale, spot.offshore) }),
    },
    {
      question: tf(locale, "faqNearbyQ", { name: spot.shortName }),
      answer: nearbyNames
        ? tf(locale, "faqNearbyAWith", { name: spot.shortName, nearby: nearbyNames })
        : tf(locale, "faqNearbyAEmpty", { name: spot.shortName }),
    },
  ];
}
