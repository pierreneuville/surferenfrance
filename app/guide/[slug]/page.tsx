import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Compass, MapPin, Sparkles, Waves, Wind } from "lucide-react";
import { GUIDES, allGuideSlugs, getGuideBySlug } from "@/lib/guides";
import { getSpotBySlug } from "@/lib/spots";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

export const dynamicParams = false;
export const revalidate = 86400; // refresh once a day — guides are mostly static editorial

export async function generateStaticParams() {
  return allGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guide/${guide.slug}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: absoluteUrl(`/guide/${guide.slug}`),
      type: "article",
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();
  const spot = getSpotBySlug(guide.spotSlug);
  if (!spot) notFound();

  const pageUrl = absoluteUrl(`/guide/${guide.slug}`);
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: guide.title,
        description: guide.description,
        url: pageUrl,
        about: spot.name,
        inLanguage: "fr-FR",
        author: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
        publisher: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: guide.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  const nearbySpots = guide.nearby.map(getSpotBySlug).filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <>
      <JsonLd data={ld} />
      <article className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-white/55 transition hover:text-sand-200">
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour à la carte
        </Link>

        {/* Hero */}
        <header className="mt-6">
          <p className="text-xs uppercase tracking-[0.3em] text-sand-200/70">Guide spot</p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
            {guide.title}
          </h1>
          <p className="mt-4 font-script text-xl text-sand-200/90">{guide.tagline}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {guide.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-white/65">
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Quick summary */}
        <section className="mt-8 grid gap-3 sm:grid-cols-2">
          <SummaryRow icon={<Calendar className="h-3.5 w-3.5" />} label="Saison" value={guide.season} />
          <SummaryRow icon={<Waves className="h-3.5 w-3.5" />} label="Houle" value={guide.swell} />
          <SummaryRow icon={<Wind className="h-3.5 w-3.5" />} label="Vent" value={guide.wind} />
          <SummaryRow icon={<Compass className="h-3.5 w-3.5" />} label="Marée" value={guide.tide} />
          <SummaryRow icon={<Sparkles className="h-3.5 w-3.5" />} label="Affluence" value={guide.crowd} />
          <SummaryRow icon={<MapPin className="h-3.5 w-3.5" />} label="Région" value={`${spot.region} · ${spot.department}`} />
        </section>

        {/* CTA to live forecast */}
        <section className="mt-8 rounded-3xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-emerald-300/90">Prévision live</p>
              <p className="mt-1 font-display text-lg font-bold">Voir la prévision 7 jours à {spot.shortName}</p>
            </div>
            <Link
              href={`/spot/${spot.slug}`}
              className="tap-target inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Voir
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Long-form sections */}
        <div className="mt-10 space-y-8">
          {guide.sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-2xl font-bold leading-tight">{section.title}</h2>
              <div className="mt-3 space-y-3 text-pretty leading-relaxed text-white/75">
                {section.body.split("\n\n").map((para, idx) => (
                  <p key={idx}>{para.trim()}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* FAQs */}
        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold">Questions fréquentes</h2>
          <div className="mt-4 grid gap-3">
            {guide.faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 open:bg-white/[0.04]"
              >
                <summary className="cursor-pointer list-none font-display text-base font-bold text-white/90">
                  {faq.question}
                  <span className="float-right ml-3 text-ocean-300 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-white/65">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Nearby spots */}
        {nearbySpots.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-2xl font-bold">Spots autour</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {nearbySpots.map((s) => (
                <Link
                  key={s.slug}
                  href={`/spot/${s.slug}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3 transition hover:border-white/15 hover:bg-white/[0.05]"
                >
                  <span>
                    <span className="font-display font-bold">{s.shortName}</span>
                    <span className="ml-2 text-xs text-white/45">{s.type}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-white/40" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Other guides */}
        {GUIDES.length > 1 && (
          <section className="mt-12 border-t border-white/[0.06] pt-8">
            <h2 className="text-xs uppercase tracking-[0.25em] text-sand-200/70">Autres guides</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {GUIDES.filter((g) => g.slug !== guide.slug).map((g) => (
                <Link
                  key={g.slug}
                  href={`/guide/${g.slug}`}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3 transition hover:border-white/15 hover:bg-white/[0.05]"
                >
                  <div className="text-xs uppercase tracking-widest text-sand-200/70">Guide</div>
                  <div className="mt-1 font-display font-bold">{g.title}</div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}

function SummaryRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-white/45">
        <span className="text-ocean-300">{icon}</span>
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-white/85">{value}</div>
    </div>
  );
}
