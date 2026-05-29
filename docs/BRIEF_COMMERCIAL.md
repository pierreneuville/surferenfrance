# Yosurf — Brief commercial & marketing

> _yo, ta vague est prête._

**Yosurf** est la carte vivante des vagues, conçue pour rendre la prévision de surf belle, instantanée et gratuite. Lancement initial **France métropolitaine + Corse (258 spots)**. Roadmap d'expansion : **Espagne (~250 spots) puis Portugal (~200 spots)** sur les 12 prochains mois.

---

## 1. Executive summary

| | |
|---|---|
| **Nom** | Yosurf |
| **URL prod** | yosurf.fr *(à acquérir)* — actuellement `surferenfrance.vercel.app` |
| **Stack** | Next.js 15 + TypeScript + Tailwind, hébergement Vercel, données Open-Meteo (gratuit, CC BY 4.0) |
| **Couverture v1** | 258 spots, 7 régions du littoral français + Corse |
| **Modèle** | Free-to-use, monétisation publicitaire (AdSense → Ezoic) + affiliation |
| **Différenciation** | UX mobile-first, score adapté au niveau, gratuit sans compte, esthétique forte (« la Magicseaweed qui aurait survécu, en plus jolie ») |
| **Stade** | MVP en production, monétisation pré-validation |
| **Investissement v1** | < 100 € (domaine + Vercel free tier) |

---

## 2. Le produit

### Promesse utilisateur
En 3 tapes, le surfeur sait :
1. **Où** surfer aujourd'hui (carte + filtres par région, niveau, distance)
2. **À quelle heure** (meilleur créneau du jour calculé sur 24h)
3. **Quelle est l'ambiance** (score 0-100 adapté à son niveau)

### Mécaniques clés livrées
- **Score de session 0-100** combinant hauteur de vague, période, vent (offshore bonus)
- **Adaptation par niveau** (débutant / intermédiaire / confirmé)
- **Meilleur créneau du jour** (fenêtre de 3h optimale)
- **"Cette semaine en mer"** — top 6 sessions à venir
- **"Hot today"** — variable reward sur le spot du jour
- **Favoris persistants** (localStorage, pas de compte requis)
- **Streak quotidien + spots explorés** (engagement habituel)
- **Onboarding différé** (3 spots suggérés par géoloc à la 1re visite)
- **Pages SEO par spot** + pages régionales + index
- **Open Graph dynamique** par spot (partage WhatsApp/Slack/iMessage gorgeous)
- **`llms.txt`** par spot et par région (visibilité dans ChatGPT, Claude, Perplexity)

### Stack technique
- Next.js 15 App Router → SSG natif pour SEO
- API Route + edge cache 30 min → résiste au pic de trafic (1 fetch Open-Meteo / 30 min partagé entre tous les visiteurs)
- Build : 280+ pages statiques pré-rendues
- Lighthouse cible : 95+ Performance, 100 SEO

---

## 3. Marché & cible

### Taille du marché surf

| Pays | Pratiquants surf (réguliers) | Pratiquants surf (occasionnels + intéressés) | Notes |
|---|---:|---:|---|
| 🇫🇷 France | ~500 000 | ~1,5 M | FFS estime 200k licenciés en surf-école |
| 🇪🇸 Espagne | ~350 000 | ~1 M | Cantabrique + Andalousie + Canaries |
| 🇵🇹 Portugal | ~250 000 | ~800k | Ericeira WSR, Algarve, Norte |
| **Total cible FR/ES/PT** | **~1,1 M** | **~3,3 M** | |

