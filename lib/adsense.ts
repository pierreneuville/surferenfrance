// Production AdSense publisher ID — public value (anyone can see it in our page source).
// Hardcoded as fallback so a forgotten env var doesn't break monetization.
// Set NEXT_PUBLIC_ADSENSE_CLIENT in Vercel env to override (e.g. with a test ID).
const FALLBACK_CLIENT = "ca-pub-9405298371447683";

const rawClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || FALLBACK_CLIENT;

export const ADSENSE_CLIENT = rawClient.startsWith("pub-")
  ? `ca-${rawClient}`
  : rawClient;

export const ADSENSE_PUBLISHER_ID = ADSENSE_CLIENT?.replace(/^ca-/, "");

export const ADSENSE_SLOT_IN_FEED = process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_FEED?.trim();
export const ADSENSE_SLOT_SPOT_DETAIL = process.env.NEXT_PUBLIC_ADSENSE_SLOT_SPOT_DETAIL?.trim();
