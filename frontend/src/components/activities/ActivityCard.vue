<script setup>
import {
  Activity as ActivityIcon,
  CircleCheck,
  CircleX,
  Pencil,
  Trash2,
  X,
} from 'lucide-vue-next';
import AppButton from '../AppButton.vue';
import { getActivityDocumentUrl } from '../../services/activityService';

const props = defineProps({
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
    class="group bg-white rounded-xl border transition-all duration-200 flex flex-col scroll-mt-32"
    :class="isExpanded ? 'border-blue-200 shadow-md' : 'border-slate-200 shadow-sm hover:shadow-md'"
  >
    <!-- Clickable header: icon, title, categories, description -->
    <div @click="emit('toggle', activity.id)" class="p-5 cursor-pointer flex flex-col">
      <div class="flex justify-between items-start gap-4 mb-3">
        <div class="p-2 bg-blue-50 rounded-lg text-blue-600">
          <ActivityIcon class="w-5 h-5" />
        </div>
        <div class="flex gap-1 transition-opacity lg:opacity-0 lg:group-hover:opacity-100">
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

      <h3 class="font-semibold text-slate-900 text-base break-words" :title="activity.title">
        {{ activity.title }}
      </h3>

      <!-- Category badges — deletable -->
      <div
        v-if="activity.categories?.length"
        class="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1"
      >
        <span
          v-for="cat in activity.categories"
          :key="cat.id"
          class="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-xl group/cat hover:bg-blue-100 transition-colors"
        >
          {{ cat.name }}
          <button
            @click.stop="emit('remove-category', activity, cat.id)"
            class="text-blue-400 hover:text-blue-600 opacity-0 group-hover/cat:opacity-100 transition-opacity focus:outline-none"
            title="Retirer la catégorie"
          >
            <X class="w-3 h-3" />
          </button>
        </span>
      </div>

      <!-- Description -->
      <div v-if="activity.description" class="mt-3 pt-3 border-t border-slate-100">
        <p class="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Description</p>
        <p
          class="text-sm text-slate-500 leading-relaxed"
          :class="isExpanded ? '' : 'line-clamp-2'"
        >
          {{ activity.description }}
        </p>
      </div>
    </div>

    <!-- Expanded: stats + category management -->
    <div
      v-if="isExpanded"
      class="px-5 pb-0 animate-in slide-in-from-top-2 duration-200"
    >
      <div class="pt-3 border-t border-slate-100">
        <!-- Stats -->
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-1">
            <span class="text-xs font-medium text-slate-500">Stages utilisant cet atelier</span>
            <span class="text-2xl font-bold text-blue-600">{{ activity.internshipCount }}</span>
          </div>
          <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-2">
            <span class="text-xs font-medium text-slate-500">Document</span>
            <div class="flex items-center gap-2">
              <CircleCheck v-if="activity.documentUrl" class="w-4 h-4 text-green-600 shrink-0" />
              <CircleX v-else class="w-4 h-4 text-slate-400 shrink-0" />
              <span
                class="text-sm font-medium"
                :class="activity.documentUrl ? 'text-green-600' : 'text-slate-400'"
              >
                {{ activity.documentUrl ? 'Disponible' : 'Aucun document' }}
              </span>
            </div>
          </div>
        </div>

        <span class="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-2 block">Catégories</span>

        <!-- Assigned category badges -->
        <div class="flex flex-wrap gap-1 mb-3 min-h-[28px]">
          <span
            v-for="cat in activity.categories"
            :key="cat.id"
            class="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-xl group/cat hover:bg-blue-100 transition-colors"
          >
            {{ cat.name }}
            <button
              @click.stop="emit('remove-category', activity, cat.id)"
              class="text-blue-400 hover:text-blue-600 opacity-0 group-hover/cat:opacity-100 transition-opacity focus:outline-none"
              title="Retirer la catégorie"
            >
              <X class="w-3 h-3" />
            </button>
          </span>
          <span v-if="!activity.categories?.length" class="text-xs text-slate-400 italic">
            Aucune catégorie
          </span>
        </div>

        <!-- Add category button + popover -->
        <div class="relative mb-3">
          <button
            @click.stop="emit('open-category-menu', activity)"
            class="w-full flex items-center justify-center gap-1.5 h-9 text-slate-500 border border-slate-300 rounded-md text-sm transition-colors hover:bg-slate-50"
          >
            + Ajouter une catégorie
          </button>

          <div
            v-if="categoryMenuOpen"
            class="fixed inset-0 z-40"
            @click="emit('close-category-menu')"
          />

          <div
            v-if="categoryMenuOpen"
            class="absolute z-50 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 p-4 left-0 top-full"
          >
            <div class="flex justify-between items-center mb-3">
              <h4 class="font-semibold text-sm">Ajouter des catégories</h4>
              <button @click.stop="emit('close-category-menu')" class="text-slate-400 hover:text-slate-600">
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
              <AppButton variant="outline" size="sm" @click.stop="emit('close-category-menu')">
                Annuler
              </AppButton>
              <AppButton
                size="sm"
                @click.stop="emit('save-categories', activity)"
                :disabled="tempCategoryIds.size === 0"
              >
                Ajouter ({{ tempCategoryIds.size }})
              </AppButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Documentation — always visible -->
    <div class="mx-5 mb-5 mt-3 pt-3 border-t border-slate-100">
      <p class="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-2">Documentation</p>

      <template v-if="activity.documentUrl">
        <div class="bg-green-50 border border-green-200 rounded-md px-3 py-2 flex items-center justify-between gap-2 mb-2">
          <span class="text-xs text-green-800 font-medium truncate">
            📄 {{ activity.documentUrl.split('-').slice(5).join('-') || activity.documentUrl }}
          </span>
          <div class="flex gap-1 shrink-0">
            <a
              v-if="activity.documentUrl.toLowerCase().endsWith('.pdf')"
              :href="getActivityDocumentUrl(activity.id)"
              target="_blank"
              class="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 whitespace-nowrap"
            >
              👁 Voir
            </a>
            <a
              :href="getActivityDocumentUrl(activity.id)"
              download
              class="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded hover:bg-slate-200"
            >
              ⬇
            </a>
            <button
              @click="emit('delete-document', activity.id)"
              class="text-xs text-red-600 bg-red-50 px-2 py-1 rounded hover:bg-red-100"
            >
              🗑
            </button>
          </div>
        </div>
        <label class="block border border-dashed border-slate-300 rounded-md p-2 text-center text-xs text-slate-400 cursor-pointer hover:border-slate-400 transition-colors">
          🔄 Remplacer
          <input type="file" class="hidden" @change="(e) => emit('upload-document', activity.id, e)" />
        </label>
      </template>

      <label
        v-else
        class="block border-2 border-dashed border-slate-200 rounded-md p-3 text-center text-xs text-slate-400 cursor-pointer hover:border-slate-300 transition-colors"
      >
        📎 Glisser un fichier ou <span class="text-blue-500 underline">parcourir</span><br />
        <span class="text-[10px]">PDF, DOCX, ODT… · max 10 MB</span>
        <input type="file" class="hidden" @change="(e) => emit('upload-document', activity.id, e)" />
      </label>
    </div>
  </div>
</template>
