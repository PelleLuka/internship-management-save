<script setup>
import { ref, onMounted } from 'vue';
import { Plus, Pencil, Trash2 } from 'lucide-vue-next';
import { useCategories } from '../composables/useCategories.js';
import AppButton from '../components/AppButton.vue';
import AppDialog from '../components/AppDialog.vue';
import AppInput from '../components/AppInput.vue';

const { categories, load, create, update, remove } = useCategories();
onMounted(load);

const showForm = ref(false);
const editTarget = ref(null);
const form = ref({ name: '', description: '' });
const deleteError = ref('');

const openCreate = () => {
  editTarget.value = null;
  form.value = { name: '', description: '' };
  deleteError.value = '';
  showForm.value = true;
};

const openEdit = (cat) => {
  editTarget.value = cat;
  form.value = { name: cat.name, description: cat.description ?? '' };
  deleteError.value = '';
  showForm.value = true;
};

const submit = async () => {
  if (editTarget.value) {
    await update(editTarget.value.id, form.value);
  } else {
    await create(form.value);
  }
  showForm.value = false;
};

const handleDelete = async (cat) => {
  deleteError.value = '';
  try {
    await remove(cat.id);
  } catch (err) {
    deleteError.value = `Impossible de supprimer "${cat.name}" : des ateliers y sont liés.`;
  }
};
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-slate-900">Catégories</h1>
      <AppButton @click="openCreate">
        <Plus class="w-4 h-4 mr-2" />
        Nouvelle catégorie
      </AppButton>
    </div>

    <div v-if="deleteError"
      class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
      {{ deleteError }}
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div v-if="!categories.length" class="p-8 text-center text-slate-400 text-sm">
        Aucune catégorie — créez la première.
      </div>
      <div
        v-for="(cat, i) in categories"
        :key="cat.id"
        :class="['flex items-center justify-between px-4 py-3',
                 i < categories.length - 1 ? 'border-b border-slate-100' : '']"
      >
        <div>
          <div class="font-semibold text-sm text-slate-900">{{ cat.name }}</div>
          <div class="text-xs text-slate-400">
            {{ cat.activityCount }} atelier{{ cat.activityCount !== 1 ? 's' : '' }} lié{{ cat.activityCount !== 1 ? 's' : '' }}
          </div>
        </div>
        <div class="flex gap-2">
          <button
            @click="openEdit(cat)"
            class="p-2 rounded-md hover:bg-blue-50 text-blue-600 transition-colors"
            aria-label="Modifier"
          >
            <Pencil class="w-4 h-4" />
          </button>
          <button
            @click="handleDelete(cat)"
            :disabled="cat.activityCount > 0"
            :class="['p-2 rounded-md transition-colors',
                     cat.activityCount > 0
                       ? 'text-slate-300 cursor-not-allowed'
                       : 'hover:bg-red-50 text-red-600']"
            :aria-label="cat.activityCount > 0 ? 'Suppression impossible (ateliers liés)' : 'Supprimer'"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <AppDialog
      :isOpen="showForm"
      @close="showForm = false"
      :title="editTarget ? 'Modifier la catégorie' : 'Nouvelle catégorie'"
    >
      <form @submit.prevent="submit" class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-700">Nom *</label>
          <AppInput v-model="form.name" placeholder="ex: Développement" required />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-700">Description</label>
          <textarea
            v-model="form.description"
            rows="2"
            class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 resize-none"
            placeholder="Description optionnelle..."
          />
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <AppButton type="button" variant="outline" @click="showForm = false">Annuler</AppButton>
          <AppButton type="submit">{{ editTarget ? 'Enregistrer' : 'Créer' }}</AppButton>
        </div>
      </form>
    </AppDialog>
  </div>
</template>
