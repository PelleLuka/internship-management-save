<script setup>
import {
  Activity as ActivityIcon,
  Download,
  Eye,
  FileText,
  Paperclip,
  Pencil,
  RefreshCw,
  Trash2,
} from 'lucide-vue-next';
import {
  extractOriginalName,
  getActivityDocumentUrl,
} from '../../services/activityService';
import ActivityCategoryBadge from './ActivityCategoryBadge.vue';
import ActivityCategoryPopover from './ActivityCategoryPopover.vue';

defineProps({
  activity: { type: Object, required: true },
  isExpanded: { type: Boolean, default: false },
  categoryMenuOpen: { type: Boolean, default: false },
  tempCategoryIds: { type: Object, default: () => new Set() },
  availableCategories: { type: Array, default: () => [] },
});

const emit = defineEmits([
  'toggle',
  'edit',
  'delete',
  'remove-category',
  'open-category-menu',
  'close-category-menu',
  'toggle-category-selection',
  'save-categories',
  'upload-document',
  'delete-document',
]);
</script>

<template>
  <div
    class="group bg-white rounded-xl border transition-all duration-200 flex flex-col scroll-mt-32 cursor-pointer"
    :class="isExpanded ? 'border-blue-200 shadow-md' : 'border-slate-200 shadow-sm hover:shadow-md'"
    data-testid="activity-card"
    @click="emit('toggle', activity.id)"
  >
    <!-- Header: icon + actions / title / non-removable badges / separator / description -->
    <div class="p-5">
      <div class="flex justify-between items-start gap-4 mb-3">
        <div class="p-2 bg-blue-50 rounded-lg text-blue-600">
          <ActivityIcon class="w-5 h-5" />
        </div>
        <div
          class="flex gap-1 transition-opacity lg:opacity-0 lg:group-hover:opacity-100"
        >
          <button
            @click.stop="emit('edit', activity.id)"
            class="p-2 hover:bg-blue-50 text-blue-600 rounded-md transition-colors"
            :aria-label="'Modifier ' + activity.title"
            :data-testid="'edit-activity-' + activity.title"
          >
            <Pencil class="w-4 h-4" />
          </button>
          <button
            @click.stop="emit('delete', activity.id)"
            :disabled="activity.internshipCount > 0"
            :class="['p-2 rounded-md transition-colors',
                     activity.internshipCount > 0
                       ? 'text-slate-300 cursor-not-allowed'
                       : 'hover:bg-red-50 text-red-600']"
            :aria-label="activity.internshipCount > 0
              ? 'Suppression impossible (atelier lié à des stagiaires)'
              : 'Supprimer ' + activity.title"
            :data-testid="'delete-activity-' + activity.title"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>

      <h3
        class="font-semibold text-slate-900 text-base break-words"
        :title="activity.title"
      >
        {{ activity.title }}
      </h3>

      <!-- Non-removable category tags below the title -->
      <div v-if="activity.categories?.length" class="mt-2 flex flex-wrap gap-1">
        <ActivityCategoryBadge
          v-for="cat in activity.categories"
          :key="cat.id"
          :category="cat"
        />
      </div>

      <!-- Separator -->
      <hr class="my-4 border-slate-100" />

      <!-- Description -->
      <p
        class="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1"
      >
        Description
      </p>
      <p
        class="text-sm text-slate-500 leading-relaxed"
        :class="isExpanded ? '' : 'line-clamp-2'"
      >
        {{ activity.description || '—' }}
      </p>
    </div>

    <!-- Expanded sections: Documentation + Categories management -->
    <div
      v-if="isExpanded"
      class="px-5 pb-5 animate-in slide-in-from-top-2 duration-200"
      @click.stop
    >
      <hr class="border-slate-100 mb-4" />

      <!-- Documentation block -->
      <p
        class="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-2"
      >
        Documentation
      </p>
      <template v-if="activity.documentUrl">
        <div
          class="bg-green-50 border border-green-200 rounded-md px-3 py-2 flex items-center justify-between gap-2 mb-2"
        >
          <span
            class="flex items-center gap-1.5 min-w-0 text-xs text-green-800 font-medium"
          >
            <FileText class="w-4 h-4 shrink-0" />
            <span class="truncate"
              >{{ extractOriginalName(activity.documentUrl) }}</span
            >
          </span>
          <div class="flex gap-1 shrink-0">
            <a
              v-if="activity.documentUrl.toLowerCase().endsWith('.pdf')"
              :href="getActivityDocumentUrl(activity.id)"
              target="_blank"
              class="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 whitespace-nowrap"
              aria-label="Voir le document"
            >
              <Eye class="w-3.5 h-3.5" />
            </a>
            <a
              :href="getActivityDocumentUrl(activity.id)"
              download
              class="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded hover:bg-slate-200"
              aria-label="Télécharger le document"
            >
              <Download class="w-3.5 h-3.5" />
            </a>
            <button
              @click.stop="emit('delete-document', activity.id)"
              class="inline-flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded hover:bg-red-100"
              aria-label="Supprimer le document"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <label
          class="block border border-dashed border-slate-300 rounded-md p-2 text-center text-xs text-slate-400 cursor-pointer hover:border-slate-400 transition-colors"
        >
          <RefreshCw class="w-3.5 h-3.5 inline -mt-0.5 mr-1" />
          Remplacer
          <input
            type="file"
            class="hidden"
            @change="(e) => emit('upload-document', activity.id, e)"
          />
        </label>
      </template>
      <label
        v-else
        class="block border-2 border-dashed border-slate-200 rounded-md p-3 text-center text-xs text-slate-400 cursor-pointer hover:border-slate-300 transition-colors"
      >
        <Paperclip class="w-4 h-4 inline -mt-1 mr-1" />
        Glisser un fichier ou
        <span class="text-blue-500 underline">parcourir</span>
        <br />
        <span class="text-[10px]">PDF, DOCX, ODT… · max 10 MB</span>
        <input
          type="file"
          class="hidden"
          @change="(e) => emit('upload-document', activity.id, e)"
        />
      </label>

      <hr class="my-4 border-slate-100" />

      <!-- Categories management block -->
      <p
        class="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-2"
      >
        Catégories
      </p>
      <div class="flex flex-wrap gap-1 mb-3 min-h-[28px]">
        <ActivityCategoryBadge
          v-for="cat in activity.categories"
          :key="cat.id"
          :category="cat"
          removable
          @remove="(catId) => emit('remove-category', activity, catId)"
        />
        <span
          v-if="!activity.categories?.length"
          class="text-xs text-slate-400 italic"
        >
          Aucune catégorie
        </span>
      </div>

      <div class="relative">
        <button
          @click.stop="emit('open-category-menu', activity)"
          class="w-full flex items-center justify-center gap-1.5 h-9 text-slate-500 border border-slate-300 rounded-md text-sm transition-colors hover:bg-slate-50"
        >
          + Ajouter une catégorie
        </button>

        <ActivityCategoryPopover
          :category-menu-open="categoryMenuOpen"
          :available-categories="availableCategories"
          :temp-category-ids="tempCategoryIds"
          @close-category-menu="emit('close-category-menu')"
          @toggle-category-selection="(id) => emit('toggle-category-selection', id)"
          @save-categories="emit('save-categories', activity)"
        />
      </div>
    </div>
  </div>
</template>
