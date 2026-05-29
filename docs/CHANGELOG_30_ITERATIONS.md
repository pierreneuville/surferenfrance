# Yosurf — Changelog des 30 itérations autonomes

> Période : mai 2026
> Status : ✅ Toutes les itérations livrées

## Récap par phase

### Phase A — i18n foundation (iter 1-5)
Préparation à l'internationalisation sans dépendance externe.

| # | Livrable | Impact |
|---|---|---|
| 1 | `lib/i18n.ts` + dictionnaires FR/EN/ES/PT (160 clés × 4) | Base de toutes les traductions |
| 2 | `LocaleProvider` + `LocaleSwitcher` (drapeau header) | Détection auto + persistance localStorage |
| 3 | Hero traduit | Première impression localisée |
| 4 | Filters traduits | Filtres dans la langue de l'user |
| 5 | QuickActions traduits | CTAs principaux localisés |

### Phase B — Nouveaux pays (iter 6-12)
Couverture européenne et marocaine de marchés à forte demande surf.

| # | Pays | Spots | Highlights |
|---|---|---:|---|
| 6 | 🇪🇸 Pays basque ES + Cantabrie | +20 | Mundaka, Sopelana, Zarautz, Liencres, Somo |
| 7 | 🇪🇸 Asturies / Galice / Andalousie | +15 | Pantín (WSL), El Palmar, Los Caños |
| 8 | 🌋 Canaries | +19 | El Quemao, La Santa, El Confital, Famara |
| 9 | 🇵🇹 Portugal Norte + Centro | +18 | Supertubos, Ribeira d'Ilhas, Nazaré N (big wave) |
| 10 | 🇵🇹 Portugal Lisbonne + Algarve + Iles | +22 | Guincho, Arrifana, Açores, Madère |
| 11 | 🇲🇦 Maroc | +19 | Anchor Point, Imsouane Bay, Safi, Boilers |
| 12 | 🇬🇧 UK + 🇮🇪 Irlande | +25 | Fistral, Thurso East, Lahinch, Mullaghmore |

**Total : +137 spots → 395 spots, 6 pays, 13 régions**

### Phase C — Revenue infrastructure (iter 13-20)
Pose toutes les fondations pour faire de l'argent sans changer de stack.

| # | Livrable | Impact métier |
|---|---|---|
| 13 | PWA manifest + `InstallPrompt` | Une app installée = ouverte 3× plus → +200% DAU/MAU |
| 14-15 | `EmailCapture` (newsletter + premium waitlist) | Lead gen sans backend, fallback localStorage |
| 16 | `AffiliatePanel` + `lib/affiliates.ts` | Revenu hors-pub : Booking, Decathlon, écoles |
| 17 | `lib/analytics.ts` + `AnalyticsScripts.tsx` | Plausible + GA4 conditionnels (privacy-first) |
| 18 | `trackEvent` câblé sur conversions clés | spot_modal_open, share, favorite, affiliate_click |
| 19 | `PremiumTeaser` Yosurf+ modal | Capture demande latente pour service payant futur |
| 20 | `.env.local.example` complet | Toutes les variables documentées pour onboarding rapide |

### Phase D — UX mobile (iter 21-26)
Polish ciblé sur l'expérience tactile.

| # | Livrable |
|---|---|
| 21 | `BackToTop` FAB mobile au-delà de 600px |
| 22 | Swipe gauche/droite dans le modal pour changer de jour |
| 23 | `lib/countries.ts` — mapping region → pays |
| 24 | Chips pays au-dessus des chips région (filtre 2-niveaux) |
| 25 | `EmptyState` avec personnalité + suggestions aléatoires |
| 26 | preconnect/dns-prefetch pour Unsplash, Open-Meteo, Plausible |

### Phase E — Polish & growth (iter 27-30)

| # | Livrable |
|---|---|
| 27 | README v2 mis à jour (395 spots, 6 pays, i18n) |
| 28 | hreflang tags (fr-FR, en, es-ES, pt-PT, x-default) |
| 29 | Brief commercial v2 actualisé |
| 30 | Changelog de référence (ce fichier) |

## Métriques techniques v2

| Indicateur | v1 | v2 |
|---|---:|---:|
| **Spots** | 258 | 395 |
| **Pays** | 1 | 6 |
| **Régions** | 7 | 13 |
| **Langues UI prêtes** | 1 | 4 |
| **Pages statiques générées** | 280+ | 470+ |
| **OG images dynamiques** | 1 + 258 | 1 + 395 |
| **`llms.txt` pages** | 7 + 258 | 13 + 395 |
| **Composants** | ~25 | ~33 |
| **Lignes de code (lib + components)** | ~3 500 | ~5 200 |

## Prochaines étapes recommandées

### Court terme (3 mois)
1. Acheter `yosurf.fr` et déployer
2. Submit AdSense, Plausible, Funding Choices CMP
3. Wire `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` à Buttondown ou Brevo
4. Submit sitemap Google Search Console + Bing Webmaster
5. Tester PWA install sur iOS/Android
6. Lancer la publication des liens affiliés Booking.com (taggés)

### Moyen terme (3-9 mois)
1. Migration vers next-intl avec routing `/en /es /pt`
2. Ajouter `/country/[code]` SEO pages (FR.fr, ES.fr, etc.)
3. Backend pour Yosurf+ (Stripe + backend léger)
4. Web Push notifications (alertes houle)
5. Carte interactive (Mapbox / MapLibre)
6. Ajouter marées (SHOM France, WorldTides ailleurs)

### Long terme (12+ mois)
1. App native iOS/Android via Capacitor ou React Native
2. Ouverture autres marchés (Indonésie, USA, Australie)
3. Communauté UGC (commentaires, photos de session)
4. Module B2B pour les écoles de surf (white-label)
