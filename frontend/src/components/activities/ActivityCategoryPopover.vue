<script setup>
import { X } from 'lucide-vue-next';
import AppButton from '../AppButton.vue';

defineProps({
  categoryMenuOpen: { type: Boolean, default: false },
  availableCategories: { type: Array, default: () => [] },
  tempCategoryIds: { type: Object, default: () => new Set() },
});

const emit = defineEmits([
  'close-category-menu',
  'toggle-category-selection',
  'save-categories',
]);
</script>

<template>
  <template v-if="categoryMenuOpen">
    <!-- Overlay to close on outside click -->
    <div class="fixed inset-0 z-40" @click="emit('close-category-menu')" />

    <!-- Popover -->
    <div
      class="absolute z-50 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 p-4 left-0 top-full"
    >
      <div class="flex justify-between items-center mb-3">
        <h4 class="font-semibold text-sm">Ajouter des catégories</h4>
        <button
          @click.stop="emit('close-category-menu')"
          class="text-slate-400 hover:text-slate-600"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <div class="mb-4">
        <div
          v-if="availableCategories.length === 0"
          class="text-xs text-slate-500 text-center py-2"
        >
          Toutes les catégories sont déjà assignées.
        </div>
        <div class="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
          <button
            v-for="cat in availableCategories"
            :key="cat.id"
            @click.stop="emit('toggle-category-selection', cat.id)"
            class="px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200"
            :class="tempCategoryIds.has(cat.id)
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50'"
          >
            {{ cat.name }}
          </button>
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
        <AppButton
          variant="outline"
          size="sm"
          @click.stop="emit('close-category-menu')"
        >
          Annuler
        </AppButton>
        <AppButton
          size="sm"
          @click.stop="emit('save-categories')"
          :disabled="tempCategoryIds.size === 0"
        >
          Ajouter ({{ tempCategoryIds.size }})
        </AppButton>
      </div>
    </div>
  </template>
</template>
