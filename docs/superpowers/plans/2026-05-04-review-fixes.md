# WorkXP Admin — Review Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Corriger les bugs backend critiques et aligner l'UI avec le design Pencil (Card/Stat, Cannot Delete Modal, CategoryFormModal, popover dismiss).

**Architecture:** 3 groupes séquentiels indépendants — backend fixes → Pencil compliance frontend → popover UX. Groupe 3 (carte stagiaire dépliable) est déjà implémenté dans InternshipCardDesktop.vue et InternshipCardMobile.vue : aucun travail requis.

**Tech Stack:** Node.js ESM, Vue 3 Composition API, Tailwind CSS, Playwright E2E, util.promisify

---

## Fichiers impactés

| Fichier | Action |
|---|---|
| `backend/services/certificateService.js` | Refactorer generateCertificate (anti-pattern) |
| `backend/models/Category.js` | Ajouter activityCount dans getById |
| `backend/services/categoryService.js` | Guard pré-suppression avec HAS_LINKED_ACTIVITIES |
| `backend/controllers/categoryController.js` | Gérer HAS_LINKED_ACTIVITIES → 409 |
| `frontend/src/views/ActivityList.vue` | Ajouter Card/Stat + Card/StatDoc dans section dépliée |
| `frontend/src/views/CategoryList.vue` | Cannot Delete Modal + extraire formulaire |
| `frontend/src/components/CategoryFormModal.vue` | Créer composant dédié |
| `tests/e2e/tests/sc-category-crud.spec.ts` | Ajouter test cannot-delete modal |
| `tests/e2e/tests/sc-activity-enriched.spec.ts` | Ajouter test stat cards |

---

## Task 1 : Refactorer certificateService.js (Group 1.1)

**Files:**
- Modify: `backend/services/certificateService.js`

**Problème :** `new Promise(async (resolve, reject) => { await ... })` — les rejections des awaits internes ne sont pas transmises au reject externe → unhandled rejection possible.

- [x] **Step 1 : Remplacer le fichier complet**

Contenu exact de `backend/services/certificateService.js` :

```js
import carbone from 'carbone';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Internship from '../models/Internship.js';
import Activity from '../models/Activity.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_PATH = path.join(__dirname, '../uploads/certificate/template.docx');
const carboneRender = promisify(carbone.render);

const formatDate = (d) => format(new Date(d), 'dd MMMM yyyy', { locale: fr });

export const generateCertificate = async (internshipId) => {
  const internship = await Internship.getById(internshipId);
  if (!internship) throw new Error('NOT_FOUND');

  if (!fs.existsSync(TEMPLATE_PATH)) throw new Error('NO_TEMPLATE');

  const activityRefs = await Internship.getActivities(internshipId);
  const activities = await Promise.all(activityRefs.map(a => Activity.getById(a.id)));

  const data = {
    prenom: internship.firstName,
    nom: internship.lastName,
    email: internship.email,
    date_debut: formatDate(internship.startDate),
    date_fin: formatDate(internship.endDate),
    date_emission: formatDate(new Date()),
    ateliers: activities.filter(Boolean).map(a => ({
      titre: a.title,
      categories: a.categories?.map(c => c.name).join(', ') ?? '',
    })),
  };

  return carboneRender(TEMPLATE_PATH, data, { convertTo: 'pdf' });
};

export const saveTemplate = (fileBuffer) => {
  const dir = path.join(__dirname, '../uploads/certificate');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(TEMPLATE_PATH, fileBuffer);
};

export const getTemplatePath = () =>
  fs.existsSync(TEMPLATE_PATH) ? TEMPLATE_PATH : null;
```

- [x] **Step 2 : Vérifier que le controller certificat est compatible**

