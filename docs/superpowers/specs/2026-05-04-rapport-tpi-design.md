# CA TIC WorkXP Admin — Rapport TPI : Design du document

**Date :** 2026-05-04
**Projet :** CA TIC WorkXP Admin — TPI 2026 — Luka Pellegrinelli (N° 155072)
**Chef de projet :** Joël Dacomo, HEIA-FR
**Deadline remise :** 2 juin 2026 à 17h00 — Présentation : 17 juin 2026 à 12h00

---

## Contexte

Ce document définit le contenu à produire pour la documentation technique du TPI WorkXP Admin, conforme au gabarit HEIA-FR v1.4 et calquée sur les documentations de référence CA TIC (eParking 2024, eRecrutement 2025).

**Approche retenue — Hybride :**
- Les sections techniques sont rédigées par Claude (basé sur le code existant, le CdC et le design Pencil)
- Les sections personnelles sont guidées (plan détaillé fourni) et rédigées par le candidat

**Fichier de sortie :** `docs/rapport-tpi/rapport-tpi-workxpadmin.md` (Markdown → copier-coller dans le gabarit Word)

---

## Structure du document et responsabilités

### Légende
- **[RÉDIGÉ]** — Claude rédige le contenu complet prêt à copier
- **[GUIDÉ]** — Claude fournit un plan + points clés, candidat rédige
- **[CANDIDAT]** — Candidat rédige seul (informations personnelles non dérivables du code)

---

### 1. Résumé du rapport `[RÉDIGÉ]`

Structure en 3 blocs (identique aux refs) :
- **Situation de départ** : Le CA TIC gère les stages découverte CO via OneNote. Données dispersées, pas de vue centralisée, pas de certificat automatisé.
- **Mise en œuvre** : Application web 3-tiers (Vue 3, Express, MariaDB) conteneurisée Docker. 5 modules : stagiaires, ateliers, catégories, association, certificat PDF.
- **Résultats** : Toutes les exigences fonctionnelles implémentées et validées par tests automatisés (Playwright E2E + Postman/Newman).

---

### 2. Préambule

#### 2.1 Introduction `[RÉDIGÉ]`
Présentation du projet TPI dans le cadre CFC HEIA-FR, objectif de l'application, lien avec le CA TIC.

#### 2.2 Organisation `[CANDIDAT]`
- Candidat : Luka Pellegrinelli, HEIA-FR
- Chef de projet : Joël Dacomo, HEIA-FR
- Expert principal : *à compléter*
- Expert secondaire : *à compléter*

#### 2.3 Environnement de travail `[CANDIDAT]`
- **Matériel** : machine(s) utilisée(s) (marque, modèle, OS)
- **Logiciels** : VSCode, Git, GitLab HEIA-FR, Docker Desktop, Node.js, Postman, Pencil (design), Claude Code (IA)
- **Accès** : GitLab HEIA-FR, réseau HEIA-FR

#### 2.4 Déroulement du projet `[RÉDIGÉ + CANDIDAT]`
- **Méthode** [RÉDIGÉ] : Waterfall adapté — phases Analyse → Conception → Réalisation → Tests. Tests effectués à la fin de chaque fonctionnalité (pas en fin de projet uniquement). Identique aux deux documentations de référence CA TIC.
- **Sauvegarde** [RÉDIGÉ] : Git + GitLab HEIA-FR (commits quotidiens). Disques réseau HEIA-FR pour la documentation.
- **Journal de bord** [RÉDIGÉ] : Description du journal (en annexe)
- **Planification Gantt** [CANDIDAT] : Le candidat insère son diagramme de Gantt (planification initiale + courante). Granularité : demi-journées. Phases : Administratif, Analyse, Conception, Réalisation, Tests, Documentation.
- **Glossaire** [RÉDIGÉ] : Mention du glossaire en annexe

#### 2.5 Déclarations `[RÉDIGÉ]`
- **Connaissances préalables** : Node.js, Vue.js, Express.js, REST/RESTful, MariaDB/SQL, Git, Docker
- **Utilisation de l'IA** : Claude Code utilisé comme outil d'assistance (correction, reformulation, suggestions de code). Ne remplace pas les compétences du candidat.
- **Standards d'entreprise** : Documentation technique + journal de bord (modèle GED CA TIC). Conventions VCS et codage : https://api-ti.pages.forge.hefr.ch

---

### 3. Cahier des charges `[RÉDIGÉ]`

Résumé fidèle du CdC officiel :
- **Donnée du problème** : stages CO gérés via OneNote, pas de centralisation
- **Description et objectifs** : 5 fonctionnalités principales (stagiaires, ateliers, catégories, association, certificat)
- **Tableau des exigences fonctionnelles** (repris du CdC avec priorités et temps estimés)
- **Phases attendues** : Analyse, Conception, Réalisation, Tests automatisés
- **Infrastructure** : 1 laptop, GitLab HEIA-FR, logiciels nécessaires
- **Technologies imposées** : VueJS, ExpressJS, MariaDB

