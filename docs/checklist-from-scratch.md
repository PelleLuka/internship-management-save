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
- [ ] Structurer les colonnes : colonne A = Tâche, colonne B = Durée, colonnes suivantes = jours (1 colonne = 1 heure)
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

### État initial (rapport §4.1)

- [ ] Décrire le système existant : suivi des stages dans Microsoft OneNote (notes non structurées)
- [ ] Lister les 5 limitations du système actuel :
  - Aucune centralisation structurée des données
  - Pas de vue d'ensemble sur l'historique des stages par personne
  - Identification du statut (passé / en cours / à venir) laborieuse
  - Génération du certificat entièrement manuelle
  - Risque d'erreurs humaines et de pertes de données
- [ ] Insérer la capture d'écran OneNote fournie dans le CdC (Figure 1) dans §4.1

### État désiré (rapport §4.2)

- [ ] Décrire les 5 modules fonctionnels souhaités :
  - Gestion des stagiaires avec calcul automatique du statut (À venir / En cours / Terminé)
  - Catalogue centralisé des ateliers (titre, description, catégories, document annexe)
  - Gestion des catégories (classification des ateliers)
  - Association ateliers ↔ stages (depuis la fiche du stagiaire)
  - Génération du certificat PDF depuis un template DOCX personnalisable
- [ ] Rédiger le schéma de principe de fonctionnement dans §4.2 :
  ```
  [Administrateur CA TIC] → [Interface Vue.js] → [API Express.js] → [MariaDB]
                                                        ↓
                                                [Fichiers uploads]
  ```

### Public cible (rapport §4.3)

- [ ] Identifier l'unique type d'utilisateur : équipe CA TIC (formateurs + responsables administratifs)
- [ ] Confirmer qu'il n'y a pas d'accès public ni de gestion de rôles pour cette version
- [ ] Rédiger §4.3 dans le rapport

### Besoins et cas d'utilisation (rapport §4.4)

- [ ] Identifier l'acteur unique du système : **Administrateur CA TIC**
- [ ] Lister les 5 cas d'utilisation principaux :
  - Gérer les stagiaires (créer, modifier, supprimer, consulter)
  - Gérer les ateliers (créer, modifier, supprimer, upload document)
  - Gérer les catégories (créer, modifier, supprimer)
  - Associer des ateliers à un stage
  - Générer le certificat PDF d'un stage
- [ ] Créer le diagramme UML de cas d'utilisation avec Draw.io ou PlantUML :
  - Un acteur à gauche : « Administrateur CA TIC »
  - 5 bulles de cas d'utilisation reliées par des flèches
  - Exporter en PNG → sauvegarder dans `docs/use-case/use-case.png`
  - Insérer dans §4.4.1 (Figure 3)
- [ ] Rédiger les descriptions des besoins dans §4.4.2 — tableau Quoi/Pourquoi/Comment/Contrainte pour chaque action :
  - Ajouter / Modifier / Supprimer / Consulter un stagiaire
  - Ajouter / Modifier / Supprimer un atelier + upload document
  - Ajouter / Modifier / Supprimer une catégorie
  - Associer un atelier à un stage
  - Générer le certificat PDF
- [ ] Remplir le tableau de synthèse des besoins par acteur (§4.4.2)

### Variantes techniques (rapport §4.5)

**Architecture :**
- [ ] Étudier 2 variantes : Monolithique (SSR Node.js) vs Architecture 3-tiers séparée (SPA + API REST + DB)
- [ ] Créer la matrice de comparaison (critères : adéquation technologies imposées 40%, maintenabilité 40%, complexité 20%) :

  | Architecture | Adéquation | Maintenabilité | Complexité | Note |
  |---|---|---|---|---|
  | Monolithique | 1 | 1 | 3 | 1.6 |
  | **3-tiers séparée** | **3** | **3** | **2** | **2.7** |

- [ ] Conclure : **3-tiers retenue** — correspond aux technologies imposées, séparation claire des responsabilités

**Stockage des documents :**
- [ ] Étudier 2 variantes : BLOB en base de données vs Filesystem + référence en DB
- [ ] Conclure : **Filesystem retenu** — performances optimales, nommage `<uuid>-<nom-sanitisé>.<ext>`, dossier `backend/uploads/` bind-monté depuis le repo (le template du certificat est versionné, les fichiers utilisateurs sont gitignored)

**Génération du certificat :**
- [ ] Étudier 2 variantes : HTML → PDF via Puppeteer vs DOCX template → PDF via carbone.js + LibreOffice
- [ ] Conclure : **carbone.js retenu** — template Word modifiable par l'admin sans intervention du développeur

### Technologies (rapport §4.6)

- [ ] Remplir le tableau des technologies retenues dans §4.6 :

  | Technologie | Rôle | Justification |
  |---|---|---|
  | Vue.js 3 (Composition API) | Frontend SPA | Imposé par le CdC, réactivité fine |
  | Vite | Bundler | HMR ultra-rapide, configuration minimale |
  | Express.js | API REST | Imposé par le CdC, minimaliste et flexible |
  | MariaDB | Base de données | Imposé par le CdC, contraintes FK natives |
  | Docker + Docker Compose | Conteneurisation | Environnement reproductible, volumes persistants |
  | Tailwind CSS | Framework CSS | Cohérence visuelle sans CSS custom |
  | Biome | Linter + formatter | Remplace ESLint + Prettier, tri auto des imports |
  | Playwright | Tests E2E | Simulation navigateur réel, multi-navigateurs |
  | Postman / Newman | Tests API | Validation contrat REST, exécutable en CLI |
  | carbone.js | Génération PDF | Injection données dans DOCX, conversion LibreOffice |
  | multer | Upload fichiers | Middleware Express standard multipart/form-data |
  | Lucide Vue | Icônes | SVG légers et cohérents avec le design |

### Rapport et journal

- [ ] Vérifier que §4.1 à §4.6 sont entièrement remplis dans le rapport
- [ ] Journal de bord : remplir les entrées de chaque journée de la phase 2

---

## Phase 3 — Conception *(~1 jour)*

### Mockups Pencil (rapport §5.4)

- [ ] Ouvrir Pencil et créer un nouveau fichier `WorkXPAdmin.pen`
- [ ] Dessiner l'écran **Liste des stages** (Figure 9) :
  - Sidebar de navigation à gauche (liens : Stages, Ateliers, Catégories, Paramètres)
  - Header avec titre « Stages » + bouton « + Nouveau stage »
  - Grille de cartes : chaque carte affiche prénom, nom, email, dates, badge statut coloré (À venir / En cours / Terminé)
- [ ] Dessiner l'écran **Liste des ateliers repliée** (Figure 10a) :
  - Même sidebar
  - Header avec titre « Ateliers » + bouton « + Nouvel atelier »
  - Liste de cartes compactes : titre, badges catégories, bouton déplier
- [ ] Dessiner l'écran **Liste des ateliers dépliée** (Figure 10b) :
  - Même carte mais étendue : mini-cartes stats (nombre de stages, état document), section catégories avec popover, zone document drag & drop
- [ ] Dessiner l'écran **Catégories** (Figure 11) :
  - Grille de cartes : icône Tag, nom, description, compteur d'ateliers liés, boutons Modifier/Supprimer
  - Barre de recherche dans le header
- [ ] Dessiner l'écran **Paramètres** (Figure 12) :
  - Zone upload template DOCX pour le certificat
  - Statut du template actuel (nom du fichier ou « Aucun template »)
- [ ] Faire des captures d'écran de chaque écran Pencil → sauvegarder dans `docs/mockup/`
- [ ] Insérer les captures dans §5.4 du rapport (Figures 9–12)

### Schéma d'architecture (rapport §5.1)

- [ ] Ouvrir Draw.io et créer un nouveau diagramme
- [ ] Dessiner 3 boîtes principales :
  - **Frontend** : « Vue.js 3 + Vite » sur le port `:8081`
  - **Backend** : « Node.js + Express.js » sur le port `:3000`
  - **Base de données** : « MariaDB » sur le port `:3306`
- [ ] Ajouter le dossier `backend/uploads/` (cylindre, bind mount) relié au backend
- [ ] Ajouter les flèches étiquetées : `HTTP/JSON` (navigateur → frontend), `REST API` (frontend → backend), `SQL` (backend → MariaDB), `R/W` (backend → backend/uploads/)
- [ ] Exporter en PNG → `docs/architecture/architecture-3tiers.png`
- [ ] Insérer dans §5.1 du rapport (Figure 4)

### Diagrammes de séquence (rapport §5.2)

Ouvrir PlantUML (plantuml.com ou extension VS Code). Créer un fichier `.txt` par séquence, générer le PNG, sauvegarder dans `docs/sequence-diagram/`.

**Stagiaires — 5 séquences**

- [ ] **Afficher la liste des stagiaires** → `GET /internships` → liste retournée → affichage
  - Évènements perturbateurs : backend indisponible, DB indisponible, aucun stagiaire, erreur de récupération
  - Export → `docs/sequence-diagram/display-internship.png`

- [ ] **Consulter les informations détaillées d'un stagiaire** → sélectionne une carte → `GET /internships/:id` → détails + ateliers associés retournés
  - Évènements perturbateurs : stagiaire non trouvé, backend/DB indisponible
  - Export → `docs/sequence-diagram/consult-internship-detail.png`

- [ ] **Créer un stagiaire** :
  ```plantuml
  @startuml
  actor Administrateur
  participant "Vue.js" as Vue
  participant "Express API" as API
  database "MariaDB" as DB

  Administrateur -> Vue : Remplit le formulaire et clique "Enregistrer"
  Vue -> API : POST /api/internships\n{firstName, lastName, email, startDate, endDate}
  API -> API : Valide (dates cohérentes, champs obligatoires)
  API -> DB : INSERT INTO person
  DB --> API : insertId (person)
  API -> DB : INSERT INTO internship
  DB --> API : insertId (internship)
  API --> Vue : 201 Created {id, firstName, ...}
  Vue -> Vue : Recharge la liste
  Vue --> Administrateur : Modal fermée, carte ajoutée
  @enduml
  ```
  - Export → `docs/sequence-diagram/create-internship.png`

- [ ] **Modifier un stagiaire** → bouton édition → formulaire pré-rempli → `PUT /api/internships/:id` → `200 OK` → carte mise à jour
  - Export → `docs/sequence-diagram/modify-internship.png`

