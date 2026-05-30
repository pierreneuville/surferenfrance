/**
 * Environment helpers — distinguish prod / staging / preview / dev.
 *
 * Vercel exposes VERCEL_ENV at build + runtime:
 *   "production"  → main branch (your production domain)
 *   "preview"     → any other branch, including `staging`
 *   "development" → vercel dev / local
 *
 * We also expose VERCEL_GIT_COMMIT_REF (the branch name), so we can
 * tell apart `staging` previews from one-off feature branches.
 */

/** Coarse environment, used for feature gating and analytics segmentation. */
export type AppEnv = "production" | "staging" | "preview" | "development";

/** Resolved once at module load (Next inlines env vars at build time). */
export const APP_ENV: AppEnv = resolveAppEnv();

function resolveAppEnv(): AppEnv {
  // Server-side reads VERCEL_ENV; client-side needs the NEXT_PUBLIC_ mirror
  // (declared in vercel.json so Vercel exposes it to the browser bundle).
  const vercelEnv = process.env.VERCEL_ENV ?? process.env.NEXT_PUBLIC_VERCEL_ENV;
  const branch = process.env.VERCEL_GIT_COMMIT_REF ?? process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF;
  if (vercelEnv === "production") return "production";
  if (vercelEnv === "preview") return branch === "staging" ? "staging" : "preview";
  return "development";
}

function currentBranch(): string {
  return (
    process.env.VERCEL_GIT_COMMIT_REF ??
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF ??
    "branch"
  );
}

/** Human-readable env badge for the staging banner. */
export function envBadge(): { label: string; tone: "warn" | "info" | "muted" } | null {
  if (APP_ENV === "production") return null;
  if (APP_ENV === "staging") return { label: "STAGING", tone: "warn" };
  if (APP_ENV === "preview") return { label: `PREVIEW · ${currentBranch()}`, tone: "info" };
  return { label: "DEV", tone: "muted" };
}

export const IS_PRODUCTION = APP_ENV === "production";
export const IS_STAGING = APP_ENV === "staging";
