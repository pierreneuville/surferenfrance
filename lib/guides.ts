import type { Spot } from "./types";

/**
 * Editorial guides — long-form SEO money pages for marquee spots.
 *
 * Each guide is a typed content object so we can render consistently and
 * generate JSON-LD (Article, FAQ) automatically.
 *
 * To add a guide: append to `GUIDES`, write 4-6 sections, list 3-6 FAQs.
 * The route /guide/[slug] picks it up automatically.
 */

export interface GuideSection {
  /** Section heading (h2). */
  title: string;
  /** Markdown-style paragraphs (split on \n\n). Plain text only, no HTML. */
  body: string;
}

export interface GuideFaq {
  question: string;
  answer: string;
}

export interface GuideContent {
  /** URL slug, e.g. "la-torche". Must be unique. */
  slug: string;
  /** Slug of the linked Spot in lib/spots.ts. Used to enrich with live data. */
  spotSlug: Spot["slug"];
  /** SEO title, ≤ 65 chars. */
  title: string;
  /** Meta description, ≤ 160 chars. */
  description: string;
  /** Hero one-liner shown above the fold. */
  tagline: string;
  /** Categorical tags shown as chips: ["Beach break", "Intermédiaire", "Étape pro"]. */
  tags: string[];
  /** Best season summary, one short line: "septembre à mars". */
  season: string;
  /** Best swell direction(s) summary: "W à NW · long-period". */
  swell: string;
  /** Wind preference summary: "E à SE offshore". */
  wind: string;
  /** Tide preference summary: "mi-marée montante". */
  tide: string;
  /** Crowd reality check: "souvent dense en saison". */
  crowd: string;
  /** Long-form sections (4-6 of them). */
  sections: GuideSection[];
  /** FAQs (3-6, used to build FAQPage schema). */
  faqs: GuideFaq[];
  /** Slugs of nearby spots to suggest at the bottom. */
  nearby: Spot["slug"][];
}

