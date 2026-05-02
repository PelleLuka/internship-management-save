<script setup>
import { ref, onMounted } from 'vue';
import { Plus, Pencil, Trash2, Tag } from 'lucide-vue-next';
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
  <div class="w-full max-w-7xl mx-auto px-4 pb-12">
    <div class="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm sticky top-8 z-40 mb-8">
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

    <!-- Empty state -->
    <div v-if="!categories.length" class="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 mb-4">
        <Tag class="w-6 h-6 text-blue-500" />
      </div>
      <h3 class="text-lg font-medium text-slate-900">Aucune catégorie</h3>
      <p class="text-slate-500 mt-1">Créez la première catégorie.</p>
    </div>

    <!-- Card grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col gap-3"
      >
        <div class="flex justify-between items-start gap-4">
          <div class="p-2 bg-blue-50 rounded-lg text-blue-600 shrink-0">
            <Tag class="w-5 h-5" />
          </div>
          <div class="flex gap-1 shrink-0">
            <button
              @click="openEdit(cat)"
              class="p-2 hover:bg-blue-50 text-blue-600 rounded-md transition-colors"
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

        <div>
          <h3 class="font-semibold text-slate-900">{{ cat.name }}</h3>
          <p v-if="cat.description" class="text-sm text-slate-500 mt-1 line-clamp-2">{{ cat.description }}</p>
        </div>

        <div class="mt-auto pt-2 border-t border-slate-100">
          <span class="text-xs text-slate-400">
            {{ cat.activityCount }} atelier{{ cat.activityCount !== 1 ? 's' : '' }} lié{{ cat.activityCount !== 1 ? 's' : '' }}
          </span>
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
