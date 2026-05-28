import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yosurf.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/mentions-legales", "/politique-confidentialite"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
