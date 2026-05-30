import { envBadge } from "@/lib/env";

/**
 * Discreet env banner — only shows outside production.
 *
 * Sits above the header, full-width, color-coded:
 *   STAGING → coral (warn)
 *   PREVIEW → ocean (info)
 *   DEV     → muted gray
 *
 * Server component, zero JS shipped.
 */
export function EnvBanner() {
  const badge = envBadge();
  if (!badge) return null;

  const colors = {
    warn:  "bg-coral-500/20 text-coral-100 border-coral-400/40",
    info:  "bg-ocean-500/20 text-ocean-100 border-ocean-400/40",
    muted: "bg-white/[0.04] text-white/55 border-white/10",
  }[badge.tone];

  return (
    <div className={`border-b ${colors}`}>
      <p className="mx-auto max-w-6xl px-4 py-1.5 text-center text-xs font-bold uppercase tracking-[0.25em]">
        ⚠ {badge.label} · not production
      </p>
    </div>
  );
}