- [ ] **Supprimer un stagiaire** → bouton suppression → dialog de confirmation → `DELETE /api/internships/:id` → `204 No Content` → carte retirée de la liste
  - Export → `docs/sequence-diagram/delete-internship.png`

**Ateliers — 4 séquences**

- [ ] **Consulter la liste des ateliers** → `GET /api/activities` (IDs) → pour chaque ID `GET /api/activities/:id` → liste de cartes affichée
  - Évènements perturbateurs : backend/DB indisponible, aucune activité
  - Export → `docs/sequence-diagram/consult-activity.png`

- [ ] **Créer une activité** → formulaire modal → `POST /api/activities` → `201 Created` → carte ajoutée
  - Export → `docs/sequence-diagram/create-activity.png`

- [ ] **Modifier une activité** → bouton édition → formulaire pré-rempli → `PATCH /api/activities/:id` → `200 OK` → carte mise à jour
  - Export → `docs/sequence-diagram/modify-activity.png`

- [ ] **Supprimer une activité** → bouton suppression → vérifie `internshipCount` → si `> 0` : bouton désactivé (HTTP 409) / si `= 0` : `DELETE /api/activities/:id` → soft delete (`visible = 0`) → carte retirée
  - Export → `docs/sequence-diagram/delete-activity.png`

**Catégories — 3 séquences**

- [ ] **Créer une catégorie** → formulaire modal → `POST /api/categories` → `201 Created` → carte ajoutée à la grille
  - Export → `docs/sequence-diagram/create-category.png`

- [ ] **Modifier une catégorie** → bouton édition → formulaire pré-rempli → `PUT /api/categories/:id` → `200 OK` → carte mise à jour
  - Export → `docs/sequence-diagram/modify-category.png`

- [ ] **Supprimer une catégorie** → bouton suppression → service vérifie `activityCount` → si `> 0` : HTTP 409 → modal « Suppression impossible » / si `= 0` : `DELETE /api/categories/:id` → `204 No Content` → carte retirée
  - Export → `docs/sequence-diagram/delete-category.png`

**Associations — 2 séquences**

- [ ] **Associer un atelier à un stagiaire** → popover « Ajouter un atelier » → sélectionne atelier → `POST /api/internships/:id/activities/:actId` → `201 Created` → tag atelier apparaît sur la carte du stage
  - Export → `docs/sequence-diagram/manage-internship-activity.png`

- [ ] **Associer une catégorie à un atelier** → popover « Ajouter une catégorie » dans la carte dépliée → sélectionne catégorie → `POST /api/activities/:id/categories/:catId` → `201 Created` → badge catégorie apparaît sur la carte atelier
  - Export → `docs/sequence-diagram/manage-activity-category.png`

**Certificat et document — 2 séquences**

- [ ] **Upload d'un document sur un atelier** :
  ```plantuml
  @startuml
  actor Administrateur
  participant "Vue.js" as Vue
  participant "Express + multer" as API
  database "MariaDB" as DB
  collections "Filesystem\n/app/uploads" as FS

  Administrateur -> Vue : Glisse un fichier dans la zone upload
  Vue -> API : POST /api/activities/:id/document (multipart/form-data)
  API -> API : Valide type MIME et taille (max 10 MB)
  API -> FS : Stocke <uuid>-<nom>.<ext>
  API -> DB : UPDATE activity SET document_url = ?
  DB --> API : OK
  API --> Vue : 200 OK {documentUrl: "..."}
  Vue --> Administrateur : Zone document mise à jour
  @enduml
  ```
  - Export → `docs/sequence-diagram/upload-document.png`

- [ ] **Génération du certificat PDF** :
  ```plantuml
  @startuml
  actor Administrateur
  participant "Vue.js" as Vue
  participant "Express API" as API
  database "MariaDB" as DB
  collections "Filesystem" as FS

  Administrateur -> Vue : Clique "Aperçu du certificat"
  Vue -> Vue : Navigue vers /certificate/:id
  Vue -> API : GET /api/internships/:id/certificate
  API -> DB : SELECT stage + ateliers associés
  DB --> API : {prenom, nom, ateliers[], ...}
  API -> FS : Lit template.docx
  API -> API : carbone.js injecte les données
  API -> API : LibreOffice convertit DOCX en PDF
  API --> Vue : Stream binaire PDF
  Vue -> Vue : Crée Blob URL, affiche dans <iframe>
  Vue --> Administrateur : PDF + boutons Imprimer/Télécharger
  @enduml
  ```
  - Export → `docs/sequence-diagram/generate-certificate.png`

- [ ] Insérer les 14 diagrammes de séquence dans §5.2 du rapport avec leur titre et leurs évènements perturbateurs

### Base de données (rapport §5.3)

- [ ] Créer le schéma MCD/MLD sur DbDiagram.io avec les 5 tables et leurs relations → exporter en PNG → `docs/database-diagram/db-diagram.png`
- [ ] Rédiger le schéma SQL complet dans `database/init.sql` :
  ```sql
  CREATE TABLE person (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    email VARCHAR(254) NOT NULL
  );

  CREATE TABLE internship (
    id INT PRIMARY KEY AUTO_INCREMENT,
    person_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    CONSTRAINT chk_dates CHECK (end_date >= start_date),
    FOREIGN KEY (person_id) REFERENCES person(id) ON DELETE CASCADE
  );

  CREATE TABLE activity (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    document_url VARCHAR(500),
    visible BOOLEAN NOT NULL DEFAULT TRUE
  );

  CREATE TABLE category (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT
  );

  CREATE TABLE internship_activity (
    internship_id INT NOT NULL,
    activity_id INT NOT NULL,
    PRIMARY KEY (internship_id, activity_id),
    FOREIGN KEY (internship_id) REFERENCES internship(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activity(id) ON DELETE RESTRICT
  );

  CREATE TABLE activity_category (
    activity_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (activity_id, category_id),
    FOREIGN KEY (activity_id) REFERENCES activity(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE RESTRICT
  );
  ```
- [ ] Vérifier les contraintes FK : CASCADE sur suppression de personne/stage, RESTRICT sur suppression d'atelier/catégorie lié
- [ ] Insérer Figure 8 (MCD/MLD) dans §5.3 du rapport

### Contrat API

- [ ] Définir le tableau complet des endpoints par module :

  **Stagiaires**

  | Méthode | Route | Description |
  |---|---|---|
  | GET | `/api/internships` | Liste tous les stages |
  | POST | `/api/internships` | Crée un stage |
  | GET | `/api/internships/:id` | Détails d'un stage |
  | PUT | `/api/internships/:id` | Modifie un stage |
  | DELETE | `/api/internships/:id` | Supprime un stage |
  | GET | `/api/internships/:id/activities` | Ateliers liés au stage |
  | POST | `/api/internships/:id/activities/:actId` | Associe un atelier |
  | DELETE | `/api/internships/:id/activities/:actId` | Dissocie un atelier |
  | GET | `/api/internships/:id/certificate` | Génère le PDF |

  **Ateliers**

  | Méthode | Route | Description |
  |---|---|---|
  | GET | `/api/activities` | Liste les IDs visibles |
  | GET | `/api/activities/:id` | Détails + catégories + internshipCount |
  | POST | `/api/activities` | Crée un atelier |
  | PATCH | `/api/activities/:id` | Modifie partiellement |
  | DELETE | `/api/activities/:id` | Soft delete (visible = 0) |
  | POST | `/api/activities/:id/document` | Upload document |
  | GET | `/api/activities/:id/document` | Télécharge document |
  | DELETE | `/api/activities/:id/document` | Supprime document |

  **Catégories**

  | Méthode | Route | Description |
  |---|---|---|
  | GET | `/api/categories` | Liste avec activityCount |
  | POST | `/api/categories` | Crée une catégorie |
  | PUT | `/api/categories/:id` | Modifie une catégorie |
  | DELETE | `/api/categories/:id` | Supprime (bloqué si ateliers liés) |

  **Certificat**

  | Méthode | Route | Description |
  |---|---|---|
  | GET | `/api/certificate/template` | Statut du template |
  | POST | `/api/certificate/template` | Upload template DOCX |

### Stratégie de tests (rapport §5.5)

- [ ] Décider des deux types de tests à mettre en place : **Playwright E2E** + **Postman/Newman API**
- [ ] Lister les scénarios E2E à écrire (un par fonctionnalité principale) :
  - Navigation entre les pages
  - CRUD stagiaires (création, validation, modification, suppression)
  - Badges de statut (À venir / En cours / Terminé)
  - CRUD ateliers (avec contrainte suppression bloquée)
  - CRUD catégories (avec Cannot Delete Modal)
  - Association ateliers ↔ stages
  - Navigation vers la page certificat
- [ ] Décider du jeu de données de test : créer `tests/setup/restore_db.sql` avec des données minimales reproductibles
- [ ] Rédiger §5.5 dans le rapport (tableau scénarios Playwright + description collection Postman)

### Rapport et journal

- [ ] Vérifier que §5.1 à §5.5 sont entièrement remplis dans le rapport
- [ ] Commit : `docs: add architecture diagram, sequence diagrams, DB schema and API contract`
- [ ] Journal de bord : remplir les entrées de chaque journée de la phase 3

---

## Phase 4 — Infrastructure *(~3h)*

### Variables d'environnement

- [ ] Ajouter `.env` au `.gitignore` **avant** de créer le fichier (avec exception `!.env.example`) :
  ```
  # Environment variables
  .env
  !.env.example
  ```
- [ ] Créer `.env.example` (à commiter, valeurs vides pour les secrets) :
  ```
  DB_HOST=localhost
  DB_USER=user
  DB_PASSWORD=
  DB_NAME=internship_management
  PORT=3000
  ```
- [ ] Créer `.env` à la racine en copiant `.env.example` et en remplissant les valeurs (jamais commité)
  > ⚠️ **Vérifier** : `git ls-files | grep .env` ne doit jamais retourner `.env` seul. Si oui : `git rm --cached .env` immédiatement.

### Docker Compose

