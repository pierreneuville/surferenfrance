/**
 * Lightweight error reporting facade.
 *
 * Today it logs to the console and (in production) POSTs a compact summary
 * to /api/errors. Swap the body of `captureException` to wire @sentry/nextjs,
 * Highlight, LogRocket, or any vendor — call sites don't change.
 *
 * Why a facade rather than direct Sentry calls:
 *   - Zero vendor lock-in (we ship without a paid plan)
 *   - Tests stay deterministic (no network in unit tests)
 *   - Privacy by default: payload is opt-in fields only, no PII
 */

interface ErrorContext {
  /** Logical area: "api/forecasts", "buoys/parse", "spot-modal", etc. */
  area: string;
  /** Extra typed metadata; KEEP IT SMALL & NON-PII. */
  extra?: Record<string, string | number | boolean | null | undefined>;
}

const ENDPOINT = "/api/errors";

export function captureException(err: unknown, context: ErrorContext): void {
  const message = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : undefined;

  // Always log in dev for quick debugging.
  if (process.env.NODE_ENV !== "production") {
    console.error(`[${context.area}]`, message, context.extra, stack);
    return;
  }

  // In production, fire-and-forget a beacon-style POST. We deliberately don't
  // await — error reporting must never block UX. The server endpoint can
  // forward to Sentry / Logtail / whatever the user wires up later.
  try {
    const payload = JSON.stringify({
      message,
      area: context.area,
      extra: context.extra ?? {},
      ts: new Date().toISOString(),
      ua: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      url: typeof location !== "undefined" ? location.href : undefined,
    });
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, payload);
    } else {
      void fetch(ENDPOINT, { method: "POST", body: payload, keepalive: true }).catch(() => {});
    }
  } catch {
    // Swallow — we never want monitoring to throw.
  }
}

/** Convenience wrapper for fetch with auto-capture on non-ok responses. */
export async function safeFetch(url: string, init: RequestInit | undefined, area: string): Promise<Response | null> {
  try {
    const res = await fetch(url, init);
    if (!res.ok) {
      captureException(new Error(`HTTP ${res.status}`), { area, extra: { url, status: res.status } });
    }
    return res;
  } catch (err) {
    captureException(err, { area, extra: { url } });
    return null;
  }
}
