<script setup>
import { ref } from 'vue';
import { useInternshipForm } from '../../composables/useInternshipForm';
import AppButton from '../AppButton.vue';
import AppDialog from '../AppDialog.vue';
import AppInput from '../AppInput.vue';

const props = defineProps({
  isOpen: Boolean,
  internshipId: String,
});

const emit = defineEmits(['close', 'success']);

const firstInputRef = ref(null);
const { formData, errors, isEditing, handleSubmit } = useInternshipForm(props, emit, firstInputRef);
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
            autofocus
          />
          <p v-if="errors.firstName" class="text-sm text-red-600 mt-1" role="alert">{{ errors.firstName }}</p>
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
          <p v-if="errors.lastName" class="text-sm text-red-600 mt-1" role="alert">{{ errors.lastName }}</p>
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
        <p v-if="errors.email" class="text-sm text-red-600 mt-1" role="alert">{{ errors.email }}</p>
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
          <p v-if="errors.startDate" class="text-sm text-red-600 mt-1" role="alert">{{ errors.startDate }}</p>
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
          <p v-if="errors.endDate" class="text-sm text-red-600 mt-1" role="alert">{{ errors.endDate }}</p>
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
