export const fr = {
  // Brand
  tagline: "ta vague est prête",
  taglineHero: "yo, ta vague est prête.",
  taglineMap: "la carte des vagues",

  // Navigation
  navSpots: "Spots",
  navIndex: "Index",
  navAbout: "À propos",
  navMenuOpen: "Ouvrir le menu",
  navMenuClose: "Fermer le menu",
  navAllSpots: "Tous les spots",
  navSpotIndex: "Index des spots",
  navScoreAbout: "À propos du score",
  navLegal: "Mentions légales",
  navPrivacy: "Confidentialité",

  // Hero
  heroBadgeLive: "{n} spots · live",
  heroTitleA: "Yo, ta vague",
  heroTitleB: "est prête.",
  heroDescription: "La carte vivante des vagues françaises.",
  heroDescriptionRange: "Du {from} à la {to} — trouve le spot, l'heure, file à l'eau.",
  heroFrom: "Pas-de-Calais",
  heroTo: "Méditerranée",
  heroCta: "Voir les sessions du jour",
  heroCtaSecondary: "Comment ça marche",
  heroStatsSpots: "spots couverts",
  heroStatsRegions: "régions du littoral",
  heroStatsForecast: "de prévisions",
  heroStatsHourly: "détail horaire",

  // Filters
  filterAllRegions: "Toutes",
  filterFavorites: "Mes favoris",
  filterSearch: "Chercher un spot…",
  filterNearMe: "Près de moi",
  filterSortScore: "Tri : meilleur score",
  filterSortWave: "Tri : hauteur vague",
  filterSortDistance: "Tri : distance",
  filterSortName: "Tri : A→Z",
  filterLevel: "Score adapté à mon niveau :",
  filterLevelHint: "(ne filtre pas la liste, recalibre uniquement le score)",
  filterLevelBeginner: "Débutant",
  filterLevelIntermediate: "Intermédiaire",
  filterLevelAdvanced: "Confirmé",
  filterToday: "Auj.",
  filterTomorrow: "Dem.",

  // Quick actions
  quickTopToday: "Top du jour",
  quickTopTodaySub: "meilleurs scores",
  quickWeekend: "Ce week-end",
  quickWeekendSub: "samedi (J+{n})",
  quickWeekendToday: "samedi (auj.)",
  quickNearMe: "Près de moi",
  quickNearMeActive: "actif",
  quickNearMeSub: "géoloc",
  quickBigWaves: "Grosses vagues",
  quickBigWavesSub: "tri par houle",

  // Hot today
  hotTodayLabel: "🔥 Hot today",
  hotTodayDayLabel: "🔥 Hot today · J+{n}",
  hotTodayWindow: "⭐ Meilleur créneau",
  hotTodayMore: "et {n} autre{s} spot{s} ≥ 70",
  hotTodayCta: "Voir",

  // Cards
  cardBestWindow: "Meilleur créneau :",
  cardNoWindow: "Pas de créneau favorable aujourd'hui",
  cardWave: "Vague",
  cardPeriod: "Période",
  cardWind: "Vent",
  cardFullSheet: "Fiche complète",
  cardShare: "Partager",
  cardShareCopied: "Copié",
  cardScoreLabelExcellent: "Excellent",
  cardScoreLabelGood: "Bien",
  cardScoreLabelMedium: "Moyen",
  cardScoreLabelPoor: "Faible",
  cardScoreLabelPlat: "Plat",

  // Week highlights
  weekTitleA: "Cette semaine",
  weekTitleB: "en mer",
  weekSessionsCount: "top {n} sessions à venir",

  // Modal
  modalBestWindowTitle: "Meilleur créneau du jour",
  modalScoreAverage: "score moyen {n}",
  modalHourly: "Heure par heure",
  modalHourlyHint: "couleur = score · gris = nuit",
  modalTouchHour: "Touche une heure",
  modalTouchHint: "pour voir les conditions.",
  modalAbout: "À propos du spot",
  modalShare: "Partager",
  modalLinkCopied: "Lien copié !",
  modalFullSheet: "Fiche complète",
  modalLoadingTides: "Lecture des marées…",
  modalNoHourly: "Détail horaire indisponible.",

  // Tiles
  tileScore: "Score",
  tileWaveMax: "Vague",
  tileWindMax: "Vent",
  tileWaterAir: "Eau / Air",
  tileGust: "raf.",
  tileAir: "air",

  // Counters / status
  countLoading: "Lecture des marées… {done}/{total}",
  countShown: "{n} spot{s} en vue 🤙",
  countUpdated: "· maj {time}",
  countExplored: "explorés",

  // States
  stateNoResults: "Aucun spot ne correspond à tes filtres.",

  // Onboarding
  onboardingWelcome: "bienvenue !",
  onboardingTitleA: "Quels spots",
  onboardingTitleB: "tu surfes ?",
  onboardingDescription: "Ajoute tes spots favoris pour les retrouver instantanément à chaque visite.",
  onboardingGeoFound: "On t'a trouvé près de chez toi",
  onboardingAddCta: "Ajouter {n} favori{s} →",
  onboardingPickHint: "Sélectionne au moins 1 spot",
  onboardingLater: "Plus tard",
  onboardingNoAccount: "Aucun compte, aucune donnée envoyée. Les favoris restent sur ton appareil.",

  // Cookie
  cookieTextLong: "On utilise des cookies pour mesurer l'audience et afficher de la pub.",
  cookieTextShort: "Cookies pour audience & pub.",
  cookieMore: "En savoir +",
  cookieRefuse: "Refuser",
  cookieAccept: "OK",

  // Footer
  footerMadeWith: "Fait avec",
  footerMadeIn: "en France · données",
  footerFooterTip: "· surfe à ton niveau et respecte les locaux 🤙",

  // Version watcher
  versionNew: "Nouvelle version disponible",
  versionRefresh: "Rafraîchir",

  // Surf level advice
  levelBeginnerTitle: "Débutant",
  levelIntermediateTitle: "Intermédiaire",
  levelAdvancedTitle: "Confirmé",
} as const;

export type Translations = typeof fr;
