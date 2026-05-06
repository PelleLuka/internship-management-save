<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Calendar, Mail, Pencil, Plus, Printer, Trash2 } from 'lucide-vue-next';
import { useInternshipStatus } from '../../../composables/useInternshipStatus';
import AppButton from '../../AppButton.vue';
import InternshipActivityPopover from './InternshipActivityPopover.vue';

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

const router = useRouter();

const internshipRef = computed(() => props.internship);
const { statusConfig, formatDate } = useInternshipStatus(internshipRef);

const handleCertificate = () => router.push(`/certificate/${props.internship.id}`);
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
          <div class="flex items-center justify-between gap-2">
            <h3
              class="font-semibold text-lg transition-colors"
              :class="[
                expanded ? 'text-blue-600 whitespace-normal break-words' : 'text-slate-900 [@media(hover:hover)]:group-hover:text-blue-600 truncate'
              ]"
            >
              {{ internship.firstName }} {{ internship.lastName }}
            </h3>
            <span :class="['inline-flex items-center gap-1.5 px-3 py-1 rounded-full shrink-0 text-xs font-semibold whitespace-nowrap', statusConfig.classes]">
              <span class="w-2 h-2 rounded-full bg-current shrink-0"></span>
              {{ statusConfig.label }}
            </span>
          </div>
          <div class="flex items-center gap-2 text-sm text-slate-500 mt-2" :class="{ 'sm:truncate': !expanded }">
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
            @click.stop="handleCertificate"
            class="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"
            title="Aperçu du certificat"
          >
            <Printer class="w-4 h-4" />
          </button>
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

            <InternshipActivityPopover
              :activity-menu-open="activityMenuOpen"
              :activities="activities"
              :internship="internship"
              :temp-selected-activity-ids="tempSelectedActivityIds"
              @close-activity-menu="emit('close-activity-menu')"
              @toggle-activity-selection="(id) => emit('toggle-activity-selection', id)"
              @save-activities="(id) => emit('save-activities', id)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
