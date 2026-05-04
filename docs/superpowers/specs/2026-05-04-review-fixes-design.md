# WorkXP Admin — Corrections post-review : Design

**Date :** 2026-05-04
**Projet :** CA TIC WorkXP Admin — TPI 2026 — Luka Pellegrinelli
**Source :** Audit code review + audit conformité Pencil (WorkXPAdmin.pen)
**Approche :** Séquentielle par risque (Groupe 1 → 2 → 3)

---

## Contexte

Un audit code review + conformité Pencil a identifié 3 groupes de problèmes :

1. **Bugs backend** — anti-pattern critique + incohérence de guard
2. **Conformité design Pencil** — composants manquants ou mal implémentés
3. **Feature expandable** — carte stagiaire non dépliable (contrairement aux cartes ateliers)

L'approche séquentielle permet de s'arrêter après chaque groupe avec une app fonctionnelle — important vu la deadline TPI du 2 juin 2026.

---

## Groupe 1 — Fixes backend

### 1.1 Refactoring `certificateService.js`

**Problème :** `new Promise(async (resolve, reject) => { ... await ... })` — si un `await` throw à l'intérieur, l'exception devient une rejection non gérée (le `reject` externe ne la reçoit jamais).

**Fichier :** `backend/services/certificateService.js`

**Solution :** Convertir en `async function` + `promisify(carbone.render)` :

```js
import { promisify } from 'util';
const carboneRender = promisify(carbone.render);

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
```

**Impact :** Aucun changement d'interface. Le controller existant reste inchangé.

---

### 1.2 Guard suppression catégories au niveau service

**Problème :** La suppression d'une catégorie liée à des ateliers est actuellement gérée en catchant l'erreur MariaDB errno 1451 dans le **controller**. Les ateliers utilisent un guard au niveau **service** (`HAS_LINKED_INTERNSHIPS`). Incohérence de pattern.

**Fichiers :**
- Modifier : `backend/services/categoryService.js`
- Modifier : `backend/controllers/categoryController.js`
- Modifier : `backend/models/Category.js` (ajouter `activityCount` si absent)

**Solution :**

Dans `Category.getById()` (ou `getAllWithCount()`), inclure `activityCount` comme le fait `Activity.getById()` avec `internshipCount`.

Dans `categoryService.js` :
```js
export const deleteCategory = async (id) => {
  const existing = await Category.getById(id);
  if (!existing) throw new Error('NOT_FOUND');
  if (existing.activityCount > 0) throw new Error('HAS_LINKED_ACTIVITIES');
  await Category.delete(id);
};
```

Dans `categoryController.js`, gérer `HAS_LINKED_ACTIVITIES` → HTTP 409 (avant `NOT_FOUND`) :
```js
if (err.message === 'HAS_LINKED_ACTIVITIES') {
  return res.status(409).json({ error: 'Category cannot be deleted: it has linked activities' });
}
```

**Note :** La contrainte FK reste en place comme filet de sécurité. La vérification applicative se déclenche en premier.

---

## Groupe 2 — Conformité design Pencil

### 2.1 `Card/Stat` + `Card/StatDoc` dans les cartes activité dépliées

**Problème :** `Card/Stat` (compteur stages) et `Card/StatDoc` (statut document) sont définis dans Pencil mais absents de l'implémentation.

**Fichier :** `frontend/src/views/ActivityList.vue`

**Positionnement :** Dans la section dépliée, entre la description et les catégories.

**Données disponibles (déjà chargées, aucun appel API supplémentaire) :**
- `activity.internshipCount` → nombre de stages utilisant cet atelier
- `activity.documentUrl` → null ou chemin → indique si document disponible

**Rendu des deux mini-cartes :**

