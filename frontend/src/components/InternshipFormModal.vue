<script setup>
import { computed, ref, watch } from "vue";
import AppButton from "./AppButton.vue";
import AppDialog from "./AppDialog.vue";
import AppInput from "./AppInput.vue";
import { createInternship, getInternshipById, updateInternship } from "../services/internshipService";
import { nextTick } from "vue";

/**
 * Props definition.
 * @property {boolean} isOpen - Controls visibility of the modal.
 * @property {string|number} internshipId - ID of the internship to edit (null for creation).
 */
const props = defineProps({
  isOpen: Boolean,
  internshipId: String
});

const emit = defineEmits(["close", "success"]);

const formData = ref({
	firstName: "",
	lastName: "",
	email: "",
	startDate: "",
	endDate: "",
});

const firstInputRef = ref(null);

const isLoading = ref(false);
const isEditing = computed(() => !!props.internshipId);

/**
 * Watcher: Resets or populates form data when modal opens.
 * If editing, fetches existing data.
 * If creating, clears the form.
 */
watch(
	() => props.isOpen,
	async (isOpen) => {
		if (isOpen) {
			if (props.internshipId) {
				isLoading.value = true;
				try {
					const data = await getInternshipById(props.internshipId);
					formData.value = {
						firstName: data.firstName,
						lastName: data.lastName,
						email: data.email,
						startDate: data.startDate?.split('T')[0] || "",
						endDate: data.endDate?.split('T')[0] || "",
					};
                    errors.value = {}; // Reset errors
				} catch (error) {
					console.error("Failed to fetch internship", error);
				} finally {
					isLoading.value = false;
				}
			} else {
				formData.value = {
					firstName: "",
					lastName: "",
					email: "",
					startDate: "",
					endDate: "",
				};
                errors.value = {}; // Reset errors
			}
            
            nextTick(() => {
                if (firstInputRef.value?.$el) {
                    firstInputRef.value.$el.focus();
                } else if (firstInputRef.value && typeof firstInputRef.value.focus === 'function') {
                     firstInputRef.value.focus();
                }
            });
		}
	},
    { immediate: true }
);

const errors = ref({});

/**
 * Validates the form data locally before sending to API.
 * 
 * Rules:
 * - First/Last Name: Required, 1-50 chars.
 * - Email: Regex pattern match.
 * - Dates: Required, Start Date must be before End Date.
 * 
 * @returns {boolean} True if valid. Populates 'errors' ref if invalid.
 */
const validate = () => {
    errors.value = {};
    let isValid = true;

    // Check Name fields
    if (!formData.value.firstName || formData.value.firstName.length < 1 || formData.value.firstName.length > 50) {
        errors.value.firstName = "Le prénom doit avoir entre 1 et 50 caractères.";
        isValid = false;
    }

    if (!formData.value.lastName || formData.value.lastName.length < 1 || formData.value.lastName.length > 50) {
        errors.value.lastName = "Le nom doit avoir entre 1 et 50 caractères.";
        isValid = false;
    }

    // Check Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.value.email || !emailRegex.test(formData.value.email)) {
        errors.value.email = "Veuillez entrer une adresse email valide.";
        isValid = false;
    }

    // Check Dates
    if (!formData.value.startDate) {
        errors.value.startDate = "La date de début est requise.";
        isValid = false;
    }

    if (!formData.value.endDate) {
        errors.value.endDate = "La date de fin est requise.";
        isValid = false;
    }

    // Date Logic Consistency
    if (formData.value.startDate && formData.value.endDate) {
        if (new Date(formData.value.startDate) > new Date(formData.value.endDate)) {
            errors.value.endDate = "La date de fin doit être égale ou postérieure à la date de début.";
            isValid = false;
        }
    }

    return isValid;
};

/**
 * Handles form submission.
 * Calls create or update service based on `isEditing`.
 * Emits 'success' to refresh parent list and 'close' to shut modal.
 */
const handleSubmit = async () => {
    if (!validate()) return;

	try {
        // ... (rest of logic)
		if (isEditing.value && props.internshipId) {
			await updateInternship(props.internshipId, {
				...formData.value,
			});
		} else {
			await createInternship({
				...formData.value,
				activityIds: [],
			});
		}
		emit("success");
		emit("close");
	} catch (error) {
		console.error("Failed to save internship", error);
		const message = error.response?.data?.error || "Une erreur est survenue lors de l'enregistrement.";
		alert(message);
	}
};
</script>

<template>
  <AppDialog :isOpen="isOpen" :title="isEditing ? 'Modifier le stagiaire' : 'Nouveau stagiaire'" @close="$emit('close')">
    <form @submit.prevent="handleSubmit" class="space-y-4" novalidate>
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <label for="firstName" class="text-sm font-medium">Prénom</label>
          <AppInput
            id="firstName"
            v-model="formData.firstName"
            @update:model-value="errors.firstName = ''"
            :class="errors.firstName ? 'border-red-500 focus-visible:ring-red-500' : ''"
            required
            ref="firstInputRef"
          />
          <p v-if="errors.firstName" class="text-xs text-red-500">{{ errors.firstName }}</p>
        </div>
        <div class="space-y-2">
          <label for="lastName" class="text-sm font-medium">Nom</label>
          <AppInput
            id="lastName"
            v-model="formData.lastName"
            @update:model-value="errors.lastName = ''"
            :class="errors.lastName ? 'border-red-500 focus-visible:ring-red-500' : ''"
            required
          />
          <p v-if="errors.lastName" class="text-xs text-red-500">{{ errors.lastName }}</p>
        </div>
      </div>

      <div class="space-y-2">
        <label for="email" class="text-sm font-medium">Email</label>
        <AppInput
          id="email"
          type="email"
          v-model="formData.email"
          @update:model-value="errors.email = ''"
          :class="errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''"
          required
        />
        <p v-if="errors.email" class="text-xs text-red-500">{{ errors.email }}</p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <label for="startDate" class="text-sm font-medium">Date de début</label>
          <AppInput
            id="startDate"
            type="date"
            v-model="formData.startDate"
            @update:model-value="errors.startDate = ''"
            :class="errors.startDate ? 'border-red-500 focus-visible:ring-red-500' : ''"
            required
          />
          <p v-if="errors.startDate" class="text-xs text-red-500">{{ errors.startDate }}</p>
        </div>
        <div class="space-y-2">
          <label for="endDate" class="text-sm font-medium">Date de fin</label>
          <AppInput
            id="endDate"
            type="date"
            v-model="formData.endDate"
            @update:model-value="errors.endDate = ''"
            :class="errors.endDate ? 'border-red-500 focus-visible:ring-red-500' : ''"
            required
          />
          <p v-if="errors.endDate" class="text-xs text-red-500">{{ errors.endDate }}</p>
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-4">
        <AppButton type="button" variant="outline" @click="$emit('close')">
          Annuler
        </AppButton>
        <AppButton type="submit">
          {{ isEditing ? 'Mettre à jour' : 'Créer' }}
        </AppButton>
      </div>
    </form>
  </AppDialog>
</template>
