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
- [ ] Conclure : **Filesystem retenu** — performances optimales, nommage `<uuid>-<nom-sanitisé>.<ext>`, volume Docker `uploads_data`

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
- [ ] Ajouter le volume Docker `uploads_data` (cylindre) relié au backend
- [ ] Ajouter les flèches étiquetées : `HTTP/JSON` (navigateur → frontend), `REST API` (frontend → backend), `SQL` (backend → MariaDB), `R/W` (backend → uploads_data)
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

- [ ] Créer `.env` à la racine du projet (ne jamais commiter) :
  ```
  DB_HOST=localhost
  DB_USER=user
  DB_PASSWORD=password
  DB_NAME=internship_management
  PORT=3000
  ```
- [ ] Créer `.env.example` (version sans valeurs sensibles, à commiter) avec les mêmes clés mais valeurs vides ou factices

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
        - uploads_data:/app/backend/uploads
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
    uploads_data:

  networks:
    app-network:
      driver: bridge
  ```
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

  SET FOREIGN_KEY_CHECKS = 1;
  ```
- [ ] Vérifier que le jeu de données inclut des stages avec les 3 statuts possibles (À venir, En cours, Terminé) pour les tests E2E
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
- [ ] Vérifier que le volume `uploads_data` persiste entre les redémarrages : `docker compose down && docker compose up` → le volume existe toujours
- [ ] Commit : `chore: add Docker infrastructure, Nginx, DB schema and test restore script`

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