```html
<!-- Rangée de stats — visible uniquement quand la carte est dépliée -->
<div class="grid grid-cols-2 gap-3 py-4 border-t border-slate-100">
  <!-- Card/Stat -->
  <div class="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-2">
    <span class="text-xs font-medium text-slate-500">Stages utilisant cet atelier</span>
    <span class="text-2xl font-bold text-blue-600">{{ activity.internshipCount }}</span>
  </div>
  <!-- Card/StatDoc -->
  <div class="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-2">
    <span class="text-xs font-medium text-slate-500">Document</span>
    <div class="flex items-center gap-2">
      <component :is="activity.documentUrl ? 'CircleCheck' : 'CircleX'"
        :class="activity.documentUrl ? 'text-green-600' : 'text-slate-400'"
        class="w-4 h-4" />
      <span :class="activity.documentUrl ? 'text-green-600' : 'text-slate-400'"
        class="text-sm font-medium">
        {{ activity.documentUrl ? 'Disponible' : 'Aucun document' }}
      </span>
    </div>
  </div>
</div>
```

---

### 2.2 `Cannot Delete Modal` — catégories

**Problème :** Quand on tente de supprimer une catégorie liée à des ateliers, le code affiche un `<div>` rouge inline. Le Pencil montre un `Cannot Delete Modal` — une vraie modal d'erreur.

**Fichier :** `frontend/src/views/CategoryList.vue`

**Solution :** Remplacer le `deleteError` ref + div rouge par une `AppDialog` dédiée à l'erreur :

```js
// Remplacer deleteError ref par :
const cannotDeleteTarget = ref(null); // { name: string } | null

const handleDelete = async (cat) => {
  cannotDeleteTarget.value = null;
  try {
    await remove(cat.id);
  } catch {
    cannotDeleteTarget.value = cat;
  }
};
```

```html
<!-- Cannot Delete Modal -->
<AppDialog
  :isOpen="!!cannotDeleteTarget"
  title="Suppression impossible"
  @close="cannotDeleteTarget = null"
>
  <p class="text-slate-600 text-sm">
    La catégorie <strong>« {{ cannotDeleteTarget?.name }} »</strong> ne peut pas être
    supprimée car des ateliers lui sont associés.
  </p>
  <p class="text-slate-500 text-sm mt-2">
    Retirez d'abord cette catégorie de tous les ateliers concernés.
  </p>
  <template #footer>
    <AppButton @click="cannotDeleteTarget = null">Fermer</AppButton>
  </template>
</AppDialog>
```

**Note :** Pour les ateliers, le bouton est déjà désactivé si `internshipCount > 0` — comportement correct selon Pencil. Aucun changement nécessaire sur ActivityList.vue pour ce point.

---

### 2.3 `CategoryFormModal.vue` — composant dédié

**Problème :** Le formulaire create/edit de catégorie est inline dans `CategoryList.vue`. Tous les autres formulaires (Internship, Activity) ont un composant dédié.

**Fichier à créer :** `frontend/src/components/CategoryFormModal.vue`

**Interface :**
```js
// Props
const props = defineProps({
  isOpen: Boolean,
  category: { type: Object, default: null }, // null = create, objet = edit
});

// Emits
const emit = defineEmits(['close', 'saved']);
```

**Comportement :**
- Si `category` est `null` → titre "Nouvelle catégorie", champs vides
- Si `category` est un objet → titre "Modifier la catégorie", champs pré-remplis
- Émet `saved` après création ou modification réussie
- Émet `close` sur Annuler ou après sauvegarde

**Champs du formulaire :**
- `name` (text, required, placeholder "ex: Développement")
- `description` (textarea, optionnel)

**`CategoryList.vue` après extraction :**
- Importe `CategoryFormModal`
- Supprime le bloc `<AppDialog>` avec le formulaire inline
- Garde les `ref` `showForm`, `editTarget`, `form` dans le composant modal

---

## Groupe 3 — Carte stagiaire dépliable

### 3.1 Expand/collapse sur `InternshipCardDesktop.vue`

