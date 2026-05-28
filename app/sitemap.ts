import type { MetadataRoute } from "next";
import { SPOTS } from "@/lib/spots";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://surf-france.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "hourly", priority: 1 },
    ...SPOTS.map((s) => ({
      url: `${SITE_URL}/spot/${s.slug}`,
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/mentions-legales`, lastModified: now, priority: 0.1 },
    { url: `${SITE_URL}/politique-confidentialite`, lastModified: now, priority: 0.1 },
  ];
}
