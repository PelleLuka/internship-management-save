# Checklist — Réalisation du projet WorkXP Admin de zéro

Checklist micro-granulaire pour reproduire l'intégralité du projet TPI CA TIC WorkXP Admin depuis zéro.
Les phases documentation et tests sont intégrées en continu ; une phase de vérification finale est prévue pour chacune.

---

## Phase 0 — Préparation *(~2h)*

### Lecture du cahier des charges

- [ ] Lire le cahier des charges en entier
- [ ] Identifier et noter les 5 exigences fonctionnelles (stagiaires, ateliers, catégories, association, certificat)
- [ ] Identifier les technologies imposées : Vue.js 3, Express.js, MariaDB

### Vérification de l'environnement

- [ ] Vérifier Node.js v20+ : `node --version` → doit afficher `v20.x.x` ou supérieur
- [ ] Vérifier npm v10+ : `npm --version`
- [ ] Vérifier Git : `git --version`
- [ ] Vérifier Docker Desktop installé et démarré : `docker --version && docker compose version`
- [ ] Vérifier Postman installé (version desktop)
- [ ] Vérifier VS Code installé avec les extensions : `Vue - Official` (Volar), `Tailwind CSS IntelliSense`, `Biome`

### Git et dépôt

- [ ] Créer le dépôt sur GitLab HEIA-FR (visibilité privée)
- [ ] Configurer l'identité Git locale si pas déjà fait :
  ```bash
  git config --global user.name "Prénom Nom"
  git config --global user.email "prenom.nom@edu.hefr.ch"
  ```
- [ ] `git clone <repo-url> && cd <repo>`

### Structure des dossiers

- [ ] Créer les dossiers racine :
  ```bash
  mkdir -p frontend backend database docker tests/e2e tests/api tests/setup docs design
  ```
- [ ] Créer un `.gitkeep` dans les dossiers vides pour les commiter

### npm Workspaces (racine)

- [ ] Créer `package.json` à la racine :
  ```json
  {
    "name": "internship-management",
    "version": "1.0.0",
    "private": true,
    "type": "module",
    "workspaces": ["frontend", "backend"]
  }
  ```

### Biome — linter et formatter

- [ ] Installer Biome en dépendance de développement racine :
  ```bash
  npm install --save-dev @biomejs/biome
  ```
- [ ] Initialiser la configuration Biome :
  ```bash
  npx biome init
  ```
- [ ] Remplacer le contenu de `biome.json` par la configuration du projet :
  ```json
  {
    "$schema": "https://biomejs.dev/schemas/2.3.8/schema.json",
    "vcs": { "enabled": true, "clientKind": "git", "useIgnoreFile": true },
    "formatter": { "enabled": true, "indentStyle": "space", "indentWidth": 2 },
    "linter": { "enabled": true, "rules": { "recommended": true } },
    "css": {
      "parser": { "tailwindDirectives": true },
      "formatter": { "quoteStyle": "single" }
    },
    "javascript": { "formatter": { "quoteStyle": "single" } },
    "html": {
      "formatter": { "enabled": true, "bracketSameLine": false, "selfCloseVoidElements": "always" },
      "experimentalFullSupportEnabled": true
    },
    "overrides": [{
      "includes": ["**/*.vue"],
      "linter": {
        "rules": {
          "style": { "useConst": "off", "useImportType": "off" },
          "correctness": { "noUnusedVariables": "off", "noUnusedImports": "off" }
        }
      }
    }],
    "assist": { "enabled": true, "actions": { "source": { "organizeImports": "on" } } }
  }
  ```
- [ ] Vérifier que Biome fonctionne : `npx biome check .`

### Scripts racine

- [ ] Ajouter les scripts dans `package.json` racine :
  ```json
  "scripts": {
    "dev:frontend": "npm run dev --workspace=frontend",
    "build:frontend": "npm run build --workspace=frontend",
    "start:backend": "npm run start --workspace=backend",
    "dev:backend": "npm run dev --workspace=backend",
    "lint": "biome lint .",
    "format": "biome format --write .",
    "check": "biome check --write .",
    "db:restore": "node tests/setup/restoreDb.js",
    "test:e2e": "npm run db:restore && cd tests/e2e && npx playwright test",
    "test:api": "npm run db:restore && bash tests/api/run_tests.sh"
  }
  ```

### Newman

- [ ] Installer Newman pour exécuter les tests API en ligne de commande :
  ```bash
  npm install --save-dev newman newman-reporter-htmlextra
  ```

