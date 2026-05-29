import type { Spot } from "./types";

export const REGIONS = [
  "Manche & Nord",
  "Bretagne",
  "Atlantique Nord",
  "Côte d'Argent",
  "Pays Basque",
  "Méditerranée",
  "Corse",
  "Espagne Atlantique",
  "Canaries",
  "Portugal",
  "Maroc",
  "Royaume-Uni",
  "Irlande",
] as const;

export const REGION_EMOJI: Record<string, string> = {
  "Manche & Nord": "🏰",
  "Bretagne": "🌬️",
  "Atlantique Nord": "🐚",
  "Côte d'Argent": "🏖️",
  "Pays Basque": "🏄",
  "Méditerranée": "☀️",
  "Corse": "🏝️",
  "Espagne Atlantique": "🇪🇸",
  "Canaries": "🌋",
  "Portugal": "🇵🇹",
  "Maroc": "🇲🇦",
  "Royaume-Uni": "🇬🇧",
  "Irlande": "🇮🇪",
};

// Helper to keep entries compact
function s(slug: string, name: string, shortName: string, region: Spot["region"], department: string, lat: number, lon: number, offshore: number, level: Spot["level"], type: string, description: string): Spot {
  return { slug, name, shortName, region, department, lat, lon, offshore, level, type, description };
}

