<script setup>
import { computed } from 'vue';
import AppButton from '../../AppButton.vue';

const props = defineProps({
  activityMenuOpen: { type: Boolean, default: false },
  activities: { type: Array, default: () => [] },
  internship: { type: Object, required: true },
  tempSelectedActivityIds: { type: Set, default: () => new Set() },
});

const emit = defineEmits([
  'close-activity-menu',
  'toggle-activity-selection',
  'save-activities',
]);

const availableActivities = computed(() =>
  props.activities.filter(
    (a) => !(props.internship.activityIds || []).includes(a.id),
  ),
);
</script>

<template>
  <div
    v-if="activityMenuOpen"
    class="absolute z-50 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 p-4 left-0 top-full"
  >
    <div class="flex justify-between items-center mb-3">
      <h4 class="font-semibold text-sm">Ajouter des activités</h4>
      <button
        @click="emit('close-activity-menu')"
        class="text-slate-400 hover:text-slate-600"
      >
        <span class="sr-only">Fermer</span>
        <svg
          class="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <div class="mb-4">
      <div
        v-if="availableActivities.length === 0"
        class="text-xs text-slate-500 text-center py-2"
      >
        Toutes les activités sont déjà assignées.
      </div>
      <div class="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
        <button
          v-for="activity in availableActivities"
          :key="activity.id"
          @click="emit('toggle-activity-selection', activity.id)"
          class="px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200"
          :class="tempSelectedActivityIds.has(activity.id)
            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
            : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50'"
        >
          {{ activity.title }}
        </button>
      </div>
    </div>

    <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
      <AppButton
        variant="outline"
        size="sm"
        @click="emit('close-activity-menu')"
      >
        Annuler
      </AppButton>
      <AppButton
        size="sm"
        @click="emit('save-activities', internship.id)"
        :disabled="tempSelectedActivityIds.size === 0"
      >
        Ajouter ({{ tempSelectedActivityIds.size }})
      </AppButton>
    </div>
  </div>
</template>
