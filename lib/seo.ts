import type { Region, Spot } from "./types";

export const SITE_NAME = "Yosurf";
export const SITE_TAGLINE = "Prévisions surf, houle et meilleurs spots";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://yosurf.fr").replace(/\/$/, "");

export const DEFAULT_DESCRIPTION =
  "Prévisions surf en France : scores de session, meilleur créneau, hauteur des vagues, période de houle, vent et spots proches sur tout le littoral.";

export const REGION_SLUGS: Record<Region, string> = {
  "Manche & Nord": "manche-nord",
  Bretagne: "bretagne",
  "Atlantique Nord": "atlantique-nord",
  "Côte d'Argent": "cote-d-argent",
  "Pays Basque": "pays-basque",
  Méditerranée: "mediterranee",
  Corse: "corse",
  "Espagne Atlantique": "espagne-atlantique",
  Canaries: "canaries",
  Portugal: "portugal",
  Maroc: "maroc",
  "Royaume-Uni": "royaume-uni",
  Irlande: "irlande",
};

export const REGION_BY_SLUG = Object.fromEntries(
  Object.entries(REGION_SLUGS).map(([region, slug]) => [slug, region])
) as Record<string, Region>;

export const REGION_SEO_COPY: Record<Region, { title: string; intro: string; season: string }> = {
  "Manche & Nord": {
    title: "Prévisions surf Manche & Nord",
    intro:
      "De Wissant au Cotentin, les spots de Manche et du Nord fonctionnent surtout avec les dépressions atlantiques et les houles longues qui contournent la côte.",
    season: "La meilleure fenêtre va généralement de septembre à mars, avec des sessions plus rares mais parfois très propres.",
  },
  Bretagne: {
    title: "Prévisions surf Bretagne",
    intro:
      "La Bretagne offre des spots très variés, de la Côte d'Émeraude à Crozon, avec des plages exposées, des baies abritées et des vagues puissantes.",
    season: "Le printemps et l'automne donnent souvent le meilleur équilibre entre houle, vent et fréquentation.",
  },
  "Atlantique Nord": {
    title: "Prévisions surf Atlantique Nord",
    intro:
      "Vendée, Loire-Atlantique, Ré et Oléron : l'Atlantique Nord mélange longues plages, îles exposées et spots accessibles pour progresser.",
    season: "Les houles d'automne et d'hiver apportent les sessions les plus régulières, avec de belles fenêtres au printemps.",
  },
  "Côte d'Argent": {
    title: "Prévisions surf Côte d'Argent",
    intro:
      "Du Médoc aux Landes, la Côte d'Argent concentre certains des beach breaks les plus réguliers d'Europe, avec bancs de sable, pinède et longues houles atlantiques.",
    season: "Septembre à novembre reste la période reine : eau encore douce, houles consistantes et vents plus favorables.",
  },
  "Pays Basque": {
    title: "Prévisions surf Pays Basque",
    intro:
      "Le Pays Basque combine beach breaks, reef breaks et vagues de repli, avec des spots iconiques autour d'Anglet, Biarritz, Guéthary et Hendaye.",
    season: "L'automne est souvent excellent, tandis que l'hiver peut devenir puissant et technique.",
  },
  Méditerranée: {
    title: "Prévisions surf Méditerranée",
    intro:
      "La Méditerranée fonctionne par coups de vent et fenêtres courtes : les sessions sont plus rares, mais elles peuvent être très propres quand la houle s'organise.",
    season: "L'automne, l'hiver et le début du printemps concentrent la majorité des vraies sessions.",
  },
  Corse: {
    title: "Prévisions surf Corse",
    intro:
      "La Corse offre des vagues plus confidentielles, entre plages exposées, caps rocheux et houles méditerranéennes ou d'ouest selon les secteurs.",
    season: "Les meilleures chances arrivent en automne-hiver, avec des houles plus solides et moins de monde à l'eau.",
  },
  "Espagne Atlantique": {
    title: "Prévisions surf Espagne Atlantique",
    intro:
      "Du Pays basque à la Galice, l'Atlantique espagnol concentre des spots de classe mondiale (Mundaka, Pantín) et des plages consistantes pour tous les niveaux.",
    season: "L'automne et l'hiver donnent les meilleures conditions, avec des houles longues et puissantes venues du nord.",
  },
  Canaries: {
    title: "Prévisions surf Canaries",
    intro:
      "L'archipel canarien est l'Hawaii européen : reefs volcaniques, vagues puissantes, eau chaude toute l'année et trade winds réguliers.",
    season: "Octobre à mars concentrent les plus grosses houles ; l'été reste surfable avec des vagues plus petites.",
  },
  Portugal: {
    title: "Prévisions surf Portugal",
    intro:
      "Du Norte à l'Algarve en passant par Ericeira (World Surfing Reserve), le Portugal aligne les beach breaks puissants, les reefs et la big wave à Nazaré.",
    season: "L'automne est la saison reine. L'hiver apporte les grosses sessions, le printemps reste très qualitatif.",
  },
  Maroc: {
    title: "Prévisions surf Maroc",
    intro:
      "Taghazout, Imsouane, Anchor Point : la côte atlantique marocaine offre des point breaks droits parfaits, eau tiède et soleil garantis tout l'hiver.",
    season: "Octobre à avril est la saison idéale. Les houles NW envoient régulièrement, avec moins de pluie qu'en Europe.",
  },
  "Royaume-Uni": {
    title: "Prévisions surf Royaume-Uni",
    intro:
      "Cornwall, Pays de Galles, Écosse : le UK abrite une scène surf historique, avec des beach breaks réguliers et quelques points cachés exceptionnels.",
    season: "L'automne et l'hiver donnent les meilleures houles, mais l'eau est froide. Été = vagues plus petites, fréquentation max.",
  },
  Irlande: {
    title: "Prévisions surf Irlande",
    intro:
      "De Lahinch à Bundoran, l'Irlande est l'un des secrets les mieux gardés d'Europe : reefs sauvages, big waves à Mullaghmore, paysages spectaculaires.",
    season: "L'automne et l'hiver concentrent toutes les grosses sessions. Eau froide, vent fort, mais récompense rare.",
  },
};

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function spotKeywords(spot: Spot) {
  return [
    `surf ${spot.shortName}`,
    `prévisions surf ${spot.shortName}`,
    `houle ${spot.shortName}`,
    `vagues ${spot.shortName}`,
    `surf ${spot.department}`,
    `spot surf ${spot.region}`,
  ];
}