### Personas
1. **Le local engagé** (40% de l'usage) — surfe 1-3×/semaine, consulte les prévisions tous les jours. Cherche la consistance et la rapidité. *Prêt à partager une bonne find.*
2. **Le surfeur intermittent** (35%) — surfe 5-10×/an, principalement vacances et week-ends. Cherche un spot facile + des conditions OK. *Découvre Yosurf via Google.*
3. **Le wave hunter / voyageur** (15%) — planifie ses séjours surf, compare 10+ spots. *Levier fort : pages régionales + `/spots` indexées.*
4. **Le débutant + l'école** (10%) — niveau débutant filtré, cherche des conditions douces. *Levier affiliation : écoles, campings.*

### Saisonnalité
- **Mai-août** : pic touristes (FR), trafic explose sur Côte d'Argent et Pays Basque
- **Septembre-novembre** : pic surfeurs locaux (meilleures conditions Atlantique)
- **Décembre-mars** : Méditerranée + Maroc + Canaries (audience qui voyage)

---

## 4. Positionnement & différenciation

### One-liner
> **« Yosurf, c'est Magicseaweed sans la pub envahissante, en plus joli. »**

### Tableau de positionnement

| | Yosurf | Surfline | Windguru | Windy.com | Windfinder | Magicseaweed |
|---|---|---|---|---|---|---|
| **Prix** | Gratuit | 100 €/an | Gratuit + payant | Gratuit | Freemium | _† mort 2023_ |
| **UX mobile** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | — |
| **Score session** | ✅ Adapté niveau | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Multi-langue** | FR (puis ES/PT) | EN | Multi | Multi | Multi | EN |
| **Communauté** | À construire | ✅ photos pros | ❌ | ❌ | ❌ | ✅ legacy |
| **Esthétique** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | — |

### Notre moat
1. **L'effet Magicseaweed** — un trou de marché béant depuis 2023 pour les surfeurs cherchant « simple + gratuit + beau »
2. **Mobile-first natif** — la plupart des concurrents ont des UX desktop bricolées sur mobile
3. **Voix de marque distinctive** — le « Yo » casual + script Caveat = identité visuelle mémorable (von Restorff effect)
4. **AI-first SEO** — `llms.txt` deployés dès J1 = présence dans les réponses ChatGPT/Claude/Perplexity quand les autres sont absents
5. **Score adapté au niveau** — vrai bénéfice produit, pas un gadget : un débutant ne veut pas le même score que Kelly Slater

---

## 5. Monétisation

### Phase 1 — AdSense (M1–M6)
- Validation immédiate dès le go-live
- **CPM cible** : 0,50 – 2 €
- **Emplacements** : in-feed (toutes les 6 cards), page spot après la grille horaire
- **CMP** : Funding Choices (Google, gratuit, conforme TCF v2.2)
- **Revenu prévisionnel à 10k MAU** : ~150–600 €/mois

### Phase 2 — Ezoic (à partir de M6, ~10k visites/mois)
- **CPM cible** : 4 – 8 €
- Optimisation algorithmique des emplacements
- **Revenu prévisionnel à 50k MAU** : ~2 000–5 000 €/mois

### Phase 3 — Mediavine (M12+, > 50k sessions/mois)
- **CPM cible** : 8 – 25 €
- **Revenu prévisionnel à 200k MAU** : ~15 000–40 000 €/mois

### Pistes complémentaires (M9+)
- **Affiliation écoles de surf** — partenariat Booking-style, ~10 % de commission sur les cours/locations
- **Affiliation hébergement** — Booking Affiliate Partner sur les fiches spots (campings, hôtels surf)
- **Affiliation board shops** — Decathlon, Surfshop.fr, etc.
- **Newsletter sponsorisée** — annonceurs ciblés (marques surf, voyagistes)
- **API premium** (B2B) — accès aux scores Yosurf pour apps tierces / écoles

### Bonus potentiel — Yosurf+ (M18+)
Si validation BTOC : abonnement freemium **2,99 €/mois** pour
- Alertes push « houle d'exception J–2 »
- Prévisions étendues (15j)
- Marées détaillées
- Pas de pub

Cible : 1 % de conversion paid = ~2 000 abonnés à 50k MAU = **~6 000 €/mois récurrents**.

---

## 6. Stratégie d'acquisition

### Levier #1 — SEO long-tail (priorité 1, gratuit, asymétrique)
- **280+ pages indexables** dès le go-live (1 home + 1 index + 7 régions + 258 spots + 2 légales)
- **Mots-clés long-tail** ciblés : `prévisions surf Hossegor`, `surf Bretagne ce week-end`, `quand surfer à Lacanau`, `spots débutants Pays Basque`
- **JSON-LD enrichi** : BreadcrumbList + FAQ + Place + ItemList = rich snippets Google
- **Sitemap.xml + ads.txt + robots.txt** : prêts dès J1
- **Action immédiate** : créer Google Search Console, soumettre sitemap

### Levier #2 — AI search (priorité 1, gratuit, sous-exploité)
- **`llms.txt` et `llms-full.txt`** : convention émergente (Mintlify, Anthropic, OpenAI) pour aider les LLM à comprendre le site
- **`robots.txt`** : allow explicite pour OAI-SearchBot, GPTBot, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended
- **Conséquence** : quand un utilisateur demande à ChatGPT « où surfer à Biarritz ce week-end ? », Yosurf devient citable
- **Avantage** : la concurrence (Surfline, Windguru) ne l'a pas fait

### Levier #3 — Partage organique (priorité 2, viral natif)
- **Open Graph par spot** : preview gorgeous quand on colle un lien dans WhatsApp/Slack/iMessage
- **Share inline sur chaque card** + bouton modal
- **Copy enrichie** : `🌊 Hossegor : 87/100 aujourd'hui. Tu viens ?` quand score ≥ 75
- **Hypothèse viralité** : 1 utilisateur engagé partage en moyenne à 0,3 personnes/semaine. Avec 5k MAU engagés = 1500 nouvelles vues/semaine via partage social

### Levier #4 — Réseaux sociaux (M3+)
- **Instagram** : posts quotidiens « score du jour » + reels « conditions du week-end » (carrousels + reels = portée organique forte)
- **TikTok** : « POV: tu cherches une session à 6h du mat » — humour surf community
- **Reddit** : r/surfing, r/Surfing_France, r/Hossegor (modération bienveillante, ne pas spammer)
- **Strava-style culture** : poster les streaks (« 12 jours d'affilée sur Yosurf »)

### Levier #5 — Partenariats locaux (M6+)
- **Écoles de surf** : encart « powered by Yosurf » sur leur site en échange d'une mention sur la fiche spot
- **Campings côtiers** : flyers QR code → page régionale Yosurf
- **Surf shops** : présentoir avec lien yosurf.fr/spot/{slug}

### Levier #6 — RP / Influence (M9+)
- **Press kit** envoyé à : Surf Session, Surfer's Journal, Le Figaro Voyage, France Info
- **Story** : « 1 dev solo recrée Magicseaweed pour la France »
- **Influenceurs niche** : Marlon Lipke (1.4M sub YouTube), Anaïs Dahéron (FR pro surfer Instagram)

---

## 7. Roadmap déploiement géographique

```
M1 ─────────────────────► M6 ────────────────► M9 ──────────► M12 ─────► M18+
🇫🇷 France                  🇪🇸 Espagne          🇵🇹 Portugal      🇲🇦 Maroc / 🇪🇺 EU
258 spots                  +250 spots           +200 spots       expansion
```

### Phase 1 — France solide (M0–M6)
**Status** : ✅ Livré, en production

| Mois | Milestone |
|---|---|
| M0 | Go-live yosurf.fr — 258 spots, FR uniquement |
| M1 | Google Search Console + Analytics, AdSense submission |
| M2 | AdSense validé → première monétisation |
| M3 | Instagram lancé, premiers contenus, 1k MAU |
| M4 | Premier partenariat école (POC) |
| M5 | 5k MAU, ~50€ / mois revenus pub |
| M6 | 10k MAU, switch Ezoic, 200€/mois |

**Pourquoi commencer par la France**
- Marché connu, langue maîtrisée
- Réseau personnel utilisable pour les premiers partenariats
- Saisonnalité été 2026 = pic touristes + média
- ROI rapide validation modèle pub

### Phase 2 — Espagne (M6–M9)
**Effort technique** : ~1 mois (i18n + 250 spots curés)

**Spots cibles** (~250) :
- **Pays basque espagnol** : Mundaka, Sopelana, Zarautz, Zumaia (~40)
- **Cantabrique** : Somo, Liencres, Suances, Loredo (~50)
- **Asturies** : Salinas, Rodiles, Tapia (~30)
- **Galice** : Pantín, Razo, Doniños, Bastiagueiro (~50)
- **Andalousie atlantique** : El Palmar, Los Caños, Bolonia (~30)
- **Canaries** : El Confital, La Santa, Igueste, Quemao (~50)

**Action marketing** :
- i18n EN + ES
- Domaine `yosurf.es` ou sous-section `yosurf.fr/es`
- Pages SEO en espagnol : `previsiones surf Mundaka`, etc.
- Influenceurs ES : Vicente Romero, Anali Gómez

**Volume cible M9** : 30k MAU global (FR + ES)

### Phase 3 — Portugal (M9–M12)
**Effort technique** : ~3 semaines (200 spots, PT + EN)

**Spots cibles** (~200) :
- **Norte** : Matosinhos, Espinho, Furadouro (~30)
- **Lisboa / Estremadura** : Ericeira (WSR, classé UNESCO surf), Peniche (Supertubos), Carcavelos (~60)
- **Algarve** : Sagres, Arrifana, Amado, Bordeira (~50)
- **Açores** : São Miguel, Santa Maria (~20)
- **Madeira** : Jardim do Mar, Paul do Mar (~10)
- Autres (~30)

**Action marketing** :
- i18n EN + PT
- Story : « Ericeira est le World Surfing Reserve d'Europe — Yosurf le couvre intégralement »
- Affiliation hôtels surf Ericeira / Peniche / Sagres
- Influenceurs : Maya Gabeira, Garrett McNamara (Nazaré), Frederico Morais

**Volume cible M12** : 100k MAU global

### Phase 4 — Extension (M18+)
- 🇲🇦 **Maroc** (Taghazout, Imsouane, Anchor Point) — destination hiver des surfeurs européens
- 🇬🇧 **UK + 🇮🇪 Irlande** (Cornwall, Donegal, Bundoran)
- 🇮🇹 **Italie** (Sardaigne, Toscane)

---

## 8. KPIs & milestones

### KPIs primaires
| Indicateur | M3 | M6 | M9 | M12 |
|---|---:|---:|---:|---:|
| **MAU** (Monthly Active Users) | 1 000 | 10 000 | 30 000 | 100 000 |
| **DAU/MAU** (stickiness) | 15 % | 18 % | 22 % | 25 % |
| **Sessions / utilisateur** | 3 | 4 | 5 | 6 |
| **Pages / session** | 4 | 5 | 6 | 7 |
| **Streak ≥ 3 jours (% MAU)** | 5 % | 8 % | 12 % | 15 % |
| **Favoris créés (% MAU)** | 20 % | 30 % | 35 % | 40 % |
| **Spots indexés Google** | 50 | 200 | 350 | 550 |
| **Trafic organique (% du total)** | 30 % | 55 % | 70 % | 78 % |

### KPIs financiers
| | M3 | M6 | M9 | M12 |
|---|---:|---:|---:|---:|
| **Revenu AdSense/Ezoic** | 20 € | 200 € | 1 500 € | 6 000 € |
| **Revenu affiliation** | 0 € | 50 € | 300 € | 1 500 € |
| **Total mensuel** | 20 € | 250 € | 1 800 € | 7 500 € |

### Évènement / activations marketing
- **Mars 2026** — lancement public yosurf.fr + post Linkedin / X
- **Mai 2026** — campagne pré-été (« Préparez votre été surf »)
- **Septembre 2026** — campagne back-to-surf (« La rentrée des surfeurs »)
- **Octobre 2026** — partenariat 1 compétition pro (étape WSL Pays Basque)
- **Mars 2027** — go-live Espagne

---

## 9. Budget marketing indicatif (Année 1)

| Poste | Montant | Notes |
|---|---:|---|
| Domaine yosurf.fr (+ .es / .pt) | 100 € | NameCheap / OVH |
| Hébergement Vercel | 0 € | Free tier suffit jusqu'à 100k MAU |
| Open-Meteo | 0 € | Free tier suffit. Plan Pro 29 €/mois si > 5000 calls/h |
| Google Workspace (mail pro) | 60 € | yo@yosurf.fr |
| **Tech infrastructure** | **160 €** | |
| Photos / médias Instagram | 200 € | Banque Unsplash + Canva Pro |
| Influenceurs micro (3 × 200 €) | 600 € | M6, M9 |
| Pub Meta test (acquisition) | 500 € | Campagne A/B sur audience surf |
| Press kit + RP | 300 € | Templates + distribution |
| **Marketing direct** | **1 600 €** | |
| Logo professionnel (optionnel) | 0 – 500 € | Le SVG actuel est viable |
| Conseil SEO (audit 1-shot) | 300 € | Pour valider la structure |
| **Total Année 1** | **~2 000 – 2 500 €** | _hors temps homme_ |

ROI break-even : ~6 mois si on atteint les KPIs cibles.

---

## 10. Risques & mitigations

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Open-Meteo passe payant ou limite plus strictement | Faible | Élevé | Plan Pro Open-Meteo (29 €/mois), backup OpenWeather, cache 30 min déjà en place |
| AdSense refuse le site (contenu jugé insuffisant) | Moyen | Moyen | Pages SEO riches + FAQs déjà en place. Backup Ezoic / Mediavine |
| Surfline / windguru cloue un concurrent gratuit | Faible | Élevé | Moat = mobile-first + AI search visibility. Time-to-market avantage |
| Saisonnalité forte (hiver = -50 % trafic) | Élevé | Moyen | Diversifier vers Méditerranée + Maroc (hiver). Newsletter pour fidéliser |
| Burn personnel (projet solo non rémunéré) | Élevé | Élevé | Phase 1 monétisation rapide. Définir un seuil de revenus à partir duquel salarier |
| Concurrence d'une app type Vague (FR), Surfit, Hiqua | Moyen | Moyen | Vitesse d'exécution + voix de marque distinctive |

---

## 11. Opportunités stratégiques

### Acquisition / partenariat
- **Decathlon** — leur app `Decathlon Coach` n'a pas d'angle surf. Partenariat data ou rachat
- **Surf Session** (média FR) — distribution éditoriale + reach
- **Quiksilver / Roxy France** — co-branding sur le hero
- **FFS** (Fédération Française de Surf) — partenariat officiel

### Brand extensions futures
- **Yosurf Camp** — guide voyage surf en partenariat avec agences
- **Yosurf Coach** — module pédagogique pour débutants (vidéos + théorie)
- **Yosurf Live** — annonces communautaires « houle exceptionnelle » par les locaux

### Marchés voisins (long terme)
- **Bodyboard** — fork léger, audience overlapping
- **Kitesurf / wing** — différents besoins (vent prioritaire) mais réutilisation de la stack
- **Plongée** — visibilité subaquatique + houle, marché énorme

---

## 12. Demande / call to action

Pour avancer plus vite, **Yosurf cherche** :

1. **Un domaine `yosurf.fr`** (à acheter immédiatement, ~10 €/an)
2. **Validation AdSense** (lancement immédiat de la procédure)
3. **5 partenariats écoles de surf FR** (POC affiliation Q3 2026)
4. **1 créateur de contenu micro-influence FR** (carrousels Instagram, M3+)
5. **Un copilote produit** *(optionnel, M9+ pour scaler ES/PT)* — design + business dev

---

## Contact

- **Édition** : Pierre Neuville
- **Code source** : [github.com/pierreneuville/surferenfrance](https://github.com/pierreneuville/surferenfrance)
- **Démo live** : [surferenfrance.vercel.app](https://surferenfrance.vercel.app)

---

> _« La meilleure planche est celle que tu prends. »_
