# Yosurf — Roadmap macro

> _yo, ta vague est prête._
>
> Roadmap fonctionnelle (macro features), pas un backlog ticket par ticket.

**Statuts** : ✅ livré · 🔄 en cours · ⏳ planifié · 💡 idée à valider

---

## 🏁 Phase 0 — Socle (✅ livré)

| Feature | Description | Statut |
|---|---|---|
| **Catalogue 395 spots** | France (285), Espagne (38), Canaries (19), Portugal (40), Maroc (19), UK (15), Irlande (10) | ✅ |
| **Score de session 0-100** | Hauteur de vague (40%) + Période (30%) + Vent (30%, bonus offshore) | ✅ |
| **3 niveaux** | Débutant, Intermédiaire, Confirmé — pondérations spécifiques | ✅ |
| **7 jours / 24h horaires** | Daily summary + détail heure par heure | ✅ |
| **Meilleur créneau du jour** | Fenêtre 3h optimale dans le jour | ✅ |
| **Cache server-side** | API route `/api/forecasts` + edge cache 30 min Vercel | ✅ |
| **i18n FR / EN / ES / PT** | Locale switcher, dictionnaire 200+ clés × 4 langues | ✅ |
| **PWA installable** | Manifest + install prompt | ✅ |
| **Favoris / streak / explorés** | Hook Model côté psy (Eyal) | ✅ |
| **OG cards dynamiques** | Image par spot pour partage social | ✅ |
| **AI / SEO** | `llms.txt` + JSON-LD + FAQ schema + pages régionales | ✅ |
| **Mobile filter UX** | Bottom sheet + sticky day picker compact | ✅ |
| **Yosurf+ waitlist** | Capture leads pour futur abonnement | ✅ |
| **Affiliation infra** | Slots Booking.com & co prêts par région | ✅ |
| **Analytics layer** | Plausible + GA4 conditionnels, 14 events trackés | ✅ |

---

## 🎯 Phase 1 — Quick wins (⏳ priorité immédiate)

> Effort total ~10h de dev, 0 € de coût récurrent. Impact UX/data immédiat.

### 1.1 Rename "Côte d'Argent" → "Aquitaine" ⏳
- Convention plus reconnue par les surfeurs (Aquitaine = la région administrative)
- Rename type, REGIONS, slugs URL, SEO copy, traductions 4 langues
- **Effort** : 30 min

### 1.2 5ème critère : puissance de la houle (kW/m) ✅
- Calcul pur, dérivé de hauteur² × période (`P ≈ 0.49 × H² × T` kW/m)
- Pas d'API supplémentaire
- Pondéré dans `computeScore()` comme proxy de la « tenue » de la vague
- **Effort** : 30 min

### 1.3 Période > 9s = amplifier les sets ✅
- Au-dessus de 9s, sets ~15-20% plus gros que la moyenne (insight expert)
- Algorithme : `effectiveHeight = wave × (1 + 0.175 × (period - 9))` si period > 9
- **Seuils hard caps** :
  - Débutant : interdit > 1.2m + 10s (effective ~1.4m)
  - Intermédiaire : interdit > 1.5m + 12s (effective ~2.3m) → marker « surf engagé »
- **Effort** : 1h

### 1.4 Lock spots world-class ✅
- Champ `worldClass: true` sur ~25 spots (La Gravière, Belharra, Mundaka, Coxos, Anchor Point, Teahupoo, etc.)
- **Jamais affichés** quand level = débutant ou intermédiaire
- Préserve la sécurité + le localisme
- **Effort** : 1h

### 1.5 Géoloc auto + Hot spot ≤ 50 km 🔄
- Prompt geo non-bloquant à la 1ère visite (post-scroll, comme onboarding)
- Fallback Vercel `request.geo` (IP-based, gratuit, déjà disponible)
- HotToday filtre les spots dans rayon 50 km du user avant de sélectionner le top
- Un Français ne se voit JAMAIS proposer Mundaka comme « hot spot du jour »
- ✅ fait : HotToday devient local dès que la géoloc utilisateur est disponible, WeekHighlights se localise à 120 km, et les spots world-class sont exclus hors niveau confirmé.
- ⏳ reste : prompt géoloc automatique post-scroll + fallback IP Vercel.
- **Effort** : 2h

