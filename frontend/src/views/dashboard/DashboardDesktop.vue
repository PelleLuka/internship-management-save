<script setup>
import { onMounted, ref } from 'vue';
import { useInternships } from '../../composables/useInternships';
import { useActivities } from '../../composables/useActivities';
import { useMediaQuery } from '../../composables/useMediaQuery';

// Components
import DashboardHeader from '../../components/internships/DashboardHeader.vue';
import InternshipCard from '../../components/internships/InternshipCard.vue';
import InternshipFormModal from '../../components/InternshipFormModal.vue';
import SidebarNavigation from '../../components/internships/SidebarNavigation.vue';
import InternshipGroupList from '../../components/internships/InternshipGroupList.vue';

// Init Composables
const {
  internships, 
  searchQuery,
  sortBy,
  expandedCards,
  loadInternships,
  handleDelete,
  removeActivity,
  toggleCard,
  groupedInternships,
  updateInternshipActivities
} = useInternships();

const {
  activities,
  activityMenuOpenId,
  tempSelectedActivityIds,
  loadActivities,
  openActivityMenu,
  closeActivityMenu,
  toggleActivitySelection,
  saveActivities
} = useActivities();

const isLgCustom = useMediaQuery('(min-width: 1022px)');

// Local State
const isModalOpen = ref(false);
const editingId = ref(null);
const headerRef = ref(null);
const headerHeight = ref(0);

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

const handleSaveActivities = (internshipId) => {
  saveActivities(internshipId, internships, updateInternshipActivities);
};

// Lifecycle
onMounted(() => {
  loadInternships();
  loadActivities();

  if (headerRef.value) {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        headerHeight.value = entry.contentRect.height;
      }
    });
    observer.observe(headerRef.value);
  }
});
</script>

<template>
  <div class="flex gap-8 w-full px-0 md:px-4 max-w-7xl mx-auto">
    <!-- Atomic Sidebar Navigation -->
    <!-- Displays Year/Month tree. Hidden on mobile, visible on LG screens. -->
    <SidebarNavigation 
      v-if="isLgCustom" 
      :groups="groupedInternships" 
      @scroll-to="scrollTo" 
    />

    <!-- Main Content Area -->
    <div class="flex-1 min-w-0 pb-12">
      <div class="space-y-8">
        <!-- Sticky Header Group -->
        <!-- Contains Search, Sort, and 'New' button. Sticks to top while scrolling. -->
        <div
          ref="headerRef"
          class="sticky top-8 z-40 space-y-4 bg-slate-50/95 backdrop-blur-sm -mx-2 px-2 rounded-b-lg"
        >
          <DashboardHeader
            v-model:searchQuery="searchQuery"
            v-model:sortBy="sortBy"
            @open-modal="() => { editingId = null; isModalOpen = true; }"
          />
        </div>

        <!-- Atomic Content List -->
        <InternshipGroupList 
          :groups="groupedInternships" 
          :header-height="headerHeight"
        >
          <!-- Using the scoped slot to render the specific card for this dashboard -->
          <template #item="{ item }">
            <InternshipCard
              :internship="item"
              :expanded="expandedCards.has(item.id)"
              :activities="activities"
              :activity-menu-open="activityMenuOpenId === item.id"
              :temp-selected-activity-ids="tempSelectedActivityIds"
              @toggle="toggleCard"
              @edit="() => { editingId = item.id; isModalOpen = true; }"
              @delete="handleDelete"
              @remove-activity="removeActivity"
              @open-activity-menu="openActivityMenu"
              @close-activity-menu="closeActivityMenu"
              @toggle-activity-selection="toggleActivitySelection"
              @save-activities="handleSaveActivities"
            />
          </template>
          
          <template #empty>
            <div v-if="internships.length === 0">Aucun stagiaire trouvé.</div>
          </template>
        </InternshipGroupList>
      </div>
    </div>

    <!-- Modal -->
    <InternshipFormModal
      v-if="isModalOpen"
      :is-open="true"
      :internship-id="editingId"
      @close="isModalOpen = false"
      @success="() => { loadInternships(); isModalOpen = false; }"
    />
  </div>
</template>
