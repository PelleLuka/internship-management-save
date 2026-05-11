# Planification du projet TPI — WorkXP Admin

**Période :** 10 jours ouvrés
**Volume :** 8 heures par jour, soit **80 heures au total**
**Granularité :** 1 heure
**Horaire journalier :** 08:00 → 12:00 (matin) / 13:00 → 17:00 (après-midi), 1 h de pause à midi

> Cette planification sert de référence pour le diagramme de Gantt
> (Figure 1 du rapport). Elle est construite en se basant sur le déroulé
> réel du TPI : analyse → conception → setup → back-end → front-end →
> tests → documentation → finalisation. Le 10ᵉ jour conserve un peu de
> tampon pour absorber les imprévus.

---

## Répartition globale (vue macro)

| # | Phase | Jours | Heures | % |
|---|---|---|---|---|
| 1 | Analyse & cahier des charges | J1 | 8 h | 10 % |
| 2 | Conception (DB, archi, mockups) | J2 | 8 h | 10 % |
| 3 | Setup environnement (Docker, repo) | J3 | 8 h | 10 % |
| 4 | Back-end — modèles & base | J4 | 8 h | 10 % |
| 5 | Back-end — services & routes | J5 | 8 h | 10 % |
| 6 | Front-end — pages & composants | J6 | 8 h | 10 % |
| 7 | Front-end — certificat & polish | J7 | 8 h | 10 % |
| 8 | Tests automatisés | J8 | 8 h | 10 % |
| 9 | Documentation technique & rapport | J9 | 8 h | 10 % |
| 10 | Finalisation, optimisations, dépôt | J10 | 8 h | 10 % |
| | **Total** | **10 j** | **80 h** | **100 %** |

---

## Jour 1 — Analyse et cahier des charges

| Heure | Tâche | Livrable |
|---|---|---|
| 08:00-09:00 | Lecture du sujet, prise de notes, questions à clarifier | Notes d'analyse |
| 09:00-10:00 | Entretien mandant (CA TIC) — clarification du besoin | Compte rendu d'entretien |
| 10:00-11:00 | Identification des fonctionnalités MUST / SHOULD / COULD | Liste priorisée |
| 11:00-12:00 | Rédaction du cahier des charges v0 (objectifs, périmètre) | `docs/analyse/specification.md` |
| 13:00-14:00 | Identification des acteurs et cas d'utilisation | Liste UC |
| 14:00-15:00 | Diagramme de cas d'utilisation (PlantUML) | `01-use-case.puml` |
| 15:00-16:00 | Contraintes techniques (Docker, navigateurs, perf) | Section contraintes |
| 16:00-17:00 | Planification initiale (Gantt) + validation v1 CDC | Diagramme de Gantt |

---

## Jour 2 — Conception

| Heure | Tâche | Livrable |
|---|---|---|
| 08:00-09:00 | MCD — entités, relations, cardinalités | Schéma MCD |
| 09:00-10:00 | MLD — passage au relationnel, FK CASCADE/RESTRICT | `05-database-schema.dbml` |
| 10:00-11:00 | Architecture 3-tiers (front / back / DB / backup) | `06-architecture.puml` |
| 11:00-12:00 | Justification des choix techniques (Vue, Express, MariaDB) | Notes pour le rapport |
| 13:00-14:00 | Mockup page **Accueil** (Pencil) | `WorkXPAdmin.pen` (page 1) |
| 14:00-15:00 | Mockup page **Stagiaires** (liste + modal création) | `WorkXPAdmin.pen` (page 2) |
| 15:00-16:00 | Mockup page **Ateliers** (catalogue + modal) | `WorkXPAdmin.pen` (page 3) |
| 16:00-17:00 | Mockup **Certificat** + **Catégories** | `WorkXPAdmin.pen` (pages 4-5) |

---

## Jour 3 — Setup environnement

| Heure | Tâche | Livrable |
|---|---|---|
| 08:00-09:00 | Init dépôt Git, structure des dossiers, `.gitignore` | Repo initialisé |
| 09:00-10:00 | `docker-compose.yml` — service `database` (MariaDB 10) | Service DB up |
| 10:00-11:00 | `Dockerfile` back-end Node 22 + LibreOffice | Image backend |
| 11:00-12:00 | `Dockerfile` front-end Nginx + build Vite multi-stage | Image frontend |
| 13:00-14:00 | Service `backup` Alpine + cron hebdomadaire | Volume `backup/data` |
| 14:00-15:00 | Variables d'environnement, `.env.example`, validation au boot | `backend/server.js` env check |
| 15:00-16:00 | Rédaction `README.md` (clone → up → URL) | `README.md` racine |
| 16:00-17:00 | Test bout-en-bout `docker compose up` (4 services) | Stack opérationnelle |

