# Pencil Design Sync — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Synchroniser les tokens de design depuis Pencil vers `tokens.css` via un JSON intermédiaire, et générer un rapport HTML de comparaison visuelle Pencil ↔ app.

**Architecture:** Deux subsystèmes indépendants dans `design/`. Token sync : `tokens.json` (source de vérité commitable) → `sync-tokens.js` → `frontend/src/tokens.css`. Visual validation : `screenshot.spec.ts` (Playwright) capture l'app → `validate-design.js` fusionne les PNG en rapport HTML avec images base64 embarquées.

**Tech Stack:** Node.js ESM (fs/path natifs), Playwright (@playwright/test déjà installé dans tests/e2e), HTML/CSS inline pour le rapport.

---

## Fichiers impactés

| Fichier | Action |
|---|---|
| `design/tokens.json` | Créer |
| `design/sync-tokens.js` | Créer |
| `design/screenshot.spec.ts` | Créer |
| `design/playwright-screenshot.config.ts` | Créer |
| `design/validate-design.js` | Créer |
| `frontend/src/tokens.css` | Modifier (corrigé par sync-tokens.js) |
| `package.json` | Modifier — ajouter 3 scripts |
| `.gitignore` | Modifier — ignorer screens/, screenshots/, rapport |

---

## Task 1 : Créer `design/tokens.json`

**Files:**
- Create: `design/tokens.json`

- [ ] **Step 1 : Créer le répertoire `design/` et le fichier `tokens.json`**

Créer `design/tokens.json` avec ce contenu exact :

```json
{
  "updatedAt": "2026-05-04",
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

- [ ] **Step 2 : Vérifier la validité JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('design/tokens.json','utf8')); console.log('JSON valide')"
```

Expected: `JSON valide`

- [ ] **Step 3 : Commit**

```bash
git add design/tokens.json
git commit -m "feat(design): add tokens.json as commitable design token source"
```

---

## Task 2 : Créer `design/sync-tokens.js`

**Files:**
- Create: `design/sync-tokens.js`

- [ ] **Step 1 : Créer le script**

Créer `design/sync-tokens.js` avec ce contenu exact :

```js
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const tokensPath = resolve(__dirname, 'tokens.json');
const cssPath = resolve(__dirname, '../frontend/src/tokens.css');

const { pencil, tokens, updatedAt } = JSON.parse(readFileSync(tokensPath, 'utf8'));

const lines = Object.entries(tokens).map(([name, def]) => {
  const value = def.ref !== undefined ? pencil[def.ref] : def.value;
  if (!value) throw new Error(`Token "${name}" — ref "${def.ref}" introuvable dans pencil`);
  return `  ${name}: ${value};`;
});

const css = `:root {\n${lines.join('\n')}\n}\n`;
writeFileSync(cssPath, css, 'utf8');

console.log(`✅ tokens.css régénéré depuis tokens.json (source: ${updatedAt})`);
console.log(`   ${Object.keys(tokens).length} tokens écrits → frontend/src/tokens.css`);
```

- [ ] **Step 2 : Vérifier la syntaxe**

```bash
node --input-type=module < design/sync-tokens.js
```

Expected:
```
✅ tokens.css régénéré depuis tokens.json (source: 2026-05-04)
   19 tokens écrits → frontend/src/tokens.css
```

- [ ] **Step 3 : Vérifier que `tokens.css` a bien été mis à jour**

```bash
cat frontend/src/tokens.css
```

