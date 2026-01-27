<script setup>
import { Search, Plus, ListFilter } from 'lucide-vue-next';
import { ref, onMounted, onUnmounted } from 'vue';
import AppInput from '../../AppInput.vue';

defineProps({
  searchQuery: String,
  sortBy: String,
  isOpen: Boolean // Controlled by parent
});

const emit = defineEmits(['update:searchQuery', 'update:sortBy', 'open-modal', 'toggle']);
const isSortMenuOpen = ref(false);
const menuRef = ref(null);

const sortOptions = [
  { label: 'Date (Récent)', value: 'dateDesc' },
  { label: 'Date (Ancien)', value: 'dateAsc' },
  { label: 'Prénom', value: 'firstName' },
  { label: 'Nom', value: 'lastName' },
];

const handleSortSelect = (value) => {
  emit('update:sortBy', value);
  isSortMenuOpen.value = false;
};

// Click Outside Handler
const handleClickOutside = (event) => {
  if (isSortMenuOpen.value && menuRef.value && !menuRef.value.contains(event.target)) {
    isSortMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <!-- Mobile Header Container -->
  <div class="flex flex-col gap-3">
    <!-- Teleport Actions to Top Bar -->
    <Teleport to="#header-actions">
        <div class="flex gap-2">
          <!-- Main Toggle (Search Icon) - Toggles both Search Inputs & Year List via parent -->
          <button 
            @click="emit('toggle')"
            class="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md border border-slate-700 transition-colors"
            :class="isOpen ? 'bg-slate-800 text-white border-slate-600' : ''"
            aria-label="Toggle filters and navigation"
          >
            <Search class="w-5 h-5" />
          </button>
          
          <!-- New Internship Button -->
          <button
            @click="emit('open-modal')"
            class="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors shadow-sm"
            aria-label="Nouveau Stagiaire"
          >
            <Plus class="w-5 h-5" />
          </button>
        </div>
    </Teleport>

    <!-- Collapsible Filters Area -->
    <div 
        v-if="isOpen"
        class="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-3 animate-in slide-in-from-top-2 duration-200"
    >
        <div ref="menuRef" class="flex items-center gap-2 relative">
          <!-- Search Input -->
          <div class="relative flex-1">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <AppInput 
              :model-value="searchQuery" 
              @update:model-value="emit('update:searchQuery', $event)" 
              class="pl-9 w-full" 
              placeholder="Rechercher..." 
            />
          </div>

          <!-- Filter Button (Icon Only) -->
          <button
            @click="isSortMenuOpen = !isSortMenuOpen"
            class="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 transition-colors shrink-0"
            :class="isSortMenuOpen ? 'bg-slate-200 border-slate-300' : ''"
            aria-label="Trier"
          >
            <ListFilter class="w-5 h-5" />
          </button>

          <!-- Dropdown Menu -->
          <div 
            v-if="isSortMenuOpen"
            class="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-slate-200 z-50 py-1 origin-top-right animate-in fade-in zoom-in-95 duration-100"
          >
            <button
              v-for="option in sortOptions"
              :key="option.value"
              @click="handleSortSelect(option.value)"
              class="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
              :class="sortBy === option.value ? 'font-semibold text-blue-600 bg-blue-50' : 'text-slate-700'"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
    </div>
  </div>
</template>
