<script setup lang="ts">
import { computed } from "vue";

/**
 * Reusable Button Component
 * 
 * @property {string} variant - Visual style: 'primary', 'secondary', 'danger', 'ghost', 'outline'.
 * @property {string} size - Size: 'sm', 'md', 'lg', 'icon'.
 * @property {string} type - Button type: 'button', 'submit', 'reset'.
 * @property {boolean} disabled - Whether the button is disabled.
 * @property {string} class - Additional custom classes.
 */
const props = defineProps({
  variant: {
    type: String,
    default: "primary",
    validator: (value) => ["primary", "secondary", "danger", "ghost", "outline"].includes(value)
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg", "icon"].includes(value)
  },
  type: {
    type: String,
    default: "button",
    validator: (value) => ["button", "submit", "reset"].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  class: {
    type: String,
    default: ""
  }
});

/**
 * Tailwind classes for different visual variants.
 */
const variantClasses = {
	primary: "bg-blue-600 text-white hover:bg-blue-700",
	secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
	danger: "bg-red-600 text-white hover:bg-red-700",
	ghost: "bg-transparent hover:bg-slate-100 text-slate-700",
	outline:
		"border border-slate-200 bg-transparent hover:bg-slate-100 text-slate-900",
};

/**
 * Tailwind classes for different sizes.
 */
const sizeClasses = {
	sm: "h-8 px-3 text-xs",
	md: "h-10 px-4 py-2",
	lg: "h-12 px-6 text-lg",
	icon: "h-10 w-10 p-2 flex items-center justify-center",
};

/**
 * Computes the final class string by merging base styles, variant, size, and custom classes.
 */
const combinedClasses = computed(() => {
	return `inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 ${variantClasses[props.variant]} ${sizeClasses[props.size]} ${props.class || ""}`;
});
</script>

<template>
  <button :type="type" :class="combinedClasses" :disabled="disabled">
    <slot />
  </button>
</template>
