# WorkXP Admin — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Compléter l'application WorkXP Admin selon le cahier des charges TPI 2026 en intégrant le design de `WorkXPAdmin.pen` et en ajoutant les fonctionnalités manquantes : refonte DB PERSON/INTERNSHIP, ateliers enrichis, catégories, upload/download de documents, statuts visuels, et certificat de stage PDF via template Word.

**Architecture:** Le backend Express existant est étendu avec de nouveaux modèles/services/routes en respectant le pattern MVC déjà en place. La DB est migrée via un script SQL non-destructif. Le frontend Vue 3 reçoit de nouvelles views/composables/services en suivant les patterns existants (Composition API, Tailwind, Lucide icons).

**Tech Stack:** Vue 3 · Express 4 · MariaDB · Tailwind CSS · Playwright · Postman/Newman · carbone.js · multer · LibreOffice (Alpine Docker)

---

## Carte des fichiers

### Nouveaux fichiers
| Fichier | Rôle |
|---|---|
| `database/schema-v2.sql` | Schéma complet version 2 (6 tables) |
| `database/migration-v2.sql` | Script migration non-destructive v1→v2 |
| `backend/models/Person.js` | CRUD table `person` |
| `backend/models/Category.js` | CRUD table `category` |
| `backend/middleware/upload.js` | Config multer (validation type, taille) |
| `backend/routes/categoryRoutes.js` | Routes CRUD /api/categories |
| `backend/routes/certificateRoutes.js` | Routes /api/certificate/template + /api/internships/:id/certificate |
| `backend/controllers/categoryController.js` | Handlers catégories |
| `backend/controllers/certificateController.js` | Handlers certificat |
| `backend/services/categoryService.js` | Logique métier catégories |
| `backend/services/certificateService.js` | Génération PDF via carbone |
| `backend/uploads/.gitkeep` | Crée le dossier uploads dans git |
| `frontend/src/tokens.css` | CSS custom properties issues du design |
| `frontend/src/views/CategoryList.vue` | Page CRUD catégories |
| `frontend/src/views/SettingsView.vue` | Page upload/download template certificat |
| `frontend/src/services/categoryService.js` | Appels API catégories |
| `frontend/src/services/certificateService.js` | Appels API certificat |
| `frontend/src/composables/useCategories.js` | State management catégories |
| `tests/e2e/tests/sc-category-crud.spec.ts` | Tests E2E catégories |
| `tests/e2e/tests/sc-activity-enriched.spec.ts` | Tests E2E ateliers enrichis |
| `tests/e2e/tests/sc-status-badges.spec.ts` | Tests E2E statuts visuels |
| `tests/e2e/tests/sc-certificate-download.spec.ts` | Tests E2E certificat |

### Fichiers modifiés
| Fichier | Changement |
|---|---|
| `database/schema.sql` | Remplacé par schema-v2 |
| `tests/setup/restore_db.sql` | Adapté au nouveau schéma (person + internship séparés) |
| `backend/models/Activity.js` | Ajout description, document_url, catégories |
| `backend/models/Internship.js` | JOIN person, suppression colonnes identité |
| `backend/services/internshipService.js` | Création/update/delete via Person + Internship |
| `backend/services/activityService.js` | Catégories, document |
| `backend/routes/activityRoutes.js` | Endpoints document |
| `backend/routes/internshipRoutes.js` | Endpoint certificate |
| `backend/server.js` | Montage nouvelles routes + static /uploads |
| `backend/package.json` | Ajout carbone, multer |
| `docker/Dockerfile.backend` | Ajout LibreOffice Alpine |
| `docker/docker-compose.yml` | Volume uploads_data |
| `frontend/tailwind.config.js` | Tokens couleurs/shadows |
| `frontend/src/style.css` | Import tokens.css |
| `frontend/src/router.js` | Routes /categories, /settings |
| `frontend/src/layouts/Sidebar.vue` | Lien Catégories |
| `frontend/src/components/ActivityFormModal.vue` | Description, catégories, document |
| `frontend/src/components/internships/card/InternshipCardDesktop.vue` | Badge statut + bouton certificat |
| `frontend/src/components/internships/card/InternshipCardMobile.vue` | Badge statut + bouton certificat |

---

## Phase 1 — Fondations (Semaine 1)

---

### Task 1 : Design System Tokens

**Files:**
- Create: `frontend/src/tokens.css`
- Modify: `frontend/tailwind.config.js`
- Modify: `frontend/src/style.css`

- [ ] **Step 1 : Créer `frontend/src/tokens.css`**

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
  --color-danger-light: #fee2e2;
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --shadow-card: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px -1px rgba(0,0,0,.1);
  --shadow-card-hover: 0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -2px rgba(0,0,0,.1);
}
```

- [ ] **Step 2 : Mettre à jour `frontend/tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: { xl: "1380px" },
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          light: "var(--color-primary-light)",
          border: "var(--color-primary-border)",
        },
        surface: "var(--color-surface)",
        "app-bg": "var(--color-bg)",
        danger: {
          DEFAULT: "var(--color-danger)",
          light: "var(--color-danger-light)",
        },
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 3 : Importer tokens.css dans `frontend/src/style.css`**

```css
@import './tokens.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 4 : Commit**

```bash
git add frontend/src/tokens.css frontend/tailwind.config.js frontend/src/style.css
git commit -m "feat(frontend): add design system tokens from WorkXPAdmin.pen"
```

---

### Task 2 : Nouveau schéma DB et script de migration

**Files:**
- Create: `database/schema-v2.sql`
- Create: `database/migration-v2.sql`

- [ ] **Step 1 : Écrire `database/schema-v2.sql`**

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

- [ ] **Step 2 : Écrire `database/migration-v2.sql`**

```sql
-- Migration v1 → v2 : séparation person / internship
-- NON-DESTRUCTIVE : données existantes préservées

-- 1. Créer la table person
CREATE TABLE IF NOT EXISTS `person` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(80) NOT NULL,
  `last_name` VARCHAR(80) NOT NULL,
  `email` VARCHAR(254) NOT NULL
);

-- 2. Remplir person depuis internship (1 person par internship, même ordre)
INSERT INTO `person` (first_name, last_name, email)
SELECT first_name, last_name, email FROM `internship` ORDER BY id;

-- 3. Ajouter person_id (nullable pour l'instant)
ALTER TABLE `internship` ADD COLUMN `person_id` INT NULL;

-- 4. Associer chaque internship à sa person (même position dans les deux tables)
UPDATE `internship` SET `person_id` = `id`;

-- 5. Contraintes
ALTER TABLE `internship`
  MODIFY COLUMN `person_id` INT NOT NULL,
  ADD CONSTRAINT `fk_internship_person`
    FOREIGN KEY (`person_id`) REFERENCES `person`(`id`) ON DELETE CASCADE;

-- 6. Supprimer les colonnes identité de internship
ALTER TABLE `internship`
  DROP COLUMN `first_name`,
  DROP COLUMN `last_name`,
  DROP COLUMN `email`;

-- 7. Nouvelles colonnes sur activity
ALTER TABLE `activity`
  ADD COLUMN `description` TEXT NULL AFTER `title`,
  ADD COLUMN `document_url` VARCHAR(500) NULL AFTER `description`;

-- 8. Nouvelle table category
CREATE TABLE IF NOT EXISTS `category` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT NULL
);

