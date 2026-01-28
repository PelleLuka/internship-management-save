<script setup>
import { useMasonryGrid } from '../../composables/useMasonryGrid';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import MasonryGrid from '../common/MasonryGrid.vue';

const props = defineProps({
  /**
   * The grouped internship data to display.
   * Structure matches the Sidebar groups.
   */
  groups: {
    type: Array,
    required: true,
    default: () => []
  },
  /**
   * Height of the sticky header (if any).
   * Used to calculate the correct scroll offset so titles aren't hidden behind the header.
   */
  headerHeight: {
    type: Number,
    default: 0
  },
  /**
   * Additional top spacing.
   */
  offset: {
    type: Number,
    default: 24
  }
});

/**
 * Calculates dynamic scroll-margin-top.
 * This ensures that when clicking a month in the sidebar, the browser scrolls
 * to the exact position respecting the fixed/sticky header height.
 */
const getScrollMargin = () => {
    return (props.headerHeight + props.offset) + 'px';
};

const emit = defineEmits(['load-more']);
const sentinel = ref(null);
let observer = null;

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      emit('load-more');
    }
  }, { 
    rootMargin: '0px 0px 200px 0px', 
    threshold: 0 
  });

  if (sentinel.value) {
    observer.observe(sentinel.value);
  }
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});
</script>

<template>
  <div class="space-y-12">
    <div
      v-for="[year, months] in groups"
      :key="year"
      :id="`year-${year}`"
      :style="{ scrollMarginTop: getScrollMargin() }"
    >
      <h2 class="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-2">
        {{ year }}
      </h2>

      <div
        v-for="[month, monthInternships] in months"
        :key="month"
        :id="`month-${year}-${month}`"
        class="mb-8"
        :style="{ scrollMarginTop: getScrollMargin() }"
      >
        <h3 class="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
          {{ month }}
          <span class="text-slate-400 font-normal">({{ monthInternships.length }})</span>
        </h3>

        <!-- Masonry Grid via the new common component -->
        <MasonryGrid :items="monthInternships">
            <template #default="{ item }">
                <slot name="item" :item="item"></slot>
            </template>
        </MasonryGrid>
      </div>
    </div>
    
    <div v-if="groups.length === 0" class="text-center py-12 text-slate-500">
      <slot name="empty">Aucun résultat trouvé.</slot>
    </div>
    
    <!-- Sentinel for Infinite Scroll -->
    <div ref="sentinel" class="h-4 w-full"></div>
  </div>
</template>