- [ ] Créer `docker/docker-compose.yml` avec **4 services** : `backend`, `frontend`, `database`, `backup` :
  ```yaml
  services:
    backend:
      build:
        context: ..
        dockerfile: docker/Dockerfile.backend
      ports:
        - "3000:3000"
      volumes:
        - ../backend:/app/backend
        - /app/backend/node_modules
        # ⚠️ Ne PAS utiliser un named volume sur /app/backend/uploads : il masquerait
        # le bind mount de ../backend et le template (backend/uploads/certificate/template.docx)
        # serait invisible dans le container → erreur NO_TEMPLATE / 400 sur la génération.
      command: npm run dev --workspace=backend
      environment:
        - DB_HOST=database
        - DB_USER=user
        - DB_PASSWORD=password
        - DB_NAME=internship_management
        - PORT=3000
      depends_on:
        - database
      networks:
        - app-network

    frontend:
      build:
        context: ..
        dockerfile: docker/Dockerfile.frontend
        target: builder
      ports:
        - "8081:5173"
      volumes:
        - ../frontend:/app/frontend
        - /app/frontend/node_modules
      command: npm run dev --workspace=frontend -- --host
      environment:
        - VITE_API_TARGET=http://backend:3000
      depends_on:
        - backend
      networks:
        - app-network

    database:
      image: mariadb:latest
      ports:
        - "3306:3306"
      environment:
        - MARIADB_ROOT_PASSWORD=root_password
        - MARIADB_DATABASE=internship_management
        - MARIADB_USER=user
        - MARIADB_PASSWORD=password
      volumes:
        - mariadb_data:/var/lib/mysql
        - ../database/schema.sql:/docker-entrypoint-initdb.d/init.sql
      networks:
        - app-network

    backup:
      build:
        context: ..
        dockerfile: docker/Dockerfile.backup
      volumes:
        - ../backup/data:/data
        - ../backup/scripts:/scripts
        - ../backup/config/crontab:/var/spool/cron/crontabs/root
      depends_on:
        - database
      networks:
        - app-network

  volumes:
    mariadb_data:

  networks:
    app-network:
      driver: bridge
  ```
  > **Stratégie uploads :** les fichiers d'activités et le template du certificat vivent dans `backend/uploads/` (bind-monté depuis le repo).
  > - Le **template** (`backend/uploads/certificate/template.docx`) est versionné dans le repo et toujours disponible au démarrage.
  > - Les **uploads d'activités** (`backend/uploads/activities/`) sont écrits côté hôte. Ajouter au `.gitignore` :
  >   ```
  >   backend/uploads/activities/*
  >   !backend/uploads/activities/.gitkeep
  >   ```
  > - Si l'admin upload un nouveau template via l'UI, il écrase `backend/uploads/certificate/template.docx`. Sur un dev pull, ça apparaît comme un fichier modifié — c'est normal.
- [ ] Vérifier que `depends_on` est correct : `frontend` attend `backend`, `backend` attend `database`

### Dockerfile backend

- [ ] Créer `docker/Dockerfile.backend` (Node 22 Alpine + LibreOffice pour carbone.js) :
  ```dockerfile
  FROM node:22-alpine AS builder

  # LibreOffice pour la conversion PDF via carbone.js
  RUN apk add --no-cache \
      libreoffice \
      openjdk11-jre-headless \
      font-noto \
      font-noto-cjk

  # ⚠️ Indispensable : Carbone (sur Linux) appelle directement `soffice.bin`, pas `soffice`.
  # Le binaire est dans /usr/lib/libreoffice/program/ qui n'est pas dans le PATH par défaut sur Alpine.
  # Sans cette ligne, `which.sync('soffice.bin')` échoue → "Cannot find LibreOffice" → 500 sur la génération PDF.
  ENV PATH="/usr/lib/libreoffice/program:${PATH}"

  WORKDIR /app

  # Copier les manifestes racine et workspace
  COPY package.json package-lock.json ./
  COPY frontend/package.json ./frontend/
  COPY backend/package.json ./backend/

  # Installer uniquement les dépendances de production
  RUN npm ci --omit=dev

  # Copier le code source backend
  COPY backend ./backend

  EXPOSE 3000

  CMD ["npm", "run", "start:backend"]
  ```

### Dockerfile frontend

- [ ] Créer `docker/Dockerfile.frontend` (build multi-stage : Vite → Nginx) :
  ```dockerfile
  # Build stage
  FROM node:22-alpine AS builder

  WORKDIR /app

  COPY package.json package-lock.json ./
  COPY frontend/package.json ./frontend/
  COPY backend/package.json ./backend/

  RUN npm ci

  COPY frontend ./frontend

  RUN npm run build:frontend

  # Production stage
  FROM nginx:alpine

  COPY --from=builder /app/frontend/dist /usr/share/nginx/html
  COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

  EXPOSE 80

  CMD ["nginx", "-g", "daemon off;"]
  ```
- [ ] Créer `docker/nginx.conf` (SPA fallback + proxy API vers le backend) :
  ```nginx
  server {
      listen 80;
      server_name localhost;

      root /usr/share/nginx/html;
      index index.html;

      location / {
          try_files $uri $uri/ /index.html;
      }

      location /api/ {
          proxy_pass http://backend:3000/;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
      }
  }
  ```

### Dockerfile backup

- [ ] Créer `docker/Dockerfile.backup` (Alpine + mariadb-client + crond pour les sauvegardes automatiques) :
  ```dockerfile
  FROM alpine:latest

  RUN apk add --no-cache mariadb-client bash busybox-suid

  RUN mkdir -p /var/log

  CMD ["crond", "-f", "-d", "8"]
  ```

### Schéma SQL

- [ ] Créer `database/schema.sql` avec les 6 tables dans l'ordre (respecter les dépendances FK) :
  ```sql
  CREATE TABLE `person` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `first_name` VARCHAR(80) NOT NULL,
    `last_name` VARCHAR(80) NOT NULL,
    `email` VARCHAR(254) NOT NULL
  );

  CREATE TABLE `internship` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `person_id` INT NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    CONSTRAINT `chk_internship_dates_valid` CHECK (`end_date` >= `start_date`),
    CONSTRAINT `fk_internship_person`
      FOREIGN KEY (`person_id`) REFERENCES `person`(`id`) ON DELETE CASCADE
  );

  CREATE TABLE `activity` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `document_url` VARCHAR(500) NULL,
    `visible` BOOLEAN NOT NULL DEFAULT true
  );

  CREATE TABLE `category` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL
  );

  CREATE TABLE `internship_activity` (
    `internship_id` INT NOT NULL,
    `activity_id` INT NOT NULL,
    PRIMARY KEY (`internship_id`, `activity_id`),
    FOREIGN KEY (`internship_id`) REFERENCES `internship`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`activity_id`) REFERENCES `activity`(`id`) ON DELETE RESTRICT
  );

  CREATE TABLE `activity_category` (
    `activity_id` INT NOT NULL,
    `category_id` INT NOT NULL,
    PRIMARY KEY (`activity_id`, `category_id`),
    FOREIGN KEY (`activity_id`) REFERENCES `activity`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE RESTRICT
  );
  ```
- [ ] Vérifier l'ordre de création : `person` et `activity` et `category` avant les tables de jonction

### Script de restauration DB (pour les tests)

- [ ] Créer `tests/setup/restore_db.sql` avec `TRUNCATE` + données reproductibles :
  ```sql
  SET FOREIGN_KEY_CHECKS = 0;

  TRUNCATE TABLE internship_activity;
  TRUNCATE TABLE activity_category;
  TRUNCATE TABLE internship;
  TRUNCATE TABLE person;
  TRUNCATE TABLE activity;
  TRUNCATE TABLE category;

  INSERT INTO activity (id, title, visible) VALUES
    (1, 'Jeu de mémoire lumineux Ordo Lumina (Python)', 1),
    (2, 'Montage d''un poste de travail PC', 1),
    -- ... (compléter avec tous les ateliers)
  ;

  INSERT INTO person (id, first_name, last_name, email) VALUES
    (1, 'Lucas', 'Martin', 'lucas.martin@example.com'),
    -- ... (compléter)
  ;

  INSERT INTO internship (id, person_id, start_date, end_date) VALUES
    (1, 1, '2024-01-09', '2024-07-09'),
    -- ... (compléter, inclure des stages À venir, En cours et Terminés)
  ;

  -- 6 catégories par défaut (voir screenshots_problem/problem6.png)
  INSERT INTO category (id, name, description) VALUES
    (1, 'Développement', 'Activités de programmation, développement logiciel et création de jeux'),
    (2, 'Système', 'Installation, configuration et administration de systèmes d''exploitation'),
    (3, 'Réseau', 'Activités liées aux réseaux informatiques et à la communication'),
    (4, 'Hardware', 'Montage, configuration et utilisation de matériel informatique'),
    (5, 'Graphisme', 'Création visuelle, retouche d''image et composition graphique'),
    (6, 'Modélisation 3D', 'Modélisation, impression et démonstration en 3D');

  -- Liens activité ↔ catégorie (1 catégorie par activité, sauf id 13 qui en a 2)
  INSERT INTO activity_category (activity_id, category_id) VALUES
    (1,1),(2,4),(3,2),(4,1),(5,1),(6,1),(7,3),(8,1),(9,1),(10,2),(11,5),(12,1),(13,4),(13,6);

  SET FOREIGN_KEY_CHECKS = 1;
  ```
- [ ] Vérifier que le jeu de données inclut des stages avec les 3 statuts possibles (À venir, En cours, Terminé) pour les tests E2E
- [ ] Vérifier que chaque catégorie a au moins 1 atelier (le bouton Supprimer doit être désactivable et testable). Counts attendus : Développement 7, Système 2, Réseau 1, Hardware 2, Graphisme 1, Modélisation 3D 1
- [ ] Créer `tests/setup/restoreDb.js` — script Node.js ESM qui lit `restore_db.sql` et l'exécute via le driver mariadb avec `multipleStatements: true` :
  ```js
  import mariadb from 'mariadb';
  import fs from 'fs';
  import path from 'path';
  import { fileURLToPath } from 'url';
  import dotenv from 'dotenv';

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });

  const conn = await mariadb.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'internship_management',
    multipleStatements: true,
  });

  const sql = fs.readFileSync(path.join(__dirname, 'restore_db.sql'), 'utf8');
  await conn.query(sql);
  await conn.end();
  console.log('DB restaurée.');
  ```

### Pool MariaDB (backend)

