# Design Gap Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix three gaps between the Pencil design and the implementation: (1) activity cards missing category badges + description, (2) categories page list → card grid, (3) certificate direct-download → dedicated preview page.

**Architecture:** Pure frontend changes (3 view files, 2 card components, 1 service, 1 router) plus one seed data change. No backend work — all required data is already returned by existing API endpoints. Certificate preview uses an iframe with a blob URL fetched from the existing `/api/internships/:id/certificate` endpoint.

**Tech Stack:** Vue 3 Composition API, Vue Router 4, Tailwind CSS, Playwright (E2E), lucide-vue-next, axios.

---

## File Structure

| File | Action | Purpose |
|------|--------|---------|
| `tests/setup/restore_db.sql` | Modify | Add 2 seed categories + descriptions on 2 activities |
| `frontend/src/views/ActivityList.vue` | Modify | Add description + category badges to cards; fix null-safety in search |
| `frontend/src/views/CategoryList.vue` | Modify | Replace list with card grid + Tag icon |
| `frontend/src/services/certificateService.js` | Modify | Add `getCertificateBlobUrl` for iframe preview |
| `frontend/src/views/CertificateView.vue` | Create | Certificate preview page: back button, iframe, Imprimer, Télécharger PDF |
| `frontend/src/router.js` | Modify | Add `/certificate/:id` route |
| `frontend/src/components/internships/card/InternshipCardDesktop.vue` | Modify | Replace direct download with `router.push('/certificate/:id')` |
| `frontend/src/components/internships/card/InternshipCardMobile.vue` | Modify | Same as desktop card |
| `tests/e2e/tests/sc-activity-enriched.spec.ts` | Modify | Add 2 card display scenarios |
| `tests/e2e/tests/sc-category-crud.spec.ts` | Modify | Add 1 card grid scenario |
| `tests/e2e/tests/sc-certificate-download.spec.ts` | Modify | Update existing button title + add preview navigation scenario |

---

### Task 1: Enrich test seed data

**Files:**
- Modify: `tests/setup/restore_db.sql`

Add two categories, descriptions on activities 1 and 4, and `activity_category` associations so E2E tests have reliable data to assert against.

- [ ] **Step 1: Add seed data to `tests/setup/restore_db.sql`**

Open the file. After the `INSERT INTO internship_activity` block and before `SET FOREIGN_KEY_CHECKS = 1;`, insert:

```sql
-- Descriptions on activities used in card display tests
UPDATE activity SET description = 'Développement d\'un jeu utilisant Python et des LEDs pour créer une séquence lumineuse interactive.' WHERE id = 1;
UPDATE activity SET description = 'Réalisation d\'un site web complet avec formulaires PHP, base de données MySQL et mise en page CSS avancée.' WHERE id = 4;

-- Seed categories
INSERT INTO category (id, name, description) VALUES
  (1, 'Programmation', 'Activités liées à la programmation et au développement logiciel'),
  (2, 'Web', 'Activités liées au développement web et à la création de sites');

-- Link categories to activities
INSERT INTO activity_category (activity_id, category_id) VALUES
  (1, 1),
  (4, 1),
  (4, 2);
```

The existing `ALTER TABLE category AUTO_INCREMENT = 1000;` at the bottom of the file remains unchanged, so test-created categories get IDs ≥ 1000 and never collide with the seeded IDs 1 and 2.

- [ ] **Step 2: Restore the database and verify**

```bash
npm run db:restore
```

Expected: success message. Then verify:

```bash
docker exec docker-database-1 mariadb -u user -ppassword internship_management \
  -e "SELECT a.id, a.title, c.name AS category FROM activity a JOIN activity_category ac ON a.id=ac.activity_id JOIN category c ON c.id=ac.category_id ORDER BY a.id;"
```

Expected output:
```
id  title                                          category
1   Jeu de mémoire lumineux Ordo Lumina (Python)   Programmation
4   Réalisation d'un site Web (HTML, CSS et PHP)   Programmation
4   Réalisation d'un site Web (HTML, CSS et PHP)   Web
```

- [ ] **Step 3: Commit**

```bash
git add tests/setup/restore_db.sql
git commit -m "test(seed): add categories and descriptions for design gap tests"
```

---

### Task 2: Activity card enrichment