---

## Jour 4 — Back-end : modèles et base de données

| Heure | Tâche | Livrable |
|---|---|---|
| 08:00-09:00 | `schema.sql` — 6 tables + contraintes CHECK / FK | `database/schema.sql` |
| 09:00-10:00 | `seed.sql` — 26 stagiaires, 13 ateliers, 6 catégories | `database/seed.sql` |
| 10:00-11:00 | Pool MariaDB (`mariadb-node`) + helper `withConnection(fn)` | `backend/config/db.js` |
| 11:00-12:00 | Modèle `Person` (CRUD + `getById`) | `backend/models/Person.js` |
| 13:00-14:00 | Modèle `Internship` (CRUD + jointures activités) | `backend/models/Internship.js` |
| 14:00-15:00 | Modèle `Activity` — single-query `getById` (JOIN + GROUP_CONCAT) | `backend/models/Activity.js` |
| 15:00-16:00 | Modèle `Category` + table de jointure `activity_category` | `backend/models/Category.js` |
| 16:00-17:00 | Vérification manuelle FK CASCADE/RESTRICT via `mariadb` CLI | Notes de test |

---

## Jour 5 — Back-end : services et routes

| Heure | Tâche | Livrable |
|---|---|---|
| 08:00-09:00 | `personService` + `internshipService` (transactions SQL) | Services persons/internships |
| 09:00-10:00 | `activityService` — création, mise à jour, soft delete | `backend/services/activityService.js` |
| 10:00-11:00 | `categoryService` — CRUD + protection FK RESTRICT | `backend/services/categoryService.js` |
| 11:00-12:00 | `certificateService` — Carbone + LibreOffice (promisify) | `backend/services/certificateService.js` |
| 13:00-14:00 | Routes `/api/persons` + `/api/internships` (+ `/details`) | `backend/routes/*.js` |
| 14:00-15:00 | Routes `/api/activities` (+ `/details`) + upload Multer | Routes activities |
| 15:00-16:00 | Route `/api/internships/:id/certificate` (stream PDF) | Route certificat |
| 16:00-17:00 | Vérifications manuelles via Postman (happy path) | Collection Postman v0 |

---

## Jour 6 — Front-end : pages et composants

| Heure | Tâche | Livrable |
|---|---|---|
| 08:00-09:00 | Init projet Vue 3 + Vite + Pinia + Vue Router | `frontend/` scaffold |
| 09:00-10:00 | Layout principal (header, nav, footer) | `App.vue` + layouts |
| 10:00-11:00 | Page **Stagiaires** — liste, recherche, filtres | `views/InternList.vue` |
| 11:00-12:00 | Modal création / édition stagiaire | `components/InternModal.vue` |
| 13:00-14:00 | Page **Ateliers** — catalogue, soft delete, restauration | `views/ActivityList.vue` |
| 14:00-15:00 | Modal création atelier + upload document | `components/activities/ActivityModal.vue` |
| 15:00-16:00 | Composant `ActivityCard` + badges catégories | `components/activities/ActivityCard.vue` |
| 16:00-17:00 | Popover assignation catégories | Composant popover |

---

## Jour 7 — Front-end : certificat et finitions

| Heure | Tâche | Livrable |
|---|---|---|
| 08:00-09:00 | Vue `CertificateView` — iframe + PDF blob | `views/CertificateView.vue` |
| 09:00-10:00 | Boutons impression / téléchargement | UI certificat |
| 10:00-11:00 | Page **Catégories** (CRUD) | `views/CategoryList.vue` |
| 11:00-12:00 | Composables `useActivityList`, `useCategoryMenu` | `composables/*.js` |
| 13:00-14:00 | Service front `activityService.js` (`getActivityDetails`, `extractOriginalName`) | `frontend/src/services/` |
| 14:00-15:00 | Remplacement des emojis par icônes Lucide + aria-labels | Accessibilité |
| 15:00-16:00 | CSS final, responsive (≥ 1280 px), états vides | Styles `App.css` |
| 16:00-17:00 | Build prod (`vite build`) + test image Nginx | Bundle vérifié |

---

## Jour 8 — Tests automatisés