- [ ] Créer `backend/config/db.js` — pool de 5 connexions, lit `.env` depuis la racine du monorepo :
  ```js
  import mariadb from 'mariadb';
  import dotenv from 'dotenv';
  import path from 'path';
  import { fileURLToPath } from 'url';

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });

  const pool = mariadb.createPool({
    host: process.env.DB_HOST || 'database',
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'internship_management',
    connectionLimit: 5,
  });

  export default pool;
  ```

### Vérification

- [ ] Lancer l'infrastructure : `docker compose -f docker/docker-compose.yml up --build`
- [ ] Vérifier que les 4 conteneurs démarrent sans erreur dans les logs
- [ ] Tester l'accès au frontend : ouvrir `http://localhost:8081` dans le navigateur
- [ ] Tester l'accès à l'API : `curl http://localhost:3000/api/internships` → doit retourner `[]`
- [ ] Vérifier la connexion MariaDB depuis le conteneur backend :
  ```bash
  docker compose exec backend node -e "import('./backend/config/db.js').then(m => m.default.getConnection()).then(c => { console.log('OK'); c.end(); })"
  ```
- [ ] Vérifier que le template du certificat est accessible : `docker compose exec backend ls /app/backend/uploads/certificate/template.docx` → fichier listé
- [ ] Vérifier que le bind mount fonctionne : un upload via `POST /api/activities/:id/document` doit créer un fichier dans `backend/uploads/activities/` côté hôte
- [ ] Commit : `chore: add Docker infrastructure, Nginx, DB schema and test restore script`

---

## Phase 5 — Backend + tests API *(~3 jours)*

### Setup Express

- [ ] Créer `backend/package.json` :
  ```json
  {
    "name": "backend",
    "private": true,
    "version": "1.0.0",
    "type": "module",
    "scripts": {
      "start": "node server.js",
      "dev": "node --watch server.js"
    }
  }
  ```
  > `node --watch` remplace nodemon (natif Node.js 18+, pas de dépendance supplémentaire)

- [ ] Installer les dépendances backend :
  ```bash
  cd backend && npm install express mariadb multer carbone cors dotenv winston date-fns
  ```
  > Pas de `uuid` — utiliser `crypto.randomUUID()` natif de Node.js

- [ ] Créer la structure des dossiers :
  ```
  backend/
  ├── config/
  │   ├── db.js          ← pool MariaDB
  │   └── logger.js      ← winston logger
  ├── controllers/
  ├── middleware/
  ├── models/
  ├── routes/
  ├── services/
  ├── uploads/
  │   ├── activities/    ← documents des ateliers
  │   └── certificate/   ← template DOCX
  └── server.js
  ```

- [ ] Créer `backend/config/logger.js` — winston avec transports fichier (`error.log`, `combined.log`) + console en dev :
  ```js
  import winston from 'winston';
  import path from 'path';
  import { fileURLToPath } from 'url';

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const logDir = path.join(__dirname, '..', 'logs');

  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    defaultMeta: { service: 'internship-service' },
    transports: [
      new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
      new winston.transports.File({ filename: path.join(logDir, 'combined.log') }),
    ],
  });

  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }));
  }

  export default logger;
  ```

- [ ] Créer `backend/middleware/requestLogger.js` — log chaque requête HTTP entrante via winston

- [ ] Créer `backend/server.js` — point d'entrée Express avec CORS, JSON, requestLogger, 5 routes montées :
  ```js
  import cors from 'cors';
  import dotenv from 'dotenv';
  import express from 'express';
  import path from 'path';
  import { fileURLToPath } from 'url';
  import logger from './config/logger.js';
  import requestLogger from './middleware/requestLogger.js';
  import healthRoutes from './routes/healthRoutes.js';
  import internshipRoutes from './routes/internshipRoutes.js';
  import activityRoutes from './routes/activityRoutes.js';
  import categoryRoutes from './routes/categoryRoutes.js';
  import certificateRoutes from './routes/certificateRoutes.js';

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  dotenv.config({ path: path.resolve(__dirname, '../.env') });

  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  app.use('/api/health', healthRoutes);
  app.use('/api/internships', internshipRoutes);
  app.use('/api/activities', activityRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/certificate', certificateRoutes);

  app.use((err, _req, res, _next) => {
    logger.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

  app.listen(PORT, () => logger.info(`Backend running on http://localhost:${PORT}`));
  ```

- [ ] Créer `backend/routes/healthRoutes.js` → `GET /api/health` retourne `{ status: 'ok' }`
- [ ] Tester : `curl http://localhost:3000/api/health` → `{ "status": "ok" }`

### Middleware upload

- [ ] Créer `backend/middleware/upload.js` — deux configurations multer distinctes :
  ```js
  import multer from 'multer';
  import path from 'path';
  import { randomUUID } from 'crypto';       // natif Node.js, pas de dépendance
  import { fileURLToPath } from 'url';

  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.oasis.opendocument.spreadsheet',
  ];

  const activityStorage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads/activities'),
    filename: (_req, file, cb) => {
      const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
      cb(null, `${randomUUID()}-${safeName}`);
    },
  });

  const certificateStorage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads/certificate'),
    filename: (_req, _file, cb) => cb(null, 'template.docx'),  // nom fixe
  });

  export const uploadActivityDocument = multer({
    storage: activityStorage,
    limits: { fileSize: 10 * 1024 * 1024 },  // 10 MB
    fileFilter: (_req, file, cb) => {
      if (ALLOWED_MIME_TYPES.includes(file.mimetype)) return cb(null, true);
      cb(new Error('INVALID_FILE_TYPE'));
    },
  }).single('document');

  export const uploadCertificateTemplate = multer({
    storage: certificateStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const docxMime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      if (file.mimetype === docxMime) return cb(null, true);
      cb(new Error('INVALID_FILE_TYPE'));
    },
  }).single('template');
  ```

### Module stagiaires

**Principes du pattern Model → Service → Controller → Route :**
- **Model** : requêtes SQL uniquement, `let conn; try { ... } finally { if (conn) conn.end(); }`
- **Service** : logique métier, lève des erreurs nommées (`throw new Error('NOT_FOUND')`)
- **Controller** : parse les params HTTP, appelle le service, construit la réponse HTTP
- **Route** : définit les URLs et verbes HTTP, importe les controllers

- [ ] Créer `backend/models/Person.js` — CRUD sur la table `person` (`create`, `update`, `delete`)
- [ ] Créer `backend/models/Internship.js` — `getAll(limit, offset, search)`, `count(search)`, `getById`, `create`, `update`, `delete`, `getActivities`, `addActivity` (INSERT IGNORE), `removeActivity`
  > `getAll` supporte la pagination (`LIMIT ? OFFSET ?`) et la recherche (`WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ?`)
- [ ] Créer `backend/services/internshipService.js` — erreurs nommées **alignées avec le controller** :
  - `NOT_FOUND`, `MISSING_FIELDS`, `NAME_TOO_LONG`, `EMAIL_TOO_LONG`, `INVALID_EMAIL`, `INVALID_DATE_FORMAT`, `END_DATE_BEFORE_START`
  - Helper `validateFields(data, { partial })` mutualisé entre `createInternship` et `updateInternship`
  - `createInternship` retourne **l'objet complet** via `Internship.getById(insertedId)` (pas juste l'ID)
  - `updateInternship` retourne **l'objet mis à jour** via `Internship.getById(id)` (jamais `undefined`)
  > Helpers internes : `isValidEmail(email)` (regex), `isValidDate(str)` (format YYYY-MM-DD + date valide)
  > ⚠️ **Piège classique** : si le service throw `VALIDATION_ERROR:*` mais que le controller catch `MISSING_FIELDS`, les erreurs 400 deviennent des 500. Toujours utiliser **les mêmes codes** des deux côtés.
- [ ] Créer `backend/controllers/internshipController.js` — parse `Number.parseInt(req.params.id, 10)`, codes HTTP :
  - Helper `replyValidationError(err, res)` avec table `VALIDATION_ERRORS` mappant chaque code → `[status, message]`
  - `200` GET liste/détail, `201` création, `204` suppression, `404` NOT_FOUND, `400` validation, `500` erreur serveur
- [ ] Créer `backend/routes/internshipRoutes.js` — 9 endpoints :
  ```js
  router.get('/', getInternships);                                          // GET  /api/internships
  router.post('/', createInternship);                                       // POST /api/internships
  router.get('/:id', getInternshipById);                                    // GET  /api/internships/:id
  router.put('/:id', updateInternship);                                     // PUT  /api/internships/:id
  router.delete('/:id', deleteInternship);                                  // DEL  /api/internships/:id
  router.get('/:id/activities', getInternshipActivities);                   // GET  /api/internships/:id/activities
  router.post('/:internshipId/activities/:activityId', addActivity);        // POST /api/internships/:iid/activities/:aid
  router.delete('/:internshipId/activities/:activityId', removeActivity);   // DEL  /api/internships/:iid/activities/:aid
  router.get('/:id/certificate', generateCertificate);                      // GET  /api/internships/:id/certificate
  ```
- [ ] Tester dans Postman : CRUD complet, dates invalides (400), stagiaire inexistant (404), association atelier
- [ ] Ajouter toutes les requêtes à la collection `test_internship_management.postman_collection.json`

### Module ateliers

- [ ] Créer `backend/models/Activity.js` :
  - `getAllIds()` → liste des IDs visibles (`WHERE visible = 1`)
  - `getById(id)` → détails + `internshipCount` via COUNT JOIN + catégories liées
  - `create(data)` → INSERT + association `categoryIds` dans `activity_category`
  - `update(id, data)` → PATCH partiel + mise à jour des catégories
  - `delete(id)` → soft delete `UPDATE activity SET visible = 0`
- [ ] Créer `backend/services/activityService.js` :
  - `deleteActivity` : `getById` → si `internshipCount > 0` → `throw new Error('HAS_LINKED_INTERNSHIPS')` → sinon soft delete
  - Erreurs : `NOT_FOUND`, `MISSING_TITLE`, `TITLE_TOO_LONG`, `HAS_LINKED_INTERNSHIPS`, `INVALID_INPUT`
