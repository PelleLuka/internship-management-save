<script setup>
/**
 * Navigation Sidebar Component.
 * Displays a hierarchical list of Years and Months to filter the internship list.
 * 
 * Usage:
 * <SidebarNavigation :groups="groupedInternships" @scroll-to="handleScroll" />
 */
defineProps({
  /**
   * Data structure for navigation.
   * Expected format: [ [ "2024", [ "Janvier", ... ] ], [ "2023", ... ] ]
   */
  groups: {
    type: Array, 
    required: true,
    default: () => []
  }
});

const emit = defineEmits(['scroll-to']);
</script>

<template>
  <div class="shrink-0 transition-all duration-300 w-fit min-w-[100px]">
    <nav class="sticky top-8 h-[calc(100vh-3rem)] overflow-y-auto py-2 scrollbar-hide">
      <div class="space-y-6">
        <div
          v-for="[year, months] in groups"
          :key="year"
          class="space-y-2"
        >
          <button
            type="button"
            @click="emit('scroll-to', `year-${year}`)"
            class="font-bold text-slate-900 hover:text-blue-600 transition-colors w-full text-left text-sm"
            :title="year"
          >
            {{ year }}
          </button>
          <div class="space-y-1 pl-3 border-l-2 border-slate-100">
            <button
              v-for="[month] in months"
              :key="`${year}-${month}`"
              type="button"
              @click="emit('scroll-to', `month-${year}-${month}`)"
              class="block text-slate-500 hover:text-blue-600 transition-colors text-sm"
              :title="month"
            >
              {{ month }}
            </button>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>
