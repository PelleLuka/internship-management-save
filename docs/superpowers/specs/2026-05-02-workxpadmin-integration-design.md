# WorkXP Admin — Design d'intégration
**Date :** 2026-05-02  
**Projet :** CA TIC WorkXP Admin — TPI 2026 — Luka Pellegrinelli  
**Approche :** Foundation-first · Deadline 2 juin 2026

---

## Contexte

L'application actuelle implémente la gestion des stagiaires, des activités (titre uniquement) et l'association stagiaires ↔ activités. Le fichier `WorkXPAdmin.pen` contient le design complet de l'application finale décrite dans le cahier des charges. Ce document définit le plan d'intégration de ce design dans le code.

**Workflow d'intégration choisi — Pipeline hybride :**  
Extraction unique du design system depuis `WorkXPAdmin.pen` via Pencil MCP → tokens persistés dans le code → `WorkXPAdmin.pen` consulté comme référence visuelle pour chaque nouvelle interface.

---

## Section 1 — Design System Extraction

### Objectif
Traduire les variables de `WorkXPAdmin.pen` en tokens réutilisables dans le code, de sorte que chaque composant construit par la suite soit automatiquement cohérent avec le design.

### Fichiers impactés
- `frontend/tailwind.config.js` — couleurs, breakpoints, shadows
- `frontend/src/tokens.css` — CSS custom properties (nouveau fichier)
- `frontend/src/components/*.vue` — remplacement des valeurs hardcodées par les tokens nommés

### Processus
1. Connecter le MCP Pencil → lire les variables et composants de `WorkXPAdmin.pen`
2. Générer `frontend/src/tokens.css` avec les CSS custom properties extraites
3. Étendre `tailwind.config.js` pour référencer ces tokens
4. Remplacer les valeurs hardcodées existantes (`bg-[#2563eb]` → `bg-primary`) dans les composants Vue existants

### Exemple de résultat
```css
/* tokens.css — généré depuis WorkXPAdmin.pen */
:root {
  --color-primary: #2563eb;
  --color-surface: #ffffff;
  --color-bg: #f8fafc;
  --color-danger: #dc2626;
  --radius-card: 12px;
  --shadow-card: 0 1px 3px rgba(0,0,0,.1);
}
```

---

## Section 2 — Refonte du schéma DB

### Motivation
La table `internship` actuelle stocke l'identité du stagiaire directement, rendant impossible la gestion d'une même personne ayant effectué plusieurs stages à des périodes différentes (exigence explicite du cahier des charges).

### Nouveau schéma — 6 tables

#### `person`
| Colonne | Type | Contrainte |
|---|---|---|
| id | INT | PK, AUTO_INCREMENT |
| first_name | VARCHAR(80) | NOT NULL |
| last_name | VARCHAR(80) | NOT NULL |
| email | VARCHAR(254) | NOT NULL |

> Unicité assurée par la clé primaire uniquement. L'email est un champ de contact, pas une clé d'unicité.

#### `internship`
| Colonne | Type | Contrainte |
|---|---|---|
| id | INT | PK, AUTO_INCREMENT |
| person_id | INT | FK → person(id), NOT NULL |
| start_date | DATE | NOT NULL |
| end_date | DATE | NOT NULL |

- `CASCADE DELETE` sur `person_id` : supprimer une personne efface tous ses stages
- `CHECK: end_date >= start_date`
- `status` : champ **calculé côté frontend** (non stocké en DB)
  - `À venir` si `start_date > TODAY`
  - `En cours` si `start_date <= TODAY <= end_date`
  - `Terminé` si `end_date < TODAY`

#### `activity`
| Colonne | Type | Contrainte |
|---|---|---|
| id | INT | PK, AUTO_INCREMENT |
| title | VARCHAR(255) | NOT NULL |
| description | TEXT | NULL |
| document_url | VARCHAR(500) | NULL |
| visible | BOOLEAN | DEFAULT true |

#### `category`
| Colonne | Type | Contrainte |
|---|---|---|
| id | INT | PK, AUTO_INCREMENT |
| name | VARCHAR(100) | NOT NULL |
| description | TEXT | NULL |

#### `internship_activity` (junction N:M — inchangée)
| Colonne | Type | Contrainte |
|---|---|---|
| internship_id | INT | FK PK, CASCADE DELETE |
| activity_id | INT | FK PK, RESTRICT DELETE |

#### `activity_category` (junction N:M — nouvelle)
| Colonne | Type | Contrainte |
|---|---|---|
| activity_id | INT | FK PK, CASCADE DELETE |
| category_id | INT | FK PK, RESTRICT DELETE |

> La contrainte RESTRICT sur `category_id` empêche la suppression d'une catégorie tant qu'elle est liée à des activités (règle explicite du cahier des charges).

