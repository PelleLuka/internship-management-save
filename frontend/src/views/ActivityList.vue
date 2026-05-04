<script setup>
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
import { computed, onMounted, ref } from 'vue';
import ActivityFormModal from '../components/ActivityFormModal.vue';
import AppButton from '../components/AppButton.vue';
import AppInput from '../components/AppInput.vue';
import { useMediaQuery } from '../composables/useMediaQuery';
import {
  deleteActivity,
  deleteActivityDocument,
  getActivities,
  getActivityById,
  getActivityDocumentUrl,
  getCategories,
  updateActivity,
  uploadActivityDocument,
} from '../services/activityService';

const activities = ref([]);
const allCategories = ref([]);
const searchQuery = ref('');
const isModalOpen = ref(false);
const editingId = ref(null);
const isSearchOpen = ref(false);
const expandedId = ref(null);
const categoryMenuActivityId = ref(null);
const tempCategoryIds = ref(new Set());

const isMobile = useMediaQuery('(max-width: 890px)');

const loadActivities = async () => {
  try {
    const idList = await getActivities();
    const promises = idList.map((item) => getActivityById(item.id));
    activities.value = await Promise.all(promises);
  } catch (error) {
    console.error('Failed to load activities', error);
  }
};

const handleDelete = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) {
    try {
      await deleteActivity(id);
      await loadActivities();
    } catch (error) {
      if (error.response?.status === 409) {
        alert(
          'Impossible de supprimer cet atelier : il est lié à des stagiaires.',
        );
      } else {
        console.error('Failed to delete activity', error);
        alert("Erreur lors de la suppression de l'activité.");
      }
    }
  }
};

const handleUploadDocument = async (activityId, event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    await uploadActivityDocument(activityId, file);
    await loadActivities();
  } catch (error) {
    console.error('Failed to upload document', error);
    alert(
      "Erreur lors de l'upload du document. Vérifiez le format et la taille (max 10 MB).",
    );
  }
};

const handleDeleteDocument = async (activityId) => {
  if (!confirm('Supprimer ce document ?')) return;
  try {
    await deleteActivityDocument(activityId);
    await loadActivities();
  } catch (error) {
    console.error('Failed to delete document', error);
    alert('Erreur lors de la suppression du document.');
  }
};

const filteredActivities = computed(() => {
  if (!searchQuery.value) return activities.value;
  const query = searchQuery.value.toLowerCase();
  return activities.value.filter(
    (a) =>
      a.title.toLowerCase().includes(query) ||
      (a.description ?? '').toLowerCase().includes(query),
  );
});

// ── Expand / collapse ──────────────────────────────────────────────────────
const toggleExpand = (id) => {
  if (expandedId.value === id) {
    expandedId.value = null;
    closeCategoryMenu();
  } else {
    expandedId.value = id;
    closeCategoryMenu();
  }
};

// ── Category management ────────────────────────────────────────────────────
const availableCategories = (activity) => {
  const assigned = new Set((activity.categories ?? []).map((c) => c.id));
  return allCategories.value.filter((c) => !assigned.has(c.id));
};

const openCategoryMenu = (activity) => {
  categoryMenuActivityId.value = activity.id;
  tempCategoryIds.value = new Set();
};

const closeCategoryMenu = () => {
  categoryMenuActivityId.value = null;
  tempCategoryIds.value = new Set();
};

const toggleCategorySelection = (catId) => {
  const s = new Set(tempCategoryIds.value);
  if (s.has(catId)) s.delete(catId);
  else s.add(catId);
  tempCategoryIds.value = s;
};

const saveCategories = async (activity) => {
  try {
    const existing = (activity.categories ?? []).map((c) => c.id);
    const newIds = [...tempCategoryIds.value];
    await updateActivity(activity.id, {
      categoryIds: [...existing, ...newIds],
    });
    closeCategoryMenu();
    await loadActivities();
  } catch (error) {
    console.error('Failed to save categories', error);
    alert('Erreur lors de la mise à jour des catégories.');
  }
};

const removeCategoryFromActivity = async (activity, catId) => {
  try {
    const remaining = (activity.categories ?? [])
      .filter((c) => c.id !== catId)
      .map((c) => c.id);
    await updateActivity(activity.id, { categoryIds: remaining });
    await loadActivities();
  } catch (error) {
    console.error('Failed to remove category', error);
    alert('Erreur lors du retrait de la catégorie.');
  }
};

onMounted(async () => {
  await loadActivities();
  allCategories.value = await getCategories();
});
</script>