### 1.6 DOM-TOM ⏳
- Open-Meteo couvre mondialement (modèle global 25 km)
- 3 nouvelles régions : **Caraïbes**, **Océan Indien**, **Pacifique Sud**
- ~30-50 spots à curer :
  - 🌴 Réunion : Saint-Leu, Saint-Pierre, Trois-Bassins (⚠️ avertissement requins)
  - 🇬🇵 Guadeloupe : Le Moule, Grande Anse, Anse Bertrand
  - 🇲🇶 Martinique : Tartane, Anse Bonneville, Pointe Faula
  - 🇳🇨 Nouvelle-Calédonie : Poé, Bourail, Ouano
  - 🇵🇫 Polynésie : Teahupoo, Papara, Sapinus, Papenoo, Taapuna, Haapiti
- **Effort** : 4h

---

## 🌊 Phase 2 — Marée (insight expert, différenciation forte)

> Le meilleur créneau **doit** tenir compte de la marée. Certains spots ne marchent qu'à mi-marée descendante. C'est l'un des facteurs les plus déterminants en surf.

### 2.1 Intégration données de marée ⏳
- **Source recommandée** : WorldTides API (~10 €/mois, 1000 req/jour)
- Alternative gratuite FR : SHOM (scrape, instable)
- Cache server-side 24h (les marées ne changent pas)
- Étendre `DaySummary` avec `tides: { highTimes[], lowTimes[], currentLevel }`
- **Effort** : 6h + 10 €/mois

### 2.2 Indicateur marée dans le meilleur créneau ⏳
- Afficher dans le modal et la card : « ↗ marée montante » / « ↘ marée descendante » / « ↕ mi-marée » à l'heure du best window
- Phase 1 : juste afficher la donnée
- **Effort** : 2h

### 2.3 Scoring tide-aware (long terme) 💡
- Ajouter `tideOptimal?: "rising" | "falling" | "mid" | "high" | "low" | "any"` au type `Spot`
- Bonus de score ±10 pts quand la marée actuelle matche la préférence du spot
- **Donnée expert nécessaire** : renseigner les ~50 spots les plus importants en v1
  - Crowdsourcing futur : « Tu connais ce spot ? Vote pour la marée idéale »
- **Effort code** : 2h
- **Effort data** : énorme (manuel) → roadmap continue

---

## 📊 Phase 3 — Page bouées live (LE différenciateur produit)

> **Insight expert clé** : Cet outil n'existe nulle part. Aujourd'hui, pour avoir les vraies données de bouées en France, il faut aller sur Data.Gouv.fr ou les sites SHOM/CANDHIS et cliquer bouée par bouée. Personne n'a fait l'**agrégation en un seul tableau**. C'est un vrai trou de marché.

### 3.1 Source de données ✅

**Plan A — Data.Gouv.fr / CANDHIS (FR uniquement, gratuit)**
- CANDHIS = Centre d'Archivage National de Données de Houle In-Situ (CEREMA / SHOM)
- ~10-20 bouées exploitables sur les côtes françaises
- Distribution : web (à scraper) + datasets data.gouv.fr (à confirmer si live ou batch)
- ⚠️ À vérifier la disponibilité temps réel et la stabilité de l'API/scrape

**Plan B — NOAA NDBC (international, gratuit, simple)**
- 10-15 bouées atlantiques larges pertinentes pour la France
- API REST stable
- Couvre les hauteurs/périodes/orientations + vent

**Plan C — Copernicus Marine (Europe, gratuit avec compte)**
- Format NetCDF, complexe
- Couverture européenne officielle

**Recommandation** : démarrer par CANDHIS (FR) + NOAA (atlantique large) → vraie data FR + cohérence avec le catalogue.

### 3.2 Page `/bouees` — Tableau global ✅

**LE produit qui n'existe pas** : tableau récap en direct, **toutes les bouées d'un coup**.

