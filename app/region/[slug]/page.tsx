import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Waves, Wind } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { REGION_EMOJI, REGIONS, SPOTS } from "@/lib/spots";
import {
  absoluteUrl,
  REGION_BY_SLUG,
  REGION_SEO_COPY,
  REGION_SLUGS,
  SITE_NAME,
} from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return Object.values(REGION_SLUGS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const region = REGION_BY_SLUG[slug];
  if (!region) return { title: "Région introuvable" };

  const copy = REGION_SEO_COPY[region];
  const spots = SPOTS.filter((spot) => spot.region === region);

  return {
    title: `${copy.title} — ${spots.length} spots, houle et vent`,
    description: `${copy.intro} Consulte les prévisions surf, vagues, vent et meilleur créneau sur ${spots.length} spots.`,
    alternates: { canonical: `/region/${slug}` },
    keywords: [
      copy.title.toLowerCase(),
      `surf ${region}`,
      `prévisions surf ${region}`,
      `spots surf ${region}`,
      `houle ${region}`,
    ],
    openGraph: {
      title: `${copy.title} · ${SITE_NAME}`,
      description: copy.intro,
      url: absoluteUrl(`/region/${slug}`),
      type: "website",
    },
  };
}

export default async function RegionPage({ params }: PageProps) {
  const { slug } = await params;
  const region = REGION_BY_SLUG[slug];
  if (!region) notFound();

  const spots = SPOTS.filter((spot) => spot.region === region);
  const copy = REGION_SEO_COPY[region];
  const pageUrl = absoluteUrl(`/region/${slug}`);
  const departmentGroups = groupByDepartment(spots);
  const faqs = regionFaqs(region, spots.length);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${copy.title} - ${SITE_NAME}`,
        description: copy.intro,
        isPartOf: { "@id": `${absoluteUrl("/")}#website` },
        about: { "@type": "Place", name: region },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Spots", item: absoluteUrl("/spots") },
          { "@type": "ListItem", position: 3, name: region, item: pageUrl },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#spots`,
        name: `Spots de surf ${region}`,
        numberOfItems: spots.length,
        itemListElement: spots.map((spot, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: absoluteUrl(`/spot/${spot.slug}`),
          name: spot.name,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <link rel="alternate" type="text/markdown" href={`/region/${slug}/llms.txt`} title={`${copy.title} LLM summary`} />
      <JsonLd data={jsonLd} />
      <Link href="/spots" className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-sand-200">
        <ArrowLeft className="h-4 w-4" />
        Tous les spots
      </Link>

      <p className="text-sm text-ocean-300">{REGION_EMOJI[region]} {region}</p>
      <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">{copy.title}</h1>
      <p className="mt-4 max-w-3xl text-pretty text-white/68">{copy.intro}</p>
      <p className="mt-3 max-w-3xl text-pretty text-white/55">{copy.season}</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Info icon={<Waves className="h-4 w-4" />} label="Spots suivis" value={`${spots.length} spots`} />
        <Info icon={<Wind className="h-4 w-4" />} label="Données" value="vagues, houle, vent" />
        <Info icon={<MapPin className="h-4 w-4" />} label="Prévision" value="7 jours · heure par heure" />
      </div>

      <section className="mt-10" aria-labelledby="spots-region">
        <h2 id="spots-region" className="font-display text-2xl font-bold">Spots de surf {region}</h2>
        <div className="mt-5 space-y-8">
          {departmentGroups.map(([department, departmentSpots]) => (
            <section key={department} aria-labelledby={`department-${department.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
              <h3
                id={`department-${department.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className="text-xs uppercase tracking-[0.25em] text-sand-200/55"
              >
                {department}
              </h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {departmentSpots.map((spot) => (
                  <Link
                    key={spot.slug}
                    href={`/spot/${spot.slug}`}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 transition hover:border-ocean-400/40 hover:bg-white/[0.04]"
                  >
                    <span className="block font-display text-xl font-bold">{spot.name}</span>
                    <span className="mt-1 block text-sm text-white/50">{spot.description}</span>
                    <span className="mt-3 block text-xs uppercase tracking-widest text-white/35">
                      {spot.type} · niveau {levelLabel(spot.level)}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="faq-region">
        <h2 id="faq-region" className="font-display text-2xl font-bold">Questions fréquentes sur le surf {region}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {faqs.map((faq) => (
            <article key={faq.question} className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">
              <h3 className="font-display text-lg font-bold">{faq.question}</h3>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-white/65">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-white/[0.06] pt-8" aria-labelledby="autres-regions">
        <h2 id="autres-regions" className="font-display text-2xl font-bold">Autres régions surf</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {REGIONS.filter((item) => item !== region).map((item) => (
            <Link
              key={item}
              href={`/region/${REGION_SLUGS[item]}`}
              className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-sm text-white/65 transition hover:border-ocean-400/40 hover:text-ocean-200"
            >
              {REGION_EMOJI[item]} {item}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-white/40">
        <span className="text-ocean-300">{icon}</span>
        {label}
      </div>
      <div className="font-display text-xl font-bold">{value}</div>
    </div>
  );
}

function groupByDepartment(spots: typeof SPOTS) {
  const groups = new Map<string, typeof SPOTS>();
  for (const spot of spots) {
    const current = groups.get(spot.department) ?? [];
    current.push(spot);
    groups.set(spot.department, current);
  }
  return [...groups.entries()];
}

function levelLabel(level: string) {
  if (level === "beginner") return "débutant";
  if (level === "advanced") return "confirmé";
  return "intermédiaire";
}

function regionFaqs(region: string, count: number) {
  return [
    {
      question: `Où surfer en ${region} ?`,
      answer: `Yosurf suit ${count} spots en ${region}, avec une fiche par spot pour comparer les vagues, le vent, le niveau conseillé et les spots proches.`,
    },
    {
      question: `Comment choisir le meilleur spot en ${region} aujourd'hui ?`,
      answer:
        "Compare d'abord le score de session, puis la hauteur de vague, la période de houle et le vent. Un vent offshore ou faible est souvent plus important qu'une vague très haute.",
    },
    {
      question: `Quelle période privilégier pour surfer en ${region} ?`,
      answer:
        REGION_SEO_COPY[region as keyof typeof REGION_SEO_COPY]?.season ??
        "L'automne et l'hiver apportent souvent les houles les plus régulières, mais les meilleures fenêtres dépendent du vent et de l'orientation de chaque spot.",
    },
    {
      question: `Les débutants peuvent-ils surfer en ${region} ?`,
      answer:
        "Oui, certains spots sont accessibles aux débutants quand la houle reste petite. Il faut privilégier les plages surveillées, les écoles de surf et éviter les jours de forts courants.",
    },
  ];
}
