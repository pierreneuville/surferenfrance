/**
 * Lightweight analytics layer — Plausible (privacy-first) + GA4 fallback.
 *
 * Plausible: no cookies, EU-friendly, AdSense-compatible, ~30€/mo for 10k visitors.
 * GA4: free, more features, requires CMP for EU.
 *
 * Config via env vars:
 *   NEXT_PUBLIC_PLAUSIBLE_DOMAIN (e.g. yosurf.fr)
 *   NEXT_PUBLIC_GA4_ID (e.g. G-XXXXX)
 */

export type EventName =
  | "spot_modal_open"
  | "spot_share"
  | "spot_favorite_add"
  | "spot_favorite_remove"
  | "filter_region"
  | "filter_level"
  | "quick_action"
  | "geo_request"
  | "install_prompt_accept"
  | "install_prompt_dismiss"
  | "newsletter_signup"
  | "premium_waitlist_signup"
  | "affiliate_click"
  | "locale_change";

interface AnalyticsWindow extends Window {
  plausible?: (event: string, options?: { props?: Record<string, string | number | boolean> }) => void;
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
}

export function trackEvent(name: EventName, props?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  const w = window as AnalyticsWindow;
  try {
    if (typeof w.plausible === "function") {
      w.plausible(name, props ? { props } : undefined);
    }
    if (typeof w.gtag === "function") {
      w.gtag("event", name, props ?? {});
    }
  } catch { /* never throw */ }
}

export function trackPageView(path: string) {
  if (typeof window === "undefined") return;
  const w = window as AnalyticsWindow;
  try {
    if (typeof w.gtag === "function") {
      w.gtag("event", "page_view", { page_path: path });
    }
    // Plausible auto-tracks SPA navigations if its script is loaded.
  } catch { /* ignore */ }
}