```
┌──────────────────────────────────────────────────────────────┐
│ Région : [Atlantique] [Manche] [Med] [Toutes]                 │
├──────────────────────────────────────────────────────────────┤
│ Bouée          | H moy | H max | H min | Période | Dir | Vent | Relevé │
├────────────────┼───────┼───────┼───────┼─────────┼─────┼──────┼────────┤
│ Anglet (62002) | 1.4 m | 2.1 m | 0.9 m | 11 s    | NO  | 12 N | 14h05  │
│ Cap Ferret     | 1.6 m | 2.4 m | 1.0 m | 13 s    | O   | 8 SO | 14h00  │
│ Belle-Île      | 2.1 m | 3.2 m | 1.4 m | 12 s    | NO  | 18 O | 13h55  │
│ Capbreton      | ...   | ...   | ...   | ...     | ... | ...  | 14h02  │
│ Six-Fours      | 0.4 m | 0.6 m | 0.2 m | 5 s     | SE  | 5 SE | 14h10  │
└──────────────────────────────────────────────────────────────┘
```

Filtrable par région française. Tri sur n'importe quelle colonne.

**Effort** : 1-2 jours

### 3.3 Module « bouées proches » sur la home ✅
- Si géoloc OK, top 2-3 bouées les plus proches affichées
- Card compacte : hauteur moy / max / min / période / orientation / vent / dernier relevé
- Lien vers `/bouees` pour tout voir
- **Effort** : 4h

### 3.4 Bouée associée à chaque spot ✅
- Sur la fiche `/spot/[slug]`, dans l'aside : **« Bouée la plus proche : Anglet 62002 »** + données live
- Permet de croiser **prévision modélisée** (Open-Meteo) vs **mesure réelle** (bouée)
- **Effort** : 2h

### 3.5 Historique / graphes (long terme) 💡
- Graphe 24h des hauteurs sur chaque bouée
- Comparaison prévision vs réalité (calibration de la confiance dans le modèle)

---

## 💰 Phase 4 — Monétisation effective

### 4.1 Validation AdSense ⏳
- Domaine custom (`yosurf.fr`) obligatoire
- Soumission, attente validation 2-4 sem
- Une fois OK : remplir `NEXT_PUBLIC_ADSENSE_CLIENT` + slot IDs dans Vercel

### 4.2 Affiliation Booking.com ⏳
- S'inscrire au Booking Affiliate Partner
- Remplacer les URLs stub dans `lib/affiliates.ts` par les URLs taggées
- ~10-15% de commission par réservation

### 4.3 Newsletter Buttondown / Brevo ⏳
- Wire `NEXT_PUBLIC_NEWSLETTER_ENDPOINT`
- Digest hebdo : « Top 5 sessions à venir près de chez toi »
- Capture déjà en place via `<EmailCapture />`

### 4.4 Funding Choices CMP ⏳
- CMP Google gratuit, conforme IAB TCF v2.2
- Requis pour AdSense en EU
- Remplace le CookieBanner maison

---

## 🚀 Phase 5 — Yosurf+ Premium (long terme)

> Capture déjà active via le teaser dans le footer.

### 5.1 Web Push notifications 💡
- Service Worker + Web Push API
- « Houle d'exception J-2 à Hossegor (87/100) »
- Frequency cap : max 1 alerte/jour par user

### 5.2 Prévisions 15 jours 💡
- Open-Meteo donne jusqu'à 16 jours (free tier)
- Affichage différencié (confiance plus faible J+8 à J+14)

### 5.3 Marées détaillées 💡
- Heure pleine mer / basse mer par spot avec graphe horaire
- Dépend de la phase 2 (intégration marées)

### 5.4 Pas de pub 💡
- Désactiver l'affichage AdSense pour les abonnés
- Compense la perte de revenu pub par l'abonnement direct

### 5.5 Tarification 💡
- **2,99 €/mois** ou **24 €/an** (économie 8 €)
- Trial 14 jours
- Stripe + backend léger (Vercel Postgres)

---

## 🌍 Phase 6 — Expansion géographique

### 6.1 Pays prioritaires (déjà partiellement couverts) ✅⏳
- ✅ Maroc (19 spots) → enrichir à 30+ (Imsouane détaillé, Sidi Kaouki, Boilers cluster)
- ✅ Canaries (19) → enrichir Fuerteventura sud + La Palma + La Gomera
- ✅ Açores / Madère → enrichir avec spots secondaires

### 6.2 Nouveaux marchés ⏳
- 🇮🇹 Italie (Sardaigne, Toscane) — ~30 spots
- 🇳🇱 Pays-Bas (Scheveningen, Zandvoort) — ~10 spots
- 🇧🇪 Belgique (De Panne, Knokke) — ~5 spots
- 🇮🇸 Islande (rare mais cool) — ~10 spots

