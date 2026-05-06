<script setup>
import { Activity as ActivityIcon, Plus, Search } from 'lucide-vue-next';
import AppButton from '../components/AppButton.vue';
import AppInput from '../components/AppInput.vue';
import ActivityCard from '../components/activities/ActivityCard.vue';
import ActivityFormModal from '../components/activities/ActivityFormModal.vue';
import { useActivityList } from '../composables/useActivityList';
import { useCategoryMenu } from '../composables/useCategoryMenu';
import { useMediaQuery } from '../composables/useMediaQuery';

const isMobile = useMediaQuery('(max-width: 890px)');

const {
  allCategories,
  editingId,
  expandedId,
  filteredActivities,
  isModalOpen,
  isSearchOpen,
  searchQuery,
  handleDelete,
  handleDeleteDocument,
  handleUploadDocument,
  loadActivities,
} = useActivityList();

const {
  availableCategories,
  categoryMenuActivityId,
  tempCategoryIds,
  closeCategoryMenu,
  openCategoryMenu,
  removeCategoryFromActivity,
  saveCategories,
  toggleCategorySelection,
} = useCategoryMenu(loadActivities, allCategories);

const toggleExpand = (id) => {
  expandedId.value = expandedId.value === id ? null : id;
  closeCategoryMenu();
};
</script>

<template>
  <div class="w-full max-w-7xl mx-auto px-4 pb-12">
    <!-- Mobile Header -->
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
      <h1 class="text-2xl font-bold text-slate-900">Activités</h1>
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

    <!-- Activity cards grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ActivityCard
        v-for="activity in filteredActivities"
        :key="activity.id"
        :activity="activity"
        :isExpanded="expandedId === activity.id"
        :categoryMenuOpen="categoryMenuActivityId === activity.id"
        :tempCategoryIds="tempCategoryIds"
        :availableCategories="availableCategories(activity)"
        @toggle="toggleExpand"
        @edit="(id) => { editingId = id; isModalOpen = true; }"
        @delete="handleDelete"
        @remove-category="removeCategoryFromActivity"
        @open-category-menu="openCategoryMenu"
        @close-category-menu="closeCategoryMenu"
        @toggle-category-selection="toggleCategorySelection"
        @save-categories="saveCategories"
        @upload-document="handleUploadDocument"
        @delete-document="handleDeleteDocument"
      />
    </div>

    <ActivityFormModal
      :isOpen="isModalOpen"
      :activityId="editingId"
      @close="isModalOpen = false"
      @success="loadActivities"
    />
  </div>
</template>