**Files:**
- Modify: `frontend/src/views/ActivityList.vue`

Add description excerpt (max 2 lines) and category badge pills to each activity card. Also fix the existing null-safety bug in the search filter (`a.description.toLowerCase()` throws when description is `null`).

- [ ] **Step 1: Write the failing E2E tests**

Open `tests/e2e/tests/sc-activity-enriched.spec.ts` and append these two tests inside the `test.describe` block, before the closing `});`:

```typescript
  test('activity card shows category badges', async ({ page }) => {
    await page.goto('/activities');
    // Activity 4 "Réalisation d'un site Web..." is seeded with Programmation + Web categories
    const card = page.locator('.grid > div').filter({ hasText: 'Réalisation d\'un site Web' });
    await expect(card.locator('text=Web')).toBeVisible();
    await expect(card.locator('text=Programmation')).toBeVisible();
  });

  test('activity card shows description excerpt', async ({ page }) => {
    await page.goto('/activities');
    const card = page.locator('.grid > div').filter({ hasText: 'Réalisation d\'un site Web' });
    await expect(card.locator('text=Réalisation d\'un site web complet')).toBeVisible();
  });
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:e2e:simple -- --grep "activity card shows"
```

Expected: FAIL — description and badges not visible on cards.

- [ ] **Step 3: Fix the null-safety bug in the search filter**

In `ActivityList.vue` at line ~94, change:

```javascript
a.description.toLowerCase().includes(query),
```

To:

```javascript
(a.description ?? '').toLowerCase().includes(query),
```

- [ ] **Step 4: Add description and category badges to the activity card**

In `ActivityList.vue`, find the `<h3>` block for the activity title (around line 196):

```html
        <h3 class="font-semibold text-slate-900 text-lg mb-2 break-words" :title="activity.title">
          {{ activity.title }}
        </h3>
```

Insert these two blocks immediately after that `</h3>`:

```html
        <!-- Description excerpt -->
        <p v-if="activity.description" class="text-sm text-slate-500 line-clamp-2 mb-2 leading-relaxed">
          {{ activity.description }}
        </p>

        <!-- Category badges -->
        <div v-if="activity.categories?.length" class="flex flex-wrap gap-1 mb-2">
          <span
            v-for="cat in activity.categories"
            :key="cat.id"
            class="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full border border-blue-100"
          >
            {{ cat.name }}
          </span>
        </div>
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm run test:e2e:simple -- --grep "activity card shows"
```