-- 9. Nouvelle table activity_category
CREATE TABLE IF NOT EXISTS `activity_category` (
  `activity_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  PRIMARY KEY (`activity_id`, `category_id`),
  FOREIGN KEY (`activity_id`) REFERENCES `activity`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE RESTRICT
);

-- Reset auto_increment
ALTER TABLE `person` AUTO_INCREMENT = 1000;
```

- [ ] **Step 3 : Appliquer la migration sur la DB locale**

```bash
docker compose exec database mariadb -u user -ppassword internship_management < database/migration-v2.sql
```

Résultat attendu : aucune erreur, puis vérifier :
```bash
docker compose exec database mariadb -u user -ppassword internship_management -e "SHOW TABLES; DESCRIBE internship; DESCRIBE person;"
```

- [ ] **Step 4 : Commit**

```bash
git add database/schema-v2.sql database/migration-v2.sql
git commit -m "feat(db): add migration script v1→v2 (person/internship split + category + activity enrichment)"
```

---

### Task 3 : Mettre à jour restore_db.sql

**Files:**
- Modify: `tests/setup/restore_db.sql`

- [ ] **Step 1 : Remplacer `tests/setup/restore_db.sql`**

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
  (2, 'Montage d\'un poste de travail PC', 1),
  (3, 'Installation d\'un système d\'exploitation (Ubuntu)', 1),
  (4, 'Réalisation d\'un site Web (HTML, CSS et PHP)', 1),
  (5, 'Programmation du jeu Casse-briques (Microsoft Small Basic)', 1),
  (6, 'Programmation du jeu Tetris (Microsoft Small Basic)', 1),
  (7, 'Programmation du jeu Attrape-moi (Processing)', 1),
  (8, 'Programmation du jeu Flappy Bird (Scratch)', 1),
  (9, 'Programmation du jeu Pac-Miam (Scratch)', 1),
  (10, 'Programmation d\'un robot Ozobot (OzoBlockly)', 1),
  (11, 'Création d\'une affiche de film (Gimp)', 1),
  (12, 'Programmation du jeu Simon sur un Raspberry Pi Pico (Python)', 1),
  (13, 'Programmation d\'un robot (LEGO Mindstorms)', 0),
  (14, 'Réalisation d\'un circuit électronique interactif (Arduino, Scratch et Kinect)', 0),
  (15, 'Création d\'une affiche de film (Photoshop)', 0);

INSERT INTO person (id, first_name, last_name, email) VALUES
  (1,'Lucas','Martin','lucas.martin@example.com'),
  (2,'Emma','Bernard','emma.bernard@example.com'),
  (3,'Gabriel','Dubois','gabriel.dubois@example.com'),
  (4,'Léa','Thomas','lea.thomas@example.com'),
  (5,'Louis','Robert','louis.robert@example.com'),
  (6,'Chloé','Richard','chloe.richard@example.com'),
  (7,'Arthur','Petit','arthur.petit@example.com'),
  (8,'Manon','Durand','manon.durand@example.com'),
  (9,'Raphaël','Leroy','raphael.leroy@example.com'),
  (10,'Jade','Moreau','jade.moreau@example.com'),
  (60,'Joël','Dacobeau','lej.dacobeau@example.cn');

INSERT INTO internship (id, person_id, start_date, end_date) VALUES
  (1, 1, '2024-01-09', '2024-07-09'),
  (2, 2, '2024-01-10', '2024-07-10'),
  (3, 3, '2024-01-11', '2024-07-11'),
  (4, 4, '2024-01-12', '2024-07-12'),
  (5, 5, '2024-01-13', '2024-07-13'),
  (6, 6, '2024-01-14', '2024-07-14'),
  (7, 7, '2024-02-09', '2024-08-09'),
  (8, 8, '2024-02-10', '2024-08-10'),
  (9, 9, '2024-02-11', '2024-08-11'),
  (10, 10, '2024-02-12', '2024-08-12'),
  (60, 60, '2025-09-01', '2025-09-02');

INSERT INTO internship_activity (internship_id, activity_id) VALUES
  (1,1),(1,2),(2,3),(2,4),(3,5),(3,6),(4,7),(4,8),(5,9),(5,10),
  (6,11),(6,12),(7,13),(7,14),(8,15),(8,1),(9,2),(9,3),(10,4),(10,5);

SET FOREIGN_KEY_CHECKS = 1;
ALTER TABLE internship AUTO_INCREMENT = 1000;
ALTER TABLE person AUTO_INCREMENT = 1000;
ALTER TABLE category AUTO_INCREMENT = 1000;
```

> Note : le seed est volontairement réduit à 10 stagiaires pour la rapidité des tests. Les IDs 1-10 et 60 sont conservés pour la compatibilité avec les tests existants.

- [ ] **Step 2 : Tester la restauration**

```bash
npm run db:restore
```

Résultat attendu : `✅ Database restored` sans erreur.

- [ ] **Step 3 : Commit**

```bash
git add tests/setup/restore_db.sql
git commit -m "test(db): update seed for v2 schema (person + internship split)"
```

---

### Task 4 : Modèle Person.js

**Files:**
- Create: `backend/models/Person.js`

- [ ] **Step 1 : Créer `backend/models/Person.js`**

```js
import pool from '../config/db.js';

const Person = {
  create: async (data) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query(
        'INSERT INTO person (first_name, last_name, email) VALUES (?, ?, ?)',
        [data.firstName, data.lastName, data.email]
      );
      return Number(res.insertId);
    } finally {
      if (conn) conn.end();
    }
  },

  getById: async (id) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM person WHERE id = ?', [id]);
      if (!rows[0]) return null;
      return {
        id: rows[0].id,
        firstName: rows[0].first_name,
        lastName: rows[0].last_name,
        email: rows[0].email,
      };
    } finally {
      if (conn) conn.end();
    }
  },

  update: async (id, data) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const fields = [];
      const values = [];
      if (data.firstName !== undefined) { fields.push('first_name = ?'); values.push(data.firstName); }
      if (data.lastName !== undefined) { fields.push('last_name = ?'); values.push(data.lastName); }
      if (data.email !== undefined) { fields.push('email = ?'); values.push(data.email); }
      if (!fields.length) return false;
      values.push(id);
      const res = await conn.query(`UPDATE person SET ${fields.join(', ')} WHERE id = ?`, values);
      return res.affectedRows > 0;
    } finally {
      if (conn) conn.end();
    }
  },

  delete: async (id) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query('DELETE FROM person WHERE id = ?', [id]);
      return res.affectedRows > 0;
    } finally {
      if (conn) conn.end();
    }
  },
};

