const rawClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();

export const ADSENSE_CLIENT = rawClient
  ? rawClient.startsWith("pub-")
    ? `ca-${rawClient}`
    : rawClient
  : undefined;

export const ADSENSE_PUBLISHER_ID = ADSENSE_CLIENT?.replace(/^ca-/, "");

export const ADSENSE_SLOT_IN_FEED = process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_FEED?.trim();
export const ADSENSE_SLOT_SPOT_DETAIL = process.env.NEXT_PUBLIC_ADSENSE_SLOT_SPOT_DETAIL?.trim();
