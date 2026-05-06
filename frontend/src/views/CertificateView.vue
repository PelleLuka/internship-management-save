<script setup>
import { ArrowLeft, Download, Printer } from 'lucide-vue-next';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCertificateBlobUrl } from '../services/certificateService.js';

const route = useRoute();
const router = useRouter();

const blobUrl = ref(null);
const loading = ref(true);
const error = ref('');
const iframeRef = ref(null);

onMounted(async () => {
  try {
    blobUrl.value = await getCertificateBlobUrl(route.params.id);
  } catch (e) {
    error.value =
      e.response?.status === 404
        ? 'Aucun template de certificat configuré. Veuillez uploader un template dans Paramètres.'
        : 'Erreur lors de la génération du certificat.';
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  if (blobUrl.value) URL.revokeObjectURL(blobUrl.value);
});

const handlePrint = () => {
  iframeRef.value?.contentWindow?.print();
};

const handleDownload = () => {
  const a = document.createElement('a');
  a.href = blobUrl.value;
  a.download = `certificat-stage-${route.params.id}.pdf`;
  a.click();
};
</script>

<template>
  <div class="flex flex-col">
    <!-- Header -->
    <div
      class="flex items-center gap-4 p-4 bg-white border-b border-slate-200 shadow-sm mb-6 rounded-lg sticky top-8 z-40"
    >
      <button
        @click="router.back()"
        class="p-2 rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
        aria-label="Retour"
      >
        <ArrowLeft class="w-5 h-5" />
      </button>
      <h1 class="text-xl font-bold text-slate-900 flex-1">
        Certificat de Stage
      </h1>
      <div class="flex gap-2">
        <button
          @click="handlePrint"
          :disabled="!blobUrl"
          class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 text-sm font-medium"
        >
          <Printer class="w-4 h-4" />
          Imprimer
        </button>
        <button
          @click="handleDownload"
          :disabled="!blobUrl"
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 text-sm font-medium"
        >
          <Download class="w-4 h-4" />
          Télécharger PDF
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex items-center justify-center">
      <div v-if="loading" class="text-slate-500 text-sm py-24">
        Génération du certificat…
      </div>
      <div
        v-else-if="error"
        class="max-w-md text-center bg-white rounded-xl p-8 border border-slate-200 shadow-sm"
      >
        <p class="text-red-600 text-sm mb-4">{{ error }}</p>
        <button
          @click="router.back()"
          class="text-blue-600 text-sm hover:underline"
        >
          ← Retour
        </button>
      </div>
      <iframe
        v-else
        ref="iframeRef"
        :src="blobUrl"
        class="w-full rounded-lg shadow-lg border border-slate-200"
        style="height: 80vh"
        title="Aperçu du certificat"
      />
    </div>
  </div>
</template>