export default Person;
```

- [ ] **Step 2 : Commit**

```bash
git add backend/models/Person.js
git commit -m "feat(backend): add Person model"
```

---

### Task 5 : Mettre à jour Internship.js et internshipService.js

**Files:**
- Modify: `backend/models/Internship.js`
- Modify: `backend/services/internshipService.js`

- [ ] **Step 1 : Remplacer `getAll` dans `backend/models/Internship.js`**

Remplacer la méthode `getAll` existante par :

```js
getAll: async (limit, offset, search = '') => {
  let conn;
  try {
    conn = await pool.getConnection();
    let query = `
      SELECT i.id, i.person_id, p.first_name, p.last_name, p.email, i.start_date, i.end_date
      FROM internship i
      JOIN person p ON i.person_id = p.id
    `;
    const params = [];
    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      query += ' WHERE p.first_name LIKE ? OR p.last_name LIKE ? OR p.email LIKE ?';
      params.push(term, term, term);
    }
    query += ' ORDER BY i.start_date DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    const rows = await conn.query(query, params);
    return rows.map(row => ({
      id: row.id,
      personId: Number(row.person_id),
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      startDate: row.start_date,
      endDate: row.end_date,
    }));
  } finally {
    if (conn) conn.end();
  }
},
```

- [ ] **Step 2 : Remplacer `count` dans `backend/models/Internship.js`**

```js
count: async (search = '') => {
  let conn;
  try {
    conn = await pool.getConnection();
    let query = `SELECT COUNT(*) as total FROM internship i JOIN person p ON i.person_id = p.id`;
    const params = [];
    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      query += ' WHERE p.first_name LIKE ? OR p.last_name LIKE ? OR p.email LIKE ?';
      params.push(term, term, term);
    }
    const rows = await conn.query(query, params);
    return Number(rows[0].total);
  } finally {
    if (conn) conn.end();
  }
},
```

- [ ] **Step 3 : Remplacer `getById` dans `backend/models/Internship.js`**

```js
getById: async (id) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`
      SELECT i.id, i.person_id, p.first_name, p.last_name, p.email, i.start_date, i.end_date
      FROM internship i
      JOIN person p ON i.person_id = p.id
      WHERE i.id = ?
    `, [id]);
    if (!rows[0]) return null;
    return {
      id: rows[0].id,
      personId: Number(rows[0].person_id),
      firstName: rows[0].first_name,
      lastName: rows[0].last_name,
      email: rows[0].email,
      startDate: rows[0].start_date,
      endDate: rows[0].end_date,
    };
  } finally {
    if (conn) conn.end();
  }
},
```

- [ ] **Step 4 : Remplacer `create` dans `backend/models/Internship.js`**

```js
create: async (data) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(
      'INSERT INTO internship (person_id, start_date, end_date) VALUES (?, ?, ?)',
      [data.personId, data.startDate, data.endDate]
    );
    return Number(res.insertId);
  } finally {
    if (conn) conn.end();
  }
},
```

- [ ] **Step 5 : Remplacer `update` dans `backend/models/Internship.js`**

```js
update: async (id, data) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const fields = [];
    const values = [];
    if (data.startDate !== undefined) { fields.push('start_date = ?'); values.push(data.startDate); }
    if (data.endDate !== undefined) { fields.push('end_date = ?'); values.push(data.endDate); }
    if (!fields.length) return false;
    values.push(id);
    const res = await conn.query(`UPDATE internship SET ${fields.join(', ')} WHERE id = ?`, values);
    return res.affectedRows > 0;
  } finally {
    if (conn) conn.end();
  }
},
```

- [ ] **Step 6 : Ajouter `delete` dans `backend/models/Internship.js`** (après `update`)

```js
delete: async (id) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query('DELETE FROM internship WHERE id = ?', [id]);
    return res.affectedRows > 0;
  } finally {
    if (conn) conn.end();
  }
},
```

- [ ] **Step 7 : Mettre à jour `createInternship` dans `backend/services/internshipService.js`**

Ajouter l'import Person en haut du fichier :
```js
import Person from '../models/Person.js';
```

Remplacer la fonction `createInternship` :
```js
export const createInternship = async (data) => {
  if (!data.firstName?.trim()) throw new Error('VALIDATION_ERROR:first_name required');
  if (!data.lastName?.trim()) throw new Error('VALIDATION_ERROR:last_name required');
  if (!isValidEmail(data.email)) throw new Error('VALIDATION_ERROR:invalid email');
  if (!isValidDate(data.startDate)) throw new Error('VALIDATION_ERROR:invalid start_date');
  if (!isValidDate(data.endDate)) throw new Error('VALIDATION_ERROR:invalid end_date');
  if (data.startDate > data.endDate) throw new Error('VALIDATION_ERROR:end_date before start_date');

  const personId = await Person.create({
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim(),
  });
  const internshipId = await Internship.create({
    personId,
    startDate: data.startDate,
    endDate: data.endDate,
  });
  return internshipId;
};
```

- [ ] **Step 8 : Mettre à jour `updateInternship` dans `backend/services/internshipService.js`**

```js
export const updateInternship = async (id, data) => {
  const internship = await Internship.getById(id);
  if (!internship) throw new Error('NOT_FOUND');

  if (data.email && !isValidEmail(data.email)) throw new Error('VALIDATION_ERROR:invalid email');
  if (data.startDate && !isValidDate(data.startDate)) throw new Error('VALIDATION_ERROR:invalid start_date');
  if (data.endDate && !isValidDate(data.endDate)) throw new Error('VALIDATION_ERROR:invalid end_date');
  const start = data.startDate ?? internship.startDate;
  const end = data.endDate ?? internship.endDate;
  if (start > end) throw new Error('VALIDATION_ERROR:end_date before start_date');

  await Person.update(internship.personId, {
    firstName: data.firstName?.trim(),
    lastName: data.lastName?.trim(),
    email: data.email?.trim(),
  });
  await Internship.update(id, {
    startDate: data.startDate,
    endDate: data.endDate,
  });
};
```

- [ ] **Step 9 : Mettre à jour `deleteInternship` dans `backend/services/internshipService.js`**

```js
export const deleteInternship = async (id) => {
  const deleted = await Internship.delete(id);
  if (!deleted) throw new Error('NOT_FOUND');
};
```

- [ ] **Step 10 : Redémarrer le backend et vérifier `GET /api/internships`**

```bash
docker compose restart backend
curl http://localhost:3000/api/internships?limit=2 | jq .
```

Résultat attendu : JSON avec `data: [{id, firstName, lastName, email, startDate, endDate, personId}, ...]`

- [ ] **Step 11 : Commit**

```bash
git add backend/models/Internship.js backend/services/internshipService.js
git commit -m "feat(backend): update Internship model and service for person/internship split"
```

---

## Phase 2 — Ateliers + Catégories + Documents (Semaine 2)

---

### Task 6 : Modèle Category.js et routes CRUD

**Files:**
- Create: `backend/models/Category.js`
- Create: `backend/services/categoryService.js`
- Create: `backend/controllers/categoryController.js`
- Create: `backend/routes/categoryRoutes.js`
- Modify: `backend/server.js`

- [ ] **Step 1 : Créer `backend/models/Category.js`**

```js
import pool from '../config/db.js';

const Category = {
  getAll: async () => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query(`
        SELECT c.id, c.name, c.description,
               COUNT(ac.activity_id) as activity_count
        FROM category c
        LEFT JOIN activity_category ac ON ac.category_id = c.id
        GROUP BY c.id
        ORDER BY c.name
      `);
      return rows.map(row => ({
        id: row.id,
        name: row.name,
        description: row.description,
        activityCount: Number(row.activity_count),
      }));
    } finally {
      if (conn) conn.end();
    }
  },

  getById: async (id) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM category WHERE id = ?', [id]);
      return rows[0] || null;
    } finally {
      if (conn) conn.end();
    }
  },

  create: async (data) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query(
        'INSERT INTO category (name, description) VALUES (?, ?)',
        [data.name, data.description ?? null]
      );
      return Number(res.insertId);
    } finally {
      if (conn) conn.end();
    }
  },

  update: async (id, data) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const fields = [];
      const values = [];
      if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
      if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
      if (!fields.length) return false;
      values.push(id);
      const res = await conn.query(`UPDATE category SET ${fields.join(', ')} WHERE id = ?`, values);
      return res.affectedRows > 0;
    } finally {
      if (conn) conn.end();
    }
  },

  delete: async (id) => {
    let conn;
    try {
      conn = await pool.getConnection();
      // RESTRICT FK will throw if activities are linked — let it propagate
      const res = await conn.query('DELETE FROM category WHERE id = ?', [id]);
      return res.affectedRows > 0;
    } finally {
      if (conn) conn.end();
    }
  },
};

export default Category;
```

- [ ] **Step 2 : Créer `backend/services/categoryService.js`**

```js
import Category from '../models/Category.js';

export const getCategories = async () => Category.getAll();

export const getCategoryById = async (id) => {
  const cat = await Category.getById(id);
  if (!cat) throw new Error('NOT_FOUND');
  return cat;
};

export const createCategory = async (data) => {
  if (!data.name?.trim()) throw new Error('VALIDATION_ERROR:name required');
  return Category.create({ name: data.name.trim(), description: data.description?.trim() ?? null });
};

export const updateCategory = async (id, data) => {
  const cat = await Category.getById(id);
  if (!cat) throw new Error('NOT_FOUND');
  if (data.name !== undefined && !data.name.trim()) throw new Error('VALIDATION_ERROR:name required');
  await Category.update(id, {
    name: data.name?.trim(),
    description: data.description?.trim(),
  });
};

export const deleteCategory = async (id) => {
  const cat = await Category.getById(id);
  if (!cat) throw new Error('NOT_FOUND');
  try {
    await Category.delete(id);
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.errno === 1451) {
      throw new Error('CONFLICT:category has linked activities');
    }
    throw err;
  }
};
```

- [ ] **Step 3 : Créer `backend/controllers/categoryController.js`**

```js
import * as categoryService from '../services/categoryService.js';
import logger from '../config/logger.js';

