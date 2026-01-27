<script setup>
import { ref, watch } from "vue";
import AppButton from "./AppButton.vue";
import AppDialog from "./AppDialog.vue";
import AppInput from "./AppInput.vue";
import { createActivity, getActivityById, updateActivity } from "../services/activityService";

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

const loading = ref(false);
const errors = ref({});

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
		if (props.activityId) {
			await updateActivity(props.activityId, formData.value);
		} else {
			await createActivity({
				...formData.value,
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
