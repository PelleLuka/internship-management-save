<script setup>
import { computed, onMounted, ref } from "vue";
import { getActivities, getActivityById, deleteActivity } from "../services/activityService";
import { useMediaQuery } from "../composables/useMediaQuery";
import ActivityFormModal from "../components/ActivityFormModal.vue";
import AppButton from "../components/AppButton.vue";
import AppInput from "../components/AppInput.vue";
import { Search, Plus, Pencil, Trash2, Activity as ActivityIcon } from "lucide-vue-next";

const activities = ref([]);
const searchQuery = ref("");
const isModalOpen = ref(false);
const editingId = ref(null);
const isSearchOpen = ref(false);

const isMobile = useMediaQuery("(max-width: 890px)");

/**
 * Loads all active activities.
 * Fetches IDs first, then details (N+1).
 * Updates `activities` state.
 */
const loadActivities = async () => {
	try {
		const idList = await getActivities();
        const promises = idList.map(item => getActivityById(item.id));
        activities.value = await Promise.all(promises);
	} catch (error) {
		console.error("Failed to load activities", error);
	}
};

/**
 * Deletes an activity using a "soft delete" (marks visible=0).
 * Uses optimistic UI update to instantly remove the item from the list.
 * 
 * @param {number} id - The ID of the activity to delete.
 */
const handleDelete = async (id) => {
	if (confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
		try {
			await deleteActivity(id);
            // Remove from local state immediately for better UX
            activities.value = activities.value.filter(a => a.id !== id);
			loadActivities();
		} catch (error) {
			console.error("Failed to delete activity", error);
			alert("Erreur lors de la suppression de l'activité.");
		}
	}
};

/**
 * Computed property to filter activities based on search query.
 * Case-insensitive search on title and description (if exists).
 */
const filteredActivities = computed(() => {
	if (!searchQuery.value) return activities.value;
	const query = searchQuery.value.toLowerCase();
	return activities.value.filter(
		(a) =>
			a.title.toLowerCase().includes(query) ||
			a.description.toLowerCase().includes(query),
	);
});

onMounted(loadActivities);
</script>

<template>
  <div class="w-full max-w-7xl mx-auto px-4 pb-12">
    
    <!-- Mobile Header Logic -->
    <template v-if="isMobile">
        <!-- Teleport Actions to Top Bar -->
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

        <!-- Sticky Collapsible Search Area -->
        <div 
          class="sticky top-16 z-30 bg-slate-50/95 backdrop-blur-sm px-2 -mx-6 mb-4 transition-all duration-300"
          :class="isSearchOpen ? 'py-4' : 'h-0 overflow-hidden py-0'"
        >
            <div class="relative w-full">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <AppInput v-model="searchQuery" class="pl-9 w-full bg-white" placeholder="Rechercher une activité..." />
            </div>
        </div>
    </template>

    <!-- Desktop Header -->
    <div v-else class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-lg border border-slate-200 shadow-sm sticky top-8 z-40 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Activités</h1>
      </div>
      <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div class="relative w-full sm:w-64">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <AppInput v-model="searchQuery" class="pl-9" placeholder="Rechercher une activité..." />
        </div>
        <AppButton @click="() => { editingId = null; isModalOpen = true; }">
          <Plus class="w-4 h-4 mr-2" />
          Nouvelle Activité
        </AppButton>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredActivities.length === 0" class="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
        <ActivityIcon class="w-6 h-6 text-slate-400" />
      </div>
      <h3 class="text-lg font-medium text-slate-900">Aucune activité trouvée</h3>
      <p class="text-slate-500 mt-1">Commencez par créer une nouvelle activité.</p>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="activity in filteredActivities"
        :key="activity.id"
        class="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col scroll-mt-32"
      >
        <div class="flex justify-between items-start gap-4 mb-3">
          <div class="p-2 bg-blue-50 rounded-lg text-blue-600">
            <ActivityIcon class="w-5 h-5" />
          </div>
          <div class="flex gap-1 transition-opacity lg:opacity-0 lg:group-hover:opacity-100">
            <button
              @click="() => { editingId = activity.id; isModalOpen = true; }"
              class="p-2 hover:bg-blue-50 text-blue-600 rounded-md transition-colors"
              :aria-label="'Modifier ' + activity.title"
              :data-testid="'edit-activity-' + activity.title"
            >
              <Pencil class="w-4 h-4" />
            </button>
            <button
              @click="handleDelete(activity.id)"
              class="p-2 hover:bg-red-50 text-red-600 rounded-md transition-colors"
              :aria-label="'Supprimer ' + activity.title"
              :data-testid="'delete-activity-' + activity.title"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <h3 class="font-semibold text-slate-900 text-lg mb-2 break-words" :title="activity.title">
          {{ activity.title }}
        </h3>
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