export const getCategories = async (req, res) => {
  try {
    const data = await categoryService.getCategories();
    res.json(data);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const data = await categoryService.getCategoryById(Number(req.params.id));
    res.json(data);
  } catch (err) {
    if (err.message === 'NOT_FOUND') return res.status(404).json({ error: 'Category not found' });
    res.status(500).json({ error: 'Server error' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const id = await categoryService.createCategory(req.body);
    res.status(201).json({ id });
  } catch (err) {
    if (err.message?.startsWith('VALIDATION_ERROR')) return res.status(400).json({ error: err.message.split(':')[1] });
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    await categoryService.updateCategory(Number(req.params.id), req.body);
    res.json({ success: true });
  } catch (err) {
    if (err.message === 'NOT_FOUND') return res.status(404).json({ error: 'Category not found' });
    if (err.message?.startsWith('VALIDATION_ERROR')) return res.status(400).json({ error: err.message.split(':')[1] });
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await categoryService.deleteCategory(Number(req.params.id));
    res.json({ success: true });
  } catch (err) {
    if (err.message === 'NOT_FOUND') return res.status(404).json({ error: 'Category not found' });
    if (err.message?.startsWith('CONFLICT')) return res.status(409).json({ error: err.message.split(':')[1] });
    res.status(500).json({ error: 'Server error' });
  }
};
```

- [ ] **Step 4 : Créer `backend/routes/categoryRoutes.js`**

```js
import express from 'express';
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';

const router = express.Router();
router.get('/', getCategories);
router.post('/', createCategory);
router.get('/:id', getCategoryById);
router.patch('/:id', updateCategory);
router.delete('/:id', deleteCategory);
export default router;
```

- [ ] **Step 5 : Monter la route dans `backend/server.js`**

Ajouter l'import :
```js
import categoryRoutes from './routes/categoryRoutes.js';
```

Ajouter après les routes existantes :
```js
app.use('/api/categories', categoryRoutes);
```

- [ ] **Step 6 : Tester manuellement**

```bash
docker compose restart backend
curl -s -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Développement"}' | jq .
# Attendu: {"id": <number>}

curl -s http://localhost:3000/api/categories | jq .
# Attendu: [{id, name, description, activityCount: 0}]

curl -s -X DELETE http://localhost:3000/api/categories/1 | jq .
# Attendu: {"success": true}
```

- [ ] **Step 7 : Commit**

```bash
git add backend/models/Category.js backend/services/categoryService.js \
        backend/controllers/categoryController.js backend/routes/categoryRoutes.js \
        backend/server.js
git commit -m "feat(backend): add Category CRUD (model, service, controller, routes)"
```

---

### Task 7 : Mettre à jour Activity.js (description, document_url, catégories)

**Files:**
- Modify: `backend/models/Activity.js`
- Modify: `backend/services/activityService.js`

- [ ] **Step 1 : Mettre à jour `getById` dans `backend/models/Activity.js`**

Remplacer la méthode `getById` :
```js
getById: async (id) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM activity WHERE id = ?', [id]);
    if (!rows[0]) return null;
    const categories = await conn.query(`
      SELECT c.id, c.name FROM category c
      JOIN activity_category ac ON ac.category_id = c.id
      WHERE ac.activity_id = ?
    `, [id]);
    return {
      id: rows[0].id,
      title: rows[0].title,
      description: rows[0].description,
      documentUrl: rows[0].document_url,
      visible: rows[0].visible,
      categories: categories.map(c => ({ id: c.id, name: c.name })),
    };
  } finally {
    if (conn) conn.end();
  }
},
```

- [ ] **Step 2 : Mettre à jour `create` dans `backend/models/Activity.js`**

```js
create: async (data) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(
      'INSERT INTO activity (title, description, visible) VALUES (?, ?, ?)',
      [data.title, data.description ?? null, data.visible !== undefined ? data.visible : true]
    );
    const id = Number(res.insertId);
    if (data.categoryIds?.length) {
      const vals = data.categoryIds.map(cid => [id, cid]);
      await conn.batch('INSERT INTO activity_category (activity_id, category_id) VALUES (?, ?)', vals);
    }
    return id;
  } finally {
    if (conn) conn.end();
  }
},
```

- [ ] **Step 3 : Mettre à jour `update` dans `backend/models/Activity.js`**

```js
update: async (id, data) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const fields = [];
    const values = [];
    if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
    if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
    if (data.documentUrl !== undefined) { fields.push('document_url = ?'); values.push(data.documentUrl); }
    if (data.visible !== undefined) { fields.push('visible = ?'); values.push(data.visible); }
    if (fields.length) {
      values.push(id);
      await conn.query(`UPDATE activity SET ${fields.join(', ')} WHERE id = ?`, values);
    }
    if (data.categoryIds !== undefined) {
      await conn.query('DELETE FROM activity_category WHERE activity_id = ?', [id]);
      if (data.categoryIds.length) {
        const vals = data.categoryIds.map(cid => [id, cid]);
        await conn.batch('INSERT INTO activity_category (activity_id, category_id) VALUES (?, ?)', vals);
      }
    }
    return true;
  } finally {
    if (conn) conn.end();
  }
},
```

- [ ] **Step 4 : Commit**

```bash
git add backend/models/Activity.js backend/services/activityService.js
git commit -m "feat(backend): enrich Activity model with description, document_url and categories"
```

---

### Task 8 : Upload / Download / Delete document (multer)

**Files:**
- Create: `backend/middleware/upload.js`
- Create: `backend/uploads/.gitkeep`
- Modify: `backend/routes/activityRoutes.js`
- Modify: `backend/controllers/activityController.js`
- Modify: `backend/server.js`
- Modify: `backend/package.json`
- Modify: `docker/docker-compose.yml`

- [ ] **Step 1 : Installer multer**

```bash
cd backend && npm install multer && cd ..
```

- [ ] **Step 2 : Créer `backend/uploads/.gitkeep`**

```bash
mkdir -p backend/uploads/activities backend/uploads/certificate
touch backend/uploads/.gitkeep backend/uploads/activities/.gitkeep backend/uploads/certificate/.gitkeep
```

- [ ] **Step 3 : Créer `backend/middleware/upload.js`**

```js
import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/vnd.oasis.opendocument.text',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.oasis.opendocument.presentation',
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
  filename: (_req, _file, cb) => cb(null, 'template.docx'),
});

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) return cb(null, true);
  cb(new Error('INVALID_FILE_TYPE'));
};

