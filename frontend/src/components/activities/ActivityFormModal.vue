<script setup>
import { useActivityForm } from '../../composables/useActivityForm';
import AppButton from '../AppButton.vue';
import AppDialog from '../AppDialog.vue';
import AppInput from '../AppInput.vue';

const props = defineProps({
  isOpen: Boolean,
  activityId: String,
});

const emit = defineEmits(['close', 'success']);

const {
  formData,
  description,
  selectedCategoryIds,
  categories,
  errors,
  loading,
  toggleCategory,
  handleSubmit,
} = useActivityForm(props, emit);
</script>

<template>
  <AppDialog
    :isOpen="isOpen"
    :title="activityId ? 'Modifier l\'activité' : 'Nouvelle activité'"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4" novalidate>
      <div class="space-y-2">
        <label for="activityTitle" class="text-sm font-medium text-slate-700">
          Titre
        </label>
        <AppInput
          id="activityTitle"
          v-model="formData.title"
          placeholder="Ex: Formation Vue.js"
          @update:model-value="errors.title = ''"
          :class="errors.title ? 'border-red-500 focus-visible:ring-red-500' : ''"
          required
        />
        <p v-if="errors.title" class="text-xs text-red-500">
          {{ errors.title }}
        </p>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium text-slate-700">Description</label>
        <textarea
          v-model="description"
          rows="3"
          class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm
                 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2
                 focus-visible:ring-blue-500 resize-none"
          placeholder="Description de l'atelier..."
        />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium text-slate-700">Catégories</label>
        <div class="flex flex-wrap gap-2 min-h-[28px]">
          <button
            v-for="cat in categories"
            :key="cat.id"
            type="button"
            @click="toggleCategory(cat.id)"
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium transition-colors border',
              selectedCategoryIds.includes(cat.id)
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            ]"
          >
            {{ cat.name }}
          </button>
          <span
            v-if="!categories.length"
            class="text-xs text-slate-400 self-center"
          >
            Aucune catégorie — créez-en dans la page Catégories
          </span>
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-4">
        <AppButton type="button" variant="outline" @click="emit('close')">
          Annuler
        </AppButton>
        <AppButton type="submit" :disabled="loading">
          {{ loading ? "Enregistrement..." : "Enregistrer" }}
        </AppButton>
      </div>
    </form>
  </AppDialog>
</template>
