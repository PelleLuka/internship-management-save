<script setup>
import { onMounted, ref, watch } from "vue";
import AppButton from "./AppButton.vue";
import AppDialog from "./AppDialog.vue";
import AppInput from "./AppInput.vue";
import { createActivity, getActivityById, getCategories, updateActivity } from "../services/activityService";

/**
 * Props definition.
 * @property {boolean} isOpen - Controls modal visibility.
 * @property {string|number} activityId - ID of activity to edit (null for creation).
 */
const props = defineProps({
	isOpen: Boolean,
	activityId: String
});

const emit = defineEmits(["close", "success"]);

const formData = ref({
	title: "",
	visible: true,
});

const description = ref('');
const selectedCategoryIds = ref([]);
const categories = ref([]);

const loading = ref(false);
const errors = ref({});

onMounted(async () => {
	categories.value = await getCategories();
});

const toggleCategory = (id) => {
	const idx = selectedCategoryIds.value.indexOf(id);
	if (idx === -1) selectedCategoryIds.value.push(id);
	else selectedCategoryIds.value.splice(idx, 1);
};

/**
 * Watcher: Loads activity data when editing.
 * Resets form when creating.
 */
watch(
	() => props.activityId,
	async (newId) => {
		if (newId && props.isOpen) {
			try {
				const data = await getActivityById(newId);
				formData.value = {
					title: data.title,
					visible: data.visible !== undefined ? data.visible : true,
				};
				description.value = data.description ?? '';
				selectedCategoryIds.value = data.categories?.map(c => c.id) ?? [];
                errors.value = {};
			} catch (error) {
				console.error("Failed to load activity", error);
			}
		} else {
			// Reset form
			formData.value = {
				title: "",
				visible: true,
			};
			description.value = '';
			selectedCategoryIds.value = [];
            errors.value = {};
		}
	},
	{ immediate: true },
);

/**
 * Validates the activity form data.
 * Checks title presence and length.
 *
 * @returns {boolean} True if valid, false otherwise.
 */
const validate = () => {
    errors.value = {};
    let isValid = true;

    if (!formData.value.title || formData.value.title.length < 3 || formData.value.title.length > 100) {
        errors.value.title = "Le titre doit avoir entre 3 et 100 caractères.";
        isValid = false;
    }

    return isValid;
};

/**
 * Handles form submission (Create or Update).
 */
const handleSubmit = async () => {
    if (!validate()) return;

	loading.value = true;
	try {
		const payload = {
			...formData.value,
			description: description.value,
			categoryIds: selectedCategoryIds.value,
		};
		if (props.activityId) {
			await updateActivity(props.activityId, payload);
		} else {
			await createActivity({
				...payload,
				id: crypto.randomUUID(),
			});
		}
		emit("success");
		emit("close");
	} catch (error) {
		console.error("Failed to save activity", error);
		const message = error.response?.data?.error || "Une erreur est survenue lors de l'enregistrement.";
		alert(message);
	} finally {
		loading.value = false;
	}
};
</script>

<template>
  <AppDialog
    :isOpen="isOpen"
    :title="activityId ? 'Modifier l\'activité' : 'Nouvelle activité'"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4" novalidate>
      <div class="space-y-2">
        <label for="activityTitle" class="text-sm font-medium text-slate-700">Titre</label>
        <AppInput
          id="activityTitle"
          v-model="formData.title"
          placeholder="Ex: Formation Vue.js"
          @update:model-value="errors.title = ''"
          :class="errors.title ? 'border-red-500 focus-visible:ring-red-500' : ''"
          required
        />
        <p v-if="errors.title" class="text-xs text-red-500">{{ errors.title }}</p>
      </div>

      <!-- Description -->
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

      <!-- Catégories -->
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
          <span v-if="!categories.length" class="text-xs text-slate-400 self-center">
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