export const uploadActivityDocument = multer({
  storage: activityStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter,
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

- [ ] **Step 4 : Ajouter les endpoints document dans `backend/routes/activityRoutes.js`**

Ajouter l'import et les routes :
```js
import { uploadActivityDocument } from '../middleware/upload.js';
import { uploadDocument, downloadDocument, deleteDocument } from '../controllers/activityController.js';

// Document routes
router.post('/:id/document', (req, res, next) => {
  uploadActivityDocument(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}, uploadDocument);
router.get('/:id/document', downloadDocument);
router.delete('/:id/document', deleteDocument);
```

- [ ] **Step 5 : Ajouter les handlers dans `backend/controllers/activityController.js`**

Ajouter en bas du fichier :
```js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Activity from '../models/Activity.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const uploadDocument = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const activity = await Activity.getById(id);
    if (!activity) return res.status(404).json({ error: 'Activity not found' });

    // Delete old file if exists
    if (activity.documentUrl) {
      const oldPath = path.join(__dirname, '../uploads/activities', activity.documentUrl);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await Activity.update(id, { documentUrl: req.file.filename });
    res.json({ documentUrl: req.file.filename, originalName: req.file.originalname });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const downloadDocument = async (req, res) => {
  try {
    const activity = await Activity.getById(Number(req.params.id));
    if (!activity?.documentUrl) return res.status(404).json({ error: 'No document' });
    const filePath = path.join(__dirname, '../uploads/activities', activity.documentUrl);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const activity = await Activity.getById(id);
    if (!activity?.documentUrl) return res.status(404).json({ error: 'No document' });
    const filePath = path.join(__dirname, '../uploads/activities', activity.documentUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await Activity.update(id, { documentUrl: null });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
```

- [ ] **Step 6 : Ajouter le volume dans `docker/docker-compose.yml`**

Dans le service `backend`, ajouter sous `volumes:` :
```yaml
- uploads_data:/app/uploads
```

En bas du fichier, dans la section `volumes:` :
```yaml
uploads_data:
```

- [ ] **Step 7 : Tester l'upload**

```bash
docker compose up -d --build backend
# Créer un PDF de test
echo "test" > /tmp/test.pdf
curl -s -X POST http://localhost:3000/api/activities/1/document \
  -F "document=@/tmp/test.pdf" | jq .
# Attendu: {"documentUrl": "<uuid>-test.pdf", "originalName": "test.pdf"}

curl -s http://localhost:3000/api/activities/1 | jq .documentUrl
# Attendu: "<uuid>-test.pdf"
```

- [ ] **Step 8 : Commit**

```bash
git add backend/middleware/upload.js backend/uploads/ \
        backend/routes/activityRoutes.js backend/controllers/activityController.js \
        backend/server.js backend/package.json backend/package-lock.json \
        docker/docker-compose.yml
git commit -m "feat(backend): add document upload/download/delete for activities (multer)"
```

---

### Task 9 : Frontend — Formulaire atelier enrichi

**Files:**
- Modify: `frontend/src/components/ActivityFormModal.vue`
- Modify: `frontend/src/services/activityService.js`
- Modify: `frontend/src/composables/useActivities.js`

- [ ] **Step 1 : Mettre à jour `frontend/src/services/activityService.js`**

Ajouter les fonctions :
```js
export const getCategories = async () => {
  const res = await axios.get('/api/categories');
  return res.data;
};

export const uploadActivityDocument = async (activityId, file) => {
  const form = new FormData();
  form.append('document', file);
  const res = await axios.post(`/api/activities/${activityId}/document`, form);
  return res.data;
};

export const deleteActivityDocument = async (activityId) => {
  await axios.delete(`/api/activities/${activityId}/document`);
};

export const getActivityDocumentUrl = (activityId) =>
  `/api/activities/${activityId}/document`;
```

- [ ] **Step 2 : Mettre à jour `ActivityFormModal.vue` — section `<script setup>`**

Remplacer le script existant par (en conservant la logique de validation existante et en ajoutant) :
```js
import { ref, watch, computed, onMounted } from 'vue'
import { getCategories } from '../services/activityService.js'

// Existing props/emits kept as-is, add:
const categories = ref([])
const selectedCategoryIds = ref([])
const description = ref('')

onMounted(async () => {
  categories.value = await getCategories()
})

// When editing, populate fields:
watch(() => props.activity, (act) => {
  if (act) {
    description.value = act.description ?? ''
    selectedCategoryIds.value = act.categories?.map(c => c.id) ?? []
  }
}, { immediate: true })

const toggleCategory = (id) => {
  const idx = selectedCategoryIds.value.indexOf(id)
  if (idx === -1) selectedCategoryIds.value.push(id)
  else selectedCategoryIds.value.splice(idx, 1)
}

// Include in submit payload:
// { title, description: description.value, categoryIds: selectedCategoryIds.value }
```

- [ ] **Step 3 : Mettre à jour `ActivityFormModal.vue` — template, ajouter champs**

Après le champ `title`, ajouter dans le template :
```html
<!-- Description -->
<div class="space-y-2">
  <label class="text-sm font-medium text-slate-700">Description</label>
  <textarea
    v-model="description"
    rows="3"
    class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm
           placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2
           focus-visible:ring-blue-500 resize-none"
    placeholder="Description de l'atelier..."
  />
</div>

<!-- Catégories -->
<div class="space-y-2">
  <label class="text-sm font-medium text-slate-700">Catégories</label>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="cat in categories"
      :key="cat.id"
      type="button"
      @click="toggleCategory(cat.id)"
      :class="[
        'px-3 py-1 rounded-full text-xs font-medium transition-colors',
        selectedCategoryIds.includes(cat.id)
          ? 'bg-blue-600 text-white'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      ]"
    >
      {{ cat.name }}
    </button>
    <span v-if="!categories.length" class="text-xs text-slate-400">
      Aucune catégorie — créez-en dans la page Catégories
    </span>
  </div>
</div>
```

- [ ] **Step 4 : Commit**

```bash
git add frontend/src/components/ActivityFormModal.vue frontend/src/services/activityService.js
git commit -m "feat(frontend): enrich activity form with description, categories"
```

---

### Task 10 : Frontend — Zone document sur les cartes activités

**Files:**
- Modify: `frontend/src/views/ActivityList.vue`

- [ ] **Step 1 : Ajouter la zone document dans la carte activité dans `ActivityList.vue`**

Dans le template de la carte activité, ajouter après les catégories :
```html
<!-- Zone document -->
<div class="mt-3 pt-3 border-t border-slate-100">
  <p class="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-2">
    Documentation
  </p>

  <!-- État rempli -->
  <div v-if="activity.documentUrl"
    class="bg-green-50 border border-green-200 rounded-md px-3 py-2 flex items-center justify-between">
    <div class="flex items-center gap-2 text-xs text-green-800 font-medium truncate">
      <span>{{ activity.documentUrl.split('-').slice(1).join('-') }}</span>
    </div>
    <div class="flex gap-1 shrink-0">
      <a v-if="activity.documentUrl?.endsWith('.pdf')"
        :href="`/api/activities/${activity.id}/document`"
        target="_blank"
        class="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100">
        Voir
      </a>
      <a :href="`/api/activities/${activity.id}/document`"
        download
        class="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded hover:bg-slate-200">
        ⬇
      </a>
      <button @click="handleDeleteDocument(activity.id)"
        class="text-xs text-red-600 bg-red-50 px-2 py-1 rounded hover:bg-red-100">
        🗑
      </button>
    </div>
  </div>

  <!-- Remplacer (si document existant) -->
  <label v-if="activity.documentUrl"
    class="mt-2 block border border-dashed border-slate-300 rounded-md p-2
           text-center text-xs text-slate-400 cursor-pointer hover:border-slate-400">
    🔄 Remplacer
    <input type="file" class="hidden" @change="(e) => handleUploadDocument(activity.id, e)" />
  </label>

  <!-- État vide -->
  <label v-else
    class="block border-2 border-dashed border-slate-200 rounded-md p-3
           text-center text-xs text-slate-400 cursor-pointer hover:border-slate-400">
    📎 Glisser un fichier ou <span class="text-blue-500 underline">parcourir</span><br>
    <span class="text-[10px]">PDF, DOCX, ODT… · max 10 MB</span>
    <input type="file" class="hidden" @change="(e) => handleUploadDocument(activity.id, e)" />
  </label>
</div>
```

- [ ] **Step 2 : Ajouter les handlers dans `<script setup>` de `ActivityList.vue`**

```js
import { uploadActivityDocument, deleteActivityDocument } from '../services/activityService.js'

const handleUploadDocument = async (activityId, event) => {
  const file = event.target.files[0]
  if (!file) return
  await uploadActivityDocument(activityId, file)
  await loadActivities() // loadActivities est la fonction de rechargement de useActivities()
}

const handleDeleteDocument = async (activityId) => {
  await deleteActivityDocument(activityId)
  await loadActivities()
}
```

- [ ] **Step 3 : Commit**

```bash
git add frontend/src/views/ActivityList.vue
git commit -m "feat(frontend): add document upload/download/delete zone on activity cards"
```

---

### Task 11 : Frontend — Page Catégories

**Files:**
- Create: `frontend/src/views/CategoryList.vue`
- Create: `frontend/src/services/categoryService.js`
- Create: `frontend/src/composables/useCategories.js`
- Modify: `frontend/src/router.js`
- Modify: `frontend/src/layouts/Sidebar.vue`

- [ ] **Step 1 : Créer `frontend/src/services/categoryService.js`**

```js
import axios from 'axios'

export const getCategories = () => axios.get('/api/categories').then(r => r.data)
export const createCategory = (data) => axios.post('/api/categories', data).then(r => r.data)
export const updateCategory = (id, data) => axios.patch(`/api/categories/${id}`, data).then(r => r.data)
export const deleteCategory = (id) => axios.delete(`/api/categories/${id}`).then(r => r.data)
```

- [ ] **Step 2 : Créer `frontend/src/composables/useCategories.js`**

```js
import { ref } from 'vue'
import * as api from '../services/categoryService.js'

export function useCategories() {
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)

  const load = async () => {
    loading.value = true
    try { categories.value = await api.getCategories() }
    catch (e) { error.value = e }
    finally { loading.value = false }
  }

  const create = async (data) => { await api.createCategory(data); await load() }
  const update = async (id, data) => { await api.updateCategory(id, data); await load() }
  const remove = async (id) => { await api.deleteCategory(id); await load() }

  return { categories, loading, error, load, create, update, remove }
}
```

- [ ] **Step 3 : Créer `frontend/src/views/CategoryList.vue`**

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { Tag, Plus, Pencil, Trash2 } from 'lucide-vue-next'
import { useCategories } from '../composables/useCategories.js'
import AppButton from '../components/AppButton.vue'
import AppDialog from '../components/AppDialog.vue'
import AppInput from '../components/AppInput.vue'

const { categories, load, create, update, remove } = useCategories()
onMounted(load)

const showForm = ref(false)
const editTarget = ref(null)
const form = ref({ name: '', description: '' })
const deleteError = ref('')

const openCreate = () => {
  editTarget.value = null
  form.value = { name: '', description: '' }
  showForm.value = true
}

const openEdit = (cat) => {
  editTarget.value = cat
  form.value = { name: cat.name, description: cat.description ?? '' }
  showForm.value = true
}

const submit = async () => {
  if (editTarget.value) await update(editTarget.value.id, form.value)
  else await create(form.value)
  showForm.value = false
}

const handleDelete = async (cat) => {
  deleteError.value = ''
  try {
    await remove(cat.id)
  } catch (err) {
    deleteError.value = `Impossible de supprimer "${cat.name}" : des ateliers y sont liés.`
  }
}
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-slate-900">Catégories</h1>
      <AppButton @click="openCreate">
        <Plus class="w-4 h-4 mr-2" /> Nouvelle catégorie
      </AppButton>
    </div>

    <div v-if="deleteError"
      class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
      {{ deleteError }}
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div v-if="!categories.length" class="p-8 text-center text-slate-400 text-sm">
        Aucune catégorie — créez la première.
      </div>
      <div v-for="(cat, i) in categories" :key="cat.id"
        :class="['flex items-center justify-between px-4 py-3',
                 i < categories.length - 1 ? 'border-b border-slate-100' : '']">
        <div>
          <div class="font-semibold text-sm text-slate-900">{{ cat.name }}</div>
          <div class="text-xs text-slate-400">{{ cat.activityCount }} atelier{{ cat.activityCount !== 1 ? 's' : '' }} lié{{ cat.activityCount !== 1 ? 's' : '' }}</div>
        </div>
        <div class="flex gap-2">
          <button @click="openEdit(cat)"
            class="p-2 rounded-md hover:bg-blue-50 text-blue-600 transition-colors">
            <Pencil class="w-4 h-4" />
          </button>
          <button @click="handleDelete(cat)"
            :disabled="cat.activityCount > 0"
            :class="['p-2 rounded-md transition-colors',
                     cat.activityCount > 0
                       ? 'text-slate-300 cursor-not-allowed'
                       : 'hover:bg-red-50 text-red-600']">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modale création/édition -->
    <AppDialog :open="showForm" @close="showForm = false"
      :title="editTarget ? 'Modifier la catégorie' : 'Nouvelle catégorie'">
      <form @submit.prevent="submit" class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-700">Nom *</label>
          <AppInput v-model="form.name" placeholder="ex: Développement" required />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-700">Description</label>
          <textarea v-model="form.description" rows="2"
            class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 resize-none"
            placeholder="Description optionnelle..." />
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <AppButton type="button" variant="outline" @click="showForm = false">Annuler</AppButton>
          <AppButton type="submit">{{ editTarget ? 'Enregistrer' : 'Créer' }}</AppButton>
        </div>
      </form>
    </AppDialog>
  </div>