| Heure | Tâche | Livrable |
|---|---|---|
| 08:00-09:00 | Setup Playwright (config, baseURL, browsers) | `playwright.config.ts` |
| 09:00-10:00 | E2E happy path — création stagiaire + ajout activités | `tests/e2e/internship.spec.ts` |
| 10:00-11:00 | E2E ateliers — création, upload, soft delete, restauration | `tests/e2e/activity.spec.ts` |
| 11:00-12:00 | E2E certificat — génération PDF + assertions Content-Type | `tests/e2e/certificate.spec.ts` |
| 13:00-14:00 | E2E catégories — assignation, suppression bloquée (RESTRICT) | `tests/e2e/category.spec.ts` |
| 14:00-15:00 | Collection Postman API (couvre les 26 endpoints) | `tests/api/*.postman_collection.json` |
| 15:00-16:00 | Sanity check DB (26 / 13 / 6 + spot-check FK) | `tests/e2e/technical/sanity-db-check.spec.ts` |
| 16:00-17:00 | Pré-commit Husky + Biome + scripts npm `test:e2e` / `test:api` | `package.json` scripts |

---

## Jour 9 — Documentation technique et rapport

| Heure | Tâche | Livrable |
|---|---|---|
| 08:00-09:00 | README projet + README back-end + README front-end | 3 × `README.md` |
| 09:00-10:00 | Spécification OpenAPI 3.0.3 (26 endpoints, 14 schémas) | `end-point-diagram.json` |
| 10:00-11:00 | Diagrammes de séquence (création, upload, certificat) | `02..04-sequence-*.puml` |
| 11:00-12:00 | Rapport — Préambule, Cahier des charges | `Documentation du TPI 2026.docx` |
| 13:00-14:00 | Rapport — Analyse, Conception | Suite du rapport |
| 14:00-15:00 | Rapport — Réalisation, Tests | Suite du rapport |
| 15:00-16:00 | Rapport — Problèmes rencontrés, Améliorations futures | Suite du rapport |
| 16:00-17:00 | Bibliographie (57 entrées), glossaire, table des illustrations | Annexes du rapport |

---

## Jour 10 — Finalisation, optimisations, dépôt

| Heure | Tâche | Livrable |
|---|---|---|
| 08:00-09:00 | Code review interne — refactor `withConnection`, single-query | Commits de refactor |
| 09:00-10:00 | Optimisations front (suppression N+1 via `/details`) | Composable `useActivityList` |
| 10:00-11:00 | Durcissement sécurité (CORS strict, Helmet, validation env) | `server.js` final |
| 11:00-12:00 | Génération d'un PDF certificat de test (jeu de données réel) | PDF de validation |
| 13:00-14:00 | Captures d'écran finales (Gantt, mockups Pencil, screenshots app) | Images du rapport |
| 14:00-15:00 | Régénération des PNG à partir des sources PlantUML / DBML | `docs/images/figureXX.png` |
| 15:00-16:00 | Relecture complète du rapport + export PDF | `Documentation du TPI 2026.pdf` |
| 16:00-17:00 | Tag git `v1.0.0`, push final, dépôt sur PkOrg | Projet rendu |

---

## Risques identifiés et tampon

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| LibreOffice absent du `PATH` dans l'image backend | Moyenne | Élevé | `ENV PATH=$PATH:/usr/lib/libreoffice/program` dans le Dockerfile |
| Régression liée à un refactor tardif (J10) | Faible | Élevé | Suite Playwright relancée après chaque refactor |
| Carbone capricieux avec dates ISO UTC | Faible | Moyen | Helper `parseLocalDate(str).slice(0,10)` |
| Mockups non finalisés à temps | Faible | Faible | Fait dès J2, donc gros tampon ensuite |
| Rapport sous-évalué en temps | Moyenne | Moyen | J9 entièrement dédié + J10 pour relecture |

Le 10ᵉ jour conserve volontairement la marge la plus large : si une phase
précédente déborde de 2 à 3 heures, le tampon de J10 absorbe sans
mettre en péril le rendu.

---

## Légende et conventions

- **Une ligne = une heure de travail effectif.** Les transitions
  (relancer Docker, attendre un build, etc.) sont incluses dans la
  ligne en cours.
- **Pause midi 12:00-13:00** non comptée dans les 8 h.
- **Livrable** indique le fichier ou la sortie attendue à la fin de
  l'heure. Si une tâche s'étale sur plusieurs heures, le livrable
  apparaît sur la dernière.
- Les commits Git ne sont pas listés ligne par ligne : on commit après
  chaque tâche terminée (≈ 1 commit / h en moyenne).
