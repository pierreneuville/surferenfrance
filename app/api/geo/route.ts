import { NextResponse } from "next/server";
import { headers } from "next/headers";

export const runtime = "edge";

/**
 * Returns the user's approximate geo (city centroid) from Vercel's edge headers.
 *
 * Why: native browser geolocation prompts are disruptive and many users dismiss.
 * Falling back to IP-derived coords lets us tailor the home page (HotToday near
 * me, nearest buoys) without a permission dialog. Precise geo is still requested
 * when the user explicitly taps "Près de moi".
 *
 * Headers (set by Vercel):
 *   - x-vercel-ip-latitude   "48.857"
 *   - x-vercel-ip-longitude  "2.353"
 *   - x-vercel-ip-city       "Paris"
 *   - x-vercel-ip-country    "FR"
 *
 * Locally these are absent → returns nulls and the client just acts as if no
 * geo was available (graceful degradation).
 */
export async function GET() {
  const h = await headers();
  const lat = h.get("x-vercel-ip-latitude");
  const lon = h.get("x-vercel-ip-longitude");
  const city = h.get("x-vercel-ip-city");
  const country = h.get("x-vercel-ip-country");

  const latitude = lat ? Number(lat) : null;
  const longitude = lon ? Number(lon) : null;

  return NextResponse.json(
    {
      source: latitude != null && longitude != null ? "ip" : "unavailable",
      lat: latitude,
      lon: longitude,
      city: city ? decodeURIComponent(city) : null,
      country: country ?? null,
    },
    {
      headers: {
        // 5 min cache — IP lookups are stable for a session and we want low latency.
        "Cache-Control": "private, max-age=300",
      },
    }
  );
}
