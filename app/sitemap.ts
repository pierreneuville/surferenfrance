import type { MetadataRoute } from "next";
import { REGIONS, SPOTS } from "@/lib/spots";
import { REGION_SLUGS, SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/llms.txt`, lastModified: now, changeFrequency: "weekly", priority: 0.2 },
    { url: `${SITE_URL}/llms-full.txt`, lastModified: now, changeFrequency: "weekly", priority: 0.2 },
    { url: `${SITE_URL}/bouees`, lastModified: now, changeFrequency: "hourly", priority: 0.86 },
    { url: `${SITE_URL}/bouees/llms.txt`, lastModified: now, changeFrequency: "weekly", priority: 0.2 },
    { url: `${SITE_URL}/spots`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...REGIONS.map((region) => ({
      url: `${SITE_URL}/region/${REGION_SLUGS[region]}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.85,
    })),
    ...REGIONS.map((region) => ({
      url: `${SITE_URL}/region/${REGION_SLUGS[region]}/llms.txt`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.2,
    })),
    ...SPOTS.map((s) => ({
      url: `${SITE_URL}/spot/${s.slug}`,
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: 0.8,
    })),
    ...SPOTS.map((s) => ({
      url: `${SITE_URL}/spot/${s.slug}/llms.txt`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.2,
    })),
  ];
}