</template>
```

- [ ] **Step 4 : Ajouter la route dans `frontend/src/router.js`**

```js
{
  path: '/categories',
  name: 'categories',
  component: () => import('./views/CategoryList.vue'),
},
```

- [ ] **Step 5 : Ajouter le lien dans `frontend/src/layouts/Sidebar.vue`**

Importer l'icône :
```js
import { Activity, User, Tag, X } from "lucide-vue-next";
```

Ajouter dans `navItems` :
```js
{ to: "/categories", icon: Tag, label: "Catégories" },
```

- [ ] **Step 6 : Vérifier dans le navigateur**

```bash
npm run dev:frontend
```
Ouvrir http://localhost:5173/categories — la page doit s'afficher avec le lien dans la sidebar.

- [ ] **Step 7 : Commit**

```bash
git add frontend/src/views/CategoryList.vue frontend/src/services/categoryService.js \
        frontend/src/composables/useCategories.js frontend/src/router.js \
        frontend/src/layouts/Sidebar.vue
git commit -m "feat(frontend): add category management page (/categories) with CRUD"
```

---

## Phase 3 — Statuts visuels (Semaine 3)

---

### Task 12 : Badges de statut sur les cartes de stage

**Files:**
- Modify: `frontend/src/components/internships/card/InternshipCardDesktop.vue`
- Modify: `frontend/src/components/internships/card/InternshipCardMobile.vue`

- [ ] **Step 1 : Ajouter le composable `useInternshipStatus` dans `InternshipCardDesktop.vue`**

Dans `<script setup>`, ajouter :
```js
import { computed } from 'vue'

const status = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(props.internship.startDate)
  const end = new Date(props.internship.endDate)
  if (today < start) return 'upcoming'
  if (today > end) return 'done'
  return 'active'
})

const statusLabel = computed(() => ({
  upcoming: '◷ À VENIR',
  active: '● EN COURS',
  done: '✓ TERMINÉ',
}[status.value]))

const statusClass = computed(() => ({
  upcoming: 'bg-blue-50 text-blue-600 border border-blue-200',
  active: 'bg-green-50 text-green-600 border border-green-200',
  done: 'bg-red-50 text-red-600 border border-red-200',
}[status.value]))
```

- [ ] **Step 2 : Ajouter le badge dans le template de `InternshipCardDesktop.vue`**

Dans la ligne du nom du stagiaire (haut de la carte), ajouter le badge :
```html
<span :class="['text-[10px] font-bold px-2 py-1 rounded-full shrink-0', statusClass]">
  {{ statusLabel }}
</span>
```

- [ ] **Step 3 : Répliquer dans `InternshipCardMobile.vue`**

Même code computed (`status`, `statusLabel`, `statusClass`) et même badge HTML.

- [ ] **Step 4 : Vérifier visuellement dans le navigateur**

Les cartes avec `end_date` < aujourd'hui affichent `✓ TERMINÉ` en rouge, celles avec `start_date` > aujourd'hui affichent `◷ À VENIR` en bleu.

- [ ] **Step 5 : Commit**

```bash
git add frontend/src/components/internships/card/InternshipCardDesktop.vue \
        frontend/src/components/internships/card/InternshipCardMobile.vue
git commit -m "feat(frontend): add internship status badges (À VENIR / EN COURS / TERMINÉ)"
```

---

## Phase 4 — Certificat de stage (Semaine 4)

---

### Task 13 : Docker — LibreOffice dans l'image backend

**Files:**
- Modify: `docker/Dockerfile.backend`

- [ ] **Step 1 : Ajouter LibreOffice dans `docker/Dockerfile.backend`**

```dockerfile
FROM node:22-alpine

# LibreOffice for carbone PDF conversion
RUN apk add --no-cache libreoffice openjdk11-jre-headless font-noto

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

> ⚠️ Le build prendra plusieurs minutes (~300MB téléchargés). À faire une seule fois.

- [ ] **Step 2 : Installer carbone**

```bash
cd backend && npm install carbone && cd ..
```

- [ ] **Step 3 : Builder et vérifier**

```bash
docker compose build backend
docker compose up -d backend
docker compose logs backend | tail -20
# Attendu: "Backend server listening at http://localhost:3000"
```

- [ ] **Step 4 : Commit**

```bash
git add docker/Dockerfile.backend backend/package.json backend/package-lock.json
git commit -m "feat(docker): add LibreOffice + carbone to backend image for PDF certificate generation"
```

---

### Task 14 : Backend — Génération certificat