### .gitignore

- [ ] Créer `.gitignore` à la racine :
  ```
  node_modules
  dist
  dist-ssr
  *.local
  .env
  backups/
  backup/data/*.sql
  tests/e2e/playwright-report/
  tests/e2e/test-results/
  design/screens/
  design/screenshots/
  design/validation-report.html
  ```

### Premier commit

- [ ] `git add . && git commit -m "chore: init project structure with Biome and npm workspaces"`

---

## Phase 1 — Planification *(~3h)*

### Décomposition des tâches du CdC

- [ ] Reprendre les 7 exigences du CdC et noter leur durée estimée officielle :

  | Exigence | Priorité | Durée estimée |
  |---|---|---|
  | Gestion des stagiaires | Haute | 2 jours |
  | Gestion des ateliers | Haute | 2 jours |
  | Association ateliers ↔ stages | Haute | 1.5 jour |
  | Automatisation des tests | Moyenne | 1.5 jour |
  | Gestion des catégories | Moyenne | 1 jour |
  | Génération du certificat | Basse | 1 jour |
  | Gestion de projet | Haute | 1 jour |

- [ ] Décomposer chaque exigence en sous-tâches (analyse, conception, implémentation, tests, doc)
- [ ] Estimer la durée personnelle de chaque sous-tâche (en demi-journées)
- [ ] Vérifier que le total correspond à la durée totale du TPI (11 jours ouvrables)

### Diagramme de Gantt

- [ ] Ouvrir Excel ou Google Sheets, créer un nouveau fichier `Gantt-WorkXPAdmin.xlsx`
- [ ] Structurer les colonnes : colonne A = Tâche, colonne B = Durée, colonnes suivantes = jours (1 colonne = 1 demi-journée)
- [ ] Créer 6 groupes de lignes correspondant aux 6 phases :
  - **Administratif** (Jour 1 matin : lecture CdC, setup, Gantt)
  - **Analyse** (Jour 1 après-midi → Jour 2 : besoins, diagrammes UML, choix techniques)
  - **Conception** (Jour 2 après-midi → Jour 3 : mockups Pencil, MCD, architecture, séquences)
  - **Réalisation** (Jour 3 après-midi → Jour 8 : infrastructure, backend, frontend)
  - **Tests** (Jour 7 → Jour 9 : intégrés à la réalisation + vérification finale)
  - **Documentation** (continu + Jour 9 → Jour 10 : finalisation rapport)