**Problème :** Les cartes ateliers sont dépliables (section categories + document). Les cartes stagiaires ne le sont pas — le Pencil montre `Card/InternFull` avec une section "Ateliers réalisés".

**Fichiers :**
- Modifier : `frontend/src/components/internships/card/InternshipCardDesktop.vue`
- Modifier : `frontend/src/components/internships/card/InternshipCardMobile.vue`

**Pattern (identique aux cartes ateliers dans ActivityList.vue) :**

État local dans le composant (pas dans le parent) :
```js
const isExpanded = ref(false);
const toggleExpand = () => { isExpanded.value = !isExpanded.value; };
```

Header cliquable (cursor-pointer sur le bloc nom/email/dates).

**Section dépliée — "Ateliers réalisés" :**
- Titre "ATELIERS RÉALISÉS" (label gris, lettres capitales, style identique à la section categories des activités)
- Liste des activités déjà associées : pills `activity.title` + `activity.categories`
- Bouton "+ Ajouter un atelier" → popover avec liste des ateliers disponibles (non encore associés)
- Bouton "×" sur chaque pill pour dissocier

**Données :**
- `GET /api/internships/:id/activities` → à appeler au premier dépliage (lazy load)
- `POST /api/internships/:id/activities/:activityId` → association
- `DELETE /api/internships/:id/activities/:activityId` → dissociation
- `GET /api/activities` + `GET /api/activities/:id` pour la liste disponible dans le popover (déjà utilisé dans le dashboard)

**Chargement :** Au premier `toggleExpand()`, si `internshipActivities` est vide et pas encore chargé, appeler `GET /api/internships/:id/activities`. Indicateur de chargement pendant le fetch.

**Fermeture du popover :** Clic en dehors (directive `v-click-outside` ou listener `@click.self` sur overlay transparent).

### 3.2 Fermeture popover au clic extérieur (bonus fix)

En même temps qu'on implémente le popover de la carte stagiaire, corriger le même problème sur le popover de catégories dans `ActivityList.vue` : ajouter `@keydown.escape` + `@click.outside`.

---

## Fichiers impactés — récapitulatif

| Fichier | Action | Groupe |
|---|---|---|
| `backend/services/certificateService.js` | Refactorer avec async + promisify | 1 |
| `backend/services/categoryService.js` | Ajouter `deleteCategory` avec guard | 1 |
| `backend/controllers/categoryController.js` | Gérer `HAS_LINKED_ACTIVITIES` → 409 | 1 |
| `backend/models/Category.js` | Vérifier que `activityCount` est retourné par `getById` | 1 |
| `frontend/src/views/ActivityList.vue` | Ajouter Card/Stat + Card/StatDoc dans section dépliée | 2 |
| `frontend/src/views/CategoryList.vue` | Cannot Delete Modal + extraire formulaire | 2 |
| `frontend/src/components/CategoryFormModal.vue` | Créer composant dédié | 2 |
| `frontend/src/components/internships/card/InternshipCardDesktop.vue` | Ajouter expand + ateliers section | 3 |
| `frontend/src/components/internships/card/InternshipCardMobile.vue` | Idem (version mobile) | 3 |

---

## Tests E2E à ajouter

**Groupe 1 — Backend :**
- `sc-certificate-download.spec.ts` : vérifier que le certificat est toujours généré correctement après refactoring

**Groupe 2 — Conformité :**
- `sc-activity-enriched.spec.ts` : ajouter test "stat cards visible dans carte dépliée"
- `sc-category-crud.spec.ts` : ajouter test "cannot delete modal s'ouvre quand catégorie liée"

**Groupe 3 — Expand card :**
- `sc-internship-association.spec.ts` : adapter pour tester l'expand card + ajout atelier depuis carte

---

## Contraintes

- Aucune modification du schéma DB
- Aucune nouvelle route API (tous les endpoints nécessaires existent déjà)
- Deadline TPI : 2 juin 2026 — on peut s'arrêter après Groupe 1 ou Groupe 2 si nécessaire
