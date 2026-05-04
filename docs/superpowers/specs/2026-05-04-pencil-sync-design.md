# WorkXP Admin — Pencil Design Sync : Design

**Date :** 2026-05-04
**Projet :** CA TIC WorkXP Admin — TPI 2026 — Luka Pellegrinelli
**Approche :** Approche 2 — JSON intermédiaire + scripts npm

---

## Contexte

Le fichier de design `WorkXPAdmin.pen` (Pencil) est la source de vérité visuelle du projet. Actuellement, les tokens de design (couleurs, rayons, ombres) sont maintenus manuellement dans `frontend/src/tokens.css`. Aucun mécanisme ne détecte les divergences entre le design Pencil et l'app réelle.

**Contrainte technique clé :** Le fichier `.pen` est chiffré — il n'est lisible qu'à travers l'API MCP Pencil, qui nécessite que Pencil soit ouvert. Toute automation impliquant le fichier `.pen` passe donc par Claude + Pencil ouvert.

---

## Objectifs

1. **Token Sync** — `design/tokens.json` comme source de vérité commitable. Un script npm régénère `frontend/src/tokens.css` depuis ce JSON sans nécessiter Pencil ouvert.
2. **Visual Validation** — Un rapport HTML côte-à-côte (Pencil vs app) généré à la demande pour détecter les divergences visuelles.

---

## Subsystème 1 — Token Sync

### Structure de fichiers

```
design/
  tokens.json          ← source de vérité (commité, mis à jour par Claude via MCP)
  sync-tokens.js       ← script Node.js : lit tokens.json → écrit tokens.css
frontend/src/
  tokens.css           ← généré par sync-tokens.js (ne plus éditer à la main)
```

### Format de `design/tokens.json`

```json
{
  "updatedAt": "YYYY-MM-DD",
  "pencil": {
    "blue-50":   "#eff6ff",
    "blue-100":  "#dbeafe",
    "blue-600":  "#2563eb",
    "blue-700":  "#1d4ed8",
    "red-50":    "#fef2f2",
    "red-600":   "#dc2626",
    "slate-50":  "#f8fafc",
    "slate-100": "#f1f5f9",
    "slate-200": "#e2e8f0",
    "slate-300": "#cbd5e1",
    "slate-400": "#94a3b8",
    "slate-500": "#64748b",
    "slate-600": "#475569",
    "slate-700": "#334155",
    "slate-800": "#1e293b",
    "slate-900": "#0f172a",
    "white":     "#ffffff"
  },
  "tokens": {
    "--color-primary":        { "ref": "blue-600" },
    "--color-primary-hover":  { "ref": "blue-700" },
    "--color-primary-light":  { "ref": "blue-50" },
    "--color-primary-border": { "ref": "blue-100" },
    "--color-bg":             { "ref": "slate-50" },
    "--color-surface":        { "ref": "white" },
    "--color-border":         { "ref": "slate-200" },
    "--color-text-primary":   { "ref": "slate-900" },
    "--color-text-secondary": { "ref": "slate-500" },
    "--color-text-tertiary":  { "ref": "slate-400" },
    "--color-sidebar-bg":     { "ref": "slate-900" },
    "--color-sidebar-hover":  { "ref": "slate-800" },
    "--color-danger":         { "ref": "red-600" },
    "--color-danger-light":   { "ref": "red-50" },
    "--radius-sm":            { "value": "0.375rem" },
    "--radius-md":            { "value": "0.5rem" },
    "--radius-lg":            { "value": "0.75rem" },
    "--shadow-card":          { "value": "0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px -1px rgba(0,0,0,.1)" },
    "--shadow-card-hover":    { "value": "0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -2px rgba(0,0,0,.1)" }
  }
}
```

Les tokens avec `"ref"` pointent vers une valeur Pencil. Les tokens avec `"value"` sont des valeurs statiques (rayons, ombres) que Pencil n'expose pas comme variables.

### Script `design/sync-tokens.js`

Script Node.js ESM exécutable sans dépendances (fs/path natifs) :

1. Lit `design/tokens.json`
2. Résout chaque token : `ref` → valeur dans `pencil`, `value` → valeur directe
3. Écrit `frontend/src/tokens.css` avec le bloc `:root { ... }` complet
4. Affiche un résumé : nombre de tokens écrits, date de la source

### Commande npm

Dans `package.json` racine :

```json
"sync:tokens": "node design/sync-tokens.js"
```

### Workflow utilisateur

