# Yosurf — 15 itérations Phase 2 (tide, DOM-TOM, i18n bouées, perf)

Suite des feedbacks expert + utilisateur. Build vert, 416 spot pages SSG.

## Bloc Marée — l'insight expert clé

### Iter 1 — Marée via Open-Meteo Marine API
- Ajout `sea_level_height_msl` à l'URL marine
- `HourlyData.tideHeight` typé + propagé
- `DaySummary.tideExtremes` (HW/LW détectés) + `tideRange` (amplitude jour)
- Helpers `detectTideExtremes`, `tideRangeForDay`, `tideStateAt` dans `lib/tide.ts`

### Iter 2 — Préférence marée par spot
- `Spot.tideOptimal: "rising" | "falling" | "high" | "mid-high" | "mid" | "mid-low" | "low" | "any"`
- Map `TIDE_PREFERENCES` peuple ~40 spots clés (Lacanau mid-low, Anglet mid, Belharra high, Mundaka mid, Anchor Point mid-high…)

### Iter 3 — Marée comme 5ème critère du score
- `tideMatchScore(state, optimal)` → 0..1
- `computeScore` accepte `{ tideState, tideOptimal }`
- Pondération adaptative : si tide connu, **30/20/20/15/15** (wave/period/wind/power/tide). Sinon **35/25/25/15** (rétro-compatible — pas de dilution sur le daily summary).
- Hourly scores recalculés avec `tideStateAt(hTide, idx)` → best-window s'aligne sur la marée

### Iter 4 — Tide curve dans modal
- Sparkline SVG sous le HourGrid : courbe lissée + markers HW/LW + bande daylight
- Curseur synchronisé avec l'heure sélectionnée
- Tile "Marée" dans HourDetail (état + hauteur)
- Badge "marée idéale" quand l'heure matche `tideOptimal`
- 5ème tile "Marée" dans SpotDetailClient (2 prochains extrêmes)

### Iter 5 — Best window tide-aware
- Pill "sur marée montante/haute/…" à droite du titre "Meilleur créneau"
- Calcul à partir de l'index `bestWindow.start` + `tideStateAt`

## Bloc Géographie & i18n

### Iter 6 — Rename Côte d'Argent → Aquitaine
- Label changé partout (`Region` union, `REGIONS`, `REGION_EMOJI`, gradients, OG image, country map, affiliates)
- **Slug `cote-d-argent` préservé** pour continuité SEO et préservation des backlinks (commenté dans `lib/seo.ts`)
- Mention historique gardée dans la copy SEO

### Iter 7 — Spots DOM-TOM
- Nouvelle région `Outre-Mer` (🌺) ajoutée à l'union, à `REGION_COUNTRY` (FR), aux gradients, à `REGION_SEO_COPY`, aux affiliates
- **21 spots ajoutés** :
  - Réunion : Saint-Leu (worldclass), Gauche inside, Trois-Bassins, Boucan-Canot, Souris Blanche, Saint-Pierre
  - Guadeloupe : Le Souffleur (worldclass), Anse-Bertrand, Le Moule, Port-Louis school, Petit Havre
  - Martinique : Tartane Anse-Bonneville, Baie du Galion, Le Diamant
  - Tahiti : Teahupo'o (worldclass), Papenoo, Papara, Matavai
  - Mayotte : N'Gouja
  - Nouvelle-Calédonie : Ouano, Île des Pins

### Iter 8 — i18n /bouees page
- 45 nouvelles clés `buoys*` dans `fr/en/es/pt`
- `app/bouees/page.tsx` migré vers `getServerLocale()` + `t()`
- `BuoyDashboard` utilise `useLocale()`, traduit colonnes, filtres, statuts (Live/Partiel/Ancien/Offline), zones, vue mobile
- Helper `areaLabel` pour traduire `Atlantique/Manche/Méditerranée/International`

### Iter 9 — i18n BuoyMiniPanel
- Titre auto-i18n selon présence `lat/lon` : "près de toi" vs "à surveiller"
- "Tout voir →" traduit
- Spot detail page passe `title={t(locale, "buoysMiniNearestSpot")}`

## Bloc UX & perf

### Iter 10 — Geo non-blocking + IP fallback Vercel
- Nouveau `/api/geo` (edge runtime) lit `x-vercel-ip-latitude/longitude/city/country`
- `HomeContent` appelle `/api/geo` au mount, set `userPos` sans permission dialog
- Le bouton "Près de moi" reste pour upgrade vers geo browser précise
- Cache 5 min, dégradation silencieuse en local

### Iter 11 — JSON-LD Dataset sur fiche spot
- Ajout d'un nœud `@type: Dataset` au `@graph` schema.org
- Liste `variableMeasured` (wave height, effective set, wave power, period, wind, tide state, score 0-100)
- Distribution JSON + Markdown (`/api/forecast/[slug]` + `llms.txt`)
- `spatialCoverage.geo` avec coordonnées du spot
- Help AI search & LLM crawlers comprendre que la page est mise à jour programmatically

### Iter 12 — OG image enrichie
- Tile Puissance ajoutée (4 conditions au lieu de 3)
- Chip `tideOptimal` quand le spot a une préférence marée
- Chip "sets ~X m" quand `effectiveWaveHeight > waveHeight + 0.1`
- Sharing impact : on voit en un coup d'œil pourquoi le spot est noté X

### Iter 13 — Tide badge sur SpotCard
- Petit chip "marée haute 14h32" affichant la prochaine marée pivot
- Couleur lagoon pour cohérence visuelle avec la palette eau

### Iter 14 — Code-split BuoyMiniPanel + loading.tsx
- `BuoyMiniPanel` chargé via `next/dynamic` (ssr off + skeleton) → hors du bundle initial home
- `app/bouees/loading.tsx` skeleton route-level pour navigation perçue instantanée

### Iter 15 — Polish + build + commit
- Tous les `tsc --noEmit` passent
- Build prod clean (416 spot pages SSG, 102 KB shared JS)
- Changelog ci-présent

## Stats finales
- **416 spots** couverts (395 + 21 DOM-TOM)
- **14 régions** (incl. Outre-Mer)
- **6 pays** (FR/ES/PT/MA/UK/IE) + territoires français d'outre-mer
- **4 langues** complètes (FR/EN/ES/PT) sur 45+ clés bouées supplémentaires
- **5 critères** dans le score (wave 30 / period 20 / wind 20 / power 15 / tide 15)
- **27 spots world-class** verrouillés débutant/intermédiaire
