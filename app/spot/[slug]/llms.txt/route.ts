import { notFound } from "next/navigation";
import { SPOTS, getSpotBySlug } from "@/lib/spots";
import { spotLlmsTxt } from "@/lib/llms";

interface RouteProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-static";

export function generateStaticParams() {
  return SPOTS.map((spot) => ({ slug: spot.slug }));
}

export async function GET(_request: Request, { params }: RouteProps) {
  const { slug } = await params;
  const spot = getSpotBySlug(slug);
  if (!spot) notFound();

  return new Response(spotLlmsTxt(spot), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
