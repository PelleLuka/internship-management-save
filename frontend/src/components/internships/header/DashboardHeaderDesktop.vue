<script setup>
import { Search, Plus } from 'lucide-vue-next';
import AppButton from '../../AppButton.vue';
import AppInput from '../../AppInput.vue';

defineProps({
  searchQuery: String,
  sortBy: String
});

const emit = defineEmits(['update:searchQuery', 'update:sortBy', 'open-modal']);
</script>

<template>
  <div class="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex justify-between items-center">
    <div class="flex items-center gap-4">
        <h1 class="text-2xl font-bold text-slate-900">Stagiaires</h1>
    </div>

    <!-- Desktop Actions -->
    <div class="flex gap-3">
      <div class="relative w-64">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <AppInput 
          :model-value="searchQuery" 
          @update:model-value="emit('update:searchQuery', $event)" 
          class="pl-9" 
          placeholder="Rechercher..." 
        />
      </div>
      <select
        :value="sortBy"
        @input="emit('update:sortBy', $event.target.value)"
        class="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="dateDesc">Date (Récent)</option>
        <option value="dateAsc">Date (Ancien)</option>
        <option value="firstName">Prénom</option>
        <option value="lastName">Nom</option>
      </select>
      
      <AppButton @click="() => emit('open-modal')">
        <Plus class="w-4 h-4 mr-2" />
        Nouveau
      </AppButton>
    </div>
  </div>
</template>
