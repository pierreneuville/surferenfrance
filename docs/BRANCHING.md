# Branching & deployment workflow

## Branches

| Branche   | Rôle                          | Domaine Vercel                          |
|-----------|-------------------------------|------------------------------------------|
| `main`    | **Production**                | `yosurf.fr` (ou le domaine de prod)      |
| `staging` | **Test / pré-prod**            | `staging.yosurf.fr` ou URL Vercel auto   |

Toute autre branche pousse une **Preview** Vercel automatique avec son propre URL (`yosurf-git-<branch>-<scope>.vercel.app`).

## Workflow quotidien

```
# Tu travailles sur une feature
git checkout staging
git pull
git checkout -b feat/ma-feature
# … code, commit …
git push -u origin feat/ma-feature
# → Vercel build une Preview avec son URL unique

# Quand tu es content :
gh pr create --base staging          # ou via l'UI GitHub
# Merge la PR dans staging
# → Vercel redeploie staging (visible sur staging.yosurf.fr)

# Quand staging est validé :
gh pr create --base main --head staging
# Merge la PR dans main
# → Vercel redeploie main (visible sur yosurf.fr)
```

**Règle d'or** : on ne push jamais directement sur `main`. Tout passe par `staging` puis PR.

## Setup Vercel (à faire UNE FOIS)

1. Va dans **Project → Settings → Git**
2. Vérifie que **Production Branch** = `main`
3. Dans **Domains**, assigne un domaine au staging :
   - Soit un sous-domaine custom : `staging.yosurf.fr` → Git Branch `staging`
   - Soit laisse Vercel générer `yosurf-staging.vercel.app` (en assignant ce domaine à la branche staging)
4. Dans **Settings → Environment Variables**, distingue les vars par env :
   - Production : valeurs réelles (clés AdSense, Plausible, etc.)
   - Preview : valeurs de test ou stub
   - Development : laisse vide (lu depuis `.env.local`)

## Setup GitHub (à faire UNE FOIS)

1. **Settings → Branches → Add classic branch protection rule** pour `main` :
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass (sélectionner les checks Vercel + futurs CI)
   - ✅ Require linear history (recommandé)
   - ❌ Allow force pushes (jamais)
2. Optionnel : même règle (plus souple) sur `staging`.
3. Dans **Settings → General → Default branch**, garde `main`.

## Le badge "STAGING"

Quand tu visites une preview/staging deploy, un bandeau coral apparaît en haut :
```
⚠ STAGING · NOT PRODUCTION
```
Implémenté par `components/EnvBanner.tsx`, gated par `lib/env.ts`.
Production = aucun bandeau.

## Variables d'environnement par environnement

`lib/env.ts` expose :
- `APP_ENV` : `"production" | "staging" | "preview" | "development"`
- `IS_PRODUCTION`, `IS_STAGING` helpers

Utilise-les pour gater des features risquées (ex: alertes payantes, A/B test).

```ts
import { IS_PRODUCTION, APP_ENV } from "@/lib/env";

if (IS_PRODUCTION) {
  // n'envoie les vraies analytics qu'en prod
}
```

## Pourquoi cette structure

- **Sécurité** : pas de push direct main, donc impossible de casser la prod par accident.
- **Test réaliste** : `staging` a son propre URL, ses propres données, son propre cache.
- **Code review** : chaque PR → preview Vercel jetable + lien dans le PR.
- **Rollback** : on peut revert le merge sur main si quelque chose casse en prod.