- [ ] Créer `backend/controllers/activityController.js` — `409` sur `HAS_LINKED_INTERNSHIPS`, `400` sur upload invalide
- [ ] Créer `backend/routes/activityRoutes.js` — 8 endpoints :
  ```js
  router.get('/', getActivityIds);                                  // GET  /api/activities
  router.post('/', createActivity);                                 // POST /api/activities
  router.get('/:id', getActivityById);                              // GET  /api/activities/:id
  router.patch('/:id', updateActivity);                             // PATCH /api/activities/:id
  router.delete('/:id', deleteActivity);                            // DEL  /api/activities/:id
  router.post('/:id/document', uploadActivityDocument, uploadDoc);  // POST /api/activities/:id/document
  router.get('/:id/document', downloadDoc);                         // GET  /api/activities/:id/document
  router.delete('/:id/document', deleteDoc);                        // DEL  /api/activities/:id/document
  ```
- [ ] Tester dans Postman : suppression bloquée (409), upload fichier > 10 MB (400), upload type invalide (400)
- [ ] Ajouter à la collection Postman

### Module catégories

- [ ] Créer `backend/models/Category.js` :
  - `getAll()` → liste avec `activityCount` via COUNT JOIN
  - `getById(id)` → détail avec `activityCount`
  - `create`, `update`, `delete`
- [ ] Créer `backend/services/categoryService.js` :
  - `deleteCategory` : `getById` → si `activityCount > 0` → `throw new Error('HAS_LINKED_ACTIVITIES')` → sinon DELETE
- [ ] Créer `backend/controllers/categoryController.js` — `409` sur `HAS_LINKED_ACTIVITIES`
- [ ] Créer `backend/routes/categoryRoutes.js` — 4 endpoints :
  ```js
  router.get('/', getCategories);        // GET  /api/categories
  router.post('/', createCategory);      // POST /api/categories
  router.put('/:id', updateCategory);    // PUT  /api/categories/:id
  router.delete('/:id', deleteCategory); // DEL  /api/categories/:id
  ```
- [ ] Tester dans Postman : suppression bloquée si ateliers liés (409)
- [ ] Ajouter à la collection Postman

### Module certificat

- [ ] Créer `backend/services/certificateService.js` — **`async function` pure** avec `promisify(carbone.render)` :
  ```js
  import { execSync } from 'node:child_process';
  import carbone from 'carbone';
  import { promisify } from 'node:util';
  import { format } from 'date-fns';
  import { fr } from 'date-fns/locale';
  // ...

  const carboneRender = promisify(carbone.render);  // évite l'anti-pattern new Promise(async)

  // Detect LibreOffice presence (required by carbone for DOCX → PDF conversion)
  const isLibreOfficeAvailable = () => {
    try {
      execSync('which soffice || which libreoffice', { stdio: 'ignore' });
      return true;
    } catch { return false; }
  };

  export const generateCertificate = async (internshipId) => {
    const internship = await Internship.getById(internshipId);
    if (!internship) throw new Error('NOT_FOUND');
    if (!fs.existsSync(TEMPLATE_PATH)) throw new Error('NO_TEMPLATE');
    if (!isLibreOfficeAvailable()) throw new Error('NO_LIBREOFFICE');

    const activities = await Internship.getActivities(internshipId);
    // ... build data object ...
    return carboneRender(TEMPLATE_PATH, data, { convertTo: 'pdf' });
  };
  ```
  > **Pourquoi `promisify` ?** `new Promise(async (resolve, reject) => { await ... })` ne transmet pas les exceptions internes au `reject` — elles deviennent des rejections non gérées. `promisify` retourne une vraie Promise compatible `await`.
  > ⚠️ **LibreOffice est requis** : `carbone.render({ convertTo: 'pdf' })` lance LibreOffice headless. Sans `soffice` dans le PATH, l'erreur est cryptique. Le check `isLibreOfficeAvailable()` permet de retourner un message clair (`NO_LIBREOFFICE` → 503) au lieu d'un 500 générique.
  > **En local** : si tu lances le backend hors Docker, le certificat échoue car LibreOffice n'est pas installé sur la machine hôte. **Toujours utiliser Docker pour tester le certificat** (LibreOffice est dans `Dockerfile.backend`).

- [ ] Créer `backend/controllers/certificateController.js` — stream PDF avec `res.setHeader('Content-Type', 'application/pdf')`, mappe `NO_LIBREOFFICE → 503` avec message explicite
- [ ] Créer `backend/routes/certificateRoutes.js` — 3 endpoints :
  ```js
  router.get('/template', getTemplateStatus);          // GET  /api/certificate/template
  router.post('/template', uploadCertificateTemplate, uploadTemplate);  // POST /api/certificate/template
  router.get('/:id', generateCertificate);             // ← monté sur /api/internships/:id/certificate via internshipRoutes
  ```
- [ ] Créer le template DOCX de démonstration avec les **balises Carbone v3** (préfixe `d.` obligatoire) :
  - Champs simples : `{d.prenom}`, `{d.nom}`, `{d.email}`, `{d.date_debut}`, `{d.date_fin}`, `{d.date_emission}`
  - Boucle ateliers (Carbone répète automatiquement entre les deux marqueurs) :
    ```
    ▸ {d.ateliers[i].titre}        ← première itération (le contenu est répété)
       {d.ateliers[i].categories}
    ▸ {d.ateliers[i+1].titre}      ← marqueur de fin (Carbone le retire)
       {d.ateliers[i+1].categories}
    ```
  > ⚠️ **Pièges Carbone classiques** :
  > - Sans `d.` devant : `{prenom}` apparaît tel quel dans le PDF (Carbone ne le voit pas comme un marqueur).
  > - La syntaxe Mustache `{#ateliers}...{/ateliers}` n'existe pas en Carbone — utiliser `[i]`/`[i+1]`.
  > - Les deux paragraphes `[i]` et `[i+1]` doivent être **structurellement identiques** (mêmes runs `<w:r>`, même mise en forme) sinon Carbone ne reconnaît pas le pattern de boucle.
- [ ] Placer le template dans `backend/uploads/certificate/template.docx`
- [ ] Tester dans Postman : génération PDF (200 + binaire), sans template (404/500)
- [ ] Ajouter à la collection Postman

### Collection Postman et Newman

- [ ] Organiser la collection Postman en 4 dossiers : `Internships`, `Activities`, `Categories`, `Certificate`
- [ ] Pour chaque requête, ajouter des **tests Postman** (onglet Tests) :
  ```js
  pm.test("Status 200", () => pm.response.to.have.status(200));
  pm.test("Has id", () => pm.expect(pm.response.json()).to.have.property('id'));
  ```
- [ ] Créer `tests/api/postman_environment.json` avec les variables `baseUrl`, `internshipId`, `activityId`, `categoryId`
- [ ] Créer `tests/api/run_tests.sh` :
  ```bash
  #!/bin/bash
  newman run tests/api/test_internship_management.postman_collection.json \
    --environment tests/api/postman_environment.json \
    --reporters cli,htmlextra \
    --reporter-htmlextra-export report_output.json
  ```
- [ ] Run `npm run test:api` → vérifier que tous les tests passent
- [ ] Commit : `feat(backend): complete REST API with all modules and Postman tests`

---

## Phase 6 — Frontend + tests E2E *(~3 jours)*

### Setup Vite + Vue

- [ ] Scaffolder le projet frontend :
  ```bash
  npm create vite@latest frontend -- --template vue
  ```
- [ ] Installer les dépendances frontend :
  ```bash
  cd frontend && npm install vue-router@4 axios tailwindcss lucide-vue-next date-fns
  npm install --save-dev @vitejs/plugin-vue autoprefixer postcss
  ```
- [ ] Configurer `frontend/vite.config.js` — alias `@` vers `src/` + proxy `/api` vers le backend :
  ```js
  import { fileURLToPath, URL } from 'node:url';
  import vue from '@vitejs/plugin-vue';
  import { defineConfig } from 'vite';

  export default defineConfig({
    plugins: [vue()],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    server: {
      proxy: {
        '/api': {
          target: process.env.VITE_API_TARGET || 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
  });
  ```
  > Le proxy évite les problèmes CORS en dev : les requêtes `/api/...` sont redirigées vers le backend Express sans passer par le navigateur.

- [ ] Configurer Tailwind CSS — créer `frontend/tailwind.config.js` :
  ```js
  export default {
    content: ['./index.html', './src/**/*.{vue,js,ts}'],
    theme: { extend: {} },
    plugins: [],
  };
  ```
- [ ] Créer `frontend/postcss.config.js` :
  ```js
  export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
  ```
- [ ] Ajouter dans `frontend/src/main.css` :
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

### Design tokens

- [ ] Créer `frontend/src/tokens.css` avec les variables CSS du design (palette bleue, fonds, textes, sidebar, danger, rayons, ombres) :
  ```css
  :root {
    --color-primary: #2563eb;
    --color-primary-hover: #1d4ed8;
    --color-primary-light: #eff6ff;
    --color-primary-border: #dbeafe;
    --color-bg: #f8fafc;
    --color-surface: #ffffff;
    --color-border: #e2e8f0;
    --color-text-primary: #0f172a;
    --color-text-secondary: #64748b;
    --color-text-tertiary: #94a3b8;
    --color-sidebar-bg: #0f172a;
    --color-sidebar-hover: #1e293b;
    --color-danger: #dc2626;
    --color-danger-light: #fef2f2;
    --radius-sm: 0.375rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --shadow-card: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px -1px rgba(0,0,0,.1);
    --shadow-card-hover: 0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -2px rgba(0,0,0,.1);
  }
  ```
- [ ] Importer `tokens.css` dans `main.js` avant `main.css`

### Router et point d'entrée

- [ ] Créer `frontend/src/router.js` — 5 routes avec lazy loading + redirect `/` → `/internships` :
  ```js
  import { createRouter, createWebHistory } from 'vue-router';

  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      { path: '/', redirect: '/internships' },
      { path: '/internships', name: 'internships', component: () => import('./views/InternshipDashboard.vue') },
      { path: '/activities',  name: 'activities',  component: () => import('./views/ActivityList.vue') },
      { path: '/categories',  name: 'categories',  component: () => import('./views/CategoryList.vue') },
      { path: '/settings',    name: 'settings',    component: () => import('./views/SettingsView.vue') },
      { path: '/certificate/:id', name: 'certificate', component: () => import('./views/CertificateView.vue') },
    ],
  });

  export default router;
  ```