export const SPOTS: Spot[] = [
  // ==================== MANCHE & NORD ====================
  // Hauts-de-France
  s("bray-dunes", "Bray-Dunes", "Bray-Dunes", "Manche & Nord", "Nord", 51.080, 2.532, 180, "beginner", "Beach break", "Plus au nord de la côte française. Vagues rares mais sympas par tempête NW."),
  s("dunkerque-malo", "Dunkerque - Malo-les-Bains", "Malo-les-Bains", "Manche & Nord", "Nord", 51.063, 2.394, 180, "beginner", "Beach break", "Plage urbaine de Dunkerque. Vagues douces, école et windsurf."),
  s("sangatte", "Sangatte - Blériot-Plage", "Sangatte", "Manche & Nord", "Pas-de-Calais", 50.948, 1.745, 180, "beginner", "Beach break", "Plage face à l'Angleterre. Vagues petites mais régulières par houle NW."),
  s("wissant", "Wissant", "Wissant", "Manche & Nord", "Pas-de-Calais", 50.887, 1.662, 180, "intermediate", "Beach break", "Plage sauvage entre Gris-Nez et Blanc-Nez. Exposée aux houles NW."),
  s("audresselles", "Audresselles", "Audresselles", "Manche & Nord", "Pas-de-Calais", 50.819, 1.598, 180, "intermediate", "Beach break / rochers", "Spot rocheux entre Cap Gris-Nez et Boulogne. Houle NW indispensable."),
  s("wimereux", "Wimereux", "Wimereux", "Manche & Nord", "Pas-de-Calais", 50.764, 1.612, 180, "beginner", "Beach break", "Plage de la station balnéaire. Surf occasionnel par houle bien établie."),
  s("equihen-plage", "Équihen-Plage", "Équihen", "Manche & Nord", "Pas-de-Calais", 50.690, 1.567, 180, "intermediate", "Beach break", "Spot au sud de Boulogne. Vagues plus consistantes que Wimereux."),
  s("hardelot", "Hardelot-Plage", "Hardelot", "Manche & Nord", "Pas-de-Calais", 50.633, 1.583, 90, "beginner", "Beach break", "Longue plage de sable accessible. Surf de fortune par grosse houle d'ouest."),
  s("le-touquet", "Le Touquet-Paris-Plage", "Le Touquet", "Manche & Nord", "Pas-de-Calais", 50.523, 1.586, 90, "beginner", "Beach break", "Longue plage facile, idéale pour débuter."),
  s("stella-plage", "Stella-Plage", "Stella", "Manche & Nord", "Pas-de-Calais", 50.473, 1.582, 90, "beginner", "Beach break", "Station tranquille sud Touquet. Vagues d'écoles."),
  s("berck-plage", "Berck-Plage", "Berck", "Manche & Nord", "Pas-de-Calais", 50.402, 1.561, 90, "beginner", "Beach break", "Vaste plage du Pas-de-Calais. Idéale en école par houle NW."),
  s("cayeux-sur-mer", "Cayeux-sur-Mer", "Cayeux", "Manche & Nord", "Somme", 50.181, 1.502, 90, "beginner", "Galets", "Plage de galets, surf rare mais possible avec houle NW établie."),
  s("ault", "Ault", "Ault", "Manche & Nord", "Somme", 50.099, 1.451, 90, "intermediate", "Galets", "Sous les falaises de craie, ambiance dramatique. Pour patients."),
  s("mers-les-bains", "Mers-les-Bains", "Mers-les-Bains", "Manche & Nord", "Somme", 50.066, 1.388, 90, "beginner", "Galets", "Ville colorée, plage de galets entre falaises."),

  // Normandie - Seine-Maritime
  s("le-treport", "Le Tréport", "Le Tréport", "Manche & Nord", "Seine-Maritime", 50.062, 1.378, 180, "beginner", "Beach break / galets", "Plage de galets sous les falaises. Surf rare mais possible."),
  s("dieppe", "Dieppe", "Dieppe", "Manche & Nord", "Seine-Maritime", 49.928, 1.080, 180, "beginner", "Galets", "Plage de galets historique. Vagues par grosse houle N."),
  s("pourville", "Pourville-sur-Mer", "Pourville", "Manche & Nord", "Seine-Maritime", 49.929, 1.040, 180, "beginner", "Beach break / galets", "Petite station entre falaises. Surf occasionnel."),
  s("quiberville", "Quiberville", "Quiberville", "Manche & Nord", "Seine-Maritime", 49.910, 0.939, 180, "beginner", "Galets", "Plage de galets entre falaises. Vagues par houle NW."),
  s("veules-les-roses", "Veules-les-Roses", "Veules", "Manche & Nord", "Seine-Maritime", 49.876, 0.793, 180, "beginner", "Beach break", "Petite plage normande pittoresque. Surf très occasionnel."),
  s("saint-valery-en-caux", "Saint-Valery-en-Caux", "Saint-Valery", "Manche & Nord", "Seine-Maritime", 49.871, 0.713, 180, "beginner", "Galets", "Plage de galets dans port pittoresque. Vagues rares."),
  s("veulettes", "Veulettes-sur-Mer", "Veulettes", "Manche & Nord", "Seine-Maritime", 49.857, 0.595, 180, "beginner", "Galets", "Plage de galets, surfable par houle NW établie. Communauté active."),
  s("yport", "Yport", "Yport", "Manche & Nord", "Seine-Maritime", 49.737, 0.314, 180, "intermediate", "Galets", "Village de pêcheurs sous les falaises. Vagues sympas en hiver."),
  s("etretat", "Étretat", "Étretat", "Manche & Nord", "Seine-Maritime", 49.708, 0.205, 135, "intermediate", "Beach break / galets", "Spot mythique sous les falaises. Vagues de qualité par grosse houle NW."),
  s("sainte-adresse", "Sainte-Adresse", "Sainte-Adresse", "Manche & Nord", "Seine-Maritime", 49.512, 0.087, 180, "beginner", "Galets", "Plage urbaine du Havre. Surf possible par grosse houle."),
  s("sotteville-sur-mer", "Sotteville-sur-Mer", "Sotteville", "Manche & Nord", "Seine-Maritime", 49.892, 0.862, 180, "intermediate", "Galets", "Plage confidentielle de la Côte d'Albâtre, vagues bien formées par houle N."),

  // Normandie - Calvados
  s("trouville", "Trouville-sur-Mer", "Trouville", "Manche & Nord", "Calvados", 49.366, 0.087, 180, "beginner", "Beach break", "Plage de la station chic. Vagues douces et école."),
  s("villers-sur-mer", "Villers-sur-Mer", "Villers", "Manche & Nord", "Calvados", 49.318, 0.000, 180, "beginner", "Beach break", "Plage longue de la Côte Fleurie."),
  s("houlgate", "Houlgate", "Houlgate", "Manche & Nord", "Calvados", 49.298, -0.072, 180, "beginner", "Beach break", "Plage familiale de la Côte Fleurie."),
  s("cabourg", "Cabourg", "Cabourg", "Manche & Nord", "Calvados", 49.286, -0.131, 180, "beginner", "Beach break", "Plage proustienne, longue et plate. Surf très occasionnel."),
  s("ouistreham", "Ouistreham - Riva-Bella", "Ouistreham", "Manche & Nord", "Calvados", 49.287, -0.258, 180, "beginner", "Beach break", "Plage longue et plate, parfaite pour les débutants."),
  s("lion-sur-mer", "Lion-sur-Mer", "Lion-sur-Mer", "Manche & Nord", "Calvados", 49.298, -0.318, 180, "beginner", "Beach break", "Station de la Côte de Nacre. École de surf."),
  s("luc-sur-mer", "Luc-sur-Mer", "Luc-sur-Mer", "Manche & Nord", "Calvados", 49.314, -0.348, 180, "beginner", "Beach break", "Plage normande facile, école active."),
  s("saint-aubin-sur-mer", "Saint-Aubin-sur-Mer", "Saint-Aubin", "Manche & Nord", "Calvados", 49.327, -0.394, 180, "beginner", "Beach break", "Plage de la Côte de Nacre. Vagues d'école."),
  s("bernieres-sur-mer", "Bernières-sur-Mer", "Bernières", "Manche & Nord", "Calvados", 49.336, -0.422, 180, "beginner", "Beach break", "Plage du Débarquement (Juno Beach), longue et plate."),
  s("asnelles", "Asnelles (Gold Beach)", "Asnelles", "Manche & Nord", "Calvados", 49.336, -0.567, 180, "beginner", "Beach break", "Plage du débarquement. École et bonne ambiance."),

  // Normandie - Manche
  s("granville", "Granville", "Granville", "Manche & Nord", "Manche", 48.838, -1.609, 180, "beginner", "Beach break", "Cité corsaire dans la baie. Surf occasionnel."),
  s("carolles", "Carolles", "Carolles", "Manche & Nord", "Manche", 48.733, -1.557, 180, "beginner", "Beach break", "Baie du Mont-Saint-Michel. Vagues douces."),
  s("coutainville", "Agon-Coutainville", "Coutainville", "Manche & Nord", "Manche", 49.063, -1.583, 180, "beginner", "Beach break", "Station du Cotentin. Vagues d'école."),
  s("pirou-plage", "Pirou-Plage", "Pirou", "Manche & Nord", "Manche", 49.149, -1.594, 180, "beginner", "Beach break", "Plage du Cotentin, longue et préservée."),
  s("barneville-carteret", "Barneville-Carteret", "Carteret", "Manche & Nord", "Manche", 49.382, -1.770, 180, "beginner", "Beach break", "Station balnéaire et port. Vagues par grosse houle W."),
  s("hatainville", "Hatainville", "Hatainville", "Manche & Nord", "Manche", 49.418, -1.785, 90, "intermediate", "Beach break", "Dunes spectaculaires du Cotentin. Vagues sauvages."),
  s("le-rozel", "Le Rozel", "Le Rozel", "Manche & Nord", "Manche", 49.494, -1.871, 90, "intermediate", "Beach break", "Plage du Cotentin avec dunes. Vagues quand ça rentre."),
  s("dielette", "Diélette (Flamanville)", "Diélette", "Manche & Nord", "Manche", 49.554, -1.866, 90, "intermediate", "Beach break", "Port à côté de Siouville. Vagues régulières."),
  s("sciotot", "Sciotot (Les Pieux)", "Sciotot", "Manche & Nord", "Manche", 49.503, -1.881, 90, "intermediate", "Beach break", "Plage du Cotentin proche Siouville."),
  s("siouville", "Siouville-Hague", "Siouville", "Manche & Nord", "Manche", 49.555, -1.842, 90, "intermediate", "Beach break", "Le spot phare de Normandie. Capricieux mais peut être excellent."),
  s("vauville", "Vauville", "Vauville", "Manche & Nord", "Manche", 49.631, -1.839, 90, "intermediate", "Beach break", "Baie sauvage à côté de Siouville. Ambiance bout du monde."),
  s("saint-vaast", "Saint-Vaast-la-Hougue", "Saint-Vaast", "Manche & Nord", "Manche", 49.585, -1.265, 90, "beginner", "Beach break", "Côte est du Cotentin, plage tranquille face à Tatihou."),

  // ==================== BRETAGNE ====================
  // Ille-et-Vilaine + Côtes-d'Armor (Côte d'Émeraude / Trégor)
  s("cancale", "Cancale", "Cancale", "Bretagne", "Ille-et-Vilaine", 48.677, -1.846, 135, "beginner", "Beach break", "Capitale de l'huître, surf rare."),
  s("saint-coulomb", "Saint-Coulomb - Anse du Guesclin", "Anse du Guesclin", "Bretagne", "Ille-et-Vilaine", 48.685, -1.929, 0, "intermediate", "Beach break", "Anse sauvage entre Cancale et Saint-Malo. Vagues confidentielles."),
  s("saint-malo", "Saint-Malo - Longchamp", "Saint-Malo", "Bretagne", "Ille-et-Vilaine", 48.650, -2.020, 135, "beginner", "Beach break", "Surf à marée basse à côté de la cité corsaire."),
  s("saint-lunaire", "Saint-Lunaire", "Saint-Lunaire", "Bretagne", "Ille-et-Vilaine", 48.638, -2.110, 180, "beginner", "Beach break", "Plage de la Fourberie. Bonne école."),
  s("saint-briac", "Saint-Briac-sur-Mer", "Saint-Briac", "Bretagne", "Ille-et-Vilaine", 48.620, -2.130, 180, "beginner", "Beach break", "Station ancienne, plages multiples."),
  s("saint-cast", "Saint-Cast-le-Guildo", "Saint-Cast", "Bretagne", "Côtes-d'Armor", 48.638, -2.250, 135, "beginner", "Beach break", "Grande plage abritée. Surf occasionnel."),
  s("saint-jacut", "Saint-Jacut-de-la-Mer", "Saint-Jacut", "Bretagne", "Côtes-d'Armor", 48.595, -2.182, 135, "beginner", "Beach break", "Presqu'île pittoresque, plages familiales."),
  s("sables-d-or", "Sables-d'Or-les-Pins", "Sables-d'Or", "Bretagne", "Côtes-d'Armor", 48.642, -2.426, 180, "beginner", "Beach break", "Longue plage de la côte d'Émeraude. Vagues régulières."),
  s("pleherel", "Pléhérel-Plage", "Pléhérel", "Bretagne", "Côtes-d'Armor", 48.659, -2.402, 180, "beginner", "Beach break", "Plage au pied du Cap Fréhel."),
  s("erquy", "Erquy", "Erquy", "Bretagne", "Côtes-d'Armor", 48.633, -2.470, 180, "beginner", "Beach break", "Port coloré et plages. Surf occasionnel."),
  s("brehec", "Bréhec (Plouézec)", "Bréhec", "Bretagne", "Côtes-d'Armor", 48.728, -2.948, 135, "intermediate", "Beach break", "Anse abritée du Goëlo. Spot local."),
  s("trestraou", "Trestraou - Perros-Guirec", "Trestraou", "Bretagne", "Côtes-d'Armor", 48.821, -3.443, 135, "beginner", "Beach break", "Côte de granit rose. Surfable l'hiver."),
  s("trestrignel", "Trestrignel - Perros-Guirec", "Trestrignel", "Bretagne", "Côtes-d'Armor", 48.811, -3.413, 135, "beginner", "Beach break", "Plage voisine de Trestraou."),
  s("tregastel", "Trégastel", "Trégastel", "Bretagne", "Côtes-d'Armor", 48.823, -3.510, 0, "beginner", "Beach break", "Côte de granit rose iconique. Plages multiples."),
  s("trebeurden", "Trébeurden", "Trébeurden", "Bretagne", "Côtes-d'Armor", 48.770, -3.578, 0, "beginner", "Beach break", "Station bretonne authentique. Surf occasionnel."),

  // Finistère Nord
  s("locquirec", "Locquirec", "Locquirec", "Bretagne", "Finistère", 48.700, -3.640, 0, "beginner", "Beach break", "Presqu'île charmante. Plage du Moulin de la Rive."),
  s("primel", "Primel-Trégastel", "Primel", "Bretagne", "Finistère", 48.715, -3.832, 0, "intermediate", "Beach break", "Plage face à la baie de Morlaix."),
  s("le-dossen", "Le Dossen (Santec)", "Le Dossen", "Bretagne", "Finistère", 48.715, -4.025, 180, "advanced", "Beach break", "Spot puissant face à l'île de Sieck. Pour confirmés."),
  s("plouescat", "Plouescat - Pors Meur", "Plouescat", "Bretagne", "Finistère", 48.671, -4.183, 180, "intermediate", "Beach break", "Côte du Léon, exposée houles N et NW."),
  s("goulven", "Goulven (La Croix)", "Goulven", "Bretagne", "Finistère", 48.625, -4.298, 180, "intermediate", "Beach break", "Baie de Goulven, dunes et longue plage."),
  s("treompan", "Tréompan (Ploudalmézeau)", "Tréompan", "Bretagne", "Finistère", 48.555, -4.660, 90, "intermediate", "Beach break", "Côte des Abers, vagues régulières."),
  s("porspoder", "Porspoder", "Porspoder", "Bretagne", "Finistère", 48.493, -4.770, 90, "intermediate", "Beach break", "Pays d'Iroise. Cadre breton authentique."),
  s("lampaul-plouarzel", "Lampaul-Plouarzel", "Lampaul", "Bretagne", "Finistère", 48.448, -4.778, 90, "intermediate", "Beach break", "Côte sauvage de l'Iroise."),
  s("le-conquet", "Le Conquet - Blancs Sablons", "Le Conquet", "Bretagne", "Finistère", 48.358, -4.766, 90, "intermediate", "Beach break", "Plage des Blancs Sablons, pointe ouest de la France. Vagues régulières."),
  s("sainte-anne-la-palud", "Sainte-Anne-la-Palud", "Sainte-Anne", "Bretagne", "Finistère", 48.180, -4.241, 90, "intermediate", "Beach break", "Baie de Douarnenez, longue plage sauvage. Ambiance pardon breton."),

  // Finistère - Presqu'île de Crozon
  s("pen-hat", "Anse de Pen Hat (Camaret)", "Pen Hat", "Bretagne", "Finistère", 48.282, -4.580, 90, "intermediate", "Beach break", "Anse spectaculaire de la presqu'île de Crozon."),
  s("trez-rouz", "Trez Rouz (Camaret)", "Trez Rouz", "Bretagne", "Finistère", 48.245, -4.595, 90, "intermediate", "Beach break", "Plage rouge de la presqu'île de Crozon."),
  s("la-palue", "La Palue (Crozon)", "La Palue", "Bretagne", "Finistère", 48.220, -4.570, 90, "advanced", "Beach break", "Spot puissant et capricieux. Réservé aux confirmés."),
  s("lostmarch", "Lostmarc'h", "Lostmarc'h", "Bretagne", "Finistère", 48.183, -4.544, 90, "intermediate", "Beach break", "Plage sauvage de Crozon. Vagues puissantes."),
  s("goulien-crozon", "Goulien (Crozon)", "Goulien", "Bretagne", "Finistère", 48.215, -4.555, 90, "intermediate", "Beach break", "Plage de la presqu'île, plus protégée que La Palue."),
  s("bordardoue", "Bordardoué (Crozon)", "Bordardoué", "Bretagne", "Finistère", 48.235, -4.560, 90, "intermediate", "Beach break", "Petite plage de Crozon, ambiance secrète."),
  s("anse-de-dinan", "Anse de Dinan (Crozon)", "Anse de Dinan", "Bretagne", "Finistère", 48.230, -4.585, 90, "intermediate", "Beach break", "Anse spectaculaire de la presqu'île, vagues quand ça rentre."),

  // Finistère - Cap Sizun & Pays Bigouden
  s("plage-du-loch", "Pointe du Raz - Plage du Loch", "Plage du Loch", "Bretagne", "Finistère", 48.038, -4.728, 90, "intermediate", "Beach break", "Sauvage et venteux, à la pointe du Raz."),
  s("audierne", "Audierne", "Audierne", "Bretagne", "Finistère", 48.014, -4.539, 90, "intermediate", "Beach break", "Port pittoresque, plage longue de Trescadec."),
  s("plouhinec", "Plouhinec", "Plouhinec", "Bretagne", "Finistère", 48.000, -4.500, 90, "intermediate", "Beach break", "Plage de la Baie d'Audierne."),
  s("tronoen", "Tronoën", "Tronoën", "Bretagne", "Finistère", 47.881, -4.318, 90, "intermediate", "Beach break", "Plage du Pays Bigouden, alternative à La Torche."),
  s("penhors", "Penhors", "Penhors", "Bretagne", "Finistère", 47.877, -4.334, 90, "intermediate", "Beach break", "Plage longue du Pays Bigouden, tranquille en semaine."),
  s("la-torche", "La Torche", "La Torche", "Bretagne", "Finistère", 47.837, -4.350, 90, "intermediate", "Beach break", "Spot le plus connu de Bretagne. École et compétitions."),
  s("pors-carn", "Pors Carn", "Pors Carn", "Bretagne", "Finistère", 47.834, -4.367, 90, "intermediate", "Beach break", "Plage abritée à côté de La Torche."),
  s("mousterlin", "Mousterlin (Fouesnant)", "Mousterlin", "Bretagne", "Finistère", 47.852, -4.030, 0, "beginner", "Beach break", "Plage longue de Fouesnant."),
  s("beg-meil", "Beg-Meil (Fouesnant)", "Beg-Meil", "Bretagne", "Finistère", 47.853, -3.989, 0, "beginner", "Beach break", "Pointe sud du Finistère, plage de sable fin."),

  // Morbihan
  s("groix-grands-sables", "Île de Groix - Grands Sables", "Groix", "Bretagne", "Morbihan", 47.625, -3.444, 0, "intermediate", "Beach break", "Plage convexe unique d'Europe. Surfable par houle S."),
  s("donnant", "Donnant - Belle-Île", "Donnant", "Bretagne", "Morbihan", 47.339, -3.250, 90, "advanced", "Beach break", "Le spot star de Belle-Île. Vagues creuses et puissantes."),
  s("anse-goulphar", "Anse de Goulphar (Belle-Île)", "Goulphar", "Bretagne", "Morbihan", 47.318, -3.226, 0, "intermediate", "Beach break", "Côte sauvage de Belle-Île."),
  s("erdeven", "Erdeven", "Erdeven", "Bretagne", "Morbihan", 47.638, -3.149, 90, "intermediate", "Beach break", "Plage des Mégalithes. Cadre sauvage."),
  s("penthievre", "Penthièvre", "Penthièvre", "Bretagne", "Morbihan", 47.555, -3.115, 0, "intermediate", "Beach break", "Isthme de Quiberon, côte sauvage."),
  s("quiberon-port-blanc", "Quiberon - Port Blanc", "Port Blanc", "Bretagne", "Morbihan", 47.483, -3.120, 0, "intermediate", "Beach break", "Côte sauvage de Quiberon. Vagues creuses par houle S/SW."),
  s("plouharnel", "Plouharnel - Sainte-Barbe", "Plouharnel", "Bretagne", "Morbihan", 47.580, -3.110, 90, "beginner", "Beach break", "Plage accueillante pour débutants."),
  s("carnac-plage", "Carnac-Plage", "Carnac", "Bretagne", "Morbihan", 47.580, -3.067, 0, "beginner", "Beach break", "Plage abritée, idéale pour les enfants."),
  s("houat", "Île d'Houat - Treac'h ar Gourhed", "Houat", "Bretagne", "Morbihan", 47.388, -2.969, 0, "intermediate", "Beach break", "Île sauvage, plage d'une beauté rare."),
  s("fort-bloque", "Ploemeur - Fort-Bloqué", "Fort-Bloqué", "Bretagne", "Morbihan", 47.731, -3.491, 180, "intermediate", "Beach break", "Plage longue avec un fort en mer, vagues régulières."),

  // ==================== ATLANTIQUE NORD ====================
  // Loire-Atlantique
  s("la-govelle", "La Govelle (Batz-sur-Mer)", "La Govelle", "Atlantique Nord", "Loire-Atlantique", 47.265, -2.526, 180, "beginner", "Beach break", "Côte sauvage du Croisic. Vagues consistantes en automne."),
  s("saint-marc", "Saint-Marc-sur-Mer", "Saint-Marc", "Atlantique Nord", "Loire-Atlantique", 47.250, -2.382, 180, "beginner", "Beach break", "Plage de Monsieur Hulot, immortalisée par Tati."),
  s("saint-brevin", "Saint-Brevin-les-Pins", "Saint-Brevin", "Atlantique Nord", "Loire-Atlantique", 47.248, -2.173, 90, "beginner", "Beach break", "Embouchure de la Loire. Vagues douces et longues."),
  s("la-plaine-sur-mer", "La Plaine-sur-Mer", "La Plaine", "Atlantique Nord", "Loire-Atlantique", 47.137, -2.196, 180, "beginner", "Beach break", "Pays de Retz, plages multiples."),
  s("prefailles", "Préfailles", "Préfailles", "Atlantique Nord", "Loire-Atlantique", 47.130, -2.211, 180, "beginner", "Beach break", "Pointe Saint-Gildas, ambiance sauvage."),
  s("pornic", "Pornic - La Source", "Pornic", "Atlantique Nord", "Loire-Atlantique", 47.117, -2.103, 180, "beginner", "Beach break", "Petite plage abritée. Surf rare mais sympa."),
  s("la-bernerie", "La Bernerie-en-Retz", "La Bernerie", "Atlantique Nord", "Loire-Atlantique", 47.083, -2.040, 180, "beginner", "Beach break", "Plage familiale du Pays de Retz."),
  s("tharon", "Tharon-Plage", "Tharon", "Atlantique Nord", "Loire-Atlantique", 47.151, -2.156, 180, "beginner", "Beach break", "Station tranquille du Pays de Retz."),

  // Vendée
  s("noirmoutier-luzeronde", "Noirmoutier - Luzéronde", "Luzéronde", "Atlantique Nord", "Vendée", 47.020, -2.260, 90, "beginner", "Beach break", "Côte ouest de Noirmoutier. Vagues régulières."),
  s("notre-dame-de-monts", "Notre-Dame-de-Monts", "Notre-Dame-de-Monts", "Atlantique Nord", "Vendée", 46.825, -2.107, 90, "beginner", "Beach break", "Longue plage de l'île-aux-Monts."),
  s("saint-jean-de-monts", "Saint-Jean-de-Monts", "Saint-Jean-de-Monts", "Atlantique Nord", "Vendée", 46.793, -2.067, 90, "beginner", "Beach break", "Longue plage urbaine. École et famille."),
  s("sion-sur-l-ocean", "Sion-sur-l'Océan", "Sion", "Atlantique Nord", "Vendée", 46.755, -2.026, 90, "beginner", "Beach break", "Saint-Hilaire-de-Riez. École active."),
  s("saint-gilles-croix-de-vie", "Saint-Gilles-Croix-de-Vie", "Croix-de-Vie", "Atlantique Nord", "Vendée", 46.700, -1.945, 90, "beginner", "Beach break", "Port et plages familiales."),
  s("ile-d-yeu-vieilles", "Île d'Yeu - Anse des Vieilles", "Île d'Yeu", "Atlantique Nord", "Vendée", 46.700, -2.378, 0, "intermediate", "Beach break", "Côte sauvage de l'île. Vagues confidentielles."),
  s("ile-d-yeu-pointe-but", "Île d'Yeu - Pointe du But", "Pointe du But", "Atlantique Nord", "Vendée", 46.732, -2.405, 270, "advanced", "Beach break / reef", "Pointe ouest, exposition max aux houles atlantiques."),
  s("bretignolles", "Bretignolles-sur-Mer (Sauzaie)", "Bretignolles", "Atlantique Nord", "Vendée", 46.636, -1.865, 90, "intermediate", "Beach break", "Spot phare de Vendée. Étape historique."),
  s("brem-sur-mer", "Brem-sur-Mer", "Brem", "Atlantique Nord", "Vendée", 46.605, -1.850, 90, "intermediate", "Beach break", "Spot des Granges, à côté de Bretignolles."),
  s("sauveterre", "Sauveterre (Olonne)", "Sauveterre", "Atlantique Nord", "Vendée", 46.524, -1.815, 90, "intermediate", "Beach break", "Forêt domaniale. Spot tranquille hors saison."),
  s("les-sables-d-olonne", "Les Sables-d'Olonne", "Les Sables", "Atlantique Nord", "Vendée", 46.497, -1.790, 45, "beginner", "Beach break", "Grande Plage urbaine. Surf doux."),
  s("longeville-sur-mer", "Longeville-sur-Mer", "Longeville", "Atlantique Nord", "Vendée", 46.413, -1.529, 45, "intermediate", "Beach break", "Spot du Rocher. Vagues puissantes par houle SW."),
  s("la-tranche-sur-mer", "La Tranche-sur-Mer", "La Tranche", "Atlantique Nord", "Vendée", 46.340, -1.435, 45, "beginner", "Beach break", "Spot familial. Idéal longboard et école."),
  s("la-faute-sur-mer", "La Faute-sur-Mer", "La Faute", "Atlantique Nord", "Vendée", 46.300, -1.317, 45, "beginner", "Beach break", "Pointe d'Arçay, plage longue et sauvage."),
  s("saint-vincent-jard", "Saint-Vincent-sur-Jard", "Saint-Vincent", "Atlantique Nord", "Vendée", 46.395, -1.523, 45, "intermediate", "Beach break", "Spot intime de Vendée, ancien repaire de Clemenceau."),
  s("talmont-saint-hilaire", "Talmont-Saint-Hilaire", "Talmont", "Atlantique Nord", "Vendée", 46.469, -1.617, 45, "intermediate", "Beach break", "Plage du Veillon, fond varié, bonne école."),

  // Charente-Maritime
  s("ile-de-re-le-lizay", "Île de Ré - Le Lizay", "Le Lizay", "Atlantique Nord", "Charente-Maritime", 46.238, -1.568, 0, "intermediate", "Beach break", "Pointe nord de l'île. Cadre paradisiaque."),
  s("ile-de-re-conche-baleines", "Île de Ré - Conche des Baleines", "Conche des Baleines", "Atlantique Nord", "Charente-Maritime", 46.243, -1.561, 0, "intermediate", "Beach break", "Plage côté ouest. Vagues consistantes."),
  s("ile-de-re-trousse-chemise", "Île de Ré - Trousse Chemise", "Trousse Chemise", "Atlantique Nord", "Charente-Maritime", 46.230, -1.500, 0, "beginner", "Beach break", "Petite plage abritée des Portes-en-Ré."),
  s("la-couarde", "Île de Ré - La Couarde", "La Couarde", "Atlantique Nord", "Charente-Maritime", 46.205, -1.420, 0, "beginner", "Beach break", "Plage centrale de Ré, accessible."),
  s("ile-d-oleron-vert-bois", "Île d'Oléron - Vert Bois", "Vert Bois", "Atlantique Nord", "Charente-Maritime", 45.883, -1.383, 90, "intermediate", "Beach break", "Plage la plus exposée d'Oléron. Vagues régulières."),
  s("la-cotiniere", "Île d'Oléron - La Cotinière", "La Cotinière", "Atlantique Nord", "Charente-Maritime", 45.910, -1.338, 90, "intermediate", "Beach break", "Plage et port de pêche."),
  s("oleron-domino", "Île d'Oléron - Domino", "Domino", "Atlantique Nord", "Charente-Maritime", 45.973, -1.310, 90, "intermediate", "Beach break", "Plage nord d'Oléron, plus sauvage."),
  s("oleron-plaisance", "Île d'Oléron - Plaisance", "Plaisance", "Atlantique Nord", "Charente-Maritime", 45.870, -1.300, 90, "intermediate", "Beach break", "Plage de Saint-Pierre-d'Oléron côté ouest."),
  s("saint-trojan", "Île d'Oléron - Saint-Trojan", "Saint-Trojan", "Atlantique Nord", "Charente-Maritime", 45.832, -1.218, 135, "beginner", "Beach break", "Sud d'Oléron, plage forestière de Gatseau."),
  s("saint-palais-sur-mer", "Saint-Palais-sur-Mer", "Saint-Palais", "Atlantique Nord", "Charente-Maritime", 45.640, -1.090, 90, "beginner", "Beach break", "Plage du Bureau, station familiale."),
  s("la-grande-conche-royan", "Royan - La Grande Conche", "Royan", "Atlantique Nord", "Charente-Maritime", 45.620, -1.020, 90, "beginner", "Beach break", "Grande plage urbaine."),
  s("saint-georges-de-didonne", "Saint-Georges-de-Didonne", "Saint-Georges", "Atlantique Nord", "Charente-Maritime", 45.605, -0.997, 90, "beginner", "Beach break", "Station familiale, vagues douces."),

  // ==================== CÔTE D'ARGENT (Gironde + Landes) ====================
  // Gironde
  s("le-verdon", "Le Verdon-sur-Mer (Pointe de Grave)", "Le Verdon", "Côte d'Argent", "Gironde", 45.560, -1.066, 90, "beginner", "Beach break", "Embouchure de la Gironde. Vagues par houle SW."),
  s("soulac-sur-mer", "Soulac-sur-Mer", "Soulac", "Côte d'Argent", "Gironde", 45.518, -1.123, 90, "beginner", "Beach break", "Pointe du Médoc, plage longue."),
  s("amelie-soulac", "L'Amélie-sur-Mer (Soulac)", "L'Amélie", "Côte d'Argent", "Gironde", 45.500, -1.137, 90, "intermediate", "Beach break", "Petite plage à côté de Soulac. Spot local."),
  s("montalivet", "Montalivet", "Montalivet", "Côte d'Argent", "Gironde", 45.379, -1.143, 90, "intermediate", "Beach break", "Plage forestière préservée. Vagues puissantes."),
  s("hourtin", "Hourtin-Plage", "Hourtin", "Côte d'Argent", "Gironde", 45.246, -1.158, 90, "intermediate", "Beach break", "Station familiale dans la pinède."),
  s("le-pin-sec", "Le Pin Sec (Naujac)", "Le Pin Sec", "Côte d'Argent", "Gironde", 45.297, -1.156, 90, "intermediate", "Beach break", "Plage forestière préservée, accès sauvage."),
  s("carcans", "Carcans-Plage", "Carcans", "Côte d'Argent", "Gironde", 45.111, -1.176, 90, "intermediate", "Beach break", "Plage sauvage au nord de Lacanau."),
  s("lacanau", "Lacanau-Océan", "Lacanau", "Côte d'Argent", "Gironde", 45.000, -1.205, 90, "intermediate", "Beach break", "Référence du Médoc. Étape du tour pro."),
  s("super-sud-lacanau", "Lacanau - Super Sud", "Super Sud", "Côte d'Argent", "Gironde", 44.985, -1.213, 90, "intermediate", "Beach break", "Spot sud de Lacanau, moins fréquenté."),
  s("le-porge", "Le Porge", "Le Porge", "Côte d'Argent", "Gironde", 44.883, -1.183, 90, "beginner", "Beach break", "Plage forestière préservée."),
  s("le-grand-crohot", "Le Grand-Crohot", "Grand-Crohot", "Côte d'Argent", "Gironde", 44.770, -1.218, 90, "intermediate", "Beach break", "Plage du Cap-Ferret, sauvage."),
  s("truc-vert", "Le Truc Vert (Cap-Ferret)", "Truc Vert", "Côte d'Argent", "Gironde", 44.690, -1.243, 90, "intermediate", "Beach break", "Plage tranquille du Cap-Ferret."),
  s("cap-ferret", "Cap Ferret - Horizon", "Cap Ferret", "Côte d'Argent", "Gironde", 44.640, -1.250, 90, "intermediate", "Beach break", "Pointe sauvage face à l'océan."),
  s("la-salie", "La Salie", "La Salie", "Côte d'Argent", "Gironde", 44.560, -1.220, 90, "advanced", "Beach break", "Bassin d'Arcachon sud. Forts courants."),
  s("petit-nice-pyla", "Pyla - Petit Nice", "Petit Nice", "Côte d'Argent", "Gironde", 44.583, -1.231, 90, "intermediate", "Beach break", "Au pied de la Dune du Pilat."),

  // Landes
  s("biscarrosse", "Biscarrosse-Plage", "Biscarrosse", "Côte d'Argent", "Landes", 44.435, -1.260, 90, "intermediate", "Beach break", "Premier spot landais. École et compétitions."),
  s("biscarrosse-vivier", "Biscarrosse - Le Vivier", "Le Vivier", "Côte d'Argent", "Landes", 44.385, -1.275, 90, "intermediate", "Beach break", "Plage sud de Biscarrosse, moins fréquentée."),
  s("mimizan", "Mimizan-Plage", "Mimizan", "Côte d'Argent", "Landes", 44.205, -1.300, 90, "beginner", "Beach break", "Plage du Courant. École reconnue."),
  s("contis", "Contis-Plage", "Contis", "Côte d'Argent", "Landes", 44.082, -1.323, 90, "intermediate", "Beach break", "Spot des Landes préservé, cadre forestier."),
  s("cap-de-l-homy", "Cap-de-l'Homy (Lit-et-Mixe)", "Cap-de-l'Homy", "Côte d'Argent", "Landes", 44.030, -1.341, 90, "intermediate", "Beach break", "Village à dunes, ambiance authentique."),
  s("saint-girons-plage", "Saint-Girons-Plage", "Saint-Girons", "Côte d'Argent", "Landes", 43.952, -1.358, 90, "intermediate", "Beach break", "Spot sauvage à côté de Moliets."),
  s("moliets", "Moliets-Plage", "Moliets", "Côte d'Argent", "Landes", 43.857, -1.383, 90, "intermediate", "Beach break", "Étape historique du tour pro. École dynamique."),
  s("messanges", "Messanges", "Messanges", "Côte d'Argent", "Landes", 43.825, -1.395, 90, "intermediate", "Beach break", "Plage Sud, ambiance camping et surf."),
  s("vieux-boucau", "Vieux-Boucau-les-Bains", "Vieux-Boucau", "Côte d'Argent", "Landes", 43.794, -1.404, 90, "intermediate", "Beach break", "Plage du Penon, ambiance village basque."),
  s("soustons-plage", "Soustons-Plage", "Soustons", "Côte d'Argent", "Landes", 43.760, -1.408, 90, "intermediate", "Beach break", "Plage des Casernes, cadre dunaire."),
  s("seignosse-penon", "Seignosse - Le Penon", "Le Penon", "Côte d'Argent", "Landes", 43.725, -1.420, 90, "intermediate", "Beach break", "Plage nord de Seignosse."),
  s("seignosse-estagnots", "Seignosse - Les Estagnots", "Estagnots", "Côte d'Argent", "Landes", 43.700, -1.430, 90, "intermediate", "Beach break", "Plage des sessions des pros."),
  s("seignosse", "Seignosse - Les Bourdaines", "Bourdaines", "Côte d'Argent", "Landes", 43.690, -1.435, 90, "intermediate", "Beach break", "Spot mondialement reconnu. Étape WSL."),
  s("hossegor-nord", "Hossegor - La Nord", "Hossegor Nord", "Côte d'Argent", "Landes", 43.685, -1.435, 90, "advanced", "Beach break", "Plage nord d'Hossegor, vagues puissantes."),
  s("hossegor", "Hossegor - La Gravière", "La Gravière", "Côte d'Argent", "Landes", 43.670, -1.440, 90, "advanced", "Beach break / fosse", "Tube break le plus célèbre d'Europe. Étape WSL."),
  s("hossegor-sud", "Hossegor - La Sud", "Hossegor Sud", "Côte d'Argent", "Landes", 43.660, -1.443, 90, "advanced", "Beach break", "Plage sud d'Hossegor."),
  s("capbreton-piste", "Capbreton - La Piste", "La Piste", "Côte d'Argent", "Landes", 43.665, -1.450, 90, "advanced", "Beach break", "Plage iconique de Capbreton."),
  s("capbreton", "Capbreton - Le Santocha", "Santocha", "Côte d'Argent", "Landes", 43.645, -1.447, 90, "intermediate", "Beach break / jetée", "Fonctionne quand Hossegor sature."),
  s("capbreton-prevent", "Capbreton - Le Prévent", "Le Prévent", "Côte d'Argent", "Landes", 43.660, -1.443, 90, "intermediate", "Beach break", "Beach break central de Capbreton."),
  s("labenne", "Labenne-Océan", "Labenne", "Côte d'Argent", "Landes", 43.595, -1.450, 90, "intermediate", "Beach break", "Station landaise, plage longue."),
  s("ondres", "Ondres-Plage", "Ondres", "Côte d'Argent", "Landes", 43.572, -1.460, 90, "intermediate", "Beach break", "Petite station landaise, peu fréquentée."),
  s("tarnos", "Tarnos - La Digue", "Tarnos", "Côte d'Argent", "Landes", 43.547, -1.500, 90, "intermediate", "Beach break / jetée", "Plage de la Digue Nord, jetée de l'Adour."),
  s("hourquet", "Hourquet (Vieux-Boucau)", "Hourquet", "Côte d'Argent", "Landes", 43.770, -1.412, 90, "intermediate", "Beach break", "Petit spot landais entre Vieux-Boucau et Seignosse, ambiance secrète."),

  // ==================== PAYS BASQUE ====================
  s("anglet-barre", "Anglet - La Barre", "La Barre", "Pays Basque", "Pyrénées-Atlantiques", 43.525, -1.515, 90, "advanced", "Beach break / jetée", "Spot historique, vagues puissantes près de la jetée de l'Adour."),
  s("anglet-cavaliers", "Anglet - Les Cavaliers", "Cavaliers", "Pays Basque", "Pyrénées-Atlantiques", 43.510, -1.524, 90, "intermediate", "Beach break", "Plage star d'Anglet, beach break puissant."),
  s("anglet-marinella", "Anglet - Marinella", "Marinella", "Pays Basque", "Pyrénées-Atlantiques", 43.498, -1.535, 90, "intermediate", "Beach break", "Plage centrale d'Anglet."),
  s("anglet-madrague", "Anglet - La Madrague", "Madrague", "Pays Basque", "Pyrénées-Atlantiques", 43.502, -1.540, 90, "intermediate", "Beach break", "Plage tranquille d'Anglet."),
  s("anglet-sables-or", "Anglet - Les Sables d'Or", "Sables d'Or", "Pays Basque", "Pyrénées-Atlantiques", 43.495, -1.547, 90, "intermediate", "Beach break", "Plage centrale d'Anglet, école active."),
  s("anglet-vvf", "Anglet - VVF", "VVF", "Pays Basque", "Pyrénées-Atlantiques", 43.490, -1.555, 90, "intermediate", "Beach break", "Plage proche Chambre d'Amour."),
  s("anglet", "Anglet - Chambre d'Amour", "Chambre d'Amour", "Pays Basque", "Pyrénées-Atlantiques", 43.485, -1.550, 90, "intermediate", "Beach break", "Sept plages en enfilade. École et compétitions."),
  s("biarritz-grande-plage", "Biarritz - Grande Plage", "Grande Plage", "Pays Basque", "Pyrénées-Atlantiques", 43.487, -1.561, 90, "beginner", "Beach break", "Le coeur de Biarritz, sous le Casino."),
  s("biarritz-port-vieux", "Biarritz - Port Vieux", "Port Vieux", "Pays Basque", "Pyrénées-Atlantiques", 43.484, -1.564, 90, "beginner", "Beach break", "Petite plage abritée du centre Biarritz."),
  s("biarritz", "Biarritz - Côte des Basques", "Côte des Basques", "Pays Basque", "Pyrénées-Atlantiques", 43.480, -1.565, 110, "beginner", "Beach break", "Berceau du surf européen. Longboard et progression."),
  s("biarritz-marbella", "Biarritz - Marbella", "Marbella", "Pays Basque", "Pyrénées-Atlantiques", 43.474, -1.572, 110, "intermediate", "Beach break", "Petite plage sous les falaises."),
  s("biarritz-milady", "Biarritz - Milady", "Milady", "Pays Basque", "Pyrénées-Atlantiques", 43.470, -1.580, 110, "intermediate", "Beach break", "Plage sud de Biarritz, plus calme."),
  s("ilbarritz", "Bidart - Ilbarritz", "Ilbarritz", "Pays Basque", "Pyrénées-Atlantiques", 43.460, -1.580, 110, "intermediate", "Beach break", "Plage entre Biarritz et Bidart."),
  s("bidart-pavillon-royal", "Bidart - Pavillon Royal", "Pavillon Royal", "Pays Basque", "Pyrénées-Atlantiques", 43.452, -1.585, 110, "intermediate", "Beach break", "Spot reef et beach mixte."),
  s("bidart", "Bidart - Erretegia", "Bidart Erretegia", "Pays Basque", "Pyrénées-Atlantiques", 43.443, -1.589, 90, "intermediate", "Beach break", "Crique pittoresque encadrée de falaises."),
  s("bidart-centre", "Bidart - Centre", "Bidart Centre", "Pays Basque", "Pyrénées-Atlantiques", 43.438, -1.595, 90, "intermediate", "Beach break", "Plage centrale de Bidart, school spot."),
  s("guethary-avalanche", "Guéthary - Avalanche", "Avalanche", "Pays Basque", "Pyrénées-Atlantiques", 43.422, -1.610, 135, "advanced", "Reef break", "Vague de récif majeure du Pays Basque."),
  s("guethary", "Guéthary - Parlementia", "Parlementia", "Pays Basque", "Pyrénées-Atlantiques", 43.425, -1.608, 135, "advanced", "Reef break", "Vague de récif puissante, pour confirmés."),
  s("guethary-alcyons", "Guéthary - Les Alcyons", "Alcyons", "Pays Basque", "Pyrénées-Atlantiques", 43.420, -1.611, 135, "advanced", "Reef break", "Reef break exigeant à côté de Parlementia."),
  s("cenitz", "Cenitz", "Cenitz", "Pays Basque", "Pyrénées-Atlantiques", 43.415, -1.617, 135, "intermediate", "Beach break", "Plage tranquille entre Guéthary et Saint-Jean-de-Luz."),
  s("lafitenia", "Saint-Jean-de-Luz - Lafitenia", "Lafitenia", "Pays Basque", "Pyrénées-Atlantiques", 43.397, -1.640, 135, "advanced", "Reef break", "Belle vague de droite, spot technique."),
  s("acotz", "Saint-Jean-de-Luz - Acotz", "Acotz", "Pays Basque", "Pyrénées-Atlantiques", 43.402, -1.635, 135, "intermediate", "Beach break", "Plage des Flots Bleus, spot d'école sympa à côté de Lafiténia."),
  s("sainte-barbe", "Saint-Jean-de-Luz - Sainte-Barbe", "Sainte-Barbe", "Pays Basque", "Pyrénées-Atlantiques", 43.392, -1.658, 135, "intermediate", "Beach break", "À côté du port, vagues sous la statue Sainte-Barbe."),
  s("erromardie", "Erromardie", "Erromardie", "Pays Basque", "Pyrénées-Atlantiques", 43.408, -1.642, 135, "beginner", "Beach break", "Spot familial entre Saint-Jean-de-Luz et Guéthary."),
  s("mayarco", "Mayarco", "Mayarco", "Pays Basque", "Pyrénées-Atlantiques", 43.400, -1.645, 135, "intermediate", "Beach break", "Petite plage tranquille."),
  s("belharra", "Belharra (Saint-Jean-de-Luz)", "Belharra", "Pays Basque", "Pyrénées-Atlantiques", 43.388, -1.692, 135, "advanced", "Big wave / reef", "Vague géante mythique, pour gros surf uniquement."),
  s("ciboure", "Ciboure - Socoa", "Ciboure", "Pays Basque", "Pyrénées-Atlantiques", 43.385, -1.665, 180, "beginner", "Beach break", "Baie de Saint-Jean-de-Luz, plage abritée."),
  s("hendaye", "Hendaye", "Hendaye", "Pays Basque", "Pyrénées-Atlantiques", 43.370, -1.780, 180, "beginner", "Beach break", "Grande baie protégée. Spot famille."),

  // ==================== MÉDITERRANÉE ====================
  // Pyrénées-Orientales
  s("banyuls", "Banyuls-sur-Mer", "Banyuls", "Méditerranée", "Pyrénées-Orientales", 42.486, 3.130, 270, "intermediate", "Beach break", "Côte rocheuse catalane. Surf rare par tempête de SE."),
  s("argeles-sur-mer", "Argelès-sur-Mer", "Argelès", "Méditerranée", "Pyrénées-Orientales", 42.557, 3.046, 270, "intermediate", "Beach break", "Longue plage sablonneuse. Tempête de SE indispensable."),
  s("saint-cyprien", "Saint-Cyprien-Plage", "Saint-Cyprien", "Méditerranée", "Pyrénées-Orientales", 42.632, 3.038, 270, "intermediate", "Beach break", "Station catalane, longue plage."),
  s("canet", "Canet-en-Roussillon", "Canet", "Méditerranée", "Pyrénées-Orientales", 42.703, 3.034, 270, "intermediate", "Beach break", "Plage urbaine, surf occasionnel."),
  s("sainte-marie-la-mer", "Sainte-Marie-la-Mer", "Sainte-Marie", "Méditerranée", "Pyrénées-Orientales", 42.728, 3.027, 270, "intermediate", "Beach break", "Catalogne française. Surf par tempête SE."),
  s("le-barcares", "Le Barcarès", "Le Barcarès", "Méditerranée", "Pyrénées-Orientales", 42.792, 3.038, 270, "intermediate", "Beach break", "Station du Roussillon, plages longues."),

  // Aude
  s("leucate", "Leucate-Plage", "Leucate", "Méditerranée", "Aude", 42.918, 3.052, 270, "intermediate", "Beach break", "Spot exposé aux houles de SE."),
  s("la-franqui", "La Franqui (Leucate)", "La Franqui", "Méditerranée", "Aude", 42.952, 3.022, 270, "intermediate", "Beach break / windsurf", "Plage longue, paradis du windsurf et kitesurf."),
  s("port-la-nouvelle", "Port-la-Nouvelle", "Port-la-Nouvelle", "Méditerranée", "Aude", 43.018, 3.075, 270, "intermediate", "Beach break", "Plage du Languedoc."),
  s("gruissan", "Gruissan", "Gruissan", "Méditerranée", "Aude", 43.107, 3.097, 270, "intermediate", "Beach break", "Station audoise, chalets pittoresques."),
  s("narbonne-plage", "Narbonne-Plage", "Narbonne-Plage", "Méditerranée", "Aude", 43.155, 3.180, 270, "intermediate", "Beach break", "Longue plage de l'Aude."),

  // Hérault
  s("vendres-plage", "Vendres-Plage", "Vendres", "Méditerranée", "Hérault", 43.225, 3.272, 270, "intermediate", "Beach break", "Plage naturiste préservée."),
  s("valras", "Valras-Plage", "Valras", "Méditerranée", "Hérault", 43.243, 3.288, 270, "intermediate", "Beach break", "Station familiale de l'Hérault."),
  s("serignan", "Sérignan-Plage", "Sérignan", "Méditerranée", "Hérault", 43.275, 3.317, 270, "intermediate", "Beach break", "Plage sauvage entre étangs et mer."),
  s("marseillan", "Marseillan-Plage", "Marseillan", "Méditerranée", "Hérault", 43.302, 3.555, 270, "intermediate", "Beach break", "Station du Languedoc."),
  s("cap-d-agde", "Cap d'Agde", "Cap d'Agde", "Méditerranée", "Hérault", 43.283, 3.466, 0, "intermediate", "Beach break", "Plage ouverte sur le Golfe du Lion."),
  s("sete", "Sète - La Corniche", "Sète", "Méditerranée", "Hérault", 43.385, 3.673, 0, "intermediate", "Beach break", "Plage urbaine de Sète."),
  s("frontignan", "Frontignan", "Frontignan", "Méditerranée", "Hérault", 43.439, 3.752, 0, "intermediate", "Beach break", "Plage longue de l'Hérault."),
  s("palavas", "Palavas-les-Flots", "Palavas", "Méditerranée", "Hérault", 43.527, 3.928, 0, "intermediate", "Beach break", "Station urbaine de Montpellier."),
  s("la-grande-motte", "La Grande-Motte", "Grande-Motte", "Méditerranée", "Hérault", 43.564, 4.083, 0, "intermediate", "Beach break", "Station moderniste. Surf par houle SE."),
  s("grand-travers", "Grand Travers (Carnon)", "Grand Travers", "Méditerranée", "Hérault", 43.539, 4.020, 0, "intermediate", "Beach break", "Longue plage sauvage entre Carnon et La Grande-Motte."),
  s("aresquiers", "Les Aresquiers (Frontignan)", "Aresquiers", "Méditerranée", "Hérault", 43.452, 3.815, 0, "intermediate", "Beach break", "Plage naturelle protégée entre étangs et mer."),

  // Gard
  s("le-grau-du-roi", "Le Grau-du-Roi", "Grau-du-Roi", "Méditerranée", "Gard", 43.535, 4.137, 0, "intermediate", "Beach break", "Petit Camargue, plage urbaine."),

  // Bouches-du-Rhône
  s("saintes-maries", "Saintes-Maries-de-la-Mer", "Saintes-Maries", "Méditerranée", "Bouches-du-Rhône", 43.452, 4.428, 0, "intermediate", "Beach break", "Camargue mystique. Surf par tempête."),
  s("beauduc", "Beauduc", "Beauduc", "Méditerranée", "Bouches-du-Rhône", 43.367, 4.589, 0, "advanced", "Beach break", "Spot reculé de Camargue. Big wave par tempête."),
  s("carro", "Carro (Martigues)", "Carro", "Méditerranée", "Bouches-du-Rhône", 43.330, 5.030, 0, "intermediate", "Beach break", "Côte Bleue, plage à l'ouest de Marseille."),
  s("la-couronne", "La Couronne (Martigues)", "La Couronne", "Méditerranée", "Bouches-du-Rhône", 43.323, 5.060, 0, "intermediate", "Beach break / reef", "Spot reef de la Côte Bleue, vagues par tempête SW."),
  s("sausset", "Sausset-les-Pins", "Sausset", "Méditerranée", "Bouches-du-Rhône", 43.331, 5.107, 0, "beginner", "Beach break", "Côte Bleue, plage urbaine."),
  s("carry-le-rouet", "Carry-le-Rouet", "Carry-le-Rouet", "Méditerranée", "Bouches-du-Rhône", 43.330, 5.150, 0, "beginner", "Beach break", "Port et plage de la Côte Bleue."),
  s("marseille-prado", "Marseille - Le Prado", "Le Prado", "Méditerranée", "Bouches-du-Rhône", 43.263, 5.364, 0, "intermediate", "Beach break", "Plage urbaine de Marseille."),
  s("marseille-catalans", "Marseille - Les Catalans", "Les Catalans", "Méditerranée", "Bouches-du-Rhône", 43.290, 5.353, 0, "beginner", "Beach break", "Petite plage centre Marseille."),
  s("marseille-pointe-rouge", "Marseille - Pointe Rouge", "Pointe Rouge", "Méditerranée", "Bouches-du-Rhône", 43.247, 5.376, 0, "intermediate", "Beach break", "Plage sud Marseille."),
  s("cassis", "Cassis - Plage de la Grande Mer", "Cassis", "Méditerranée", "Bouches-du-Rhône", 43.214, 5.539, 0, "beginner", "Beach break", "Port pittoresque. Vagues très rares."),

  // Var
  s("la-ciotat", "La Ciotat", "La Ciotat", "Méditerranée", "Var", 43.176, 5.605, 0, "intermediate", "Beach break", "Plage longue, surf par houle SW."),
  s("bandol", "Bandol", "Bandol", "Méditerranée", "Var", 43.137, 5.752, 0, "beginner", "Beach break", "Station chic du Var. Surf très occasionnel."),
  s("sanary", "Sanary-sur-Mer", "Sanary", "Méditerranée", "Var", 43.119, 5.800, 0, "beginner", "Beach break", "Village provençal authentique."),
  s("le-brusc", "Le Brusc - Six-Fours", "Le Brusc", "Méditerranée", "Var", 43.066, 5.805, 0, "intermediate", "Beach break", "Spot du Var, sessions rares mais belles."),
  s("la-seyne", "La Seyne-sur-Mer", "La Seyne", "Méditerranée", "Var", 43.107, 5.881, 0, "beginner", "Beach break", "Plage des Sablettes, urbaine."),
  s("hyeres-almanarre", "L'Almanarre - Hyères", "Almanarre", "Méditerranée", "Var", 43.084, 6.137, 90, "intermediate", "Beach break / windsurf", "Paradis windsurf, surfable par tempête W."),
  s("le-lavandou", "Le Lavandou", "Le Lavandou", "Méditerranée", "Var", 43.137, 6.367, 0, "beginner", "Beach break", "Station du Var, plage urbaine."),
  s("cavalaire", "Cavalaire-sur-Mer", "Cavalaire", "Méditerranée", "Var", 43.169, 6.527, 0, "beginner", "Beach break", "Grande baie de la côte d'Azur."),
  s("pampelonne", "Pampelonne (Ramatuelle)", "Pampelonne", "Méditerranée", "Var", 43.218, 6.690, 0, "beginner", "Beach break", "Plage star de Saint-Tropez. Surf très occasionnel."),
  s("pampelonne-tahiti", "Pampelonne - Tahiti Plage", "Tahiti Plage", "Méditerranée", "Var", 43.230, 6.682, 0, "beginner", "Beach break", "Section nord de Pampelonne, ambiance plus chill."),
  s("saint-aygulf", "Saint-Aygulf", "Saint-Aygulf", "Méditerranée", "Var", 43.395, 6.722, 0, "beginner", "Beach break", "Station tranquille du Var."),
  s("frejus", "Fréjus - Saint-Aygulf", "Fréjus", "Méditerranée", "Var", 43.435, 6.737, 0, "beginner", "Beach break", "Cité romaine et plages familiales."),

  // Alpes-Maritimes
  s("nice", "Nice - Promenade des Anglais", "Nice", "Méditerranée", "Alpes-Maritimes", 43.690, 7.265, 0, "beginner", "Galets", "Plage de galets urbaine. Surf rarissime."),
  s("cagnes", "Cagnes-sur-Mer", "Cagnes", "Méditerranée", "Alpes-Maritimes", 43.660, 7.150, 0, "beginner", "Galets", "Plage de galets près de Nice."),
  s("mandelieu", "Mandelieu - La Napoule", "Mandelieu", "Méditerranée", "Alpes-Maritimes", 43.522, 6.940, 180, "beginner", "Beach break", "Plage du Riou, ambiance Estérel rouge."),
  s("esquillon", "Plage de l'Esquillon (Théoule)", "Esquillon", "Méditerranée", "Alpes-Maritimes", 43.495, 6.937, 180, "intermediate", "Reef / galets", "Petite crique de l'Estérel, vagues par houle SE."),

  // ==================== CORSE ====================
  s("calvi", "Calvi", "Calvi", "Corse", "Haute-Corse", 42.566, 8.755, 90, "intermediate", "Beach break", "Baie de Calvi. Surf par tempête de W et NW."),
  s("ile-rousse", "L'Île-Rousse", "L'Île-Rousse", "Corse", "Haute-Corse", 42.633, 8.939, 90, "intermediate", "Beach break", "Plage abritée du Nebbio. Vagues rares."),
  s("saleccia", "Saleccia (Agriates)", "Saleccia", "Corse", "Haute-Corse", 42.793, 9.218, 90, "intermediate", "Beach break", "Plage paradisiaque sauvage. Vagues par tempête W."),
  s("propriano", "Propriano", "Propriano", "Corse", "Corse-du-Sud", 41.677, 8.902, 270, "intermediate", "Beach break", "Golfe de Valinco. Vagues par tempête SW."),
  s("porto-vecchio-palombaggia", "Porto-Vecchio - Palombaggia", "Palombaggia", "Corse", "Corse-du-Sud", 41.566, 9.343, 90, "beginner", "Beach break", "Plage paradisiaque, surf très occasionnel."),
  s("cala-rossa", "Cala Rossa (Porto-Vecchio)", "Cala Rossa", "Corse", "Corse-du-Sud", 41.629, 9.359, 90, "intermediate", "Beach break", "Crique rouge mythique, vagues quand tempête E."),
  s("pinarello", "Pinarello", "Pinarello", "Corse", "Corse-du-Sud", 41.687, 9.388, 90, "intermediate", "Beach break", "Plage du sud-est corse, ambiance lagon."),
  s("algajola", "Algajola", "Algajola", "Corse", "Haute-Corse", 42.611, 8.857, 0, "intermediate", "Beach break", "Plage entre Calvi et L'Île-Rousse, vagues régulières en hiver."),
  s("lumio", "Lumio (Sant'Ambroggio)", "Lumio", "Corse", "Haute-Corse", 42.580, 8.825, 0, "intermediate", "Beach break", "Spot du golfe de Calvi, accessible et joli."),

  // ==================== 🇪🇸 ESPAGNE ATLANTIQUE — Pays basque + Cantabrie ====================
  // Pays basque espagnol (Vizcaya / Gipuzkoa)
  s("mundaka", "Mundaka", "Mundaka", "Espagne Atlantique", "Vizcaya", 43.405, -2.696, 180, "advanced", "Reef left", "Vague gauche mythique de classe mondiale. Tubes sur fond de sable estuarien. Pour confirmés."),
  s("sopelana", "Sopelana", "Sopelana", "Espagne Atlantique", "Vizcaya", 43.391, -2.989, 180, "intermediate", "Beach break", "Spot urbain de Bilbao, plage la plus consistante du Pays basque ES."),
  s("bakio", "Bakio", "Bakio", "Espagne Atlantique", "Vizcaya", 43.428, -2.815, 180, "intermediate", "Beach break", "Plage longue exposée aux houles NW. École locale active."),
  s("plentzia", "Plentzia", "Plentzia", "Espagne Atlantique", "Vizcaya", 43.408, -2.949, 180, "beginner", "Beach break", "Plage d'estuaire abritée, parfaite pour démarrer."),
  s("la-salvaje", "La Salvaje", "La Salvaje", "Espagne Atlantique", "Vizcaya", 43.371, -2.984, 180, "advanced", "Beach break", "Spot brutal de Bilbao, ferme dur. Pour confirmés."),
  s("punta-galea", "Punta Galea", "Punta Galea", "Espagne Atlantique", "Vizcaya", 43.376, -3.008, 180, "advanced", "Reef right", "Vague de récif droite puissante, big wave en hiver."),
  s("menakoz", "Meñakoz", "Meñakoz", "Espagne Atlantique", "Vizcaya", 43.382, -2.973, 180, "advanced", "Reef right", "Big wave spot, droite puissante, prend jusqu'à 5m."),
  s("zarautz", "Zarautz", "Zarautz", "Espagne Atlantique", "Gipuzkoa", 43.286, -2.166, 180, "intermediate", "Beach break", "Plus longue plage du Pays basque ES, étape WSL. Vagues consistantes."),
  s("zumaia", "Zumaia (Itzurun)", "Zumaia", "Espagne Atlantique", "Gipuzkoa", 43.305, -2.255, 180, "intermediate", "Beach break / reef", "Plage d'Itzurun encaissée par les falaises de flysch."),
  s("orrua", "Orrua (Mutriku)", "Orrua", "Espagne Atlantique", "Gipuzkoa", 43.310, -2.367, 180, "advanced", "Reef left", "Big wave gauche, l'un des meilleurs spots experts d'Europe."),
  s("roca-puta", "Roca Puta (Mutriku)", "Roca Puta", "Espagne Atlantique", "Gipuzkoa", 43.313, -2.379, 180, "advanced", "Reef right", "Vague de récif droite intense, locaux uniquement."),
  s("hondarribia", "Hondarribia", "Hondarribia", "Espagne Atlantique", "Gipuzkoa", 43.380, -1.795, 180, "beginner", "Beach break", "Plage frontalière, vagues douces, alternative à Hendaye."),

  // Cantabrie
  s("liencres", "Liencres - Valdearenas", "Liencres", "Espagne Atlantique", "Cantabrie", 43.448, -3.953, 180, "intermediate", "Beach break", "Estuaire du Pas, dunes spectaculaires, vagues régulières."),
  s("somo", "Somo", "Somo", "Espagne Atlantique", "Cantabrie", 43.443, -3.755, 180, "beginner", "Beach break", "Face à Santander, plage de référence pour débuter en Cantabrie."),
  s("loredo", "Loredo", "Loredo", "Espagne Atlantique", "Cantabrie", 43.470, -3.747, 180, "intermediate", "Beach break", "Plage voisine de Somo, ambiance plus chill."),
  s("suances", "Suances - Los Locos", "Suances", "Espagne Atlantique", "Cantabrie", 43.434, -4.046, 180, "intermediate", "Beach break / reef", "Spot mythique de Cantabrie, base de Pablo Gutiérrez."),
  s("santander-sardinero", "Santander - El Sardinero", "El Sardinero", "Espagne Atlantique", "Cantabrie", 43.476, -3.770, 180, "intermediate", "Beach break", "Plage urbaine de Santander, ambiance ville."),
  s("berria", "Berria (Santoña)", "Berria", "Espagne Atlantique", "Cantabrie", 43.451, -3.480, 180, "intermediate", "Beach break", "Longue plage sauvage de Santoña, étape WSL en juniors."),
  s("langre", "Langre", "Langre", "Espagne Atlantique", "Cantabrie", 43.485, -3.715, 180, "intermediate", "Beach break", "Plage entre falaises, vagues consistantes."),
  s("ris", "Ris (Noja)", "Ris", "Espagne Atlantique", "Cantabrie", 43.491, -3.512, 180, "beginner", "Beach break", "Spot famille de Noja, vagues douces."),
];

export function getSpotBySlug(slug: string): Spot | undefined {
  return SPOTS.find((s) => s.slug === slug);
}

const EARTH_KM = 6371;
function distKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_KM * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Returns the N closest spots to the given one, sorted by distance ascending. */
export function getNearbySpots(spot: Spot, count = 4): Array<{ spot: Spot; km: number }> {
  return SPOTS
    .filter((s) => s.slug !== spot.slug)
    .map((s) => ({ spot: s, km: distKm(spot.lat, spot.lon, s.lat, s.lon) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, count);
}
