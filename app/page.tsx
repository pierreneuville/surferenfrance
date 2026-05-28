import type { Metadata } from "next";
import { HomeContent } from "@/components/HomeContent";
import { Hero } from "@/components/Hero";
import { SeoSpotIndex } from "@/components/SeoSpotIndex";
import { DEFAULT_DESCRIPTION, SITE_NAME, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Prévisions surf France — vagues, houle, vent et meilleurs spots",
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: `Prévisions surf France · ${SITE_NAME}`,
    description: DEFAULT_DESCRIPTION,
    url: absoluteUrl("/"),
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <HomeContent />
      <SeoSpotIndex />
    </>
  );
}
