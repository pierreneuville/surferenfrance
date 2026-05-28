// Returns the current build ID. Force-dynamic so each deploy serves its own.
// Cache-Control: no-store so browsers never reuse a stale value.
export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET() {
  return Response.json(
    { buildId: process.env.NEXT_PUBLIC_BUILD_ID || "dev" },
    { headers: { "Cache-Control": "no-store, must-revalidate" } }
  );
}
