<script setup>
import { useMasonryGrid } from '../../composables/useMasonryGrid';

const props = defineProps({
  /**
   * Flat array of items to be distributed into columns.
   */
  items: {
    type: Array,
    required: true,
    default: () => []
  }
});

/**
 * Uses the masonry composable to distribute items into 1, 2, or 3 columns
 * based on the current viewport width (Responsive).
 */
const { getMasonryColumns } = useMasonryGrid();
</script>

<template>
  <div class="flex gap-6 items-start">
    <div
      v-for="(col, colIndex) in getMasonryColumns(items)"
      :key="colIndex"
      class="flex-1 space-y-6 min-w-0"
    >
      <div v-for="item in col" :key="item.id">
        <!-- Scoped Slot for Generic Item Rendering -->
        <slot :item="item"></slot>
      </div>
    </div>
  </div>
</template>
