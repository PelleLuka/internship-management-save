<script setup>
import { X } from 'lucide-vue-next';

defineProps({
  category: { type: Object, required: true },
  removable: { type: Boolean, default: false },
});

const emit = defineEmits(['remove']);
</script>

<template>
  <span
    class="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-xl transition-colors"
    :class="removable ? 'group/cat hover:bg-blue-100' : ''"
  >
    {{ category.name }}
    <button
      v-if="removable"
      @click.stop="emit('remove', category.id)"
      class="text-blue-400 hover:text-blue-600 opacity-0 group-hover/cat:opacity-100 transition-opacity focus:outline-none"
      title="Retirer la catégorie"
    >
      <X class="w-3 h-3" />
    </button>
  </span>
</template>
