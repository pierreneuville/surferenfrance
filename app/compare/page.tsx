import type { Metadata } from "next";
import { CompareClient } from "@/components/CompareClient";
import { SITE_NAME, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Comparer des spots de surf — Yosurf",
  description: "Mets 3 spots côte à côte : score du jour, vague, vent, marée, distance entre spots. Aide-toi à choisir où aller surfer aujourd'hui.",
  alternates: { canonical: "/compare" },
  openGraph: {
    title: `Comparer des spots de surf · ${SITE_NAME}`,
    description: "Compare 3 spots côte à côte pour choisir où aller surfer.",
    url: absoluteUrl("/compare"),
  },
};

export default function ComparePage() {
  return <CompareClient />;
}
