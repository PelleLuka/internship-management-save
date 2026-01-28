<script setup>
import { onMounted, ref } from 'vue';
import { useInternships } from '../../composables/useInternships';
import { useActivities } from '../../composables/useActivities';
import { Calendar } from 'lucide-vue-next';

// Components
import DashboardHeader from '../../components/internships/DashboardHeader.vue';
import InternshipCard from '../../components/internships/InternshipCard.vue';
import InternshipFormModal from '../../components/InternshipFormModal.vue';
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
  updateInternshipActivities,
  loadNextBatch
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

// Local State
const isModalOpen = ref(false);
const isNavOpen = ref(false); // Collapsed by default
const editingId = ref(null);
const expandedYear = ref(null);
const headerRef = ref(null);
const headerHeight = ref(0);

const toggleYear = (year) => {
  expandedYear.value = expandedYear.value === year ? null : year;
};

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
  <div class="flex gap-8 w-full px-0 mx-auto">
    <!-- Layout Mobile : Pas de sidebar, verticalité -->

    <div class="flex-1 min-w-0 pb-12">
      <div class="space-y-4">
        <!-- Sticky Header Group (Restored & Cleaned) -->
        <!-- Sticky Header Group (Restored & Cleaned) -->
        <div
          ref="headerRef"
          class="sticky top-16 z-30 bg-slate-50/95 backdrop-blur-sm px-2 -mx-2 mb-1 transition-all duration-300"
          :class="isNavOpen ? 'space-y-4 py-4' : 'py-0 h-0 overflow-hidden'"
        >
          <!-- 
            DashboardHeader (Mobile Variant):
            - Teleports [Search] and [+] buttons to the top bar.
            - Displays Search/Sort inputs when isOpen is true.
            - Emits @toggle when [Search] is clicked.
           -->
          <DashboardHeader
            v-model:searchQuery="searchQuery"
            v-model:sortBy="sortBy"
            :is-open="isNavOpen"
            @toggle="isNavOpen = !isNavOpen"
            @open-modal="() => { editingId = null; isModalOpen = true; }"
          />

          <!-- Mobile Horizontal Navigation (Collapsible) -->
          <!-- Also controlled by isNavOpen (same toggle as Search) -->
          <div
            v-if="isNavOpen"
            class="w-full max-w-[calc(100vw-2rem)] mx-auto py-2 transition-all duration-300 animate-in slide-in-from-top-2"
          >
            <div class="flex flex-nowrap gap-2 items-center overflow-x-auto scrollbar-hide pb-1">
              <template v-for="[year, months] in groupedInternships" :key="year">
                <button
                  @click="toggleYear(year)"
                  class="shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap"
                  :class="[
                  expandedYear === year
                    ? 'bg-blue-600 text-white shadow-md transform scale-105'
                    : 'bg-white text-slate-600 border border-slate-200 shadow-sm hover:border-blue-300 hover:text-blue-600 hover:shadow-md'
                ]"
                >
                  {{ year }}
                  <span class="ml-1 opacity-75 text-xs">({{ months.length }})</span>
                </button>

                <!-- Inline Expanded Months -->
                <template v-if="expandedYear === year">
                  <div class="flex flex-nowrap gap-2 items-center px-1 animate-in fade-in slide-in-from-left-4 duration-300">
                    <button
                      v-for="[month] in months"
                      :key="`${year}-${month}`"
                      @click="scrollTo(`month-${year}-${month}`)"
                      class="shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 shadow-sm whitespace-nowrap"
                      :class="[
                      'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-md'
                    ]"
                    >
                      {{ month }}
                    </button>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </div>

        <!-- Atomic Content List -->
        <div class="px-2">
            <InternshipGroupList 
                :groups="groupedInternships" 
                :header-height="headerHeight"
                :offset="88" 
                @load-more="loadNextBatch"
            >
            <!-- Offset 88 = 64 (Navbar) + 24 (Padding) -->

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
