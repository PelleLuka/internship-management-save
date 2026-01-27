<script setup>
import { onMounted, onUnmounted, watch } from "vue";
import { X } from "lucide-vue-next";

/**
 * Reusable Dialog/Modal Component.
 * features teleportation and body scroll locking.
 * 
 * @property {boolean} isOpen - Controls visibility.
 * @property {string} title - Header title of the dialog.
 */
const props = defineProps({
	isOpen: Boolean,
	title: String,
});

const emit = defineEmits(["close"]);

/**
 * Handles Escape key press to close dialog.
 */
const handleEscape = (e) => {
	if (e.key === "Escape" && props.isOpen) {
		emit("close");
	}
};

onMounted(() => document.addEventListener("keydown", handleEscape));
onUnmounted(() => document.removeEventListener("keydown", handleEscape));

/**
 * Watcher: Locks body scroll when dialog is open.
 */
watch(
	() => props.isOpen,
	(val) => {
		if (val) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
	},
);
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>
      
      <!-- Content -->
      <div 
        role="dialog" 
        aria-modal="true" 
        :aria-label="title"
        class="relative z-50 w-full max-w-lg rounded-lg bg-white p-6 shadow-lg animate-in fade-in zoom-in duration-200"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">{{ title }}</h2>
          <button @click="$emit('close')" class="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2">
            <X class="h-4 w-4" />
            <span class="sr-only">Close</span>
          </button>
        </div>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
