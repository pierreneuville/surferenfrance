import type { Region } from "./types";

/** Country code per region — useful for top-level filtering & SEO. */
export const REGION_COUNTRY: Record<Region, "FR" | "ES" | "PT" | "MA" | "UK" | "IE"> = {
  "Manche & Nord": "FR",
  Bretagne: "FR",
  "Atlantique Nord": "FR",
  "Aquitaine": "FR",
  "Pays Basque": "FR",
  Méditerranée: "FR",
  Corse: "FR",
  "Outre-Mer": "FR",
  "Espagne Atlantique": "ES",
  Canaries: "ES",
  Portugal: "PT",
  Maroc: "MA",
  "Royaume-Uni": "UK",
  Irlande: "IE",
};

export const COUNTRIES = ["FR", "ES", "PT", "MA", "UK", "IE"] as const;
export type Country = (typeof COUNTRIES)[number];

export const COUNTRY_FLAG: Record<Country, string> = {
  FR: "🇫🇷",
  ES: "🇪🇸",
  PT: "🇵🇹",
  MA: "🇲🇦",
  UK: "🇬🇧",
  IE: "🇮🇪",
};

export const COUNTRY_LABEL: Record<Country, string> = {
  FR: "France",
  ES: "Espagne",
  PT: "Portugal",
  MA: "Maroc",
  UK: "Royaume-Uni",
  IE: "Irlande",
};

export function regionsForCountry(country: Country): Region[] {
  return (Object.keys(REGION_COUNTRY) as Region[]).filter(
    (r) => REGION_COUNTRY[r] === country
  );
}