Expected: both tests PASS.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/views/ActivityList.vue tests/e2e/tests/sc-activity-enriched.spec.ts
git commit -m "feat(ui): show description and category badges on activity cards"
```

---

### Task 3: Category page card grid

**Files:**
- Modify: `frontend/src/views/CategoryList.vue`

Convert the single-column list to a responsive card grid matching the Pencil design: each card shows a Tag icon, the category name, optional description, activity count, and always-visible edit/delete buttons.

Keep buttons always visible (not hover-to-reveal) to preserve existing E2E test behavior.

- [ ] **Step 1: Write the failing E2E test**

Open `tests/e2e/tests/sc-category-crud.spec.ts` and append inside the `test.describe` block before the closing `});`:

```typescript
  test('categories displayed as card grid', async ({ page }) => {
    await page.goto('/categories');
    // Seeded categories must appear
    await expect(page.getByText('Programmation')).toBeVisible();
    await expect(page.getByText('Web')).toBeVisible();
    // Layout must be a grid, not a list
    await expect(page.locator('.grid')).toBeVisible();
  });
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:e2e:simple -- --grep "categories displayed as card grid"
```

Expected: FAIL — `.grid` element not found on categories page.

- [ ] **Step 3: Update the `Tag` import in `CategoryList.vue` `<script setup>`**

Change:

```javascript
import { Plus, Pencil, Trash2 } from 'lucide-vue-next';
```

To:

```javascript
import { Plus, Pencil, Trash2, Tag } from 'lucide-vue-next';
```

- [ ] **Step 4: Replace the entire `<template>` block in `CategoryList.vue`**

```html
<template>
  <div class="w-full max-w-7xl mx-auto px-4 pb-12">
    <div class="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm sticky top-8 z-40 mb-8">
      <h1 class="text-2xl font-bold text-slate-900">Catégories</h1>
      <AppButton @click="openCreate">
        <Plus class="w-4 h-4 mr-2" />
        Nouvelle catégorie
      </AppButton>
    </div>

    <div v-if="deleteError"
      class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
      {{ deleteError }}
    </div>

    <!-- Empty state -->
    <div v-if="!categories.length" class="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 mb-4">
        <Tag class="w-6 h-6 text-blue-500" />
      </div>
      <h3 class="text-lg font-medium text-slate-900">Aucune catégorie</h3>
      <p class="text-slate-500 mt-1">Créez la première catégorie.</p>
    </div>

    <!-- Card grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col gap-3"
      >
        <div class="flex justify-between items-start gap-4">
          <div class="p-2 bg-blue-50 rounded-lg text-blue-600 shrink-0">
            <Tag class="w-5 h-5" />
          </div>
          <div class="flex gap-1 shrink-0">
            <button
              @click="openEdit(cat)"
              class="p-2 hover:bg-blue-50 text-blue-600 rounded-md transition-colors"
              aria-label="Modifier"
            >
              <Pencil class="w-4 h-4" />
            </button>
            <button
              @click="handleDelete(cat)"
              :disabled="cat.activityCount > 0"
              :class="['p-2 rounded-md transition-colors',
                       cat.activityCount > 0
                         ? 'text-slate-300 cursor-not-allowed'
                         : 'hover:bg-red-50 text-red-600']"
              :aria-label="cat.activityCount > 0 ? 'Suppression impossible (ateliers liés)' : 'Supprimer'"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <h3 class="font-semibold text-slate-900">{{ cat.name }}</h3>
          <p v-if="cat.description" class="text-sm text-slate-500 mt-1 line-clamp-2">{{ cat.description }}</p>
        </div>

        <div class="mt-auto pt-2 border-t border-slate-100">
          <span class="text-xs text-slate-400">
            {{ cat.activityCount }} atelier{{ cat.activityCount !== 1 ? 's' : '' }} lié{{ cat.activityCount !== 1 ? 's' : '' }}
          </span>
        </div>
      </div>
    </div>

    <AppDialog
      :isOpen="showForm"
      @close="showForm = false"
      :title="editTarget ? 'Modifier la catégorie' : 'Nouvelle catégorie'"
    >
      <form @submit.prevent="submit" class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-700">Nom *</label>
          <AppInput v-model="form.name" placeholder="ex: Développement" required />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-700">Description</label>
          <textarea
            v-model="form.description"
            rows="2"
            class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 resize-none"
            placeholder="Description optionnelle..."
          />
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

- [ ] **Step 5: Run the new test and all existing Category CRUD tests**

```bash
npm run test:e2e:simple -- --grep "categories displayed as card grid|Category CRUD"
```

Expected: all 5 tests PASS. The existing CRUD tests use `hasText` locators that work with both list and card layouts.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/views/CategoryList.vue tests/e2e/tests/sc-category-crud.spec.ts
git commit -m "feat(ui): convert categories page to card grid matching design"
```

---

### Task 4: Certificate service helper

**Files:**
- Modify: `frontend/src/services/certificateService.js`

Add `getCertificateBlobUrl` which fetches the PDF as a blob and returns a temporary object URL suitable for an `<iframe>` `src` attribute. The existing `downloadCertificate` function is kept but will no longer be called from the card components (it stays for potential future use).

- [ ] **Step 1: Add `getCertificateBlobUrl` to `certificateService.js`**

Open the file and add after the `downloadCertificate` function:

```javascript
export const getCertificateBlobUrl = async (internshipId) => {
  const res = await axios.get(`/api/internships/${internshipId}/certificate`, {
    responseType: 'blob',
  });
  return URL.createObjectURL(res.data);
};
```

The full file after the change:

```javascript
import axios from 'axios';

