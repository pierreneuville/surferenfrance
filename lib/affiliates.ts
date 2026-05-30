import type { Region, Spot } from "./types";

/**
 * Affiliate link registry per region (and per spot when relevant).
 *
 * Revenue model:
 * - Booking.com Affiliate Partner → hôtels & surf camps
 * - Decathlon Coach → matériel surf
 * - Surf schools locales (commissions directes)
 *
 * To activate revenue:
 * 1. Sign up with each partner program
 * 2. Replace `null` with the affiliate-tagged URL (with your tracking ID)
 * 3. The component automatically shows the slot
 */

export interface AffiliateLink {
  label: string;
  description: string;
  url: string;
  cta: string;
}

export interface AffiliateBundle {
  surfCamp?: AffiliateLink;
  hotel?: AffiliateLink;
  surfSchool?: AffiliateLink;
  boardShop?: AffiliateLink;
}

// Stub URL utility — replace with real tagged affiliate URLs in production
const stub = (q: string) =>
  `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(q)}`;

export const REGION_AFFILIATES: Record<Region, AffiliateBundle> = {
  "Manche & Nord": {
    hotel: { label: "Hôtels Normandie & Manche", description: "Trouve un hôtel près des spots du nord", url: stub("Normandie surf"), cta: "Voir les disponibilités" },
  },
  "Bretagne": {
    surfCamp: { label: "Surf camps Bretagne", description: "Camps à La Torche, Crozon, Quiberon", url: stub("surf camp Bretagne"), cta: "Réserver" },
    hotel: { label: "Hôtels Bretagne", description: "À côté des spots bretons", url: stub("hôtel Bretagne surf"), cta: "Voir" },
  },
  "Atlantique Nord": {
    surfCamp: { label: "Surf camps Vendée", description: "Camps Bretignolles & Sables", url: stub("surf camp Vendée"), cta: "Réserver" },
  },
  "Aquitaine": {
    surfCamp: { label: "Surf camps Landes & Gironde", description: "Camps Hossegor, Lacanau, Seignosse", url: stub("surf camp Hossegor Lacanau"), cta: "Réserver" },
    hotel: { label: "Hôtels Hossegor / Capbreton", description: "Dormir au cœur des spots", url: stub("Hossegor hôtel"), cta: "Voir" },
  },
  "Pays Basque": {
    surfCamp: { label: "Surf camps Pays Basque", description: "Anglet, Biarritz, Hendaye", url: stub("surf camp Biarritz"), cta: "Réserver" },
    hotel: { label: "Hôtels Biarritz", description: "Centre Biarritz, vue océan", url: stub("Biarritz hôtel"), cta: "Voir" },
  },
  "Méditerranée": {
    hotel: { label: "Hôtels Méditerranée", description: "Var, Hérault, Pyrénées-Orientales", url: stub("hôtel Méditerranée surf"), cta: "Voir" },
  },
  "Corse": {
    hotel: { label: "Hôtels Corse", description: "Calvi, Bonifacio, Porto-Vecchio", url: stub("Corse hôtel"), cta: "Voir" },
  },
  "Outre-Mer": {
    hotel: { label: "Hôtels Outre-Mer", description: "Réunion, Antilles, Tahiti — proche des spots", url: stub("surf Outre-Mer hôtel"), cta: "Voir" },
    surfCamp: { label: "Surf camps Outre-Mer", description: "Saint-Leu, Le Moule, Papenoo, Anse Bonneville", url: stub("surf camp outre mer"), cta: "Réserver" },
  },
  "Espagne Atlantique": {
    surfCamp: { label: "Surf camps Espagne", description: "Pays basque, Cantabrie, Galice", url: stub("surf camp Mundaka"), cta: "Reservar" },
    hotel: { label: "Hôtels Bilbao / Santander", description: "À côté de Mundaka & Sopelana", url: stub("Mundaka hotel"), cta: "Ver" },
  },
  "Canaries": {
    surfCamp: { label: "Surf camps Canaries", description: "Fuerteventura, Lanzarote, Gran Canaria", url: stub("surf camp Fuerteventura"), cta: "Reservar" },
    hotel: { label: "Hôtels Canaries", description: "Sun, surf, all-inclusive", url: stub("Fuerteventura surf hotel"), cta: "Ver" },
  },
  "Portugal": {
    surfCamp: { label: "Surf camps Portugal", description: "Ericeira, Peniche, Algarve", url: stub("surf camp Ericeira"), cta: "Reservar" },
    hotel: { label: "Hôtels Ericeira / Peniche", description: "Capitale européenne du surf", url: stub("Ericeira hotel"), cta: "Ver" },
  },
  "Maroc": {
    surfCamp: { label: "Surf camps Taghazout & Imsouane", description: "Points breaks parfaits, all-in", url: stub("surf camp Taghazout"), cta: "Réserver" },
    hotel: { label: "Hôtels Taghazout", description: "Logement village et bord de mer", url: stub("Taghazout riad"), cta: "Voir" },
  },
  "Royaume-Uni": {
    hotel: { label: "Hotels Cornwall", description: "Near Newquay, Watergate, Polzeath", url: stub("Cornwall surf hotel"), cta: "Book" },
  },
  "Irlande": {
    hotel: { label: "Hotels Sligo / Clare", description: "Near Lahinch, Strandhill, Bundoran", url: stub("Lahinch hotel"), cta: "Book" },
  },
};

export function affiliatesFor(spot: Spot): AffiliateBundle {
  return REGION_AFFILIATES[spot.region] ?? {};
}