Expected : bloc `:root { ... }` avec 19 propriétés. Vérifier que `--color-danger-light` vaut `#fef2f2` (correction depuis l'ancienne valeur `#fee2e2`).

- [ ] **Step 4 : Commit**

```bash
git add design/sync-tokens.js frontend/src/tokens.css
git commit -m "feat(design): add sync-tokens.js script + fix --color-danger-light to match Pencil red-50"
```

---

## Task 3 : Ajouter `sync:tokens` au `package.json` racine

**Files:**
- Modify: `package.json`

- [ ] **Step 1 : Ajouter le script dans `package.json`**

Dans la section `"scripts"` de `package.json` racine, ajouter après `"test:api"` :

```json
"sync:tokens": "node design/sync-tokens.js"
```

- [ ] **Step 2 : Vérifier que la commande fonctionne**

```bash
npm run sync:tokens
```

Expected:
```
✅ tokens.css régénéré depuis tokens.json (source: 2026-05-04)
   19 tokens écrits → frontend/src/tokens.css
```

- [ ] **Step 3 : Commit**

```bash
git add package.json
git commit -m "feat(design): add sync:tokens npm script"
```

---

## Task 4 : Créer `design/screenshot.spec.ts` + config Playwright

**Files:**
- Create: `design/screenshot.spec.ts`
- Create: `design/playwright-screenshot.config.ts`

- [ ] **Step 1 : Créer la config Playwright pour les screenshots**

Créer `design/playwright-screenshot.config.ts` :

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '../../design',
  testMatch: 'screenshot.spec.ts',
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: process.env.APP_URL ?? 'http://localhost:8081',
    viewport: { width: 1440, height: 900 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

- [ ] **Step 2 : Créer le spec de screenshot**

Créer `design/screenshot.spec.ts` :

```ts
import { test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const OUT_DIR = resolve(process.cwd(), 'design/screenshots');

const SCREENS = [
  { name: 'internships', path: '/internships' },
  { name: 'activities',  path: '/activities' },
  { name: 'categories',  path: '/categories' },
  { name: 'settings',    path: '/settings' },
  { name: 'certificate', path: '/certificate/1' },
];

test.beforeAll(() => {
  mkdirSync(OUT_DIR, { recursive: true });
});

for (const { name, path } of SCREENS) {
  test(`screenshot ${name}`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'networkidle' });
    await page.screenshot({
      path: `${OUT_DIR}/${name}.png`,
      fullPage: false,
    });
    console.log(`📸 ${name}.png`);
  });
}
```

**Note :** La route `/certificate/1` requiert qu'un stage avec `id=1` existe en DB (présent dans les données seed). Si la route redirige ou affiche une erreur, le screenshot capturera tout de même l'état de l'écran.

- [ ] **Step 3 : Ajouter `screenshot:app` dans `package.json`**

Dans la section `"scripts"` de `package.json` racine, ajouter :

```json
"screenshot:app": "cd tests/e2e && npx playwright test --config ../../design/playwright-screenshot.config.ts"
```

- [ ] **Step 4 : Vérifier (app doit être lancée)**

S'assurer que l'app tourne (`docker-compose up` ou `npm run dev:frontend` + `npm run start:backend`), puis :

```bash
npm run screenshot:app
```

Expected : 5 tests `PASSED`, fichiers `design/screenshots/*.png` créés.

```bash
ls design/screenshots/
```

Expected :
```
activities.png  categories.png  certificate.png  internships.png  settings.png
```

- [ ] **Step 5 : Commit**

```bash
git add design/screenshot.spec.ts design/playwright-screenshot.config.ts package.json
git commit -m "feat(design): add Playwright screenshot spec for app visual capture"
```

---

## Task 5 : Créer `design/validate-design.js`

**Files:**
- Create: `design/validate-design.js`

- [ ] **Step 1 : Créer le script de rapport**

Créer `design/validate-design.js` :

```js
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SCREENS = ['internships', 'activities', 'categories', 'settings', 'certificate'];

const toBase64 = (filePath) => {
  if (!existsSync(filePath)) return null;
  return `data:image/png;base64,${readFileSync(filePath).toString('base64')}`;
};

const cards = SCREENS.map((name) => {
  const pencilSrc = toBase64(resolve(__dirname, `screens/${name}.png`));
  const appSrc    = toBase64(resolve(__dirname, `screenshots/${name}.png`));

  const img = (src, label) => src
    ? `<div class="col"><p class="label">${label}</p><img src="${src}" alt="${label} — ${name}"></div>`
    : `<div class="col"><p class="label">${label}</p><p class="missing">⚠️ Screenshot manquant</p></div>`;

  return `
<section>
  <h2>${name}</h2>
  <div class="row">
    ${img(pencilSrc, 'Pencil')}
    ${img(appSrc, 'App')}
  </div>
</section>`;
}).join('\n');

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Validation Design — WorkXP Admin</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, sans-serif; background: #f8fafc; color: #0f172a; padding: 2rem; }
  h1 { font-size: 1.25rem; font-weight: 700; margin-bottom: 2rem; color: #1e293b; }
  section { margin-bottom: 3rem; }
  h2 { font-size: 1rem; font-weight: 600; text-transform: capitalize; margin-bottom: 0.75rem;
       color: #475569; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; }
  .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
  .col { display: flex; flex-direction: column; gap: 0.375rem; }
  .label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
           letter-spacing: 0.06em; color: #94a3b8; }
  img { width: 100%; border: 1px solid #e2e8f0; border-radius: 0.5rem; display: block; }
  .missing { color: #dc2626; font-size: 0.875rem; padding: 1rem;
             background: #fef2f2; border: 1px solid #fecaca; border-radius: 0.5rem; }
</style>
</head>
<body>
<h1>Validation Design — WorkXP Admin</h1>
${cards}
</body>
</html>`;

const reportPath = resolve(__dirname, 'validation-report.html');
writeFileSync(reportPath, html, 'utf8');
console.log('✅ Rapport généré : design/validation-report.html');

const opener = process.platform === 'darwin' ? 'open'
  : process.platform === 'win32' ? 'start'
  : 'xdg-open';

try {
  execSync(`${opener} "${reportPath}"`);
} catch {
  console.log(`   Ouvrir manuellement : ${reportPath}`);
}
```

- [ ] **Step 2 : Ajouter `validate:design` dans `package.json`**

Dans la section `"scripts"` de `package.json` racine, ajouter :

```json
"validate:design": "node design/validate-design.js"
```

- [ ] **Step 3 : Tester avec les screenshots existants**

Créer le dossier `design/screens/` (il sera rempli par Claude via MCP Pencil) :

```bash
mkdir -p design/screens
```

Lancer la validation sans les screens Pencil pour vérifier le comportement "manquant" :

```bash
npm run validate:design
```

Expected :
```
✅ Rapport généré : design/validation-report.html
```

Le rapport s'ouvre dans le navigateur avec les captures app et les colonnes Pencil affichant "⚠️ Screenshot manquant".

- [ ] **Step 4 : Commit**

```bash
git add design/validate-design.js package.json
git commit -m "feat(design): add validate-design.js report generator"
```

---

## Task 6 : Mettre à jour `.gitignore` et documenter le workflow

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1 : Mettre à jour `.gitignore`**

Ajouter à la fin de `.gitignore` :

```
# Design sync — fichiers générés (non commités)
design/screens/
design/screenshots/
design/validation-report.html
```

- [ ] **Step 2 : Vérifier que les dossiers sont bien ignorés**

```bash
mkdir -p design/screens design/screenshots
touch design/screens/test.png design/screenshots/test.png design/validation-report.html
git status
```

Expected : les fichiers créés n'apparaissent PAS dans `git status` (ignorés).

```bash
rm design/screens/test.png design/screenshots/test.png design/validation-report.html
```

- [ ] **Step 3 : Vérifier la liste complète des scripts ajoutés**

```bash
npm run
```

Expected — les trois scripts suivants apparaissent :
```
sync:tokens
screenshot:app
validate:design
```

- [ ] **Step 4 : Commit final**

```bash
git add .gitignore
git commit -m "chore(design): gitignore generated screens, screenshots and report"
```

---

## Workflow complet — récapitulatif post-implémentation

### Sync tokens depuis Pencil

```bash
# 1. Dire à Claude : "sync les tokens depuis Pencil"
#    → Claude appelle get_variables MCP → met à jour design/tokens.json

# 2. Régénérer tokens.css
npm run sync:tokens

# 3. Commiter les deux fichiers
git add design/tokens.json frontend/src/tokens.css
git commit -m "design: sync tokens from Pencil (YYYY-MM-DD)"
```

### Validation visuelle

```bash
# 1. S'assurer que l'app tourne
docker-compose -f docker/docker-compose.yml up -d

# 2. Dire à Claude : "exporte les écrans Pencil dans design/screens/"
#    → Claude utilise export_nodes ou get_screenshot MCP

# 3. Capturer les screenshots de l'app
npm run screenshot:app

# 4. Générer et ouvrir le rapport
npm run validate:design
```