- [ ] Colorier chaque phase avec une couleur distincte (ex : bleu = réalisation, orange = tests, vert = doc)
- [ ] Ajouter une ligne "Gantt réel" sous chaque ligne "Gantt prévu" (laisser vide pour l'instant, à remplir en phase 8)
- [ ] Fixer les jalons clés (cellules marquées ◆) :
  - Fin analyse → Jour 2 soir
  - Fin conception → Jour 3 soir
  - Fin backend → Jour 6 soir
  - Fin frontend → Jour 8 soir
  - Remise finale → **2 juin 2026 à 17h00**
- [ ] Sauvegarder le Gantt et faire un screenshot du tableau pour le rapport (Figure §2.4)

### Rapport TPI — initialisation

- [ ] Ouvrir `docs/rapport-tpi/rapport-tpi-workxpadmin.md`
- [ ] Remplir l'en-tête :
  - **Date de création** : date du Jour 1
  - **Dernière édition** : laisser vide (à remplir à la remise)
- [ ] Remplir §2.2 Organisation : candidat, chef de projet (Joël Dacomo), experts (à compléter dès que connus)
- [ ] Remplir §2.3 Matériel : machine utilisée (modèle exact + OS + version)
- [ ] Remplir §2.3 Logiciels : versions exactes de tous les outils installés
- [ ] Insérer le screenshot du Gantt dans §2.4 Planification

### Journal de bord — initialisation

- [ ] Créer `docs/journal-de-bord.md` avec la structure suivante pour chaque journée :
  ```markdown
  ## Jour 1 — [date]
  **Heures travaillées :** 8h (08h00–12h00 / 13h00–17h00)
  **Tâches réalisées :**
  - ...
  **Problèmes rencontrés :**
  - ...
  **Solutions apportées :**
  - ...
  **Prévu pour demain :**
  - ...
  ```
- [ ] Remplir l'entrée Jour 1 avec les tâches de la journée (lecture CdC, setup, Gantt)
- [ ] Commit : `docs: add initial Gantt planning and start TPI journal`

---

## Phase 2 — Analyse *(~1 jour)*

- [ ] Identifier l'acteur unique du système : Administrateur CA TIC
- [ ] Lister les 5 cas d'utilisation principaux (CRUD stagiaires, CRUD ateliers, CRUD catégories, association ateliers↔stages, génération certificat)
- [ ] Rédiger les descriptions des besoins (tableau Quoi/Pourquoi/Comment/Contrainte pour chaque action)
- [ ] Créer le diagramme UML de cas d'utilisation (Draw.io ou PlantUML)
- [ ] Étudier variante d'architecture : Monolithique vs 3-tiers → créer matrice de comparaison
- [ ] Étudier variante stockage documents : BLOB en DB vs Filesystem → décision
- [ ] Étudier variante génération PDF : Puppeteer vs carbone.js → décision
- [ ] Documenter les choix dans le rapport §4.5 (avec matrice et conclusion)
- [ ] Remplir §4.6 : tableau technologies retenues avec justification
- [ ] Journal de bord : entrées journalières

---

## Phase 3 — Conception *(~1 jour)*

- [ ] Créer le fichier Pencil `WorkXPAdmin.pen` et dessiner les mockups des 5 écrans principaux (stages, ateliers repliés, ateliers dépliés, catégories, paramètres)
- [ ] Définir le schéma SQL complet : 5 tables (`person`, `internship`, `activity`, `category`, `internship_activity`, `activity_category`) avec FK et CHECK
- [ ] Créer le MCD/MLD (DbDiagram.io ou Draw.io)
- [ ] Créer le diagramme d'architecture 3-tiers Draw.io (3 boîtes + volume `uploads_data` + flèches HTTP/SQL)
- [ ] Créer 3 diagrammes de séquence (PlantUML) : création stagiaire, upload document, génération certificat
- [ ] Définir le contrat API : tableau méthode/route/description pour chaque module
- [ ] Insérer tous les diagrammes dans le rapport (§5.1 à §5.4)
- [ ] Journal de bord

---

## Phase 4 — Infrastructure *(~3h)*

- [ ] Créer `docker/docker-compose.yml` avec 3 services : `frontend` (:8081), `backend` (:3000), `mariadb` (:3306)
- [ ] Configurer les volumes Docker : `uploads_data`, `mariadb_data`
- [ ] Créer `docker/backend.Dockerfile` (Node 20 Alpine + `apk add --no-cache libreoffice`)
- [ ] Créer `docker/frontend.Dockerfile` (Node 20 build Vite → Nginx)
- [ ] Créer `database/init.sql` avec tous les CREATE TABLE, contraintes FK (CASCADE/RESTRICT) et CHECK (`end_date >= start_date`)
- [ ] Créer `database/restore_db.sql` avec données minimales reproductibles pour les tests
- [ ] Créer `.env.example` (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT`)
- [ ] `docker compose up --build` et vérifier que les 3 services démarrent
- [ ] Vérifier la connexion MariaDB depuis le conteneur backend
- [ ] Commit : `chore: add Docker infrastructure and DB schema`

---

## Phase 5 — Backend + tests API *(~3 jours)*

### Setup Express

- [ ] `cd backend && npm init -y`
- [ ] Installer : `express`, `mariadb`, `multer`, `carbone`, `cors`, `dotenv`, `uuid`
- [ ] Créer `server.js` (Express, CORS, JSON middleware, montage routes, port via `.env`)
- [ ] Créer `config/db.js` (pool MariaDB avec `getConnection()` + `finally conn.end()`)
- [ ] Créer la structure des dossiers : `routes/`, `controllers/`, `services/`, `models/`, `middleware/`
- [ ] Créer `middleware/upload.js` (multer, validation MIME, limite 10 MB, nommage `<uuid>-<sanitized>.<ext>`)

### Module stagiaires

- [ ] Créer `models/Person.js` (getAll, getById, create, update, delete)
- [ ] Créer `models/Internship.js` (getAll avec JOIN person, getById, create, update, delete, getActivities, addActivity, removeActivity)
- [ ] Créer `services/internshipService.js` (erreurs nommées : `NOT_FOUND`, `INVALID_DATES`, `MISSING_FIELD`)
- [ ] Créer `controllers/internshipController.js` (codes HTTP 200/201/204/404/422)
- [ ] Créer `routes/internships.js` (9 endpoints : CRUD + activities + certificate)
- [ ] Tester CRUD complet dans Postman + cas d'erreur (dates invalides, champ manquant)
- [ ] Ajouter toutes les requêtes à la collection Postman

### Module ateliers

- [ ] Créer `models/Activity.js` (soft delete via `visible=0`, `internshipCount` via COUNT JOIN)
- [ ] Créer `services/activityService.js` (guard `HAS_LINKED_INTERNSHIPS` si `internshipCount > 0`)
- [ ] Créer `controllers/activityController.js` (HTTP 409 sur `HAS_LINKED_INTERNSHIPS`)
- [ ] Créer `routes/activities.js` (8 endpoints : CRUD + upload/download/delete document)
- [ ] Tester dans Postman (suppression bloquée HTTP 409, upload > 10 MB HTTP 400) + ajouter à collection

### Module catégories

- [ ] Créer `models/Category.js` (`activityCount` via COUNT JOIN)
- [ ] Créer `services/categoryService.js` (guard `HAS_LINKED_ACTIVITIES`)
- [ ] Créer `controllers/categoryController.js`
- [ ] Créer `routes/categories.js` (4 endpoints : CRUD)
- [ ] Tester dans Postman + ajouter à collection

### Module certificat

- [ ] Créer `services/certificateService.js` (`async function` pure avec `promisify(carbone.render)` — éviter l'anti-pattern `new Promise(async)`)
- [ ] Créer `controllers/certificateController.js` (stream PDF binaire, `Content-Type: application/pdf`)
- [ ] Créer `routes/certificate.js` (GET status template, POST upload template, GET generate)
- [ ] Créer le template DOCX de démonstration avec balises carbone : `{prenom}`, `{nom}`, `{email}`, `{date_debut}`, `{date_fin}`, `{#ateliers}`, `{titre}`, `{categories}`, `{/ateliers}`, `{date_emission}`
- [ ] Placer le template dans `backend/uploads/certificate/template.docx`
- [ ] Tester la génération PDF dans Postman + ajouter à collection
- [ ] Installer Newman : `npm install -g newman`
- [ ] Run `newman run collection.json` → vérifier que tout passe
- [ ] Commit : `feat(backend): complete REST API with all modules`

---

## Phase 6 — Frontend + tests E2E *(~3 jours)*

### Setup

- [ ] `npm create vite@latest frontend -- --template vue`
- [ ] Installer : `vue-router@4`, `axios`, `tailwindcss`, `lucide-vue-next`, `@biomejs/biome`
- [ ] Configurer Tailwind CSS (`tailwind.config.js`, import dans `src/main.css`)
- [ ] Créer `biome.json` : `organizeImports: "on"`, indentation 2 espaces, guillemets doubles
- [ ] Créer `src/tokens.css` avec les variables CSS de couleurs (palette bleue + statuts)
- [ ] Créer `src/router.js` avec 5 routes : `/internships`, `/activities`, `/categories`, `/settings`, `/certificate/:id`
- [ ] Créer `src/layouts/Sidebar.vue` (navigation + responsive collapse via `useMediaQuery`)
- [ ] Créer `src/App.vue` avec `<RouterView>` et layout sidebar

### Composants partagés

- [ ] Créer `AppButton.vue` (variantes primary/secondary/danger/ghost/outline, sizes sm/md/lg/icon, prop `disabled`)
- [ ] Créer `AppInput.vue` (`v-model`, label, message d'erreur)
- [ ] Créer `AppDialog.vue` (prop `isOpen`, slot contenu, émit `@close`)

### Module stagiaires

- [ ] Créer `src/services/internshipService.js` (appels Axios vers `/api/internships`)
- [ ] Créer `src/composables/useInternships.js` (`ref` list, `load`, `create`, `update`, `remove`)
- [ ] Créer `views/InternshipDashboard.vue` (switcher mobile/desktop via `useMediaQuery` breakpoint 890px)
- [ ] Créer `views/internships/DashboardDesktop.vue` + `DashboardMobile.vue`
- [ ] Créer `components/internships/InternshipCardDesktop.vue` (badges statut, `parseLocalDate` avec `String(str).slice(0,10).split('-')` pour gérer les ISO datetime MariaDB)
- [ ] Créer `components/internships/InternshipCardMobile.vue`
- [ ] Créer `components/internships/InternshipFormModal.vue`
- [ ] Initialiser Playwright : `npm init playwright@latest` dans `tests/e2e/`
- [ ] Écrire `sc01-navigation.spec.ts`, `sc03` à `sc06` (CRUD stagiaires + validation)
- [ ] Run Playwright → verts

### Module ateliers

- [ ] Créer `src/services/activityService.js`
- [ ] Créer `src/composables/useActivities.js`
- [ ] Créer `views/ActivityList.vue` (cartes dépliables, tags catégories supprimables au hover, upload document drag & drop, popover catégories avec fermeture Escape + clic extérieur)
- [ ] Créer `components/activities/ActivityFormModal.vue`
- [ ] Écrire `sc07-activity-crud.spec.ts`, `sc08-internship-association.spec.ts`, `sc09-internship-dissociation.spec.ts`, `sc-activity-enriched.spec.ts`
- [ ] Run Playwright → verts

### Module catégories

- [ ] Créer `src/services/categoryService.js`
- [ ] Créer `src/composables/useCategories.js`
- [ ] Créer `views/CategoryList.vue` (grille responsive, barre de recherche, Cannot Delete Modal via `AppDialog`)
- [ ] Créer `components/categories/CategoryFormModal.vue`
- [ ] Écrire `sc-category-crud.spec.ts`
- [ ] Run Playwright → verts

### Certificat + Paramètres

- [ ] Créer `views/CertificateView.vue` (`<iframe>` avec Blob URL PDF, boutons Imprimer / Télécharger)
- [ ] Créer `views/SettingsView.vue` (upload template DOCX, drag & drop, statut template actuel)
- [ ] Écrire `sc-certificate-download.spec.ts`, `sc-status-badges.spec.ts`
- [ ] Run Playwright complet → tous verts
- [ ] Commit : `feat(frontend): complete UI with all modules`

---

## Phase 7 — Vérification des tests *(~4h)*

- [ ] Restaurer la base de données de test : `mysql -u root -p < tests/setup/restore_db.sql`
- [ ] Run `npm run test:api` (Newman complet) → noter les résultats
- [ ] Run `npm run test:e2e` (Playwright complet) → noter les résultats
- [ ] Corriger les régressions identifiées
- [ ] Re-run après corrections → tous verts
- [ ] Remplir la table de tests manuels du rapport §7 (T01–T16) : colonnes "Résultat obtenu" et "Statut" ✅/❌
- [ ] Faire signer la table de tests par le chef de projet
- [ ] Commit : `test: all E2E and API tests passing`

---

## Phase 8 — Finalisation documentation *(~1 jour)*

- [ ] Mettre à jour le Gantt avec la planification réelle superposée à l'initiale
- [ ] Insérer Figure 1 (capture d'écran OneNote du CdC) dans §4.1
- [ ] Insérer Figure 3 (diagramme UML cas d'utilisation) dans §4.4.1
- [ ] Insérer Figure 4 (architecture 3-tiers) dans §5.1
- [ ] Insérer Figures 5–7 (diagrammes de séquence) dans §5.2
- [ ] Insérer Figure 8 (MCD/MLD) dans §5.3
- [ ] Insérer Figures 9–12 (mockups Pencil) dans §5.4
- [ ] Rédiger §8 Problèmes rencontrés avec vécu personnel (minimum 3–4 problèmes documentés)
- [ ] Rédiger §9 Améliorations et évolutions (idées personnelles + celles du CdC)
- [ ] Rédiger §10 Conclusion (rappel des 5 exigences ✅ + ce qui a bien fonctionné + bilan personnel)
- [ ] Rédiger §11 Remerciements
- [ ] Compléter §2.2 avec les noms des deux experts (principal + secondaire)
- [ ] Compléter §2.3 Matériel avec machine exacte + OS + versions exactes des logiciels
- [ ] Compléter §14 Annexes (journal de bord complet + collection Postman JSON exportée)
- [ ] Signer §12 Déclaration de non-plagiat (date + lieu)
- [ ] Générer la table des matières dans Word
- [ ] Générer la table des illustrations dans Word
- [ ] Relecture complète du rapport

---

## Phase 9 — Livraison *(~2h)*

- [ ] Run `npm run lint` → 0 warning Biome
- [ ] Run `npm run test:e2e` → tous verts
- [ ] Run `npm run test:api` → tous verts
- [ ] `docker compose down -v && docker compose up --build` depuis zéro → app complète fonctionnelle
- [ ] Vérifier la liste des livrables du CdC (rapport, code source, tests, template DOCX, README)
- [ ] Convertir le rapport `.md` en `.docx` selon le modèle GED CA TIC
- [ ] Exporter en PDF
- [ ] Déposer sur PkOrg avant le **2 juin 2026 à 17h00**
- [ ] Préparer les grandes lignes de la présentation orale (**17 juin 2026**)
