<script setup>
import { useMediaQuery } from '../../composables/useMediaQuery';
import DashboardHeaderDesktop from './header/DashboardHeaderDesktop.vue';
import DashboardHeaderMobile from './header/DashboardHeaderMobile.vue';

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  },
  sortBy: {
    type: String,
    default: 'dateDesc'
  },
  // Mobile Only: Controls visibility of filters
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  'update:searchQuery', 
  'update:sortBy', 
  'open-modal',
  'toggle' // Mobile Only: emitted when search icon is clicked
]);

const isMobile = useMediaQuery('(max-width: 890px)');
</script>

<template>
  <DashboardHeaderMobile
    v-if="isMobile"
    :search-query="searchQuery"
    :sort-by="sortBy"
    :is-open="isOpen"
    @update:search-query="emit('update:searchQuery', $event)"
    @update:sort-by="emit('update:sortBy', $event)"
    @open-modal="emit('open-modal')"
    @toggle="emit('toggle')"
  />
  <DashboardHeaderDesktop
    v-else
    :search-query="searchQuery"
    :sort-by="sortBy"
    @update:search-query="emit('update:searchQuery', $event)"
    @update:sort-by="emit('update:sortBy', $event)"
    @open-modal="emit('open-modal')"
  />
</template>