- [ ] Mettre à jour `frontend/src/main.js` pour monter le router et importer les CSS
- [ ] Créer `frontend/src/App.vue` — délègue tout au `MainLayout` :
  ```vue
  <script setup lang="ts">
  import MainLayout from './layouts/MainLayout.vue';
  </script>
  <template><MainLayout /></template>
  ```

### Layout responsive

- [ ] Créer `frontend/src/composables/useMediaQuery.js` — reactive `matchMedia` avec `onScopeDispose` pour le cleanup :
  ```js
  import { onScopeDispose, ref } from 'vue';

  export function useMediaQuery(query) {
    const matches = ref(false);
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      matches.value = media.matches;
      const onChange = () => { matches.value = media.matches; };
      media.addEventListener('change', onChange);
      onScopeDispose(() => media.removeEventListener('change', onChange));
    }
    return matches;
  }
  ```

- [ ] Créer `frontend/src/layouts/MainLayout.vue` — flex layout avec sidebar + `<RouterView>`, breakpoint 890px :
  - Mobile (< 891px) : header fixe en haut + drawer sidebar + padding `pt-16`
  - Desktop (≥ 891px) : sidebar fixe à gauche + `padding: p-8`
  - Émet `@open-menu` vers `TheMobileHeader`, reçoit `@close` de `Sidebar`

- [ ] Créer `frontend/src/layouts/TheMobileHeader.vue` — header fixe mobile avec bouton hamburger + titre de l'app
- [ ] Créer `frontend/src/layouts/Sidebar.vue` — navigation avec liens (Stagiaires, Activités, Catégories, Paramètres), collapse sur mobile via `is-open` prop
- [ ] Créer `frontend/src/components/nav/SidebarNavigation.vue` — liste des liens `<RouterLink>` avec icônes Lucide

### Composants partagés

- [ ] Créer `frontend/src/components/AppButton.vue` — 5 variantes × 4 tailles, prop `disabled` :
  - `variant` : `primary` | `secondary` | `danger` | `ghost` | `outline`
  - `size` : `sm` (h-8 px-3) | `md` (h-10 px-4) | `lg` (h-12 px-6) | `icon` (h-10 w-10 p-2)
  - Classes de base : `inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50`

- [ ] Créer `frontend/src/components/AppInput.vue` — `v-model`, label optionnel, slot message d'erreur

- [ ] Créer `frontend/src/components/AppDialog.vue` — modal avec backdrop, prop `isOpen`, slot contenu, émit `@close` sur clic extérieur ou touche Escape

- [ ] Créer `frontend/src/components/AppCard.vue` — conteneur blanc avec ombre et bord

### Module stagiaires

- [ ] Créer `frontend/src/services/internshipService.js` — appels Axios avec pagination et recherche côté serveur :
  ```js
  export const getInternships = async (page = 1, limit = 20, search = '') => {
    const params = new URLSearchParams({ page, limit });
    if (search) params.append('search', search);
    const res = await axios.get(`/api/internships?${params}`);
    return res.data;  // { data: [], total: N }
  };
  ```

- [ ] Créer `frontend/src/composables/useInternships.js` — pagination, recherche, chargement et suppression :
  - `internships`, `searchTerm`, `page`, `total`, `isLoading`, `hasMore`
  - `loadInternships(reset)` — pagination infinie, reset sur changement de recherche
  - `loadNextBatch()` — charge la page suivante si `internships.length < total`
  - `handleDelete(id)` — confirmation + reload
  - `watch(searchTerm, () => loadInternships(true))`

- [ ] Créer `frontend/src/composables/useInternshipActivities.js` — gestion des ateliers liés et cartes dépliées :
  - Prend `internships` ref en paramètre pour partager l'état réactif
  - `expandedCards` (Set) — ensemble des IDs de cartes dépliées
  - `toggleCard(id)` — déplier/replier une carte
  - `removeActivity(internshipId, activityId)` — confirmation + update local dans `internships`
  - `updateInternshipActivities(internshipId, newIds, allActivities)` — synchronise `activityIds` et `linkedActivities`
  > ⚠️ Mutation d'un `Set` ne déclenche pas de re-render : toujours remplacer la référence (`expandedCards.value = new Set(modified)`)

- [ ] Créer `frontend/src/composables/useInternshipGrouping.js` — tri et regroupement par mois/année :
  - Prend `internships` ref en paramètre
  - `sortBy` — ref : `dateDesc` | `dateAsc` | `firstName` | `lastName`
  - `sortedInternships` (computed) — tri client selon `sortBy`
  - `groupedInternships` (computed) — structure `[[year, [[month, [interns...]]...]...]...]` avec `date-fns/locale/fr`

- [ ] Créer `frontend/src/composables/useInternshipStatus.js` — calcul de statut partagé entre les deux variantes de carte :
  - `parseLocalDate(str)` — **obligatoire** : `String(str).slice(0,10).split('-').map(Number)` → `new Date(y, m-1, d)`
    > Pourquoi `slice(0,10)` ? MariaDB retourne les dates en ISO datetime complet (`2026-05-04T00:00:00.000Z`). `new Date("2026-05-04")` parse comme UTC minuit → en UTC+2, c'est 02h00 local → les comparaisons de statut sont fausses. Le `slice` normalise les deux formats.
  - `status` (computed) — compare `today` (avec `setHours(0,0,0,0)`) aux dates du stage
  - `statusConfig` (computed) — `{ label, classes }` pour les 3 états : `upcoming` → amber, `active` → green, `done` → blue
  - `formatDate(dateStr)` — `format(new Date(dateStr), 'dd MMM yyyy', { locale: fr })`
  - Prend `internship` (computed ref) en paramètre

- [ ] Créer `frontend/src/views/InternshipDashboard.vue` — switcher `<DashboardDesktop v-else>` / `<DashboardMobile v-if="isMobile">` via `useMediaQuery('(max-width: 890px)')`
- [ ] Créer `frontend/src/views/internships/DashboardDesktop.vue` — layout desktop avec sidebar de navigation par année/mois :
  - Importe et orchestre **3 composables séparés** : `useInternships()`, `useInternshipActivities(internships)`, `useInternshipGrouping(internships)`
  - Sidebar `SidebarNavigation` avec tree année/mois via `groupedInternships`
- [ ] Créer `frontend/src/views/internships/DashboardMobile.vue` — layout mobile avec navigation horizontale :
  - Même 3 composables que Desktop
  - Navigation horizontale scrollable par année/mois (collapsible via `isNavOpen`)

- [ ] Créer `frontend/src/components/internships/card/InternshipActivityPopover.vue` — popover d'ajout d'activité (desktop) :
  - Props : `activityMenuOpen`, `activities`, `internship`, `tempSelectedActivityIds`
  - Emits : `close-activity-menu`, `toggle-activity-selection`, `save-activities`
  - `availableActivities` (computed) — filtre les activités déjà liées via `internship.activityIds`
  - Dropdown absolute z-50 + boutons Annuler/Ajouter (N)

- [ ] Créer `frontend/src/components/internships/card/InternshipCardDesktop.vue` :
  - Utilise `useInternshipStatus(internshipRef)` — **ne pas dupliquer** `parseLocalDate` ni le calcul de statut inline
  - `internshipRef = computed(() => props.internship)` — wrapper computed requis par le composable
  - Badge statut : `upcoming` → `bg-amber-100 text-amber-600` | `active` → `bg-green-100 text-green-600` | `done` → `bg-blue-100 text-blue-600`
  - Section dépliée : liste des ateliers liés avec bouton retirer, bouton « Aperçu du certificat »
  - Utilise `<InternshipActivityPopover>` — **ne pas redupliquer** le bloc popover inline
  - Actions Edit/Delete visibles au hover (desktop)

- [ ] Créer `frontend/src/components/internships/card/InternshipCardMobile.vue` — même architecture que Desktop :
  - Utilise `useInternshipStatus(internshipRef)` (même composable partagé)
  - Layout colonne, actions toujours visibles (pas de hover sur mobile)
- [ ] Créer `frontend/src/composables/useInternshipForm.js` — logique du formulaire stagiaire extraite du modal :
  - `formData`, `errors`, `isLoading`, `isEditing` (computed)
  - `watch(isOpen)` → charge les données existantes ou reset + focus sur le premier champ
  - `validate()` — 6 règles : prénom/nom (1-50 chars), email (regex), dates requises, fin ≥ début
  - `handleSubmit(isEditing, internshipId, emit)` — appelle `createInternship` ou `updateInternship`
  - Prend `props`, `emit`, `firstInputRef` en paramètres
- [ ] Créer `frontend/src/components/internships/InternshipFormModal.vue` — orchestrateur du formulaire :
  - Script ~12 lignes : instancie `useInternshipForm`, expose `handleSubmit`
  - Template inchangé (5 champs + boutons Annuler/Créer)
- [ ] Créer `frontend/src/components/internships/InternshipGroupList.vue` — rendu de la liste groupée par mois/année

**Tests E2E — stagiaires :**
- [ ] Initialiser Playwright dans `tests/e2e/` :
  ```bash
  cd tests/e2e && npm init playwright@latest
  ```
- [ ] Configurer `tests/e2e/playwright.config.ts` — `baseURL: 'http://localhost:8081'`, `testDir: './tests'`, `retries: 2`, projet `chromium`
- [ ] Écrire `sc01-navigation.spec.ts` — redirection `/` → `/internships`, navigation sidebar entre pages
- [ ] Écrire `sc03-internship-creation.spec.ts` — créer un stagiaire valide, vérifier l'apparition de la carte
- [ ] Écrire `sc04-internship-validation.spec.ts` — date fin < début, champs vides → messages d'erreur
- [ ] Écrire `sc05-internship-modification.spec.ts` — modifier un stagiaire, vérifier la persistance
- [ ] Écrire `sc06-internship-deletion.spec.ts` — supprimer un stagiaire, vérifier la disparition
- [ ] Run : `npm run test:e2e` → tous verts

### Module ateliers

