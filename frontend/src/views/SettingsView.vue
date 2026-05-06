<script setup>
import { ref } from 'vue';
import AppButton from '../components/AppButton.vue';
import {
  downloadCertificateTemplate,
  uploadCertificateTemplate,
} from '../services/certificateService.js';

const uploading = ref(false);
const message = ref('');

const carboneTags = [
  '{d.prenom}',
  '{d.nom}',
  '{d.date_debut}',
  '{d.date_fin}',
  '{d.date_emission}',
  '{d.ateliers[i].titre} / {d.ateliers[i+1].titre}',
];

const handleUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  uploading.value = true;
  message.value = '';
  try {
    await uploadCertificateTemplate(file);
    message.value = 'Modèle uploadé avec succès.';
  } catch {
    message.value = "Erreur lors de l'upload.";
  } finally {
    uploading.value = false;
  }
};
</script>

<template>
  <div class="p-6 max-w-xl mx-auto">
    <h1 class="text-2xl font-bold text-slate-900 mb-6">Paramètres</h1>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-900 mb-1">
        Modèle de certificat
      </h2>
      <p class="text-sm text-slate-500 mb-2">
        Uploadez un fichier <strong>.docx</strong>&nbsp;avec les balises Carbone
        suivantes :
      </p>
      <ul class="text-sm text-slate-500 mb-4 list-disc list-inside space-y-1">
        <li v-for="tag in carboneTags" :key="tag">
          <code class="text-blue-600 bg-blue-50 px-1 rounded">{{ tag }}</code>
        </li>
      </ul>

      <div class="flex flex-col gap-3">
        <label class="cursor-pointer">
          <span
            class="inline-flex items-center justify-center h-10 px-4 py-2 rounded-md font-medium
                   bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
            :class="{ 'opacity-50 pointer-events-none': uploading }"
          >
            {{ uploading ? 'Upload en cours…' : '⬆ Uploader un nouveau modèle' }}
          </span>
          <input
            type="file"
            accept=".docx"
            class="hidden"
            @change="handleUpload"
          />
        </label>

        <button
          type="button"
          @click="downloadCertificateTemplate"
          class="inline-flex items-center justify-center h-10 px-4 py-2 rounded-md font-medium
                 border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 transition-colors"
        >
          ⬇ Télécharger le modèle actuel
        </button>
      </div>

      <p
        v-if="message"
        :class="['mt-3 text-sm', message.includes('Erreur') ? 'text-red-600' : 'text-green-600']"
      >
        {{ message }}
      </p>
    </div>
  </div>
</template>