**Files:**
- Create: `backend/services/certificateService.js`
- Create: `backend/controllers/certificateController.js`
- Create: `backend/routes/certificateRoutes.js`
- Modify: `backend/server.js`

- [ ] **Step 1 : Créer `backend/services/certificateService.js`**

```js
import carbone from 'carbone';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Internship from '../models/Internship.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_PATH = path.join(__dirname, '../uploads/certificate/template.docx');

const formatDate = (d) => format(new Date(d), 'dd MMMM yyyy', { locale: fr });

export const generateCertificate = (internshipId) =>
  new Promise(async (resolve, reject) => {
    const internship = await Internship.getById(internshipId);
    if (!internship) return reject(new Error('NOT_FOUND'));

    if (!fs.existsSync(TEMPLATE_PATH)) {
      return reject(new Error('NO_TEMPLATE'));
    }

    // getActivities doit retourner les activités avec leurs catégories.
    // Vérifier que Internship.getActivities() fait un JOIN activity_category + category.
    // Si ce n'est pas le cas, utiliser Activity.getById(id) pour chaque activité.
    const activityList = await Internship.getActivities(internshipId);
    const activities = await Promise.all(activityList.map(a => Activity.getById(a.id)));
    import Activity from '../models/Activity.js'; // ajouter en haut du fichier

    const data = {
      prenom: internship.firstName,
      nom: internship.lastName,
      email: internship.email,
      date_debut: formatDate(internship.startDate),
      date_fin: formatDate(internship.endDate),
      date_emission: formatDate(new Date()),
      ateliers: activities.map(a => ({
        titre: a.title,
        categories: a.categories?.map(c => c.name).join(', ') ?? '',
      })),
    };

    carbone.render(TEMPLATE_PATH, data, { convertTo: 'pdf' }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });

export const saveTemplate = (fileBuffer) => {
  const dir = path.join(__dirname, '../uploads/certificate');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(TEMPLATE_PATH, fileBuffer);
};

export const getTemplatePath = () =>
  fs.existsSync(TEMPLATE_PATH) ? TEMPLATE_PATH : null;
```

- [ ] **Step 2 : Créer `backend/controllers/certificateController.js`**

```js
import * as certificateService from '../services/certificateService.js';
import { uploadCertificateTemplate } from '../middleware/upload.js';
import logger from '../config/logger.js';

export const generateCertificate = async (req, res) => {
  try {
    const pdf = await certificateService.generateCertificate(Number(req.params.id));
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="certificat-stage-${req.params.id}.pdf"`,
    });
    res.send(pdf);
  } catch (err) {
    if (err.message === 'NOT_FOUND') return res.status(404).json({ error: 'Internship not found' });
    if (err.message === 'NO_TEMPLATE') return res.status(400).json({ error: 'No certificate template uploaded yet' });
    logger.error(err);
    res.status(500).json({ error: 'Certificate generation failed' });
  }
};

export const uploadTemplate = (req, res, next) => {
  uploadCertificateTemplate(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true });
  });
};

export const downloadTemplate = (req, res) => {
  const templatePath = certificateService.getTemplatePath();
  if (!templatePath) return res.status(404).json({ error: 'No template uploaded' });
  res.download(templatePath, 'certificate-template.docx');
};
```

- [ ] **Step 3 : Créer `backend/routes/certificateRoutes.js`**

```js
import express from 'express';
import { uploadTemplate, downloadTemplate } from '../controllers/certificateController.js';

const router = express.Router();
router.post('/template', uploadTemplate);
router.get('/template', downloadTemplate);
export default router;
```

- [ ] **Step 4 : Ajouter la route certificat dans `backend/routes/internshipRoutes.js`**

```js
import { generateCertificate } from '../controllers/certificateController.js';
// ...
router.get('/:id/certificate', generateCertificate);
```

- [ ] **Step 5 : Monter la route dans `backend/server.js`**

```js
import certificateRoutes from './routes/certificateRoutes.js';
// ...
app.use('/api/certificate', certificateRoutes);
```

- [ ] **Step 6 : Commit**

```bash
git add backend/services/certificateService.js backend/controllers/certificateController.js \
        backend/routes/certificateRoutes.js backend/routes/internshipRoutes.js backend/server.js
git commit -m "feat(backend): add certificate generation endpoint (carbone DOCX→PDF)"
```

---

### Task 15 : Frontend — Bouton certificat + Page Paramètres

**Files:**
- Modify: `frontend/src/components/internships/card/InternshipCardDesktop.vue`
- Modify: `frontend/src/components/internships/card/InternshipCardMobile.vue`
- Create: `frontend/src/views/SettingsView.vue`
- Create: `frontend/src/services/certificateService.js`
- Modify: `frontend/src/router.js`
- Modify: `frontend/src/layouts/Sidebar.vue`

- [ ] **Step 1 : Créer `frontend/src/services/certificateService.js`**

```js
import axios from 'axios'

export const downloadCertificate = async (internshipId) => {
  const res = await axios.get(`/api/internships/${internshipId}/certificate`, {
    responseType: 'blob',
  })
  const url = URL.createObjectURL(res.data)
  const a = document.createElement('a')
  a.href = url
  a.download = `certificat-stage-${internshipId}.pdf`
  a.click()
  URL.revokeObjectURL(url)
}

export const uploadCertificateTemplate = async (file) => {
  const form = new FormData()
  form.append('template', file)
  await axios.post('/api/certificate/template', form)
}

export const downloadCertificateTemplate = () => {
  window.open('/api/certificate/template', '_blank')
}
```

- [ ] **Step 2 : Ajouter le bouton certificat dans `InternshipCardDesktop.vue`**

Dans la section actions de la carte (à côté des boutons éditer/supprimer) :
```html
<button @click="handleCertificate"
  class="p-2 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"
  title="Télécharger le certificat">
  <Printer class="w-4 h-4" />
</button>
```

Dans `<script setup>` :
```js
import { Printer } from 'lucide-vue-next'
import { downloadCertificate } from '../../../services/certificateService.js'

const handleCertificate = () => downloadCertificate(props.internship.id)
```

- [ ] **Step 3 : Répliquer dans `InternshipCardMobile.vue`** (même code).

- [ ] **Step 4 : Créer `frontend/src/views/SettingsView.vue`**

```vue
<script setup>
import { ref } from 'vue'
import { uploadCertificateTemplate, downloadCertificateTemplate } from '../services/certificateService.js'
import AppButton from '../components/AppButton.vue'

const uploading = ref(false)
const message = ref('')

const handleUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  uploading.value = true
  message.value = ''
  try {
    await uploadCertificateTemplate(file)
    message.value = 'Modèle uploadé avec succès.'
  } catch {
    message.value = 'Erreur lors de l\'upload.'
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <div class="p-6 max-w-xl mx-auto">
    <h1 class="text-2xl font-bold text-slate-900 mb-6">Paramètres</h1>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-900 mb-1">Modèle de certificat</h2>
      <p class="text-sm text-slate-500 mb-4">
        Uploadez un fichier <strong>.docx</strong> contenant les balises
        <code class="text-blue-600">{prenom}</code>, <code class="text-blue-600">{nom}</code>,
        <code class="text-blue-600">{date_debut}</code>, <code class="text-blue-600">{date_fin}</code>,
        <code class="text-blue-600">{#ateliers}{titre}{/ateliers}</code>,
        <code class="text-blue-600">{date_emission}</code>.
      </p>

      <div class="flex flex-col gap-3">
        <label class="cursor-pointer">
          <AppButton as="span" :disabled="uploading">
            {{ uploading ? 'Upload en cours…' : '⬆ Uploader un nouveau modèle' }}
          </AppButton>
          <input type="file" accept=".docx" class="hidden" @change="handleUpload" />
        </label>

        <AppButton variant="outline" @click="downloadCertificateTemplate">
          ⬇ Télécharger le modèle actuel
        </AppButton>
      </div>

      <p v-if="message" class="mt-3 text-sm"
        :class="message.includes('Erreur') ? 'text-red-600' : 'text-green-600'">
        {{ message }}
      </p>
    </div>
  </div>
</template>
```

- [ ] **Step 5 : Ajouter la route `/settings` dans `router.js`**

```js
{
  path: '/settings',
  name: 'settings',
  component: () => import('./views/SettingsView.vue'),
},
```

- [ ] **Step 6 : Ajouter le lien Paramètres dans la sidebar**

```js
import { Activity, User, Tag, Settings, X } from "lucide-vue-next";
// ...
{ to: "/settings", icon: Settings, label: "Paramètres" },
```

- [ ] **Step 7 : Commit**

```bash
git add frontend/src/views/SettingsView.vue frontend/src/services/certificateService.js \
        frontend/src/components/internships/card/InternshipCardDesktop.vue \
        frontend/src/components/internships/card/InternshipCardMobile.vue \
        frontend/src/router.js frontend/src/layouts/Sidebar.vue
git commit -m "feat(frontend): add certificate download button and settings page for template upload"
```

---

### Task 16 : Template DOCX de démonstration

**Files:**
- Create: `backend/uploads/certificate/README.md`

- [ ] **Step 1 : Créer un fichier README décrivant le template attendu**

```markdown
# Template de certificat

Placez votre fichier `template.docx` ici.

## Balises disponibles

| Balise | Valeur |
|--------|--------|
| `{prenom}` | Prénom du stagiaire |
| `{nom}` | Nom du stagiaire |
| `{email}` | Email du stagiaire |
| `{date_debut}` | Date de début (ex: 15 avril 2026) |
| `{date_fin}` | Date de fin |
| `{date_emission}` | Date d'émission du certificat |
| `{#ateliers}{titre} — {categories}{/ateliers}` | Liste des ateliers |

## Upload via l'interface

Allez sur `/settings` dans l'application pour uploader ou remplacer le template.
```

> Le fichier template.docx réel doit être créé manuellement dans Word par le responsable CA TIC et uploadé via la page Paramètres.

- [ ] **Step 2 : Commit**

```bash
git add backend/uploads/certificate/README.md
git commit -m "docs: add certificate template README with balise reference"
```

---

## Tests E2E

---

### Task 17 : Tests E2E — Catégories

**Files:**
- Create: `tests/e2e/tests/sc-category-crud.spec.ts`

- [ ] **Step 1 : Créer `tests/e2e/tests/sc-category-crud.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test.beforeEach(async () => {
  // Restore DB before each test
});

test('create a category', async ({ page }) => {
  await page.goto('/categories');
  await page.getByRole('button', { name: /nouvelle catégorie/i }).click();
  await page.getByPlaceholder(/ex: développement/i).fill('Développement');
  await page.getByRole('button', { name: /créer/i }).click();
  await expect(page.getByText('Développement')).toBeVisible();
});

test('cannot delete category linked to an activity', async ({ page }) => {
  // Seed: create category linked to activity via API
  await page.goto('/categories');
  // The delete button for a category with activityCount > 0 must be disabled
  const row = page.locator('[data-testid="category-row"]').first();
  const deleteBtn = row.getByRole('button', { name: /supprimer/i });
  await expect(deleteBtn).toBeDisabled();
});

test('delete category with no linked activities', async ({ page }) => {
  await page.goto('/categories');
  await page.getByRole('button', { name: /nouvelle catégorie/i }).click();
  await page.getByPlaceholder(/ex: développement/i).fill('À supprimer');
  await page.getByRole('button', { name: /créer/i }).click();
  const row = page.getByText('À supprimer').locator('../..');
  await row.getByRole('button', { name: /supprimer/i }).click();
  await expect(page.getByText('À supprimer')).not.toBeVisible();
});
```

- [ ] **Step 2 : Lancer les tests**

```bash
npm run db:restore
npx playwright test tests/e2e/tests/sc-category-crud.spec.ts --reporter=line
```

Résultat attendu : tous les tests passent (ou échouent de manière compréhensible si l'UI manque encore des `data-testid`).

- [ ] **Step 3 : Commit**

```bash
git add tests/e2e/tests/sc-category-crud.spec.ts
git commit -m "test(e2e): add category CRUD scenarios"
```

---

### Task 18 : Tests E2E — Ateliers enrichis

**Files:**
- Create: `tests/e2e/tests/sc-activity-enriched.spec.ts`

- [ ] **Step 1 : Créer `tests/e2e/tests/sc-activity-enriched.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test('activity form shows description and category fields', async ({ page }) => {
  await page.goto('/activities');
  await page.getByRole('button', { name: /nouvelle activité/i }).click();
  await expect(page.getByPlaceholder(/description/i)).toBeVisible();
  await expect(page.getByText(/catégories/i)).toBeVisible();
});

test('upload and download document on activity card', async ({ page }) => {
  await page.goto('/activities');
  // La zone Documentation doit être visible même sans fichier attaché
  await expect(page.getByText(/documentation/i).first()).toBeVisible();
  await expect(page.getByText(/glisser un fichier/i).first()).toBeVisible();
});
```

- [ ] **Step 2 : Lancer et commiter**

```bash
npx playwright test tests/e2e/tests/sc-activity-enriched.spec.ts --reporter=line
git add tests/e2e/tests/sc-activity-enriched.spec.ts
git commit -m "test(e2e): add enriched activity scenarios (description, categories, document)"
```

---

### Task 19 : Tests E2E — Statuts visuels

**Files:**
- Create: `tests/e2e/tests/sc-status-badges.spec.ts`

- [ ] **Step 1 : Créer `tests/e2e/tests/sc-status-badges.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test('shows TERMINÉ badge for past internship', async ({ page }) => {
  // internship id=1 has end_date 2024-07-09 (past)
  await page.goto('/internships');
  await expect(page.getByText('✓ TERMINÉ').first()).toBeVisible();
});

test('shows À VENIR badge for future internship', async ({ page }) => {
  // Create a future internship via API before test
  await page.goto('/internships');
  await expect(page.getByText('◷ À VENIR').first()).toBeVisible();
});
```

- [ ] **Step 2 : Lancer et commiter**

```bash
npx playwright test tests/e2e/tests/sc-status-badges.spec.ts --reporter=line
git add tests/e2e/tests/sc-status-badges.spec.ts
git commit -m "test(e2e): add status badge scenarios"
```

---

### Task 19 : Tests API Postman — Catégories + Document + Certificat

**Files:**
- Modify: `tests/api/test_internship_management.postman_collection.json`

- [ ] **Step 1 : Ajouter les cas dans la collection Postman**

Dans Postman, ajouter un dossier "Categories" avec :
- `POST /api/categories` — body `{"name":"Test"}` — assert status 201, body has `id`
- `GET /api/categories` — assert status 200, body is array
- `PATCH /api/categories/{{categoryId}}` — assert status 200
- `DELETE /api/categories/{{categoryId}}` — assert status 200
- `DELETE /api/categories/{{linkedCategoryId}}` — assert status 409 (catégorie liée)

Ajouter un dossier "Documents" :
- `POST /api/activities/1/document` — form-data avec fichier PDF — assert 200, body has `documentUrl`
- `GET /api/activities/1/document` — assert 200, Content-Type PDF
- `DELETE /api/activities/1/document` — assert 200

Ajouter un dossier "Certificate" :
- `POST /api/certificate/template` — form-data avec .docx — assert 200
- `GET /api/certificate/template` — assert 200
- `GET /api/internships/1/certificate` — assert 200, Content-Type PDF

- [ ] **Step 2 : Lancer Newman**

```bash
npm run test:api
```

- [ ] **Step 3 : Commit**

```bash
git add tests/api/test_internship_management.postman_collection.json
git commit -m "test(api): add Postman tests for categories, documents, and certificate"
```

---

## Résumé des commandes utiles

```bash
# Développement local
npm run dev:frontend      # Vite dev server :5173
npm run dev:backend       # Node --watch :3000

# Docker
docker compose up -d      # Démarrer tous les services
docker compose build backend  # Rebuild après changement Dockerfile
docker compose restart backend  # Relancer le backend

# Tests
npm run db:restore         # Restaurer la DB de test
npm run test:e2e:simple    # Tous les tests E2E
npm run test:api           # Tests API Newman

# Migration DB (une seule fois)
docker compose exec database mariadb -u user -ppassword internship_management < database/migration-v2.sql
```