- [ ] Créer `frontend/src/services/activityService.js` — `getActivityIds()`, `getActivityById(id)`, `createActivity(data)`, `updateActivity(id, data)`, `deleteActivity(id)`, `uploadDocument(id, file)`, `deleteDocument(id)`
- [ ] Créer `frontend/src/composables/useActivities.js` — gestion du menu d'ajout d'atelier depuis les cartes stagiaire :
  - `activities`, `activityMenuOpenId`, `tempSelectedActivityIds`
  - `loadActivities()`, `openActivityMenu(internship)`, `closeActivityMenu()`
  - `toggleActivitySelection(activityId)`, `saveActivities(internshipId, internships, updateInternshipActivities)`

- [ ] Créer `frontend/src/composables/useActivityList.js` — données, CRUD et filtre pour la vue ActivityList :
  - `activities`, `allCategories`, `searchQuery`, `isModalOpen`, `editingId`, `isSearchOpen`
  - `expandedIds` (`ref(new Set())`) — **plusieurs cartes peuvent être dépliées simultanément**, comme pour les stagiaires
  - `toggleExpand(id)` — ajoute/retire l'id du Set en remplaçant la référence (`expandedIds.value = new Set(...)`) pour conserver la réactivité Vue
  - `loadActivities()` — enrichit chaque activité avec ses catégories
  - `handleDelete(id)`, `handleUploadDocument(id, file)`, `handleDeleteDocument(id)`
  - `filteredActivities` (computed) — filtre sur le titre

- [ ] Créer `frontend/src/composables/useCategoryMenu.js` — état et opérations du popover de catégorie :
  - Prend `loadActivities` et `allCategories` en paramètres
  - `categoryMenuActivityId`, `tempCategoryIds` (Set)
  - `availableCategories(activity)`, `openCategoryMenu(activity)`, `closeCategoryMenu()`
  - `toggleCategorySelection(catId)`, `saveCategories(activityId)`, `removeCategoryFromActivity(actId, catId)`
  - `onMounted`/`onUnmounted` pour listener Escape
  > ⚠️ `tempCategoryIds` est un `Set` — toujours remplacer la référence pour déclencher la réactivité Vue

- [ ] Créer `frontend/src/components/activities/ActivityCategoryBadge.vue` — badge d'une catégorie (lecture seule ou supprimable) :
  - Props : `category`, `removable` (boolean, default `false`)
  - Emits : `remove(categoryId)` (uniquement quand `removable` est vrai)
  - Span avec nom de la catégorie ; si `removable`, bouton X qui apparaît au hover (`group/cat` + `opacity-0 group-hover/cat:opacity-100`)
  > ⚠️ Source unique de vérité — utilisé deux fois dans `ActivityCard.vue` (compact = read-only, déplié = removable)

- [ ] Créer `frontend/src/components/activities/ActivityCategoryPopover.vue` — popover d'ajout de catégorie extrait de `ActivityCard` :
  - Props : `categoryMenuOpen`, `availableCategories`, `tempCategoryIds`
  - Emits : `close-category-menu`, `toggle-category-selection`, `save-categories`
  - Overlay transparent (z-40) + dropdown (z-50) avec liste filtrée et boutons Annuler/Ajouter

- [ ] Créer `frontend/src/components/activities/ActivityCard.vue` — rendu d'une seule carte atelier :
  - Props : `activity`, `isExpanded`, `categoryMenuOpen`, `tempCategoryIds`, `availableCategories`
  - Emits : `toggle`, `edit`, `delete`, `remove-category`, `open-category-menu`, `close-category-menu`, `toggle-category-selection`, `save-categories`, `upload-document`, `delete-document`
  - Attribut `data-testid="activity-card"` sur le wrapper (ciblé par les E2E)
  - **Carte entièrement cliquable** pour étendre/replier (`@click="emit('toggle', activity.id)"` sur le wrapper)
  - **Vue compact** (`!isExpanded`) :
    1. Icône activité + boutons Modifier/Supprimer **visibles uniquement au hover desktop** (`lg:opacity-0 lg:group-hover:opacity-100`)
    2. Titre
    3. Tags catégories **non-cliquables, non-supprimables** (`<ActivityCategoryBadge>` sans `removable`)
    4. Ligne de séparation (`<hr>`)
    5. Description tronquée à 2 lignes (`line-clamp-2`)
  - **Vue dépliée** ajoute en dessous, avec `@click.stop` sur le wrapper de la zone dépliée (pour ne pas re-déclencher le toggle) :
    6. Ligne de séparation
    7. Bloc **Documentation** : zone d'upload (drag-drop) si pas de fichier, sinon ligne fichier + boutons Voir/Télécharger/Supprimer/Remplacer
    8. Ligne de séparation
    9. Bloc **Catégories** : tags **supprimables** (`removable`) + bouton « + Ajouter une catégorie » + `<ActivityCategoryPopover>`
  > ❌ **Pas de mini-cartes stats** (`internshipCount` / statut document) — design simplifié.
  > Les boutons Edit/Delete/X-catégorie/Voir/Télécharger/Supprimer/Remplacer/Ajouter doivent **tous** avoir `@click.stop` pour ne pas déclencher le toggle de la carte.

- [ ] Créer `frontend/src/views/ActivityList.vue` — orchestrateur léger (~85 lignes) :
  - Importe `useActivityList()` + `useCategoryMenu(loadActivities, allCategories)` + `MasonryGrid`
  - `toggleExpand(id)` local : appelle `baseToggleExpand(id)` puis `closeCategoryMenu()`
  - Rend les cartes via `<MasonryGrid :items="filteredActivities">` (pas une grille CSS) — chaque colonne est une pile verticale indépendante donc une carte qui s'étend pousse seulement les cartes en dessous d'elle dans la même colonne

- [ ] Créer `frontend/src/composables/useActivityForm.js` — logique du formulaire atelier extraite du modal :
  - `formData` (title, visible), `description`, `selectedCategoryIds`, `categories`, `errors`, `loading`
  - `onMounted` → `loadCategories()` (charge la liste des catégories disponibles)
  - `toggleCategory(id)` — ajoute/retire un id dans `selectedCategoryIds`
  - `watch(activityId)` → charge ou reset le formulaire (`{ immediate: true }`)
  - `validate()` — règle titre (3-100 chars)
  - `handleSubmit()` — appelle `createActivity` ou `updateActivity` puis émet `success` + `close`
  - Prend `props` + `emit` en paramètres

- [ ] Créer `frontend/src/components/activities/ActivityFormModal.vue` — orchestrateur du formulaire atelier :
  - Script ~10 lignes : instancie `useActivityForm`, expose le state et `handleSubmit`
  - Template : titre + description (textarea) + chips catégories cliquables + boutons Annuler/Enregistrer

**Tests E2E — ateliers :**
- [ ] Écrire `sc07-activity-crud.spec.ts` — créer, modifier, supprimer un atelier
- [ ] Écrire `sc08-internship-association.spec.ts` — associer un atelier à un stage depuis la carte dépliée
- [ ] Écrire `sc09-internship-dissociation.spec.ts` — retirer un atelier d'un stage
- [ ] Écrire `sc-activity-enriched.spec.ts` :
  - description visible (extrait dans la carte compact)
  - tags catégories visibles dans la carte (1 badge pour activité 4 = `Développement`)
  - bouton Supprimer désactivé pour un atelier lié à des stages
  - bloc Documentation visible **uniquement** quand la carte est dépliée
  - bloc « Ajouter une catégorie » visible uniquement quand la carte est dépliée
  > Sélecteur des cartes : `[data-testid="activity-card"]` (le wrapper utilise `MasonryGrid` donc plus de `.grid > div`)
- [ ] Run : `npm run test:e2e` → tous verts

### Module catégories

- [ ] Créer `frontend/src/services/categoryService.js` — `getCategories()`, `createCategory(data)`, `updateCategory(id, data)`, `deleteCategory(id)`
- [ ] Créer `frontend/src/composables/useCategories.js` — `categories`, `load`, `create`, `update`, `remove` (attrape le 409 et le remonte)

- [ ] Créer `frontend/src/components/categories/CategoryCard.vue` — rendu d'une carte catégorie :
  - Props : `category`
  - Emits : `edit`, `delete`
  - Icône `Tag` + boutons Modifier/Supprimer (Supprimer désactivé si `activityCount > 0`)
  - Titre + description optionnelle + compteur d'ateliers
  - **Texte du compteur** : `{{ count }} atelier{{ count > 1 ? 's' : '' }}` — donne `"1 atelier"` / `"2 ateliers"` / `"0 atelier"`. Pas le mot « lié(s) ».
  - **Pas de séparateur** (ni `border-t`, ni `<hr>`) entre le titre et le compteur
  > ⚠️ **Espaces du compteur** : interpolation Vue sur deux lignes (`{{ count }}` puis `atelier{{ s }}`) — le saut de ligne devient un espace au rendu. Si Biome reformate et colle les balises, on obtient `"1ateliers"` (sans espace) — relire le rendu après chaque format.
- [ ] Créer `frontend/src/views/CategoryList.vue` — orchestrateur de la liste :
  - Grille responsive (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) avec `<CategoryCard v-for>`
  - Barre de recherche : `searchQuery` ref + `filteredCategories` computed (`name` + `description`)
  - `AppDialog` « Suppression impossible » si la catégorie a des ateliers liés
- [ ] Créer `frontend/src/components/categories/CategoryFormModal.vue` — formulaire nom + description optionnelle, émit `@saved` / `@close`

**Tests E2E — catégories :**
- [ ] Écrire `sc-category-crud.spec.ts` :
  - les 6 catégories seed sont visibles (vérifier au moins 2 noms : `Développement`, `Système`)
  - créer / modifier une catégorie
  - tentative de suppression d'une catégorie liée → modal « Suppression impossible » visible avec le nom de la catégorie
- [ ] Run : `npm run test:e2e` → tous verts

### Badges de statut

**Tests E2E :**
- [ ] Écrire `sc-status-badges.spec.ts` — vérifier que les badges À venir / En cours / Terminé s'affichent correctement selon les dates du jeu de données `restore_db.sql`
  > Les données de test doivent contenir des stages avec les 3 statuts pour que ce scénario soit valide
- [ ] Run : `npm run test:e2e` → verts

### Certificat et Paramètres

- [ ] Créer `frontend/src/services/certificateService.js` — `getCertificate(id)` retourne un Blob PDF, `uploadTemplate(file)`, `getTemplateStatus()`

