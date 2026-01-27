<script setup>
import { Calendar, Mail, Pencil, Trash2, Plus } from 'lucide-vue-next';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import AppButton from '../../AppButton.vue';

const props = defineProps({
  internship: { type: Object, required: true },
  expanded: { type: Boolean, default: false },
  activities: { type: Array, default: () => [] },
  activityMenuOpen: { type: Boolean, default: false },
  tempSelectedActivityIds: { type: Set, default: () => new Set() }
});

const emit = defineEmits([
  'toggle', 'edit', 'delete', 'remove-activity', 
  'open-activity-menu', 'close-activity-menu', 
  'toggle-activity-selection', 'save-activities'
]);

const formatDate = (dateStr) => {
  try {
    return format(new Date(dateStr), 'dd MMM yyyy', { locale: fr });
  } catch {
    return dateStr;
  }
};
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group relative">
    <!-- Card Header -->
    <div
      class="p-5 cursor-pointer rounded-t-xl flex-1"
      @click="emit('toggle', internship.id)"
    >
      <div class="flex justify-between items-start gap-4">
        <div class="min-w-0 flex-1">
          <h3
            class="font-semibold text-lg transition-colors"
            :class="[
              expanded ? 'text-blue-600 whitespace-normal break-words' : 'text-slate-900 [@media(hover:hover)]:group-hover:text-blue-600 truncate'
            ]"
          >
            {{ internship.firstName }} {{ internship.lastName }}
          </h3>
          <div class="flex items-center gap-2 text-sm text-slate-500 mt-1" :class="{ 'sm:truncate': !expanded }">
            <Mail class="w-3 h-3 shrink-0" />
            <span :class="[expanded ? 'whitespace-normal break-all' : 'truncate']">{{ internship.email }}</span>
          </div>
        </div>
        
        <!-- Desktop Hover Actions -->
        <!-- Actions (Edit/Delete) only appear when hovering the card group. -->
        <div
          class="flex gap-1 transition-opacity shrink-0"
          :class="[
            expanded 
              ? 'opacity-100 pointer-events-auto' 
              : 'opacity-0 pointer-events-none [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:pointer-events-auto'
          ]"
        >
          <button
            @click.stop="emit('edit', internship)"
            class="p-1.5 hover:bg-blue-50 text-blue-600 rounded-md transition-colors"
            :aria-label="'Modifier ' + internship.firstName + ' ' + internship.lastName"
          >
            <Pencil class="w-4 h-4" />
          </button>
          <button
            @click.stop="emit('delete', internship.id)"
            class="p-1.5 hover:bg-red-50 text-red-600 rounded-md transition-colors"
            :aria-label="'Supprimer ' + internship.firstName + ' ' + internship.lastName"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-1">
          <span class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Date de début</span>
          <div class="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <Calendar class="w-3.5 h-3.5 text-slate-400" />
            <span>{{ formatDate(internship.startDate) }}</span>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Date de fin</span>
          <div class="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <Calendar class="w-3.5 h-3.5 text-slate-400" />
            <span>{{ formatDate(internship.endDate) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Expanded Details -->
    <div
      v-if="expanded"
      class="px-5 pb-5 animate-in slide-in-from-top-2 duration-200"
    >
      <div class="space-y-3 border-t border-slate-100 pt-5">
        <div>
          <span class="text-slate-500 block text-xs mb-2 font-bold uppercase tracking-wider">Activités</span>

          <div class="flex flex-wrap gap-1 mb-3">
            <span
              v-for="activity in (internship.linkedActivities || [])"
              :key="activity.id"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 group/tag hover:bg-blue-100 transition-colors"
            >
              {{ activity.title }}
              <button
                @click.stop="emit('remove-activity', internship.id, activity.id)"
                class="ml-1.5 text-blue-400 hover:text-blue-600 focus:outline-none opacity-0 group-hover/tag:opacity-100 transition-opacity"
                title="Retirer l'activité"
              >
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
            <span
              v-if="(internship.linkedActivities || []).length === 0"
              class="text-xs text-slate-400 italic"
            >
              Aucune activité
            </span>
          </div>

          <div class="relative">
            <AppButton
              variant="outline"
              size="sm"
              class="w-full text-xs h-7 border-dashed"
              @click="emit('open-activity-menu', internship)"
            >
              <Plus class="w-3 h-3 mr-1" />
              Ajouter une activité
            </AppButton>

            <!-- Activity Selection Menu (Popover) -->
            <div
              v-if="activityMenuOpen"
              class="absolute z-50 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 p-4 left-0 top-full"
            >
              <div class="flex justify-between items-center mb-3">
                <h4 class="font-semibold text-sm">Ajouter des activités</h4>
                <button @click="emit('close-activity-menu')" class="text-slate-400 hover:text-slate-600">
                  <span class="sr-only">Fermer</span>
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div class="mb-4">
                <div
                  v-if="activities.filter(a => !(internship.activityIds || []).includes(a.id)).length === 0"
                  class="text-xs text-slate-500 text-center py-2"
                >
                  Toutes les activités sont déjà assignées.
                </div>
                <div class="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
                  <button
                    v-for="activity in activities.filter(a => !(internship.activityIds || []).includes(a.id))"
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
                <AppButton variant="outline" size="sm" @click="emit('close-activity-menu')">Annuler</AppButton>
                <AppButton
                  size="sm"
                  @click="emit('save-activities', internship.id)"
                  :disabled="tempSelectedActivityIds.size === 0"
                >
                  Ajouter ({{ tempSelectedActivityIds.size }})
                </AppButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