<template>
  <div class="w-full max-w-7xl mx-auto px-4 pb-12">
    <!-- Mobile Header Logic -->
    <template v-if="isMobile">
      <Teleport to="#header-actions">
        <div class="flex gap-2">
          <button
            @click="isSearchOpen = !isSearchOpen"
            class="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md border border-slate-700 transition-colors"
            :class="isSearchOpen ? 'bg-slate-800 text-white border-slate-600' : ''"
            aria-label="Rechercher"
          >
            <Search class="w-5 h-5" />
          </button>
          <button
            @click="() => { editingId = null; isModalOpen = true; }"
            class="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors shadow-sm"
            aria-label="Nouvelle Activité"
          >
            <Plus class="w-5 h-5" />
          </button>
        </div>
      </Teleport>

      <div
        class="sticky top-16 z-30 bg-slate-50/95 backdrop-blur-sm px-2 -mx-6 mb-4 transition-all duration-300"
        :class="isSearchOpen ? 'py-4' : 'h-0 overflow-hidden py-0'"
      >
        <div class="relative w-full">
          <Search
            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          />
          <AppInput
            v-model="searchQuery"
            class="pl-9 w-full bg-white"
            placeholder="Rechercher une activité..."
          />
        </div>
      </div>
    </template>

    <!-- Desktop Header -->
    <div
      v-else
      class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-lg border border-slate-200 shadow-sm sticky top-8 z-40 mb-8"
    >
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Activités</h1>
      </div>
      <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div class="relative w-full sm:w-64">
          <Search
            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          />
          <AppInput
            v-model="searchQuery"
            class="pl-9"
            placeholder="Rechercher une activité..."
          />
        </div>
        <AppButton @click="() => { editingId = null; isModalOpen = true; }">
          <Plus class="w-4 h-4 mr-2" />
          Nouvelle Activité
        </AppButton>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredActivities.length === 0"
      class="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300"
    >
      <div
        class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4"
      >
        <ActivityIcon class="w-6 h-6 text-slate-400" />
      </div>
      <h3 class="text-lg font-medium text-slate-900">
        Aucune activité trouvée
      </h3>
      <p class="text-slate-500 mt-1">
        Commencez par créer une nouvelle activité.
      </p>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="activity in filteredActivities"
        :key="activity.id"
        class="group bg-white rounded-xl border transition-all duration-200 flex flex-col scroll-mt-32"
        :class="expandedId === activity.id
          ? 'border-blue-200 shadow-md'
          : 'border-slate-200 shadow-sm hover:shadow-md'"
      >
        <!-- ── Clickable header: icon, title, categories, description ── -->
        <div
          @click="toggleExpand(activity.id)"
          class="p-5 cursor-pointer flex flex-col"
        >
          <div class="flex justify-between items-start gap-4 mb-3">
            <div class="p-2 bg-blue-50 rounded-lg text-blue-600">
              <ActivityIcon class="w-5 h-5" />
            </div>
            <div
              class="flex gap-1 transition-opacity lg:opacity-0 lg:group-hover:opacity-100"
            >
              <button
                @click.stop="() => { editingId = activity.id; isModalOpen = true; }"
                class="p-2 hover:bg-blue-50 text-blue-600 rounded-md transition-colors"
                :aria-label="'Modifier ' + activity.title"
                :data-testid="'edit-activity-' + activity.title"
              >
                <Pencil class="w-4 h-4" />
              </button>
              <button
                @click.stop="handleDelete(activity.id)"
                :disabled="activity.internshipCount > 0"
                :class="['p-2 rounded-md transition-colors',
                         activity.internshipCount > 0
                           ? 'text-slate-300 cursor-not-allowed'
                           : 'hover:bg-red-50 text-red-600']"
                :aria-label="activity.internshipCount > 0
                  ? 'Suppression impossible (atelier lié à des stagiaires)'
                  : 'Supprimer ' + activity.title"
                :data-testid="'delete-activity-' + activity.title"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>

          <h3
            class="font-semibold text-slate-900 text-base break-words"
            :title="activity.title"
          >
            {{ activity.title }}
          </h3>

          <!-- Category badges — display only -->
          <div
            v-if="activity.categories?.length"
            class="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1"
          >
            <span
              v-for="cat in activity.categories"
              :key="cat.id"
              class="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-xl"
            >
              {{ cat.name }}
            </span>
          </div>

          <!-- Description section -->
          <div
            v-if="activity.description"
            class="mt-3 pt-3 border-t border-slate-100"
          >
            <p
              class="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1"
            >
              Description
            </p>
            <p
              class="text-sm text-slate-500 leading-relaxed"
              :class="expandedId === activity.id ? '' : 'line-clamp-2'"
            >
              {{ activity.description }}
            </p>
          </div>
        </div>

        <!-- ── Expanded: category management ── -->
        <div
          v-if="expandedId === activity.id"
          class="px-5 pb-0 animate-in slide-in-from-top-2 duration-200"
        >
          <div class="pt-3 border-t border-slate-100">
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
            <span
              class="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-2 block"
              >Catégories</span
            >

            <!-- Badges with × remove -->
            <div class="flex flex-wrap gap-1 mb-3 min-h-[28px]">
              <span
                v-for="cat in activity.categories"
                :key="cat.id"
                class="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-xl group/cat hover:bg-blue-100 transition-colors"
              >
                {{ cat.name }}
                <button
                  @click.stop="removeCategoryFromActivity(activity, cat.id)"
                  class="text-blue-400 hover:text-blue-600 opacity-0 group-hover/cat:opacity-100 transition-opacity focus:outline-none"
                  title="Retirer la catégorie"
                >
                  <X class="w-3 h-3" />
                </button>
              </span>
              <span
                v-if="!activity.categories?.length"
                class="text-xs text-slate-400 italic"
              >
                Aucune catégorie
              </span>
            </div>

            <!-- Add category button + popover -->
            <div class="relative mb-3">
              <button
                @click.stop="openCategoryMenu(activity)"
                class="w-full flex items-center justify-center gap-1.5 h-9 text-slate-500 border border-slate-300 rounded-md text-sm transition-colors hover:bg-slate-50"
              >
                + Ajouter une catégorie
              </button>

              <div
                v-if="categoryMenuActivityId === activity.id"
                class="absolute z-50 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 p-4 left-0 top-full"
              >
                <div class="flex justify-between items-center mb-3">
                  <h4 class="font-semibold text-sm">Ajouter des catégories</h4>
                  <button
                    @click.stop="closeCategoryMenu"
                    class="text-slate-400 hover:text-slate-600"
                  >
                    <X class="w-4 h-4" />
                  </button>
                </div>

                <div class="mb-4">
                  <div
                    v-if="availableCategories(activity).length === 0"
                    class="text-xs text-slate-500 text-center py-2"
                  >
                    Toutes les catégories sont déjà assignées.
                  </div>
                  <div class="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                    <button
                      v-for="cat in availableCategories(activity)"
                      :key="cat.id"
                      @click.stop="toggleCategorySelection(cat.id)"
                      class="px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200"
                      :class="tempCategoryIds.has(cat.id)
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50'"
                    >
                      {{ cat.name }}
                    </button>
                  </div>
                </div>

                <div
                  class="flex justify-end gap-2 pt-2 border-t border-slate-100"
                >
                  <AppButton
                    variant="outline"
                    size="sm"
                    @click.stop="closeCategoryMenu"
                  >
                    Annuler
                  </AppButton>
                  <AppButton
                    size="sm"
                    @click.stop="saveCategories(activity)"
                    :disabled="tempCategoryIds.size === 0"
                  >
                    Ajouter ({{ tempCategoryIds.size }})
                  </AppButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Documentation — always visible ── -->
        <div class="mx-5 mb-5 mt-3 pt-3 border-t border-slate-100">
          <p
            class="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-2"
          >
            Documentation
          </p>

          <template v-if="activity.documentUrl">
            <div
              class="bg-green-50 border border-green-200 rounded-md px-3 py-2 flex items-center justify-between gap-2 mb-2"
            >
              <span class="text-xs text-green-800 font-medium truncate">
                📄
                {{ activity.documentUrl.split('-').slice(5).join('-') || activity.documentUrl }}
              </span>
              <div class="flex gap-1 shrink-0">
                <a
                  v-if="activity.documentUrl.toLowerCase().endsWith('.pdf')"
                  :href="getActivityDocumentUrl(activity.id)"
                  target="_blank"
                  class="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 whitespace-nowrap"
                >
                  👁 Voir
                </a>
                <a
                  :href="getActivityDocumentUrl(activity.id)"
                  download
                  class="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded hover:bg-slate-200"
                >
                  ⬇
                </a>
                <button
                  @click="handleDeleteDocument(activity.id)"
                  class="text-xs text-red-600 bg-red-50 px-2 py-1 rounded hover:bg-red-100"
                >
                  🗑
                </button>
              </div>
            </div>
            <label
              class="block border border-dashed border-slate-300 rounded-md p-2 text-center
                          text-xs text-slate-400 cursor-pointer hover:border-slate-400 transition-colors"
            >
              🔄 Remplacer
              <input
                type="file"
                class="hidden"
                @change="(e) => handleUploadDocument(activity.id, e)"
              />
            </label>
          </template>

          <label
            v-else
            class="block border-2 border-dashed border-slate-200 rounded-md p-3 text-center
                   text-xs text-slate-400 cursor-pointer hover:border-slate-300 transition-colors"
          >
            📎 Glisser un fichier ou
            <span class="text-blue-500 underline">parcourir</span>
            <br />
            <span class="text-[10px]">PDF, DOCX, ODT… · max 10 MB</span>
            <input
              type="file"
              class="hidden"
              @change="(e) => handleUploadDocument(activity.id, e)"
            />
          </label>
        </div>
      </div>
    </div>

    <ActivityFormModal
      :isOpen="isModalOpen"
      :activityId="editingId"
      @close="isModalOpen = false"
      @success="loadActivities"
    />
  </div>
</template>