- [ ] Créer `frontend/src/views/CertificateView.vue` :
  - `onMounted` → `GET /api/internships/:id/certificate` → `response.blob()` → `URL.createObjectURL(blob)` → affecter à `<iframe :src>`
  - Bouton « Imprimer » : `iframe.contentWindow.print()`
  - Bouton « Télécharger PDF » : créer `<a>` avec `href = blobUrl` + `download = "certificat.pdf"`

- [ ] Créer `frontend/src/views/SettingsView.vue` :
  - Zone d'upload drag & drop pour le template DOCX
  - Affiche le statut actuel : template présent (nom + bouton remplacer) ou absent (invitation à uploader)
  - `POST /api/certificate/template` avec `FormData`

**Tests E2E — certificat :**
- [ ] Écrire `sc-certificate-download.spec.ts` — cliquer sur « Aperçu du certificat » depuis une carte, vérifier la navigation vers `/certificate/:id`
- [ ] Run Playwright complet : `npm run test:e2e` → tous verts
- [ ] Commit : `feat(frontend): complete UI with all modules and E2E tests`

---

## Phase 7 — Vérification des tests *(~4h)*

### Préconditions

- [ ] Vérifier que l'application tourne complètement : `docker compose -f docker/docker-compose.yml up -d`
- [ ] Vérifier que le frontend répond : ouvrir `http://localhost:8081` dans le navigateur
- [ ] Vérifier que le backend répond : `curl http://localhost:3000/api/health` → `{ "status": "ok" }`
- [ ] Vérifier que MariaDB est accessible depuis le backend (logs Docker sans erreur de connexion)

### Restauration de la base de données de test

- [ ] Lancer la restauration via le script npm racine :
  ```bash
  npm run db:restore
  ```
  > Ce script exécute `tests/setup/restoreDb.js` qui : (1) se connecte à MariaDB via le pool, (2) lit `tests/setup/restore_db.sql`, (3) exécute le SQL avec `multipleStatements: true` — TRUNCATE de toutes les tables puis INSERT des données de test
- [ ] Vérifier le résultat attendu après restauration :
  - **60 stagiaires** dans la table `internship` (+ personnes associées dans `person`)
  - **15 activités** dans la table `activity` (13 visibles dont les 13 de problem4.png, 2 avec `visible = 0` pour tester le soft-delete)
  - **6 catégories** par défaut : Développement (7 ateliers), Système (2), Réseau (1), Hardware (2), Graphisme (1), Modélisation 3D (1)
  - **Stagiaire ID 60** : Joël Dacobeau (utilisé par certains scénarios manuels)
  - Stages couvrant les 3 statuts : passés (dates 2024), en cours (dates encadrant aujourd'hui), à venir (dates futures)

### Sanity check — intégrité des données

- [ ] Lancer le sanity check Playwright (vérifie que la restauration est correcte avant de lancer les vrais tests) :
  ```bash
  npm run test:e2e:sanity
  ```
  > Exécute `tests/e2e/tests/technical/sanity-db-check.spec.ts` via l'API Playwright `request` (pas de navigateur) : vérifie `total = 60` stagiaires, `length = 12` activités visibles, stagiaire ID 60 = Joël Dacobeau, activités 14 et 15 associées
- [ ] Si le sanity check échoue → vérifier la connexion DB et relancer `npm run db:restore`

### Tests API — Newman

- [ ] Lancer les tests API complets :
  ```bash
  npm run test:api
  ```
  > Ce script exécute `tests/api/run_tests.sh` qui :
  > 1. Restaure la DB (`npm run db:restore`)
  > 2. Lance le sanity check Postman (`sanity_check.postman_collection.json`) — si KO, arrête
  > 3. Lance la collection principale (`test_internship_management.postman_collection.json`)
  > 4. Génère un rapport HTML dans `test-results/api/report.html`
  > 5. Logs dans `tests/api/postman.log`

- [ ] Vérifier la couverture de la collection Postman — doit couvrir :

  | Module | Requêtes testées |
  |---|---|
  | Stagiaires | GET liste (pagination), GET détail, POST (valide), POST (dates invalides → 400), PUT, DELETE, GET activities, POST association, DELETE dissociation |
  | Ateliers | GET ids, GET détail, POST (valide), POST (titre manquant → 422), PATCH, DELETE (sans stage → 204), DELETE (avec stage → 409), POST document, GET document, DELETE document |
  | Catégories | GET liste, POST, PUT, DELETE (sans atelier → 204), DELETE (avec atelier → 409) |
  | Certificat | GET template status, POST template (DOCX), GET generate |

- [ ] Lire le rapport HTML généré : `open test-results/api/report.html`
- [ ] Si des tests échouent → identifier la cause (bug backend, données de test incorrectes, mauvais endpoint)
- [ ] Corriger les bugs identifiés → relancer `npm run test:api` → tous verts

### Tests E2E — Playwright

- [ ] Lancer tous les tests E2E :
  ```bash
  npm run test:e2e
  ```
  > Ce script : (1) restaure la DB, (2) lance le sanity check E2E, (3) lance tous les specs hors sanity

- [ ] Vérifier que les **25 scénarios** passent tous — liste complète :

  | Fichier | Ce qui est testé |
  |---|---|
  | `sc01-navigation.spec.ts` | Redirection `/` → `/internships`, navigation sidebar |
  | `sc03-internship-creation.spec.ts` | Créer stagiaire valide, carte visible |
  | `sc04-internship-validation.spec.ts` | Date fin < début, champs vides → erreurs |
  | `sc05-internship-modification.spec.ts` | Modifier stagiaire, persistance des données |
  | `sc06-internship-deletion.spec.ts` | Supprimer stagiaire, disparition de la carte |
  | `sc07-activity-crud.spec.ts` | Créer, modifier, supprimer atelier |
  | `sc08-internship-association.spec.ts` | Associer atelier à un stage |
  | `sc09-internship-dissociation.spec.ts` | Retirer atelier d'un stage |
  | `sc10-internship-search.spec.ts` | Recherche par nom/prénom |
  | `sc11-network-error.spec.ts` | Comportement lors d'erreur réseau |
  | `sc12-sorting-grouping.spec.ts` | Tri et groupement par date |
  | `sc13-form-state.spec.ts` | État du formulaire (reset, pré-remplissage) |
  | `sc14-keyboard-nav.spec.ts` | Navigation clavier, fermeture Escape |
  | `sc15-duplicate-check.spec.ts` | Gestion des doublons |
  | `sc16-xss-security.spec.ts` | Injection XSS dans les champs texte |
  | `sc17-boundary-tests.spec.ts` | Valeurs limites (255 caractères, email max) |
  | `sc18-grouping-logic.spec.ts` | Logique de groupement année/mois |
  | `sc19-exhaustive-validation.spec.ts` | Validation exhaustive du formulaire |
  | `sc20-date-validation.spec.ts` | Parsing des dates ISO datetime MariaDB |
  | `sc21-update-expanded.spec.ts` | Mise à jour d'une carte dépliée |
  | `sc-activity-enriched.spec.ts` | Description, catégories, suppression bloquée, stats |
  | `sc-category-crud.spec.ts` | CRUD catégories, Cannot Delete Modal |
  | `sc-certificate-download.spec.ts` | Navigation vers page certificat |
  | `sc-status-badges.spec.ts` | Badges À venir / En cours / Terminé selon les dates |
  | `technical/sanity-db-check.spec.ts` | Intégrité des données après restauration |

- [ ] En cas d'échec : ouvrir le rapport HTML Playwright :
  ```bash
  cd tests/e2e && npx playwright show-report
  ```
- [ ] Pour déboguer un scénario en mode visuel :
  ```bash
  cd tests/e2e && npx playwright test tests/sc03-internship-creation.spec.ts --headed
  ```
- [ ] Identifier les causes d'échec : sélecteur périmé, timing (ajouter `waitForResponse`), données de test manquantes
- [ ] Corriger → relancer → tous verts

### Lint — vérification du code

- [ ] Lancer la vérification Biome sur tout le projet :
  ```bash
  npm run check
  ```
  > `biome check --write .` : formate et corrige automatiquement les imports non triés, les guillemets, l'indentation
- [ ] Vérifier qu'il n'y a **aucun warning ni erreur** restant après le check
- [ ] Si des erreurs persistent (ex : règles `correctness` sur du code Vue) → les corriger manuellement

### Tests manuels — table du rapport §7

- [ ] Exécuter chaque scénario manuellement dans le navigateur (l'app doit tourner avec la DB restaurée)
- [ ] Remplir les colonnes **« Résultat obtenu »** et **« Statut »** (✅ / ❌) pour les 16 tests :

  | N° | Scénario | Préconditions | Résultat attendu |
  |---|---|---|---|
  | T01 | Créer un stagiaire valide | App lancée, DB restaurée | Carte apparaît, statut calculé correct |
  | T02 | Créer avec date fin < début | App lancée | Message d'erreur, aucun enregistrement |
  | T03 | Modifier un stagiaire | Stagiaire T01 créé | Nouvelles données affichées |
  | T04 | Supprimer un stagiaire | Stagiaire sans ateliers | Carte disparaît |
  | T05 | Badge « À venir » | Stage avec startDate future | Badge amber visible |
  | T06 | Badge « Terminé » | Stage avec endDate passée | Badge bleu visible |
  | T07 | Créer atelier avec catégories | Catégories existantes | Badges catégories visibles |
  | T08 | Supprimer atelier lié à stage | Atelier associé | Bouton désactivé, message impossible |
  | T09 | Supprimer atelier sans stage | Atelier non associé | Atelier disparu |
  | T10 | Upload document sur atelier | Atelier existant | Zone document affiche le fichier |
  | T11 | Upload fichier > 10 MB | — | Erreur rejetée |
  | T12 | Créer une catégorie | — | Catégorie dans la grille |
  | T13 | Supprimer catégorie liée | Catégorie avec ateliers | Bouton désactivé |
  | T14 | Associer atelier à un stage | Stage + atelier existants | Atelier dans la liste du stage |
  | T15 | Générer le certificat PDF | Template uploadé, stage avec ateliers | PDF affiché dans l'iframe |
  | T16 | Générer sans template | Aucun template | Message d'erreur explicite |

- [ ] Faire signer la table de tests par le chef de projet (Joël Dacomo)
- [ ] Commit : `test: all E2E and API tests passing, manual test table completed`

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