export const GUIDES: GuideContent[] = [
  {
    slug: "la-torche",
    spotSlug: "la-torche",
    title: "Surfer La Torche : guide complet 2026",
    description: "Vague phare du Finistère sud. Quand venir, comment lire les conditions, accès, niveau requis, alternatives quand c'est saturé.",
    tagline: "Le metronome breton qui sépare les bons jours des autres.",
    tags: ["Beach break", "Intermédiaire+", "Finistère sud"],
    season: "Septembre à avril, pic en automne",
    swell: "W à NW longue période",
    wind: "E à NE offshore",
    tide: "mi-marée descendante, fenêtre étroite",
    crowd: "dense les bons week-ends, calme en semaine",
    sections: [
      {
        title: "Pourquoi La Torche est la référence bretonne",
        body: `La Torche capte les houles d'ouest et de nord-ouest qui balaient le golfe de Gascogne en hiver et concentre leur énergie sur une longue plage orientée plein W. Le résultat : un beach break très consistant, capable de faire fonctionner du 1 à 4 mètres avec des bancs de sable régulièrement reformés par les courants de la baie d'Audierne.

La plage est aussi une pépinière du surf français — l'école Surf School fondée par Jean-Yves Quéméneur a formé des générations de surfeurs. Quand ça pompe, on partage le pic avec des compétiteurs locaux qui connaissent chaque banc.`,
      },
      {
        title: "Les meilleures conditions",
        body: `Le créneau parfait à La Torche, c'est une houle W de 1,5 à 2 mètres avec une période 10 à 13 secondes, sur mi-marée descendante, vent E à NE faible. Tu obtiens des pics propres, creux mais pas vicieux, avec des shoulders qui se déroulent assez pour enchaîner les manœuvres.

Au-delà de 2,5 m, la plage ferme rapidement, sauf si tu trouves la position juste : il faut suivre les surfers locaux et les currents pour identifier le seul banc encore surfable, souvent décalé vers le sud près du parking.`,
      },
      {
        title: "Quand La Torche ne marche pas",
        body: `Une houle SW pure ne rentre pas vraiment : la pointe de la Torche fait écran. Si la prévision donne du SW dominant, file plutôt à Pors Carn juste au sud ou monte sur Crozon où l'orientation est meilleure.

Le vent SW onshore peut hacher la session en quelques minutes. Si ça démarre offshore le matin mais que le vent tourne tôt, vise une dawn patrol de 7h à 10h — c'est souvent le meilleur créneau du jour.`,
      },
      {
        title: "Accès, parking, sécurité",
        body: `Le parking principal est à 5 minutes à pied de la plage. En haute saison, arrive avant 11h ou viens à vélo depuis Penmarc'h. Le sentier descend doucement vers la plage, attention aux chutes de pierres après les tempêtes.

Côté sécurité : les courants peuvent être violents, surtout à marée descendante. Reste à distance des falaises au nord (chutes possibles) et de la pointe rocheuse qui marque la fin du beach break côté sud. La plage est surveillée en juillet-août.`,
      },
      {
        title: "Niveau requis",
        body: `Petits jours (≤ 1,2 m) : accessible aux débutants confirmés et intermédiaires, avec les écoles présentes sur la plage. Évite les jours de gros, même en école — les currents sont sérieux.

Gros jours (≥ 2 m) : pour confirmés uniquement. Les sets peuvent doubler la moyenne et la sortie au large demande du fond. Pas un spot pour apprendre à surfer du gros.`,
      },
    ],
    faqs: [
      {
        question: "Combien de jours par mois ça marche à La Torche ?",
        answer: "Entre 15 et 22 jours/mois d'octobre à mars selon les saisons. La Torche est l'un des spots les plus consistants de France grâce à son exposition plein W. L'été, compte 6 à 10 jours surfables par mois, souvent petits.",
      },
      {
        question: "Faut-il une combinaison toute l'année ?",
        answer: "Oui. Eau entre 11°C en hiver et 19°C en fin d'été. Compte une 5/4 mm en hiver, une 4/3 mm aux intersaisons, une 3/2 mm en été. Gants et chausson conseillés de décembre à mars.",
      },
      {
        question: "C'est où la meilleure école de surf à La Torche ?",
        answer: "Surf School La Torche (la plus ancienne, sur la plage) et No Boundaries Surf Camp (campement et formations). Les deux ont des moniteurs BEES expérimentés et adaptent les sessions au niveau de l'eau.",
      },
      {
        question: "On peut camper près de La Torche ?",
        answer: "Oui — plusieurs campings dans Penmarc'h et Plomeur (5-10 min en voiture). Le camping La Torche est le plus proche du spot et reste ouvert d'avril à octobre. Vans tolérés sur certaines aires mais pas sur le parking de la plage.",
      },
      {
        question: "Quelle alternative à La Torche quand ça sature ?",
        answer: "Pors Carn (juste au sud, plus petit et plus tolérant), Pointe de la Torche north (rare mais magique avec swell N), ou monter à Crozon pour La Palue / Goulien si la houle est trop sud.",
      },
    ],
    nearby: ["pors-carn", "le-loch", "anse-du-cabestan", "guidel"],
  },

  {
    slug: "hossegor",
    spotSlug: "hossegor",
    title: "Hossegor La Gravière : guide du tube européen",
    description: "Le beach break le plus puissant d'Europe. Quand venir, comment lire la fosse, niveau requis, sécurité et bons plans pour profiter quand ça envoie.",
    tagline: "Tube break culte. Pas pour s'initier, jamais banal.",
    tags: ["Beach break", "Avancé+", "Étape WSL"],
    season: "Septembre à novembre — la fenêtre dorée",
    swell: "W à NW · 8 à 14 s · de 1,5 à 3 m",
    wind: "E à SE offshore",
    tide: "mi-marée descendante (banc creuse)",
    crowd: "très dense en saison, brutal au pic",
    sections: [
      {
        title: "La fosse, c'est quoi exactement",
        body: `La Gravière doit sa réputation à une fosse sous-marine — le Gouf de Capbreton — qui plonge à plus de 3 000 m à seulement quelques kilomètres de la côte. Cette structure géologique focalise la houle atlantique vers la plage et accélère brutalement les vagues sur les derniers mètres avant la cassure.

Résultat : des tubes parfaits qui se referment sur du sable, avec une puissance hors norme pour un beach break. C'est ce qui fait venir le World Tour chaque automne pour le Quiksilver Pro France.`,
      },
      {
        title: "Le créneau parfait",
        body: `Le top absolu à Hossegor, c'est une houle W de 1,8 à 2,5 mètres, période 11 à 14 secondes, vent E offshore de 5 à 15 km/h, sur mi-marée descendante. Les bancs creusent, les sets explosent à 100 mètres du bord et tu as 3 à 4 secondes pour te lever et disparaître dans la chambre.

L'automne (septembre à novembre) concentre la majorité de ces fenêtres : températures de l'eau encore douces (18-20°C en septembre), houles plus longues qu'en été, vents plus stables.`,
      },
      {
        title: "Pourquoi c'est pas un spot d'apprentissage",
        body: `Le take-off à La Gravière est brutal : la vague se forme tard et casse fort. Si tu n'as jamais surfé de tubes à 2 m, c'est pas ici qu'il faut apprendre. Le sable s'est durci sous les années de pression et claquer la planche au fond donne souvent des dings — et parfois des blessures.

Au-delà de 2,5 m, les courants entre les pics deviennent sérieux et la sortie au large peut prendre 30 minutes. Bonne forme physique exigée. Pas de cuissard sans amis dans l'eau qui peuvent t'aider.`,
      },
      {
        title: "Les bonnes alternatives",
        body: `Quand La Gravière sature ou que la houle est trop grosse, les options autour sont nombreuses :

— La Sud d'Hossegor : un peu plus tolérant, banc plus ouvert
— Capbreton La Piste : autre fosse, tubes plus longs sur certains swells
— Santocha (Capbreton) : marche quand La Gravière ferme, plus accessible
— Seignosse Les Bourdaines : banc voisin, parfois plus propre les jours de vent`,
      },
      {
        title: "Bonus pratique",
        body: `Le parking de La Gravière se remplit dès 8h en saison — viens en vélo depuis le centre. Le shaper local Pukas a un atelier à Hossegor si tu veux un board adapté (pour les tubes ici, vise 6'2'' à 6'6'' relativement épais).

Le marché du centre-ville et les restaus du quai de la Centrale (Capbreton) sont les meeting points habituels. L'eau est dangereuse pour la baignade en dehors des zones surveillées — informe-toi du courant du jour avant de plonger.`,
      },
    ],
    faqs: [
      {
        question: "C'est quoi la différence entre La Nord, La Gravière et La Sud d'Hossegor ?",
        answer: "Trois sections de la même plage, chacune avec son banc. La Nord casse souvent plus tôt et plus fort (banc proche du bord). La Gravière au centre est la plus connue (tube break). La Sud est plus tolérante, bonne option quand La Gravière est saturée ou trop grosse.",
      },
      {
        question: "Quand a lieu le Quiksilver Pro France à Hossegor ?",
        answer: "Habituellement entre fin septembre et mi-octobre, dans la fenêtre du World Tour Championship. Les dates exactes changent chaque année. La compétition se déplace selon l'état des bancs (parfois à Capbreton ou Seignosse).",
      },
      {
        question: "Hossegor en débutant — c'est jamais possible ?",
        answer: "Si — à condition de viser les jours de petite houle (≤ 1 m) ET d'aller à La Sud ou plus loin (Soustons, Vieux-Boucau). La Gravière elle-même n'est jamais pour débutants. Les écoles d'Hossegor opèrent à La Sud ou à Capbreton-Santocha.",
      },
      {
        question: "Où manger / dormir près d'Hossegor ?",
        answer: "Côté logement : surf camps autour de Soorts-Hossegor, hôtels au centre, locations Airbnb dans Capbreton plus calme. Côté table : la Centrale et le marché de Capbreton, ou les bistrots autour du lac d'Hossegor.",
      },
      {
        question: "Quelle planche emporter à Hossegor en automne ?",
        answer: "Un shortboard épais (6'2'' à 6'6'' / 28-32 L selon ton poids) pour les jours moyens, plus un step-up 6'8'' à 7'2'' pour les gros jours (≥ 2 m). Les tubes ici demandent du volume pour la rame et la dropque rapide.",
      },
    ],
    nearby: ["hossegor-nord", "hossegor-sud", "capbreton-piste", "seignosse"],
  },

  {
    slug: "anglet",
    spotSlug: "anglet-vvf",
    title: "Surfer Anglet : guide des 11 plages basques",
    description: "Tour complet des plages d'Anglet : VVF, Cavaliers, Marinella, Sables d'Or… quel banc pour quel jour, quelle école, quel parking.",
    tagline: "11 plages, 11 ambiances. Le terrain d'entraînement préféré du Pays basque.",
    tags: ["Beach break", "Tous niveaux", "Pays Basque"],
    season: "Avril à novembre",
    swell: "W à NW · 0,8 à 2 m",
    wind: "E à SE offshore, S côtier matin",
    tide: "mi-marée, fenêtre large",
    crowd: "très dense l'été (15h-19h), agréable matin",
    sections: [
      {
        title: "Le terrain d'entraînement du Pays basque",
        body: `Anglet aligne 4 km de plages entre l'embouchure de l'Adour et Biarritz, divisées en 11 sections nommées (du nord au sud : La Barre, Les Cavaliers, Les Dunes, VVF, Marinella, Madrague, Océan, Sables d'Or, Petite Madrague, Corsaires, Club). Cette diversité fait qu'on trouve presque toujours un banc qui marche.

C'est LE spot d'apprentissage et de progression du sud-ouest. Les écoles y forment 50 000 personnes par an. C'est aussi un terrain de jeu pour confirmés sur les grosses houles, notamment aux Cavaliers et VVF.`,
      },
      {
        title: "Quel banc pour quel jour",
        body: `— Petits jours (≤ 1 m), vent calme : Marinella, Sables d'Or, Océan. Bancs cool, accessibles débutants.

— Moyens (1 à 1,5 m), vent E : VVF (le plus consistant), Madrague. Tubes courts et belles épaules.

— Gros jours (≥ 1,8 m) : Les Cavaliers (banc bien creusé), Les Dunes (sauvage). Pour confirmés.

— Vent S onshore : se réfugier vers le sud (Petite Madrague, Corsaires) où les falaises protègent un peu.`,
      },
      {
        title: "Le quotidien en saison",
        body: `Anglet en juillet-août, c'est une foule dense. Pour avoir la paix, vise les dawn patrols (lever du soleil → 9h, eau lisse et plage vide) ou les sessions de fin d'après-midi après 19h quand les touristes sont au resto.

Parkings : payants en saison (1 à 2€/h), gratuits ailleurs. Le parking VVF est le plus pratique mais sature vite. Les parkings nord (Cavaliers, Dunes) sont moins encombrés.`,
      },
      {
        title: "Écoles et locations",
        body: `Les écoles emblématiques d'Anglet : ESCA (École de surf de la Côte des Aigles, aux Cavaliers), Anglet Surf School (VVF), Hastéa (Marinella). Toutes proposent cours individuels, stages semaine et location matériel.

Pour la location en autonomie : Quiksilver Boardriders près de Marinella, Rip Curl à Biarritz à 10 min en voiture. Combis 4/3 toute l'année, 3/2 d'été (de juin à septembre).`,
      },
    ],
    faqs: [
      {
        question: "Quelle est la meilleure plage d'Anglet pour débuter ?",
        answer: "Marinella et Sables d'Or sont les plus douces, avec des bancs progressifs et beaucoup d'écoles. Évite Les Cavaliers et VVF les jours où ça pompe — banc plus rapide, courant plus marqué.",
      },
      {
        question: "Anglet ou Biarritz pour surfer ?",
        answer: "Anglet pour la quantité de bancs et le surf tous niveaux. Biarritz pour les vagues plus typées (Grande Plage tubulaire les bons jours, Côte des Basques école et longboard). Les deux se complètent à 10 min en voiture.",
      },
      {
        question: "Y a-t-il un parking gratuit à Anglet ?",
        answer: "Hors saison (octobre à mai) : oui, partout. En saison (juin à septembre) : payant sur les parkings de plage, gratuit dans les rues à 10 min à pied. Le vélo est la meilleure option : pistes cyclables le long de toutes les plages.",
      },
      {
        question: "Quel est le meilleur moment pour surfer Anglet sans la foule ?",
        answer: "Mai-juin et septembre-octobre : eau encore agréable (18-20°C), houles consistantes, foule absente. En haute saison, vise les dawn patrols 6h30-9h ou les sessions 19h-21h.",
      },
      {
        question: "Anglet marche-t-il en hiver ?",
        answer: "Oui mais souvent gros : les Cavaliers et VVF deviennent un terrain pour confirmés (1,5 à 3 m, eau à 12-13°C). Combi 5/4 mm avec chausson et gants. Les jours plus petits restent surfables à Marinella et Madrague.",
      },
    ],
    nearby: ["anglet-cavaliers", "anglet-marinella", "biarritz-cote-des-basques", "biarritz-grande-plage"],
  },

  {
    slug: "lacanau",
    spotSlug: "lacanau",
    title: "Lacanau-Océan : guide complet du beach break médocain",
    description: "Étape historique du tour pro français. Quand venir, comment lire les bancs Nord/Sud, niveau, écoles et bons plans Médoc.",
    tagline: "Le rendez-vous de tout surfer parisien le week-end.",
    tags: ["Beach break", "Intermédiaire", "Médoc"],
    season: "Mai à octobre, pic en septembre",
    swell: "W à NW · 1 à 2,5 m",
    wind: "E à NE offshore",
    tide: "mi-marée descendante",
    crowd: "très dense saison + week-ends",
    sections: [
      {
        title: "Lacanau, le metronome atlantique",
        body: `Lacanau-Océan est l'un des spots les plus consistants du Médoc. Sa plage exposée plein W reçoit toutes les houles d'ouest et de nord-ouest qui descendent du golfe de Gascogne. C'est aussi historiquement le berceau du surf bordelais : la première école de surf de la côte y a ouvert en 1968.

Le spot accueille chaque août le Lacanau Pro, étape historique du WQS. C'est le rendez-vous incontournable des surfers parisiens qui descendent le week-end, et un terrain de jeu privilégié pour les progressants intermédiaires.`,
      },
      {
        title: "Lire les bancs Nord et Sud",
        body: `Lacanau s'organise autour de deux pics principaux : la Plage Nord (face à la promenade du front de mer) et la Plage Sud (à 300 m, vers le sud). Selon la saison et les courants, l'un est meilleur que l'autre.

— La Plage Nord est plus large, plus tolérante, plus fréquentée par les écoles. Bon banc pour les progressants.

— La Plage Sud est souvent plus creuse, avec des séries plus organisées les bons jours. Pour intermédiaires confirmés et plus.

— Les bancs bougent après chaque tempête, donc le "meilleur côté" change. Demande aux locaux le matin.`,
      },
      {
        title: "Les bonnes saisons",
        body: `Été (juin-août) : eau à 20-22°C, fonds plats, vagues plus petites mais consistantes, ambiance plage. Hyper fréquenté.

Automne (septembre-novembre) : LA meilleure période. Houles plus longues, vents plus stables, foule qui s'évapore après le 15 septembre, eau encore à 18-19°C jusqu'à fin octobre.

Hiver (décembre-février) : gros et froid (eau à 11-12°C, vent souvent fort). Pour confirmés avec combi 5/4 mm. Beaucoup moins de surfers à l'eau.`,
      },
      {
        title: "Logistique et bonnes adresses",
        body: `Parking : payant en saison sur le front de mer. Stationnement gratuit à 5-10 min à pied dans les rues du centre. Évite de venir en voiture le 14 juillet, le 15 août et tout l'été après 13h — embouteillages.

Écoles emblématiques : Lacanau Surf Club (la plus ancienne, formation pro), Ocean Roots, Lacanau Surf School. Toutes louent du matos et donnent des stages semaine.

Bonnes adresses : marché de Lacanau le mercredi et samedi matin, La Cabane du Surfeur pour boire un verre les pieds dans le sable, Hôtel L'Étoile d'Argent pour dormir à 100 m du spot.`,
      },
    ],
    faqs: [
      {
        question: "Lacanau ou Hossegor pour surfer en septembre ?",
        answer: "Si tu cherches la puissance et les tubes : Hossegor (mais c'est saturé). Si tu cherches une foule moins violente et une vague plus tolérante : Lacanau. Les deux sont à 2h en voiture, certains font les deux dans le week-end.",
      },
      {
        question: "C'est quand le Lacanau Pro ?",
        answer: "Habituellement entre fin juillet et mi-août. La compétition (WQS) attire des centaines de surfers pros et amateurs. Si tu veux surfer le spot, viens AVANT ou APRÈS la compète : l'eau est blindée pendant 10 jours.",
      },
      {
        question: "On peut surfer Lacanau en débutant ?",
        answer: "Oui, sur la Plage Nord les jours de petite houle (≤ 1 m). Beaucoup d'écoles encadrent. Évite les jours de gros (≥ 1,5 m) et les zones avec courant. Les sauveteurs en mer indiquent la zone surveillée chaque jour.",
      },
      {
        question: "Quel niveau pour la Plage Sud de Lacanau ?",
        answer: "Intermédiaire confirmé minimum. Le banc creuse plus tôt et la sortie au large peut être longue les jours de gros. Pas un spot pour apprendre.",
      },
      {
        question: "Y a-t-il des alternatives à Lacanau pour échapper à la foule ?",
        answer: "Oui : Le Porge (plus calme, ambiance forestière, à 20 min au sud), Le Grand Crohot (Cap Ferret), Le Pin Sec (Naujac, secret). Tous accessibles en moins d'1h depuis Lacanau.",
      },
    ],
    nearby: ["super-sud-lacanau", "carcans", "le-porge", "le-pin-sec"],
  },
];

export function getGuideBySlug(slug: string): GuideContent | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function allGuideSlugs(): string[] {
  return GUIDES.map((g) => g.slug);
}
