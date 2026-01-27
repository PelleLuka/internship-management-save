<script setup>
import { computed } from "vue";

/**
 * Reusable Input Component
 * Wrapper around standard input with consistent styling.
 * 
 * @property {string|number} modelValue - The v-model value.
 * @property {string} type - Input type (text, email, date, etc.).
 * @property {string} placeholder - Placeholder text.
 * @property {string} class - Additional classes.
 */
const props = defineProps({
  modelValue: [String, Number],
  type: String,
  placeholder: String,
  class: String
});

const emit = defineEmits(["update:modelValue"]);

const combinedClasses = computed(() => {
	return `flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${props.class || ""}`;
});

/**
 * Emits updated value to parent.
 * @param {Event} event - The input event.
 */
const updateValue = (event) => {
	const target = event.target;
	emit("update:modelValue", target.value);
};
</script>

<template>
  <input
    :type="type || 'text'"
    :class="combinedClasses"
    :placeholder="placeholder"
    :value="modelValue"
    @input="updateValue"
  />
</template>
