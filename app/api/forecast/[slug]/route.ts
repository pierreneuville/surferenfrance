import { NextRequest, NextResponse } from "next/server";
import { getSpotBySlug } from "@/lib/spots";
import { fetchSpotForecast } from "@/lib/api";

// Per-spot detail (full hourly data). Used by SpotModal + spot detail page.
export const revalidate = 1800;
export const runtime = "nodejs";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const spot = getSpotBySlug(slug);
  if (!spot) {
    return NextResponse.json({ error: "Spot not found" }, { status: 404 });
  }
  try {
    const forecast = await fetchSpotForecast(spot, "intermediate");
    return NextResponse.json(forecast, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
        "CDN-Cache-Control": "public, s-maxage=1800",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Upstream fetch failed", message: (e as Error).message },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