### Stratégie de migration (non-destructive)
1. Créer la table `person`
2. Insérer les identités depuis `internship` (une ligne par entrée existante)
3. Ajouter colonne `person_id` (nullable) dans `internship`
4. Remplir `person_id` : pour chaque ligne `internship`, créer une entrée `person` correspondante et affecter son `id` généré — chaque stage reçoit sa propre `person`, sans déduplication par email
5. Passer `person_id` NOT NULL + ajouter FK + supprimer les anciennes colonnes (`first_name`, `last_name`, `email`)

### Impact backend
- Nouveau `backend/models/Person.js`
- `backend/models/Internship.js` — requêtes avec JOIN person
- `backend/services/internshipService.js` — logique de création : INSERT person si nouveau, puis INSERT internship lié
- `backend/models/Activity.js` — ajout description, document_url
- Nouveau `backend/models/Category.js`
- Mise à jour `tests/setup/restore_db.sql` + fixtures Playwright + collection Postman

---

## Section 3 — Interfaces utilisateur

### 3.1 Badges de statut sur les cartes de stage
Calculé par une propriété `computed` Vue à partir de `start_date` et `end_date` comparées à la date du jour. Aucun changement backend requis.

- `● EN COURS` — fond vert (#dcfce7), texte #16a34a
- `✓ TERMINÉ` — fond rouge (#fee2e2), texte #dc2626
- `◷ À VENIR` — fond bleu (#eff6ff), texte #2563eb

Affiché en haut à droite de chaque carte de stage.

### 3.2 Formulaire atelier enrichi
Champs ajoutés au formulaire de création/modification d'un atelier :
- `description` — textarea
- `catégories` — sélecteur multi-tags (liste des catégories existantes, cliquables)
- `documentation` — zone d'upload (voir Section 3b)

### 3.3 Page Catégories (`/categories`)
Nouvelle route dans Vue Router. Interface de gestion CRUD :
- Liste des catégories avec le nombre d'ateliers liés
- Création via modale
- Modification via modale
- Suppression : bouton actif (rouge) si 0 atelier lié, désactivé (grisé) si des ateliers sont liés

### 3.4 Navigation
Ajout d'un lien "Catégories" dans la sidebar, avec l'icône appropriée du jeu Lucide.

---

## Section 3b — Upload / Download / Stockage des documents

### Principe
Chaque activité peut avoir **un seul document** attaché, dans **n'importe quel format document** (PDF, DOCX, ODT, PPTX, etc.). La section "Documentation" est **toujours visible** sur la carte, qu'un fichier soit attaché ou non.

### Formats acceptés
PDF, DOCX, DOC, ODT, PPTX, ODP, TXT, XLSX, ODS — max **10 MB**.  
Rejetés : exécutables, archives (.zip, .rar), images seules, fichiers > 10 MB.

### Comportement selon le format
- **PDF** : bouton "👁 Voir" (ouvre dans un nouvel onglet) + bouton "⬇ Télécharger"
- **Autres formats** : bouton "⬇ Télécharger" uniquement

### États de la zone document sur la carte

**État vide** — zone dashed avec drag & drop + texte "Glisser un fichier ou parcourir · PDF, DOCX, ODT… · max 10 MB"

**État rempli** :
- Icône + nom du fichier (📄 pour PDF, 📝 pour les autres)
- Boutons : "👁 Voir" (PDF uniquement) · "⬇" télécharger · "🗑" supprimer
- Zone "🔄 Remplacer" sous le fichier actuel

### Stockage
```
backend/uploads/
  activities/          # documents des ateliers
    <uuid>-<nom-sanitisé>.<ext>
  certificate/         # template certificat
    template.docx
```

Nommage : UUID + nom original sanitisé → évite les collisions et les path traversal attacks.

Volume Docker nommé `uploads_data` monté sur `/app/uploads` — persistant entre redémarrages, partagé entre les documents d'activités et le template de certificat.

### Endpoints backend
| Méthode | Route | Description |
|---|---|---|
| POST | `/api/activities/:id/document` | Upload (multer) |
| GET | `/api/activities/:id/document` | Télécharger le fichier |
| DELETE | `/api/activities/:id/document` | Supprimer fichier + entrée DB |

### Validation multer
- Type MIME vérifié côté serveur (pas seulement l'extension)
- Taille max : 10 MB
- Nom de fichier sanitisé avant stockage (suppression des `../`, caractères spéciaux)

### docker-compose.yml
```yaml
backend:
  volumes:
    - uploads_data:/app/uploads

volumes:
  uploads_data:
```

---

## Section 4 — Certificat de stage

### Approche : carbone.js (DOCX template → PDF)
L'admin crée/modifie le template dans Word, l'uploade dans l'application. À la génération, carbone.js injecte les données du stage dans le template et produit un PDF téléchargeable directement.

### Flux
`Template .docx (Word)` → `Upload UI` → `Stockage /uploads/certificate/template.docx` → `Bouton "Télécharger certificat" sur la carte` → `carbone.js injecte les données + convertit en PDF` → `PDF téléchargé`

### Balises dans le template Word
```
{prenom}           Prénom du stagiaire
{nom}              Nom du stagiaire
{email}            Email du stagiaire
{date_debut}       Date de début du stage (formatée)
{date_fin}         Date de fin du stage (formatée)
{#ateliers}        Début de boucle ateliers
  {titre}          Titre de l'atelier
  {categories}     Catégories de l'atelier
{/ateliers}        Fin de boucle ateliers
{date_emission}    Date d'émission automatique (TODAY)
```

Un template `.docx` de démonstration est livré avec le projet. L'admin peut le télécharger, le modifier dans Word (mise en page, logo, textes), et le ré-uploader sans toucher au code.

### Prérequis Docker
carbone.js utilise LibreOffice pour la conversion DOCX → PDF. À ajouter dans `docker/Dockerfile.backend` :
```dockerfile
RUN apk add --no-cache libreoffice
```
Impact : image backend ~+300MB. Entièrement auto-hébergé, aucun service externe requis.

### Endpoints backend
| Méthode | Route | Description |
|---|---|---|
| POST | `/api/certificate/template` | Upload du template .docx |
| GET | `/api/certificate/template` | Télécharger le template actuel |
| GET | `/api/internships/:id/certificate` | Générer et télécharger le PDF |

### Dépendances npm
```
npm install carbone multer
```
> `multer` est installé une seule fois et sert à la fois pour les documents d'activités (Section 3b) et pour l'upload du template certificat.

### UI
- Bouton "🖨 Certificat" sur chaque carte de stage
- Section "Paramètres" → "Modèle de certificat" avec bouton upload + lien "Télécharger le modèle actuel"

---

## Section 5 — Plan d'implémentation

### Planning (Approche Foundation-first)

| Semaine | Dates | Travaux |
|---|---|---|
| **S1 — Fondations** | 2–9 mai | Design system tokens · Migration DB PERSON/INTERNSHIP · Nouveau Person.js · Mise à jour seeds + tests |
| **S2 — Ateliers + Catégories** | 9–16 mai | DB category + activity_category · Endpoints CRUD catégories · Upload documents (multer) · Formulaire atelier enrichi · Page /categories |
| **S3 — Statuts + Navigation** | 16–23 mai | Badges statut (computed Vue) · Lien Catégories sidebar · Tests E2E nouveaux scénarios |
| **S4 — Certificat + Polish** | 23–30 mai | carbone.js + LibreOffice Docker · Endpoints certificat · Bouton carte + page Paramètres · Template .docx de base · Polish + documentation |
| **Buffer + Remise** | 30 mai–2 juin | Marge imprévus · Finalisation documentation · Journal de travail · Remise PkOrg |

### Stratégie de tests

**Nouveaux scénarios Playwright E2E :**
- `sc-person-migration` — données existantes préservées après migration
- `sc-category-crud` — création, modification, contrainte RESTRICT à la suppression
- `sc-activity-enriched` — description, catégories, upload/download document
- `sc-status-badges` — calcul correct En cours / Terminé / À venir
- `sc-certificate-download` — PDF généré et téléchargeable

**Nouveaux cas Postman :**
- CRUD `/api/categories`
- PATCH `/api/activities` avec description et document
- `POST/GET/DELETE /api/activities/:id/document`
- `POST/GET /api/certificate/template`
- `GET /api/internships/:id/certificate`
- Contrainte : tentative de suppression d'une catégorie liée → 409

### Intégration WorkXPAdmin.pen dans le workflow
- **Semaine 1** — Pencil MCP connecté → extraction tokens → `tokens.css` généré
- **Semaines 2–4** — `WorkXPAdmin.pen` consulté comme référence visuelle pour chaque nouvelle interface
- **Fin TPI** — `design.pen` mis à jour avec les écrans finaux pour la documentation de réalisation

---

## Résumé des nouvelles dépendances

| Package | Usage | Côté |
|---|---|---|
| `carbone` | Templating DOCX + conversion PDF | Backend |
| `multer` | Upload de fichiers | Backend |
| `libreoffice` (Alpine) | Conversion PDF via carbone | Docker |

## Résumé des nouvelles routes Vue Router

| Route | Vue | Description |
|---|---|---|
| `/categories` | `CategoryList.vue` | Gestion CRUD des catégories |
| `/settings` | `SettingsView.vue` | Upload template certificat + téléchargement modèle actuel |
