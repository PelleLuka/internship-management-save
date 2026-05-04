<script setup>
import { computed, onMounted, ref } from 'vue';
import { Pencil, Plus, Search, Tag, Trash2 } from 'lucide-vue-next';
import { useCategories } from '../composables/useCategories.js';
import AppButton from '../components/AppButton.vue';
import AppDialog from '../components/AppDialog.vue';
import AppInput from '../components/AppInput.vue';
import CategoryFormModal from '../components/CategoryFormModal.vue';

const { categories, load, create, update, remove } = useCategories();
onMounted(load);

const showForm = ref(false);
const editTarget = ref(null);
const cannotDeleteTarget = ref(null);
const searchQuery = ref('');

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value;
  const q = searchQuery.value.toLowerCase();
  return categories.value.filter(c =>
    c.name.toLowerCase().includes(q) ||
    (c.description ?? '').toLowerCase().includes(q),
  );
});

const openCreate = () => {
  editTarget.value = null;
  cannotDeleteTarget.value = null;
  showForm.value = true;
};

const openEdit = (cat) => {
  editTarget.value = cat;
  cannotDeleteTarget.value = null;
  showForm.value = true;
};

const handleSaved = async (formData) => {
  if (editTarget.value) {
    await update(editTarget.value.id, formData);
  } else {
    await create(formData);
  }
  showForm.value = false;
};

const handleDelete = async (cat) => {
  cannotDeleteTarget.value = null;
  try {
    await remove(cat.id);
  } catch {
    cannotDeleteTarget.value = cat;
  }
};
</script>

<template>
  <div class="w-full max-w-7xl mx-auto px-4 pb-12">
    <div class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-lg border border-slate-200 shadow-sm sticky top-8 z-40 mb-8">
      <h1 class="text-2xl font-bold text-slate-900">Catégories</h1>
      <div class="flex gap-3 w-full sm:w-auto">
        <div class="relative w-full sm:w-56">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <AppInput v-model="searchQuery" class="pl-9" placeholder="Rechercher..." />
        </div>
        <AppButton @click="openCreate">
          <Plus class="w-4 h-4 mr-2" />
          Nouvelle catégorie
        </AppButton>
      </div>
    </div>

    <AppDialog
      :isOpen="!!cannotDeleteTarget"
      title="Suppression impossible"
      @close="cannotDeleteTarget = null"
    >
      <p class="text-slate-600 text-sm">
        La catégorie <strong class="text-slate-900">« {{ cannotDeleteTarget?.name }} »</strong>
        ne peut pas être supprimée car des ateliers lui sont associés.
      </p>
      <p class="text-slate-500 text-sm mt-2">
        Retirez d'abord cette catégorie de tous les ateliers concernés, puis réessayez.
      </p>
      <div class="flex justify-end mt-4">
        <AppButton @click="cannotDeleteTarget = null">Fermer</AppButton>
      </div>
    </AppDialog>

    <!-- Empty state -->
    <div v-if="!filteredCategories.length" class="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 mb-4">
        <Tag class="w-6 h-6 text-blue-500" />
      </div>
      <h3 class="text-lg font-medium text-slate-900">Aucune catégorie</h3>
      <p class="text-slate-500 mt-1">Créez la première catégorie.</p>
    </div>

    <!-- Card grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="cat in filteredCategories"
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

    <CategoryFormModal
      :isOpen="showForm"
      :category="editTarget"
      @close="showForm = false"
      @saved="handleSaved"
    />
  </div>
</template>
