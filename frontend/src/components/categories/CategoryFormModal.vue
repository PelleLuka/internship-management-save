<script setup>
import { computed, ref, watch } from 'vue';
import AppButton from '../AppButton.vue';
import AppDialog from '../AppDialog.vue';
import AppInput from '../AppInput.vue';

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  category: { type: Object, default: null },
});

const emit = defineEmits(['close', 'saved']);

const form = ref({ name: '', description: '' });

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      form.value = {
        name: props.category?.name ?? '',
        description: props.category?.description ?? '',
      };
    }
  },
);

const title = computed(() =>
  props.category ? 'Modifier la catégorie' : 'Nouvelle catégorie',
);

const submit = () => {
  emit('saved', { ...form.value });
};
</script>

<template>
  <AppDialog :isOpen="isOpen" :title="title" @close="emit('close')">
    <form @submit.prevent="submit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">
          Nom *
        </label>
        <AppInput
          v-model="form.name"
          placeholder="ex: Développement"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">
          Description
        </label>
        <textarea
          v-model="form.description"
          rows="3"
          placeholder="Description optionnelle"
          class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <AppButton type="button" variant="outline" @click="emit('close')">
          Annuler
        </AppButton>
        <AppButton type="submit">
          {{ category ? 'Enregistrer' : 'Créer' }}
        </AppButton>
      </div>
    </form>
  </AppDialog>
</template>