### 6.3 Marchés majeurs (effort significatif) 💡
- 🇺🇸 USA East/West Coast (~500 spots, marché énorme)
- 🇦🇺 Australie (~300 spots)
- 🇮🇩 Indonésie (Bali, Mentawai, ~200 spots)
- 🇨🇷 Costa Rica (Tamarindo, Nosara, ~30 spots)

---

## 🛠 Phase 7 — Tech debt & infra

### 7.1 Migration vers next-intl ⏳
- Routes localisées `/en/`, `/es/`, `/pt/`
- hreflang propre pointant vers vraies URLs
- Améliore le SEO long-tail multilingue

### 7.2 Carte interactive ⏳
- Mapbox ou MapLibre (gratuit jusqu'à 50k loads/mois)
- Vue carte de France avec tous les spots
- Click → modal
- Filtres carte/liste switchables

### 7.3 Backend léger ⏳
- Vercel Postgres ou Supabase (~25 €/mois)
- Pour Yosurf+ (users, abonnements, push subscriptions)
- Pour UGC futur (commentaires, photos)

### 7.4 Photos par spot 💡
- Unsplash API ou Cloudinary
- Hero photo par spot (au lieu de gradient régional)
- Upload utilisateur futur

---

## 📱 Phase 8 — Mobile native (très long terme)

### 8.1 App iOS / Android via Capacitor 💡
- Réutilise tout le code Next.js existant
- Distribution App Store / Play Store
- Push notifications natives

### 8.2 Apple Watch / WearOS 💡
- Glance : score du spot favori + meilleur créneau
- Notification « tu peux aller surfer dans 1h »

---

## 🎯 Priorités stratégiques

### Ordre d'attaque recommandé (par ratio valeur / effort)

```
M1   ┌─ Phase 1.1-1.5 (Quick wins) ─────────── 10h dev ──── 0€
     └─ Phase 4.1-4.2 (AdSense + Booking) ──── side task ── 0€
        
M2   ┌─ Phase 1.6 (DOM-TOM) ───────────────── 4h dev ───── 0€
     └─ Phase 2.1-2.2 (Marée data + indic) ── 8h dev ───── 10€/mo
        
M3   ┌─ Phase 3.1-3.2 (Bouées + tableau) ──── 2-3j dev ─── 0€
     └─ Phase 4.3 (Newsletter active) ──────── 2h dev ───── 0€
        
M4   ┌─ Phase 2.3 (Scoring marée top 50) ──── 2h + curation ───
     └─ Phase 3.3-3.4 (Bouées intégrées) ──── 6h dev ─────

M6+  └─ Yosurf+ + carte + expansion ──────── multi-mois ──
```

### Le différenciateur produit clé

D'après l'expert :

> **« La page bouées live, elle n'existe nulle part. »**

C'est **Phase 3** — l'agrégation en un tableau unique des bouées CANDHIS françaises. C'est un outil qui aurait sa place sur la home même de surfeurs avancés, et qui justifierait à lui seul un bookmark/PWA install.

Combiné avec l'i18n et la couverture européenne déjà en place, Yosurf devient un produit unique au monde sur ce créneau.

---

## 📝 Critères "definition of done" par feature

Pour chaque feature livrée :
- ✅ Build clean (TypeScript strict, pas de warning)
- ✅ Test mobile sur vraies tailles iPhone (375px / 390px)
- ✅ Test desktop ≥ 1024px
- ✅ Traduit dans les 4 langues
- ✅ Tracking event ajouté dans `lib/analytics.ts` si interaction user
- ✅ SEO : si nouvelle page, ajouter au sitemap + canonical + OG image
- ✅ Cache : si appel externe, edge cache 30 min minimum
- ✅ Commit message clair (`feat:` / `fix:` / `i18n:` / `perf:` / `ux:`)

---

## 🔁 Cycle de release

Pas de cycle formel. Push direct sur `main` → Vercel deploy auto. Le VersionWatcher prévient les utilisateurs au prochain refresh d'onglet.

Pour les features risquées (refonte UI majeure, nouvelle API) : preview deployment Vercel + test interne avant merge sur main.
