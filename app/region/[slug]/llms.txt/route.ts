import { notFound } from "next/navigation";
import { REGION_BY_SLUG } from "@/lib/seo";
import { regionLlmsTxt } from "@/lib/llms";

interface RouteProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-static";

export function generateStaticParams() {
  return Object.keys(REGION_BY_SLUG).map((slug) => ({ slug }));
}

export async function GET(_request: Request, { params }: RouteProps) {
  const { slug } = await params;
  const region = REGION_BY_SLUG[slug];
  if (!region) notFound();

  return new Response(regionLlmsTxt(region), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