---

### 4. Analyse

#### 4.1 État initial `[RÉDIGÉ]`
Le CA TIC consigne actuellement les stages dans OneNote (liste manuelle d'ateliers par période). Pas de vue centralisée, pas d'historique structuré par stagiaire, génération du certificat manuelle ou inexistante.

#### 4.2 État désiré `[RÉDIGÉ]`
Application web d'administration permettant de :
- Gérer la liste des stagiaires (CRUD + statut calculé À venir / En cours / Terminé)
- Gérer le catalogue des ateliers (titre, description, document, catégories)
- Gérer les catégories d'ateliers (CRUD + contrainte suppression)
- Associer des ateliers à chaque stage
- Générer et imprimer le certificat de stage en PDF

Schéma de principe de fonctionnement (à produire : Admin → Frontend Vue → Backend Express → MariaDB).

#### 4.3 Public cible `[RÉDIGÉ]`
Utilisateur unique : l'équipe du CA TIC (formateurs, responsables administratifs). Application d'administration interne, pas d'accès public. Interface doit être intuitive sans formation préalable.

#### 4.4 Besoins `[RÉDIGÉ]`

**4.4.1 Cas d'utilisation** : Diagramme UML avec acteur Administrateur et les 5 groupes de cas d'utilisation (CRUD Stagiaire, CRUD Atelier, CRUD Catégorie, Association Atelier↔Stage, Certificat). À produire avec Draw.io ou PlantUML.

**4.4.2 Description** : Tableaux Quoi/Pourquoi/Comment/Contrainte/Remarque pour chaque cas d'utilisation :
- Ajouter un stagiaire
- Modifier un stagiaire
- Supprimer un stagiaire
- Consulter la liste des stages (avec filtres de statut)
- Ajouter un atelier
- Modifier un atelier
- Supprimer un atelier (contrainte : 0 stage lié)
- Uploader un document sur un atelier
- Ajouter une catégorie
- Modifier une catégorie
- Supprimer une catégorie (contrainte : 0 atelier lié)
- Associer des ateliers à un stage
- Générer le certificat PDF d'un stage

#### 4.5 Fonctionnement — Variantes `[RÉDIGÉ]`

**4.5.1 Architecture de l'application**
Variantes comparées avec matrice de décision (critères : complexité, maintenabilité, adéquation aux technologies imposées) :
- Variante 1 : Application monolithique (tout dans un seul projet)
- Variante 2 : Architecture 3-tiers séparée (Frontend / Backend / DB) ← **choisie**
- Choix justifié : séparation des responsabilités, indépendance de déploiement, standard imposé par le CdC

**4.5.2 Stockage des documents d'ateliers**
Variantes comparées (critères : simplicité, performance, cohérence avec le projet) :
- Variante 1 : Stockage en base de données (BLOB)
- Variante 2 : Stockage sur le filesystem du serveur avec référence en DB ← **choisie**
- Choix justifié : performances, taille des fichiers, simplicité de gestion Docker volume

**4.5.3 Format du certificat**
Variantes comparées (critères : personnalisabilité, complexité d'implémentation, dépendances) :
- Variante 1 : HTML → PDF (puppeteer/wkhtmltopdf)
- Variante 2 : DOCX template → PDF via carbone.js ← **choisie**
- Choix justifié : template modifiable dans Word par l'admin sans toucher au code

#### 4.6 Technologies utilisées `[RÉDIGÉ]`

Tableau de justification pour chaque technologie imposée :

| Technologie | Rôle | Justification |
|---|---|---|
| Vue.js 3 + Vite | Frontend SPA | Composition API modulaire, réactivité fine, HMR rapide. Standard CA TIC. |
| Express.js | API REST Backend | Minimaliste, flexible, excellent écosystème npm. Standard CA TIC. |
| MariaDB | Base de données relationnelle | Données structurées avec relations N:M, contraintes d'intégrité FK. Standard CA TIC. |
| Docker + Compose | Conteneurisation | Environnement reproductible, isolation des services, déploiement simplifié. |
| Tailwind CSS | Styling | Utilitaire, cohérence visuelle, pas de CSS custom à maintenir. |
| Biome | Linter + formatter | Outil tout-en-un ultra-rapide, remplace ESLint + Prettier. |
| Playwright | Tests E2E | Simulation navigateur réelle, scénarios utilisateurs complets. |
| Postman/Newman | Tests API | Validation contrat d'interface backend, exécution CI. |
| carbone.js | Génération PDF | Templating DOCX → PDF, zéro service externe, template éditable Word. |

---

### 5. Conception

#### 5.1 Schéma d'architecture `[RÉDIGÉ]`
Diagramme 3-tiers montrant :
- Navigateur → Vue 3 (port 8081)
- Vue 3 → Express API (port 3000) via Axios/HTTP
- Express → MariaDB (port 3306)
- Docker Compose orchestrant les 3 conteneurs + volume `uploads_data`

#### 5.2 Diagrammes de séquences `[RÉDIGÉ]`
Diagrammes pour les flux principaux (à produire avec PlantUML/Draw.io) :
- Création d'un stagiaire (POST /api/internships)
- Création d'un atelier avec catégories (POST /api/activities + associations)
- Upload d'un document (POST /api/activities/:id/document)
- Génération du certificat PDF (GET /api/internships/:id/certificate)

#### 5.3 Base de données `[RÉDIGÉ]`
- Schéma relationnel (MCD) : 6 tables — `internship`, `activity`, `category`, `activity_category`, `internship_activity`
- Description de chaque table avec colonnes, types, contraintes
- Contraintes FK : CASCADE sur internship_activity, RESTRICT sur activity_category (règle CdC)
- Soft delete sur `activity` (visible = 0)
- Schéma SQL complet en référence (`database/schema-v2.sql`)

#### 5.4 Mockups `[RÉDIGÉ]`
Référence au fichier `WorkXPAdmin.pen` utilisé comme source de vérité visuelle tout au long du développement. Captures d'écran des écrans principaux à insérer.

#### 5.5 Stratégie de tests `[RÉDIGÉ]`
- **Tests E2E Playwright** : 6 scénarios (sc-activity-crud, sc-category-crud, sc-activity-enriched, sc-status-badges, sc-certificate-download, sc-internship-activity)
- **Tests API Postman/Newman** : collection couvrant tous les endpoints REST (CRUD + contraintes métier + upload)
- **Principe** : tests exécutés après chaque fonctionnalité, base de données restaurée (`restore_db.sql`) avant chaque exécution

---

### 6. Réalisation

#### 6.1 Structure du projet `[RÉDIGÉ]`
Monorepo NPM Workspaces :
```
/
├── frontend/     (Vue 3 + Vite + Tailwind)
├── backend/      (Express + MariaDB connector + multer + carbone)
├── database/     (schema SQL + migrations)
├── tests/        (Playwright E2E + Postman collection)
├── docker/       (Dockerfiles + docker-compose.yml)
└── package.json  (scripts globaux)
```

#### 6.2 Linter et code formatter `[RÉDIGÉ]`
Biome v1.x : configuration via `biome.json`. Règles : import sorting, no unused vars, consistent formatting. Exécuté via `npm run format`.

#### 6.3 Design et interface `[RÉDIGÉ]`
Tailwind CSS avec classes utilitaires. Design calqué sur `WorkXPAdmin.pen`. Composants Vue réutilisables (`AppButton`, `AppCard`, `AppInput`, `AppDialog`). Interface responsive desktop/tablette.

#### 6.4 Gestion des stagiaires `[RÉDIGÉ]`
- CRUD complet (création, modification, suppression avec confirmation)
- Calcul de statut côté frontend (computed Vue) : À venir / En cours / Terminé
- Badges colorés selon statut (amber, green, blue)
- Association d'ateliers inline sur la carte (popover)
- Bouton certificat → page de prévisualisation PDF

#### 6.5 Gestion des ateliers `[RÉDIGÉ]`
- CRUD avec description et catégories
- Carte dépliable : section document toujours visible, gestion catégories inline
- Upload document (PDF, DOCX, ODT… max 10 MB) via multer, stockage filesystem
- Contrainte suppression : soft delete + guard backend si stage lié (HTTP 409)

#### 6.6 Gestion des catégories `[RÉDIGÉ]`
- CRUD via grille de cartes responsive
- Contrainte suppression : bloquée si atelier lié (RESTRICT FK → catch errno 1451 → HTTP 409)

#### 6.7 Génération du certificat `[RÉDIGÉ]`
- Template DOCX uploadé dans Paramètres, stocké dans `uploads/certificate/template.docx`
- carbone.js injecte les données du stage dans le template
- LibreOffice (Alpine) convertit DOCX → PDF dans le conteneur backend
- Prévisualisation dans un iframe Vue, boutons Imprimer et Télécharger

#### 6.8 Base de données `[RÉDIGÉ]`
- Connexion via pool MariaDB connector
- Pattern : Model → Service → Controller → Route
- Soft delete sur activity (visible = 0) — FK RESTRICT non déclenchée par UPDATE
- Guard applicatif dans le service (internshipCount > 0 → HAS_LINKED_INTERNSHIPS)

#### 6.9 Traitement des erreurs `[RÉDIGÉ]`
- Codes HTTP sémantiques : 200, 201, 204, 400, 404, 409, 422, 500
- Erreurs métier : NOT_FOUND, MISSING_TITLE, TITLE_TOO_LONG, HAS_LINKED_INTERNSHIPS, HAS_LINKED_ACTIVITIES
- Try/catch dans tous les handlers Express, messages JSON structurés `{ error: "..." }`

---

### 7. Tests de fonctionnement `[RÉDIGÉ]`

Tableau protocole de test (format CA TIC) :

| N° | Scénario | Préconditions | Étapes | Résultat attendu | Résultat obtenu | Statut |
|---|---|---|---|---|---|---|
Pour chaque test Playwright et Postman clé. Résultats obtenus à compléter lors de l'exécution finale.

---

### 8. Problèmes rencontrés `[GUIDÉ]`

Points clés à documenter (le candidat développe chacun avec son vécu) :
1. **Soft delete + contrainte FK** : `UPDATE SET visible=0` ne déclenche pas `ON DELETE RESTRICT`. Solution : guard applicatif dans le service.
2. **Réactivité Vue 3 avec Set** : mutation d'un `ref<Set>` ne déclenche pas le re-render. Solution : remplacer la référence (`tempCategoryIds.value = new Set(...)`).
3. **carbone.js + LibreOffice Docker** : image backend +300 MB, temps de build long. Solution : layer Docker optimisé.
4. **Tests E2E sur éléments hover** : boutons masqués par `pointer-events: none` hors hover non cliquables par Playwright. Solution : `{ force: true }`.
5. *(Le candidat ajoute les obstacles rencontrés pendant son développement)*

---

### 9. Amélioration et évolution `[RÉDIGÉ + GUIDÉ]`

**[RÉDIGÉ]** Pistes techniques identifiées :
- Authentification (hors périmètre TPI) : intégration CA TIC Authentication Gateway (Microsoft MFA)
- Endpoint `GET /api/activities/details` pour éliminer le pattern N+1 requêtes dans ActivityList
- Intégration inscription FriStages (mentionnée dans le CdC comme évolution future)
- Recherche textuelle côté serveur (filtre stagiaires/ateliers)
- Pipeline CI/CD (GitHub/GitLab Actions)

**[GUIDÉ]** Le candidat ajoute ses propres idées d'amélioration issues de l'utilisation réelle.

---

### 10. Conclusion `[GUIDÉ]`

Points à aborder :
- Objectifs atteints ? (Référencer les 5 exigences du CdC, confirmer implémentation)
- Ce qui a bien fonctionné (architecture, tests automatisés, Docker)
- Ce qui aurait été fait différemment
- Bilan personnel sur l'apprentissage

---

### 11. Remerciements `[CANDIDAT]`
Remerciements au chef de projet (Joël Dacomo) et aux experts.

### 12. Déclaration de non plagiat `[CANDIDAT]`
Texte standard CA TIC.

### 13. Glossaire `[RÉDIGÉ]`
Termes à définir : SPA, API REST, CRUD, ORM, Soft Delete, E2E, JWT, MCD, FK, Monorepo, HMR, PDF, DOCX, carbone.js, LibreOffice, Docker, Playwright, Postman, Newman, Biome.

### 14. Annexes `[CANDIDAT]`
- Journal de bord complet
- Code imprimé (listings principaux)
- Collection Postman

### 15. Table des illustrations `[CANDIDAT]`
Générée automatiquement dans Word.

---

## Diagrammes à produire (outils recommandés)

| Diagramme | Outil | Section |
|---|---|---|
| Cas d'utilisation UML | Draw.io / PlantUML | 4.4.1 |
| Schéma architecture 3-tiers | Draw.io | 5.1 |
| Diagrammes de séquences (4x) | PlantUML / SequenceDiagram.org | 5.2 |
| MCD base de données | DbDiagram.io / Draw.io | 5.3 |
| Diagramme de Gantt | Excel / Google Sheets | 2.4 |

---

## Plan d'implémentation du document

**Approche** : Rédaction section par section dans `docs/rapport-tpi/rapport-tpi-workxpadmin.md`, puis copier-coller dans le gabarit Word `CAND Rapport TPI 2026 v1.4.docx`.

**Ordre de rédaction recommandé** :
1. Sections techniques (3, 4, 5, 6, 7) — dérivables directement du code
2. Sections encadrantes (1, 2.1, 2.5, 13) — dérivables du CdC et des refs
3. Sections guidées (8, 9, 10) — le candidat complète avec son vécu
4. Sections personnelles (2.2, 2.3, 2.4 Gantt, 11, 12, 14, 15)