export const downloadCertificate = async (internshipId) => {
  const res = await axios.get(`/api/internships/${internshipId}/certificate`, {
    responseType: 'blob',
  });
  const url = URL.createObjectURL(res.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = `certificat-stage-${internshipId}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
};

export const getCertificateBlobUrl = async (internshipId) => {
  const res = await axios.get(`/api/internships/${internshipId}/certificate`, {
    responseType: 'blob',
  });
  return URL.createObjectURL(res.data);
};

export const uploadCertificateTemplate = async (file) => {
  const form = new FormData();
  form.append('template', file);
  await axios.post('/api/certificate/template', form);
};

export const downloadCertificateTemplate = () => {
  window.open('/api/certificate/template', '_blank');
};
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/services/certificateService.js
git commit -m "feat(service): add getCertificateBlobUrl for certificate preview iframe"
```

---

### Task 5: Certificate preview page

**Files:**
- Create: `frontend/src/views/CertificateView.vue`
- Modify: `frontend/src/router.js`
- Modify: `frontend/src/components/internships/card/InternshipCardDesktop.vue`
- Modify: `frontend/src/components/internships/card/InternshipCardMobile.vue`
- Modify: `tests/e2e/tests/sc-certificate-download.spec.ts`

The preview page matches the Pencil design: a header bar with back arrow + "Certificat de Stage" title + "Imprimer" + "Télécharger PDF" buttons, and the PDF embedded in a full-height iframe. If no template is uploaded the error message tells the admin where to fix it.

- [ ] **Step 1: Write the failing E2E test and update the stale existing one**

Replace the entire content of `tests/e2e/tests/sc-certificate-download.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Certificate Download', () => {
  test('certificate button exists on internship cards', async ({ page }) => {
    await page.goto('/internships');
    // Title updated: now navigates to preview instead of direct download
    await expect(
      page.locator('button[title="Aperçu du certificat"]').first()
    ).toBeVisible();
  });

  test('settings page is accessible', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByText(/modèle de certificat/i)).toBeVisible();
    await expect(page.getByText(/uploader un nouveau modèle/i)).toBeVisible();
  });

  test('certificate button navigates to preview page', async ({ page }) => {
    await page.goto('/internships');
    const card = page.locator('.grid > div').first();
    await card.hover();
    await card.locator('button[title="Aperçu du certificat"]').first().click();
    await expect(page).toHaveURL(/\/certificate\/\d+/);
    await expect(page.getByText('Certificat de Stage')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Imprimer' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Télécharger PDF' })).toBeVisible();
  });
});
```

- [ ] **Step 2: Run tests to verify the new one fails and the first one fails (button title changed)**

```bash
npm run test:e2e:simple -- --grep "Certificate Download"
```

Expected: "certificate button exists" FAILS (still looking for old title), "certificate button navigates" FAILS (route doesn't exist yet). "settings page" still PASSES.

- [ ] **Step 3: Create `frontend/src/views/CertificateView.vue`**

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft, Printer, Download } from 'lucide-vue-next';
import { getCertificateBlobUrl } from '../services/certificateService.js';

const route = useRoute();
const router = useRouter();

const blobUrl = ref(null);
const loading = ref(true);
const error = ref('');
const iframeRef = ref(null);

onMounted(async () => {
  try {
    blobUrl.value = await getCertificateBlobUrl(route.params.id);
  } catch (e) {
    error.value = e.response?.status === 404
      ? 'Aucun template de certificat configuré. Veuillez uploader un template dans Paramètres.'
      : 'Erreur lors de la génération du certificat.';
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  if (blobUrl.value) URL.revokeObjectURL(blobUrl.value);
});

const handlePrint = () => {
  iframeRef.value?.contentWindow?.print();
};

const handleDownload = () => {
  const a = document.createElement('a');
  a.href = blobUrl.value;
  a.download = `certificat-stage-${route.params.id}.pdf`;
  a.click();
};
</script>

<template>
  <div class="flex flex-col">
    <!-- Header -->
    <div class="flex items-center gap-4 p-4 bg-white border-b border-slate-200 shadow-sm mb-6 rounded-lg sticky top-8 z-40">
      <button
        @click="router.back()"
        class="p-2 rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
        aria-label="Retour"
      >
        <ArrowLeft class="w-5 h-5" />
      </button>
      <h1 class="text-xl font-bold text-slate-900 flex-1">Certificat de Stage</h1>
      <div class="flex gap-2">
        <button
          @click="handlePrint"
          :disabled="!blobUrl"
          class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 text-sm font-medium"
        >
          <Printer class="w-4 h-4" />
          Imprimer
        </button>
        <button
          @click="handleDownload"
          :disabled="!blobUrl"
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 text-sm font-medium"
        >
          <Download class="w-4 h-4" />
          Télécharger PDF
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex items-center justify-center">
      <div v-if="loading" class="text-slate-500 text-sm py-24">Génération du certificat…</div>
      <div v-else-if="error" class="max-w-md text-center bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
        <p class="text-red-600 text-sm mb-4">{{ error }}</p>
        <button @click="router.back()" class="text-blue-600 text-sm hover:underline">← Retour</button>
      </div>
      <iframe
        v-else
        ref="iframeRef"
        :src="blobUrl"
        class="w-full rounded-lg shadow-lg border border-slate-200"
        style="height: 80vh"
        title="Aperçu du certificat"
      />
    </div>
  </div>
</template>
```

- [ ] **Step 4: Add the `/certificate/:id` route to `frontend/src/router.js`**

After the `/settings` route entry (before the closing `]` of the routes array), add:

```javascript
        {
            path: "/certificate/:id",
            name: "certificate",
            component: () => import("./views/CertificateView.vue"),
        },
```

- [ ] **Step 5: Update `InternshipCardDesktop.vue`**

In `<script setup>`, make these changes:

**Remove** this import:
```javascript
import { downloadCertificate } from '../../../services/certificateService.js';
```

**Add** router import (place it with the other vue imports at the top):
```javascript
import { useRouter } from 'vue-router';
```

**Add** router instance (place it after the `emit` definition):
```javascript
const router = useRouter();
```

**Replace** the handleCertificate function:
```javascript
const handleCertificate = () => router.push('/certificate/' + props.internship.id);
```

**Update** the button title attribute in the template — find:
```html
title="Télécharger le certificat"
```
Replace with:
```html
title="Aperçu du certificat"
```

- [ ] **Step 6: Update `InternshipCardMobile.vue` — identical changes as Step 5**

In `<script setup>`:

**Remove:**
```javascript
import { downloadCertificate } from '../../../services/certificateService.js';
```

**Add** (with the other vue imports):
```javascript
import { useRouter } from 'vue-router';
```

**Add** (after `emit`):
```javascript
const router = useRouter();
```

**Replace:**
```javascript
const handleCertificate = () => router.push('/certificate/' + props.internship.id);
```

In the template, find and update the printer button title to `"Aperçu du certificat"`.

- [ ] **Step 7: Run all Certificate Download tests**

```bash
npm run test:e2e:simple -- --grep "Certificate Download"
```

Expected: all 3 tests PASS. Note: the "certificate button navigates" test will see the error message in the iframe (no template uploaded), but the page navigation, heading, and buttons are still rendered correctly and the test only asserts those.

- [ ] **Step 8: Commit**

```bash
git add frontend/src/views/CertificateView.vue \
        frontend/src/router.js \
        frontend/src/components/internships/card/InternshipCardDesktop.vue \
        frontend/src/components/internships/card/InternshipCardMobile.vue \
        tests/e2e/tests/sc-certificate-download.spec.ts
git commit -m "feat(ui): add certificate preview page with print and download actions"
```

---

## Self-Review

**1. Spec coverage:**
- Activity cards: category badges ✅, description excerpt ✅
- Null-safety bug in search filter fixed ✅
- Categories page: card grid layout ✅, Tag icon ✅, description on card ✅, activity count preserved ✅
- Certificate: dedicated preview page ✅, back button ✅, "Imprimer" button ✅, "Télécharger PDF" button ✅, error message when no template ✅

**2. Placeholder scan:** None found. Every step has actual code or an exact command.

**3. Type consistency:**
- `getCertificateBlobUrl(internshipId)` defined in Task 4 and used in `CertificateView` in Task 5 ✅
- `router.push('/certificate/' + props.internship.id)` in both card components matches the `/certificate/:id` route added in Task 5 ✅
- `activity.categories` is `Array<{id: number, name: string}>` — matches what `getActivityById` already returns per the existing Activity model ✅
- `cat.description` in card — matches what `Category.getAll()` returns; the form field for description has existed since the previous implementation ✅
- `title="Aperçu du certificat"` updated consistently in both the E2E test (Task 5 Step 1) and both card components (Task 5 Steps 5–6) ✅
