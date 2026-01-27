<script setup>
import { computed } from "vue";

/**
 * Reusable Card Component
 * Provides a consistent white container with border and shadow.
 * 
 * @property {string} class - Additional classes to merge with default styles.
 */
const props = defineProps({
  class: String
});

/**
 * Computes generic card classes + custom classes.
 */
const combinedClasses = computed(() => {
	return `bg-white rounded-lg border border-slate-200 shadow-sm ${props.class || ""}`;
});
</script>

<template>
  <div :class="combinedClasses">
    <slot />
  </div>
</template>