1. Modifier une couleur dans Pencil
2. Dire à Claude : *"sync les tokens depuis Pencil"*
3. Claude appelle `get_variables` via MCP Pencil → met à jour `design/tokens.json`
4. Lancer `npm run sync:tokens` → `frontend/src/tokens.css` est régénéré
5. Commiter `design/tokens.json` + `frontend/src/tokens.css`

### Divergence détectée lors du brainstorming

La valeur actuelle de `--color-danger-light` dans `tokens.css` est `#fee2e2` (Tailwind `red-100`), alors que Pencil expose `red-50: #fef2f2`. Le script utilisera la valeur Pencil (`#fef2f2`), corrigeant cette divergence.

---

## Subsystème 2 — Visual Validation

### Structure de fichiers

```
design/
  screens/             ← exports Pencil PNG (générés par Claude via MCP)
    internships.png
    activities.png
    categories.png
    settings.png
    certificate.png
  screenshots/         ← captures app (générées par le script npm)
    internships.png
    activities.png
    categories.png
    settings.png
    certificate.png
  validate-design.js   ← script Node.js : génère validation-report.html
  validation-report.html  ← rapport côte-à-côte (gitignored)
```

### Écrans comparés

| Route app | Écran Pencil | Fichier |
|---|---|---|
| `/internships` | List/Intern | `internships.png` |
| `/activities` | List/Activity | `activities.png` |
| `/categories` | List/Category | `categories.png` |
| `/settings` | Settings | `settings.png` |
| `/certificate/:id` | Certificate | `certificate.png` |

Résolution : **1440×900** (desktop standard, cohérent avec les mockups Pencil).

### Commandes npm

Dans `package.json` racine :

```json
"screenshot:app": "node design/screenshot-app.js",
"validate:design": "node design/validate-design.js"
```

### Script `design/screenshot-app.js`

Utilise l'API Playwright (`@playwright/test`) pour capturer chaque route :

1. Lance un browser Chromium headless
2. Navigue vers chaque route (`/internships`, `/activities`, etc.)
3. Attend que le réseau soit idle (données chargées)
4. Capture un screenshot 1440×900 → `design/screenshots/{nom}.png`

Prérequis : l'app doit être lancée (`docker-compose up` ou `npm run dev`).

### Script `design/validate-design.js`

Génère `design/validation-report.html` :

1. Lit la liste des 5 écrans
2. Pour chaque écran : vérifie que `design/screens/{nom}.png` et `design/screenshots/{nom}.png` existent
3. Génère un HTML avec pour chaque écran :
   - Titre de l'écran
   - Deux images côte-à-côte à 50% de largeur chacune
   - Labels « Pencil » et « App »
4. Ouvre automatiquement le rapport dans le navigateur par défaut (`open` macOS / `xdg-open` Linux / `start` Windows)

### Workflow utilisateur

1. S'assurer que l'app tourne en local
2. Dire à Claude : *"exporte les écrans Pencil"* → Claude utilise MCP pour sauver les 5 PNG dans `design/screens/`
3. Lancer `npm run screenshot:app` → captures app sauvées dans `design/screenshots/`
4. Lancer `npm run validate:design` → rapport HTML ouvert dans le navigateur
5. Révision manuelle côte-à-côte

### `.gitignore`

```
design/screens/
design/screenshots/
design/validation-report.html
```

Les PNG et le rapport ne sont pas commités — seuls `tokens.json`, `sync-tokens.js`, `screenshot-app.js` et `validate-design.js` le sont.

---

## Fichiers impactés — récapitulatif

| Fichier | Action |
|---|---|
| `design/tokens.json` | Créer |
| `design/sync-tokens.js` | Créer |
| `design/screenshot-app.js` | Créer |
| `design/validate-design.js` | Créer |
| `frontend/src/tokens.css` | Modifier (correction `--color-danger-light`) |
| `package.json` (racine) | Ajouter 3 scripts |
| `.gitignore` | Ajouter entrées `design/screens/`, `design/screenshots/`, `design/validation-report.html` |

---

## Contraintes

- Aucune nouvelle dépendance npm : `sync-tokens.js` et `validate-design.js` utilisent uniquement `fs`, `path`, `child_process` natifs Node.js
- `screenshot-app.js` utilise `@playwright/test` déjà installé dans le projet
- Le sync tokens nécessite Claude + Pencil ouvert ; la régénération `tokens.css` depuis JSON ne le nécessite pas
- La validation visuelle est manuelle — pas de pixel diff automatique
