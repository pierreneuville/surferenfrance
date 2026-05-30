import { NextResponse } from "next/server";
import { CANDHIS_NOTE, fetchBuoyObservations } from "@/lib/buoys";

export const revalidate = 900;
export const runtime = "nodejs";

export async function GET() {
  const observations = await fetchBuoyObservations();

  return NextResponse.json(
    {
      updatedAt: new Date().toISOString(),
      candhis: {
        status: "requires_token",
        note: CANDHIS_NOTE,
      },
      observations,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
        "CDN-Cache-Control": "public, s-maxage=900",
      },
    }
  );
}
