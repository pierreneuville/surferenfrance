import { NextResponse } from "next/server";

export const runtime = "edge";

/**
 * Error sink — receives client-side errors from `lib/errorReporting.ts`.
 *
 * Today: logs to stdout (visible in Vercel function logs).
 * Tomorrow: forward to Sentry / Logtail / Datadog by adding a single fetch here.
 *
 * Aggressively rate-limit-friendly: 1 KB payload max, no auth, no DB.
 */
export async function POST(request: Request) {
  try {
    const text = await request.text();
    if (text.length > 2048) {
      return NextResponse.json({ ok: false, reason: "payload too large" }, { status: 413 });
    }
    // Single console.error so it's grep-able as "[yosurf-error]" in logs.
    console.error("[yosurf-error]", text);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
