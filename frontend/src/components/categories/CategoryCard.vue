<script setup>
import { Pencil, Tag, Trash2 } from 'lucide-vue-next';

defineProps({
  category: { type: Object, required: true },
});

const emit = defineEmits(['edit', 'delete']);
</script>

<template>
  <div
    class="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col gap-3"
  >
    <div class="flex justify-between items-start gap-4">
      <div class="p-2 bg-blue-50 rounded-lg text-blue-600 shrink-0">
        <Tag class="w-5 h-5" />
      </div>
      <div class="flex gap-1 shrink-0">
        <button
          @click="emit('edit', category)"
          class="p-2 hover:bg-blue-50 text-blue-600 rounded-md transition-colors"
          aria-label="Modifier"
        >
          <Pencil class="w-4 h-4" />
        </button>
        <button
          @click="emit('delete', category)"
          :disabled="category.activityCount > 0"
          :class="['p-2 rounded-md transition-colors',
                   category.activityCount > 0
                     ? 'text-slate-300 cursor-not-allowed'
                     : 'hover:bg-red-50 text-red-600']"
          :aria-label="category.activityCount > 0 ? 'Suppression impossible (ateliers liés)' : 'Supprimer'"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div>
      <h3 class="font-semibold text-slate-900">{{ category.name }}</h3>
      <p
        v-if="category.description"
        class="text-sm text-slate-500 mt-1 line-clamp-2"
      >
        {{ category.description }}
      </p>
    </div>

    <div class="mt-auto pt-2 border-t border-slate-100">
      <span class="text-xs text-slate-400">
        {{ category.activityCount }}atelier
        {{ category.activityCount !== 1 ? 's' : '' }}lié
        {{ category.activityCount !== 1 ? 's' : '' }}
      </span>
    </div>
  </div>
</template>
