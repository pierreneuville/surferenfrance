import type { Metadata } from "next";
import Link from "next/link";
import { Activity, Database, Radio, Waves } from "lucide-react";
import { BuoyDashboard } from "@/components/BuoyDashboard";
import { JsonLd } from "@/components/JsonLd";
import { CANDHIS_NOTE, fetchBuoyObservations } from "@/lib/buoys";
import { SITE_NAME, absoluteUrl } from "@/lib/seo";
import { getServerLocale } from "@/lib/serverLocale";
import { t } from "@/lib/i18n";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Bouées live — mesures de houle en direct",
  description:
    "Tableau live des bouées de houle utiles au surf : hauteur moyenne, hauteur max, période, direction, vent et fraîcheur du relevé.",
  alternates: { canonical: "/bouees" },
  openGraph: {
    title: `Bouées live surf · ${SITE_NAME}`,
    description: "Mesures de houle et de vent en direct depuis les bouées NOAA, avec architecture prête pour CANDHIS.",
    url: absoluteUrl("/bouees"),
  },
};

export default async function BuoysPage() {
  const observations = await fetchBuoyObservations();
  const locale = await getServerLocale();
  const liveCount = observations.filter((observation) => observation.status === "live").length;
  const waveCount = observations.filter((observation) => observation.waveHeight != null).length;
  const updatedAt = new Date().toISOString();
  const pageUrl = absoluteUrl("/bouees");
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Bouées live surf",
        description: "Mesures de houle et de vent en direct utiles aux surfeurs.",
        isPartOf: { "@id": `${absoluteUrl("/")}#website` },
        inLanguage: "fr-FR",
        about: { "@id": `${pageUrl}#dataset` },
      },
      {
        "@type": "Dataset",
        "@id": `${pageUrl}#dataset`,
        name: "Yosurf live surf buoy observations",
        description: "Observations de bouées NOAA NDBC avec hauteur de houle, période dominante, direction, vent et fraîcheur de relevé.",
        url: pageUrl,
        temporalCoverage: "real-time",
        spatialCoverage: "Atlantic Ocean, English Channel, North Sea",
        measurementTechnique: "NOAA NDBC realtime station text feeds",
        variableMeasured: ["wave height", "dominant wave period", "wave direction", "wind speed", "wind direction", "water temperature"],
        distribution: [
          {
            "@type": "DataDownload",
            encodingFormat: "application/json",
            contentUrl: absoluteUrl("/api/buoys"),
          },
          {
            "@type": "DataDownload",
            encodingFormat: "text/markdown",
            contentUrl: absoluteUrl("/bouees/llms.txt"),
          },
        ],
      },
    ],
  };

  return (
    <>
      <link rel="alternate" type="text/markdown" href="/bouees/llms.txt" title="Bouées live LLM summary" />
      <JsonLd data={ld} />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="mb-8">
          <Link href="/" className="text-sm text-white/55 transition hover:text-sand-200">
            {t(locale, "buoysPageBreadcrumb")}
          </Link>
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-sand-200/60">{t(locale, "buoysKicker")}</p>
          <h1 className="mt-2 font-display text-4xl font-bold leading-tight sm:text-5xl">
            {t(locale, "buoysPageTitle")}
          </h1>
          <p className="mt-4 max-w-3xl text-pretty text-white/65">
            {t(locale, "buoysPageIntro")}
          </p>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <InfoCard icon={<Radio className="h-4 w-4" />} label={t(locale, "buoysStatStations")} value={`${observations.length}`} />
          <InfoCard icon={<Activity className="h-4 w-4" />} label={t(locale, "buoysStatLive")} value={`${liveCount}`} />
          <InfoCard icon={<Waves className="h-4 w-4" />} label={t(locale, "buoysStatWave")} value={`${waveCount}`} />
        </div>

        <BuoyDashboard observations={observations} updatedAt={updatedAt} />

        <section className="mt-10 rounded-3xl border border-white/[0.06] bg-white/[0.025] p-5">
          <div className="flex items-start gap-3">
            <Database className="mt-1 h-5 w-5 shrink-0 text-ocean-300" />
            <div>
              <h2 className="font-display text-xl font-bold">{t(locale, "buoysSourceTitle")}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {t(locale, "buoysSourceBody")} {CANDHIS_NOTE}
              </p>
              <p className="mt-2 text-xs text-white/38">
                {t(locale, "buoysSourceCaveat")}
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-white/40">
        <span className="text-ocean-300">{icon}</span>
        {label}
      </div>
      <div className="font-display text-2xl font-bold">{value}</div>
    </div>
  );
}
