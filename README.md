# 🏄 Yosurf

> _yo, ta vague est prête._

Yosurf est la carte vivante des vagues françaises. 231 spots de la Côte d'Opale à la Corse, score de session quotidien, meilleur créneau du jour, vagues, houle et vent — gratuit, sans compte, sans pub intrusive.

Stack : **Next.js 15 (App Router) + TypeScript + Tailwind CSS**. Données : **[Open-Meteo](https://open-meteo.com)** (gratuit, sans clé API).

---

## 🚀 Déploiement sur Vercel (5 minutes)

### Option A — Depuis l'interface Vercel (le plus simple)

1. Pousse le dossier sur un repo GitHub (ou GitLab/Bitbucket).
2. Va sur [vercel.com/new](https://vercel.com/new), connecte ton repo.
3. Vercel détecte automatiquement Next.js. Clique **Deploy**.
4. Une fois déployé, ajoute ton domaine dans **Settings → Domains**.

### Option B — Avec la CLI Vercel

```bash
npm i -g vercel
cd surf
vercel        # déploiement preview
vercel --prod # déploiement production
```

### Variables d'environnement à définir dans Vercel

| Variable | Valeur exemple | Quand |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://ousurfer.fr` | Dès que tu as ton domaine (sitemap + canonicals) |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | `ca-pub-XXXXXXXXXXXXXXXX` | Dès que le site est ajouté dans AdSense |
| `NEXT_PUBLIC_ADSENSE_SLOT_IN_FEED` | `1234567890` | Après création du bloc in-feed |
| `NEXT_PUBLIC_ADSENSE_SLOT_SPOT_DETAIL` | `1234567890` | Après création du bloc page spot |

---

## 🧑‍💻 Dev local

```bash
npm install
npm run dev
# http://localhost:3000
```

---

## 📁 Structure

```
app/                  Routes Next.js (App Router)
├── layout.tsx        Layout racine (fonts, metadata, CookieBanner)
├── page.tsx          Accueil (Hero + grille de spots)
├── spot/[slug]/      Page SEO par spot (générée statiquement)
├── mentions-legales/
├── politique-confidentialite/
├── sitemap.ts        Sitemap auto pour Google
└── robots.ts         robots.txt auto

components/           UI components
├── Hero, Header, Footer
├── Filters           Chips de filtres (jour, région, niveau, recherche, géoloc)
├── SpotCard          Carte d'un spot dans la grille
├── SpotModal         Modal avec détail horaire au clic
├── HourGrid          Grille des 24h avec scores
├── AdSlot            Emplacement publicité (placeholder ou AdSense)
└── CookieBanner      Consentement RGPD

lib/
├── spots.ts          Catalogue de 231 spots français avec coordonnées + descriptions
├── api.ts            Fetch Open-Meteo (vagues + vent) + scoring horaire
├── score.ts          Score 0-100, adapté au niveau du surfeur
└── utils.ts          Helpers (distance, formatage, etc.)
```

---

## 💰 Monétisation publicitaire — checklist

L'app est **prête pour la publicité** au niveau code. Reste à faire côté business :

### 1. Domaine + hébergement
- [x] Hébergement Vercel
- [ ] Domaine propre (.fr de préférence) — indispensable pour AdSense

### 2. Régie publicitaire
**Trois options selon ton trafic :**

| Régie | Seuil minimum | CPM moyen | Validation |
|---|---|---|---|
| **Google AdSense** | Aucun | 0,50 – 2 € | 2 à 4 semaines |
| **Ezoic** | ~10 000 visites/mois | 4 – 8 € | Quelques jours |
| **Mediavine** | 50 000 sessions/mois | 8 – 25 € | Premium |

**Recommandation** : démarrer avec **AdSense**, basculer sur Ezoic quand tu atteins 10 k visites/mois.

### 3. Une fois AdSense validé
- [ ] Ajoute `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXX...` dans Vercel
- [ ] Crée tes blocs publicitaires dans la console AdSense, récupère les `slot` IDs
- [ ] Ajoute `NEXT_PUBLIC_ADSENSE_SLOT_IN_FEED` et `NEXT_PUBLIC_ADSENSE_SLOT_SPOT_DETAIL` dans Vercel
- [ ] Vérifie `https://ton-domaine.fr/ads.txt` après déploiement
- [ ] Active les annonces automatiques dans AdSense si tu veux que Google teste d'autres emplacements

### 4. Conformité RGPD (obligatoire en France)
- [ ] **À faire dans AdSense** : activer un message RGPD via **Confidentialité et messages** ou installer une **CMP certifiée Google / IAB TCF v2.2**
- [x] Politique de confidentialité (à compléter avec ton nom/contact)
- [x] Mentions légales (à compléter)

### 5. SEO pour générer du trafic gratuit
- [x] Pages par spot (`/spot/hossegor`, etc.) avec metadata + JSON-LD
- [x] Sitemap automatique
- [x] robots.txt
- [ ] **À faire** : ajouter le site dans [Google Search Console](https://search.google.com/search-console), soumettre `sitemap.xml`
- [ ] **À faire** : Google Analytics 4 (ajouter le tag dans `layout.tsx`)
- [ ] **Idée** : ajouter un blog (`/blog/...`) — articles "Meilleurs spots du Pays Basque", "Comment débuter le surf à Lacanau", etc. → énorme levier de SEO

### 6. Pour booster les revenus
- Densifier les fiches spots (ajouter écoles de surf, campings à proximité — affiliation possible)
- Newsletter (Buttondown / Brevo) avec les meilleures sessions du week-end
- Ajouter des spots Espagne / Portugal pour les voyageurs

---

## 🔧 Maintenance / améliorations futures

Pistes par ordre d'impact :
1. **Vue carte de France** — Mapbox ou Leaflet
2. **Marées** — API SHOM ou WorldTides
3. **Alertes mail/push** — "Houle prévue samedi à Hossegor"
4. **PWA** — installation sur écran d'accueil mobile
5. **Photos par spot** — Unsplash API ou upload via Cloudinary
6. **Multilangue** — anglais pour les touristes

---

## ⚖️ Licence des données

Données Open-Meteo en CC BY 4.0. Le code de l'app est sous licence à définir (MIT recommandé).
