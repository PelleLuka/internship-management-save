<script setup>
import { Calendar, Pencil, Plus, Printer, Trash2 } from 'lucide-vue-next';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useInternshipStatus } from '../../../composables/useInternshipStatus';
import AppButton from '../../AppButton.vue';

const props = defineProps({
  internship: { type: Object, required: true },
  expanded: { type: Boolean, default: false },
  activities: { type: Array, default: () => [] },
  activityMenuOpen: { type: Boolean, default: false },
  tempSelectedActivityIds: { type: Set, default: () => new Set() },
});

const emit = defineEmits([
  'toggle',
  'edit',
  'delete',
  'remove-activity',
  'open-activity-menu',
  'close-activity-menu',
  'toggle-activity-selection',
  'save-activities',
]);

const router = useRouter();

const internshipRef = computed(() => props.internship);
const { statusConfig, formatDate } = useInternshipStatus(internshipRef);

const handleCertificate = () =>
  router.push(`/certificate/${props.internship.id}`);
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200 shadow-sm relative">
    <!-- Top-right action buttons (always visible on mobile — no hover).
         The title row reserves space via pr-32 so the name never slides
         under the buttons. -->
    <div class="absolute top-3 right-3 flex gap-2 z-10">
      <button
        @click.stop="handleCertificate"
        class="p-2 bg-slate-50 text-slate-600 rounded-lg active:scale-95 transition-transform"
        title="Aperçu du certificat"
        :aria-label="'Aperçu du certificat'"
      >
        <Printer class="w-4 h-4" />
      </button>
      <button
        @click.stop="emit('edit', internship)"
        class="p-2 bg-blue-50 text-blue-600 rounded-lg active:scale-95 transition-transform"
        :aria-label="'Modifier ' + internship.firstName"
      >
        <Pencil class="w-4 h-4" />
      </button>
      <button
        @click.stop="emit('delete', internship.id)"
        class="p-2 bg-red-50 text-red-600 rounded-lg active:scale-95 transition-transform"
        :aria-label="'Supprimer ' + internship.firstName"
      >
        <Trash2 class="w-4 h-4" />
      </button>
    </div>

    <!-- Card Header -->
    <div
      class="p-4 cursor-pointer rounded-t-xl"
      @click="emit('toggle', internship.id)"
    >
      <h3
        class="font-semibold text-base transition-colors truncate pr-32"
        :class="[expanded ? 'text-blue-600' : 'text-slate-900']"
      >
        {{ internship.firstName }}
        {{ internship.lastName }}
      </h3>
      <div class="text-xs text-slate-500 mt-2 break-all">
        {{ internship.email }}
      </div>
      <span
        :class="['inline-flex items-center gap-1.5 px-3 py-1 rounded-full shrink-0 text-xs font-semibold whitespace-nowrap mt-2', statusConfig.classes]"
      >
        <span class="w-2 h-2 rounded-full bg-current shrink-0"></span>
        {{ statusConfig.label }}
      </span>

      <div class="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
        <div class="flex flex-col gap-1">
          <span
            class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold"
            >Début</span
          >
          <div
            class="flex items-center gap-1 text-xs font-medium text-slate-600"
          >
            <Calendar class="w-3 h-3 text-slate-400" />
            <span>{{ formatDate(internship.startDate) }}</span>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <span
            class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold"
            >Fin</span
          >
          <div
            class="flex items-center gap-1 text-xs font-medium text-slate-600"
          >
            <Calendar class="w-3 h-3 text-slate-400" />
            <span>{{ formatDate(internship.endDate) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Expanded Details -->
    <div
      v-if="expanded"
      class="px-4 pb-4 animate-in slide-in-from-top-2 duration-200"
    >
      <div class="space-y-3 border-t border-slate-100 pt-3">
        <div>
          <span
            class="text-slate-500 block text-xs mb-2 font-bold uppercase tracking-wider"
            >Activités</span
          >

          <div class="flex flex-wrap gap-1 mb-3">
            <span
              v-for="activity in (internship.linkedActivities || [])"
              :key="activity.id"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
            >
              {{ activity.title }}
              <button
                @click.stop="emit('remove-activity', internship.id, activity.id)"
                class="ml-2 text-blue-400 active:text-blue-700"
              >
                ×
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
              class="w-full text-xs h-8 border-dashed"
              @click="emit('open-activity-menu', internship)"
            >
              <Plus class="w-3 h-3 mr-1" />
              Ajouter une activité
            </AppButton>

            <!-- Activity Selection Menu (Simplified for Mobile) -->
            <div
              v-if="activityMenuOpen"
              class="fixed inset-0 z-[100] bg-white p-4 flex flex-col animate-in fade-in duration-200"
              @click.stop
            >
              <h4 class="font-bold text-lg mb-4">Ajouter des activités</h4>

              <div class="flex-1 overflow-y-auto mb-4">
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="activity in activities.filter(a => !(internship.activityIds || []).includes(a.id))"
                    :key="activity.id"
                    @click="emit('toggle-activity-selection', activity.id)"
                    class="px-4 py-3 rounded-xl text-sm font-medium border w-full text-left transition-all"
                    :class="tempSelectedActivityIds.has(activity.id) 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-slate-600 border-slate-200'"
                  >
                    {{ activity.title }}
                  </button>
                </div>
              </div>

              <div class="flex gap-3 pt-4 border-t border-slate-100 mt-auto">
                <AppButton
                  class="flex-1"
                  variant="outline"
                  @click="emit('close-activity-menu')"
                >
                  Fermer
                </AppButton>
                <AppButton
                  class="flex-1"
                  @click="emit('save-activities', internship.id)"
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