Le controller `backend/controllers/certificateController.js` appelle `generateCertificate` et doit gérer une async function qui throw (au lieu d'un callback-style Promise). Vérifier qu'il est dans un bloc try/catch. Si oui, aucun changement nécessaire.

- [x] **Step 3 : Test manuel**

```bash
cd /Users/pellegrinelliluka/projects/Test-internship-management
docker-compose -f docker/docker-compose.yml up -d
# Naviguer vers un stage avec ateliers, cliquer "Aperçu du certificat"
# → PDF doit s'afficher dans l'iframe
```

- [x] **Step 4 : Commit**

```bash
git add backend/services/certificateService.js
git commit -m "fix(certificate): replace new Promise(async) anti-pattern with async/await + promisify"
```

---

## Task 2 : Guard suppression catégories au niveau service (Group 1.2)

**Files:**
- Modify: `backend/models/Category.js` (getById)
- Modify: `backend/services/categoryService.js` (deleteCategory)
- Modify: `backend/controllers/categoryController.js` (deleteCategory handler)

**Problème :** La suppression d'une catégorie tente l'opération SQL puis catch errno 1451. Pattern incohérent avec les ateliers (qui vérifient `internshipCount` AVANT la suppression).

- [x] **Step 1 : Mettre à jour Category.getById() pour inclure activityCount**

Dans `backend/models/Category.js`, remplacer la méthode `getById` (lignes 28-37) :

```js
getById: async (id) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`
      SELECT c.id, c.name, c.description,
             COUNT(CASE WHEN a.visible = 1 THEN 1 END) as activity_count
      FROM category c
      LEFT JOIN activity_category ac ON ac.category_id = c.id
      LEFT JOIN activity a ON a.id = ac.activity_id
      WHERE c.id = ?
      GROUP BY c.id
    `, [id]);
    if (!rows[0]) return null;
    return {
      id: rows[0].id,
      name: rows[0].name,
      description: rows[0].description,
      activityCount: Number(rows[0].activity_count),
    };
  } finally {
    if (conn) conn.end();
  }
},
```

- [x] **Step 2 : Mettre à jour categoryService.deleteCategory**

Dans `backend/services/categoryService.js`, remplacer `deleteCategory` (lignes 26-37) :

```js
export const deleteCategory = async (id) => {
  const existing = await Category.getById(id);
  if (!existing) throw new Error('NOT_FOUND');
  if (existing.activityCount > 0) throw new Error('HAS_LINKED_ACTIVITIES');
  await Category.delete(id);
};
```

- [x] **Step 3 : Mettre à jour categoryController.deleteCategory**

Dans `backend/controllers/categoryController.js`, remplacer le handler `deleteCategory` (lignes 45-54) :

```js
export const deleteCategory = async (req, res) => {
  try {
    await categoryService.deleteCategory(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    if (err.message === 'NOT_FOUND') return res.status(404).json({ error: 'Category not found' });
    if (err.message === 'HAS_LINKED_ACTIVITIES') return res.status(409).json({ error: 'Category cannot be deleted: it has linked activities' });
    res.status(500).json({ error: 'Server error' });
  }
};
```

**Note :** Le 204 No Content est cohérent avec le DELETE des autres ressources (internship, activity).

- [x] **Step 4 : Vérifier updateCategory utilise bien le nouveau getById**

`updateCategory` dans le service fait `Category.getById(id)` et vérifie `!cat`. Le nouveau getById retourne `null` si non trouvé → comportement identique. Aucun changement nécessaire.

- [x] **Step 5 : Test manuel**

```bash
# Via l'interface : créer une catégorie, l'associer à un atelier, tenter de la supprimer
# → la suppression doit être bloquée avec un message d'erreur approprié
# Vérifier aussi la suppression d'une catégorie sans atelier → doit fonctionner
```

- [x] **Step 6 : Commit**

```bash
git add backend/models/Category.js backend/services/categoryService.js backend/controllers/categoryController.js
git commit -m "fix(category): move deletion guard to service level with pre-check (HAS_LINKED_ACTIVITIES)"
```

---

## Task 3 : Card/Stat + Card/StatDoc dans les cartes activité dépliées (Group 2.1)

**Files:**
- Modify: `frontend/src/views/ActivityList.vue` (template, section expanded ~ligne 341)

**Problème :** Les composants Pencil `Card/Stat` (compteur stages) et `Card/StatDoc` (statut document) sont absents de la section dépliée des cartes activité.

**Données déjà disponibles :** `activity.internshipCount` et `activity.documentUrl` sont déjà dans chaque objet activité chargé. Aucun appel API supplémentaire.

- [x] **Step 1 : Ajouter CircleCheck et CircleX aux imports Lucide**

Dans `ActivityList.vue`, les imports Lucide sont en ligne 2-9. Ajouter `CircleCheck` et `CircleX` :

```js
import {
  Activity as ActivityIcon,
  CircleCheck,
  CircleX,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-vue-next';
```

- [x] **Step 2 : Insérer la rangée de stats dans la section dépliée**

Dans `ActivityList.vue`, la section dépliée commence à la ligne ~341 :
```html
<!-- ── Expanded: category management ── -->
<div
  v-if="expandedId === activity.id"
  class="px-5 pb-0 animate-in slide-in-from-top-2 duration-200"
>
  <div class="pt-3 border-t border-slate-100">
```

Insérer la rangée de stats **entre** `<div class="pt-3 border-t border-slate-100">` et `<span class="text-[10px] uppercase..."` :

```html
<!-- Card/Stat + Card/StatDoc -->
<div class="grid grid-cols-2 gap-3 mb-4">
  <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-1">
    <span class="text-xs font-medium text-slate-500">Stages utilisant cet atelier</span>
    <span class="text-2xl font-bold text-blue-600">{{ activity.internshipCount }}</span>
  </div>
  <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-2">
    <span class="text-xs font-medium text-slate-500">Document</span>
    <div class="flex items-center gap-2">
      <CircleCheck v-if="activity.documentUrl" class="w-4 h-4 text-green-600 shrink-0" />
      <CircleX v-else class="w-4 h-4 text-slate-400 shrink-0" />
      <span
        class="text-sm font-medium"
        :class="activity.documentUrl ? 'text-green-600' : 'text-slate-400'"
      >
        {{ activity.documentUrl ? 'Disponible' : 'Aucun document' }}
      </span>
    </div>
  </div>
</div>
```

- [x] **Step 3 : Écrire le test E2E**

Dans `tests/e2e/tests/sc-activity-enriched.spec.ts`, ajouter à la fin du `describe` block :

```typescript
test('expanded activity card shows stat cards', async ({ page }) => {
  await page.goto('/activities');
  // Activity 4 "Réalisation d'un site Web..." has internshipCount and categories
  const card = page
    .locator('.grid > div')
    .filter({ hasText: "Réalisation d'un site Web" });
  await card.click();
  // Card/Stat: internship count visible
  await expect(card.locator('text=Stages utilisant cet atelier')).toBeVisible();
  // Card/StatDoc: document status visible
  await expect(card.locator('text=Document').first()).toBeVisible();
});
```

- [x] **Step 4 : Lancer les tests**

```bash
cd tests/e2e
npm run test -- --grep "stat cards"
```

Expected: PASS

- [x] **Step 5 : Commit**

```bash
git add frontend/src/views/ActivityList.vue tests/e2e/tests/sc-activity-enriched.spec.ts
git commit -m "feat(ui): add Card/Stat and Card/StatDoc to expanded activity cards"
```

---

## Task 4 : Cannot Delete Modal pour les catégories (Group 2.2)

**Files:**
- Modify: `frontend/src/views/CategoryList.vue`

**Problème :** Quand une suppression de catégorie échoue (HTTP 409), le code affiche un `<div>` rouge inline. Le design Pencil montre un modal d'erreur.

- [x] **Step 1 : Remplacer deleteError ref par cannotDeleteTarget**

Dans `CategoryList.vue`, script section. Remplacer :

```js
const deleteError = ref('');
```

par :

```js
const cannotDeleteTarget = ref(null); // { id, name } | null
```

- [x] **Step 2 : Mettre à jour openCreate et openEdit**

Remplacer toutes les occurrences de `deleteError.value = '';` par `cannotDeleteTarget.value = null;` :

```js
const openCreate = () => {
  editTarget.value = null;
  form.value = { name: '', description: '' };
  cannotDeleteTarget.value = null;
  showForm.value = true;
};

const openEdit = (cat) => {
  editTarget.value = cat;
  form.value = { name: cat.name, description: cat.description ?? '' };
  cannotDeleteTarget.value = null;
  showForm.value = true;
};
```

- [x] **Step 3 : Mettre à jour handleDelete**

Remplacer la fonction `handleDelete` :

```js
const handleDelete = async (cat) => {
  cannotDeleteTarget.value = null;
  try {
    await remove(cat.id);
  } catch {
    cannotDeleteTarget.value = cat;
  }
};
```

- [x] **Step 4 : Remplacer le div rouge inline par un AppDialog dans le template**

Dans la partie template de `CategoryList.vue`, remplacer le bloc `v-if="deleteError"` :

```html
<div v-if="deleteError"
  class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
  {{ deleteError }}
</div>
```

par ce modal d'erreur (juste avant le grid des cartes) :

```html
<AppDialog
  :isOpen="!!cannotDeleteTarget"
  title="Suppression impossible"
  @close="cannotDeleteTarget = null"
>
  <p class="text-slate-600 text-sm">
    La catégorie <strong class="text-slate-900">« {{ cannotDeleteTarget?.name }} »</strong>
    ne peut pas être supprimée car des ateliers lui sont associés.
  </p>
  <p class="text-slate-500 text-sm mt-2">
    Retirez d'abord cette catégorie de tous les ateliers concernés, puis réessayez.
  </p>
  <template #footer>
    <AppButton @click="cannotDeleteTarget = null">Fermer</AppButton>
  </template>
</AppDialog>
```

- [x] **Step 5 : Vérifier que AppDialog accepte un slot #footer**

Lire `frontend/src/components/AppDialog.vue` et vérifier qu'il a un slot nommé `footer`. Si non, utiliser le contenu sans slot :

```html
<AppDialog
  :isOpen="!!cannotDeleteTarget"
  title="Suppression impossible"
  @close="cannotDeleteTarget = null"
>
  <p class="text-slate-600 text-sm">
    La catégorie <strong class="text-slate-900">« {{ cannotDeleteTarget?.name }} »</strong>
    ne peut pas être supprimée car des ateliers lui sont associés.
  </p>
  <p class="text-slate-500 text-sm mt-2">
    Retirez d'abord cette catégorie de tous les ateliers concernés, puis réessayez.
  </p>
  <div class="flex justify-end mt-4">
    <AppButton @click="cannotDeleteTarget = null">Fermer</AppButton>
  </div>
</AppDialog>
```

- [x] **Step 6 : Écrire le test E2E**

Dans `tests/e2e/tests/sc-category-crud.spec.ts`, ajouter à la fin du `describe` block :

```typescript
test('cannot delete modal appears when category has linked activities', async ({ page }) => {
  // Create a category via API
  const catRes = await page.request.post('/api/categories', {
    data: { name: 'CatToBlock E2E' },
  });
  const { id: catId } = await catRes.json();

  // Create an activity and link the category
  const actRes = await page.request.post('/api/activities', {
    data: { title: 'Act for CatBlock', categoryIds: [catId] },
  });
  expect(actRes.ok()).toBeTruthy();

  await page.goto('/categories');

  // Find the category card and click delete
  const card = page.locator('.grid > div').filter({ hasText: 'CatToBlock E2E' });
  await card.locator('button[aria-label*="Supprimer"]').click({ force: true });

  // Modal should appear
  await expect(page.locator('text=Suppression impossible')).toBeVisible();
  await expect(page.locator('text=CatToBlock E2E')).toBeVisible();

  // Close modal
  await page.locator('button', { hasText: 'Fermer' }).click();
  await expect(page.locator('text=Suppression impossible')).not.toBeVisible();
});
```

- [x] **Step 7 : Lancer le test**

```bash
cd tests/e2e
npm run test -- --grep "cannot delete modal"
```

Expected: PASS

- [x] **Step 8 : Commit**

```bash
git add frontend/src/views/CategoryList.vue tests/e2e/tests/sc-category-crud.spec.ts
git commit -m "feat(ui): replace inline delete error with Cannot Delete Modal for categories"
```

---

## Task 5 : CategoryFormModal.vue — composant dédié (Group 2.3)

**Files:**
- Create: `frontend/src/components/CategoryFormModal.vue`
- Modify: `frontend/src/views/CategoryList.vue`

**Problème :** Le formulaire create/edit de catégorie est inline dans `CategoryList.vue`. Tous les autres formulaires (InternshipFormModal, ActivityFormModal) ont un composant dédié.

- [x] **Step 1 : Lire AppDialog.vue pour connaître ses props/slots**

```bash
cat frontend/src/components/AppDialog.vue
```

Identifier : props `isOpen`, `title` ; émit `close` ; slot default pour le contenu.

- [x] **Step 2 : Créer CategoryFormModal.vue**

Créer `frontend/src/components/CategoryFormModal.vue` avec ce contenu exact :

```vue
<script setup>
import { ref, watch } from 'vue';
import AppButton from './AppButton.vue';
import AppDialog from './AppDialog.vue';
import AppInput from './AppInput.vue';

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  category: { type: Object, default: null }, // null = create, objet = edit
});

const emit = defineEmits(['close', 'saved']);

const form = ref({ name: '', description: '' });

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      form.value = {
        name: props.category?.name ?? '',
        description: props.category?.description ?? '',
      };
    }
  },
);

const title = computed(() =>
  props.category ? 'Modifier la catégorie' : 'Nouvelle catégorie',
);

const submit = () => {
  emit('saved', { ...form.value });
};
</script>

<template>
  <AppDialog :isOpen="isOpen" :title="title" @close="emit('close')">
    <form @submit.prevent="submit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Nom *</label>
        <AppInput
          v-model="form.name"
          placeholder="ex: Développement"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          v-model="form.description"
          rows="3"
          placeholder="Description optionnelle"
          class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <AppButton type="button" variant="outline" @click="emit('close')">Annuler</AppButton>
        <AppButton type="submit">
          {{ category ? 'Enregistrer' : 'Créer' }}
        </AppButton>
      </div>
    </form>
  </AppDialog>
</template>
```

**Note :** `computed` doit être importé depuis vue — ajouter à l'import `{ ref, watch, computed }`.

- [x] **Step 3 : Mettre à jour CategoryList.vue pour utiliser CategoryFormModal**

**3a.** Ajouter l'import en haut du script :
```js
import CategoryFormModal from '../components/CategoryFormModal.vue';
```

**3b.** Supprimer le `form` ref et les fonctions `openCreate`, `openEdit`, `submit` qui gèrent le formulaire (elles passent dans le composant). Les remplacer par :

```js
const showForm = ref(false);
const editTarget = ref(null);

const openCreate = () => {
  editTarget.value = null;
  cannotDeleteTarget.value = null;
  showForm.value = true;
};

const openEdit = (cat) => {
  editTarget.value = cat;
  cannotDeleteTarget.value = null;
  showForm.value = true;
};

const handleSaved = async (formData) => {
  if (editTarget.value) {
    await update(editTarget.value.id, formData);
  } else {
    await create(formData);
  }
  showForm.value = false;
};
```

**3c.** Dans le template, remplacer le bloc `<AppDialog>` avec le formulaire inline par :

```html
<CategoryFormModal
  :isOpen="showForm"
  :category="editTarget"
  @close="showForm = false"
  @saved="handleSaved"
/>
```

- [x] **Step 4 : Vérifier que create/edit fonctionnent**

```bash
# Naviguer vers /categories
# Créer une catégorie → modal s'ouvre, soumettre → catégorie apparaît
# Cliquer modifier → modal s'ouvre pré-remplie, modifier → changement visible
```

- [x] **Step 5 : Commit**

```bash
git add frontend/src/components/CategoryFormModal.vue frontend/src/views/CategoryList.vue
git commit -m "refactor(ui): extract CategoryFormModal as dedicated component"
```

---

## Task 6 : Popover dismiss sur Escape et clic extérieur (Bonus UX)

**Files:**
- Modify: `frontend/src/views/ActivityList.vue` (popover catégories)

**Problème :** Le popover "+ Ajouter une catégorie" dans les cartes activité ne se ferme pas avec Escape ni au clic en dehors.

- [x] **Step 1 : Ajouter un listener keydown global dans ActivityList.vue**

Dans le `<script setup>`, ajouter après les imports :

```js
import { computed, onMounted, onUnmounted, ref } from 'vue';

// ... (code existant) ...

const handleEscape = (e) => {
  if (e.key === 'Escape') closeCategoryMenu();
};

onMounted(async () => {
  window.addEventListener('keydown', handleEscape);
  await loadActivities();
  allCategories.value = await getCategories();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape);
});
```

**Note :** `onUnmounted` doit être ajouté aux imports vue. Supprimer le `onMounted` existant (ligne 163) et le remplacer par celui ci-dessus.

- [x] **Step 2 : Ajouter un overlay invisible pour clic extérieur**

Dans le template, le popover est dans :
```html
<div
  v-if="categoryMenuActivityId === activity.id"
  class="absolute z-50 mt-2 w-72 bg-white ..."
>
```

Ajouter un overlay AVANT le div du popover (dans le `<div class="relative mb-3">`) :

```html
<div class="relative mb-3">
  <!-- Overlay pour fermer au clic extérieur -->
  <div
    v-if="categoryMenuActivityId === activity.id"
    class="fixed inset-0 z-40"
    @click="closeCategoryMenu"
  />

  <!-- bouton + Ajouter une catégorie -->
  <button ...>+ Ajouter une catégorie</button>

  <!-- popover (z-50 > overlay z-40) -->
  <div v-if="categoryMenuActivityId === activity.id" class="absolute z-50 ...">
    ...
  </div>
</div>
```

- [x] **Step 3 : Vérifier**

```bash
# Ouvrir une carte activité, cliquer "+ Ajouter une catégorie"
# Appuyer Escape → popover se ferme
# Cliquer en dehors du popover → popover se ferme
```

- [x] **Step 4 : Commit**

```bash
git add frontend/src/views/ActivityList.vue
git commit -m "fix(ui): close category popover on Escape key and outside click"
```

---

## Self-Review

**1. Spec coverage :**
- ✅ Group 1.1 — certificateService refactor → Task 1
- ✅ Group 1.2 — category guard service-level → Task 2
- ✅ Group 2.1 — Card/Stat + Card/StatDoc → Task 3
- ✅ Group 2.2 — Cannot Delete Modal → Task 4
- ✅ Group 2.3 — CategoryFormModal composant dédié → Task 5
- ✅ Group 3 — carte stagiaire dépliable → déjà implémentée (InternshipCardDesktop/Mobile.vue)
- ✅ Bonus popover → Task 6
- ✅ Tests E2E → Tasks 3 (stat cards), 4 (cannot delete modal)

**2. Placeholder scan :** Aucun TBD. Tout le code est complet dans chaque step.

**3. Cohérence :**
- `cannotDeleteTarget` utilisé de façon cohérente dans Tasks 4 et 5 (CategoryList.vue)
- `HAS_LINKED_ACTIVITIES` défini dans Task 2 (service) et géré dans Task 2 (controller)
- `carboneRender` déclaré en Task 1, pas référencé ailleurs
- `CategoryFormModal` crée `emit('saved', formData)` et `CategoryList.vue` écoute `@saved="handleSaved"` (Task 5)
