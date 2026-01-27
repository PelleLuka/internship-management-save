<script setup>
import { useMediaQuery } from '../composables/useMediaQuery';
import DashboardMobile from './dashboard/DashboardMobile.vue';
import DashboardDesktop from './dashboard/DashboardDesktop.vue';

// < 891px = Mobile
// >= 891px = Desktop (including tablet landscape)
const isMobile = useMediaQuery('(max-width: 890px)');
</script>

<template>
  <!-- Responsive Dashboard Switcher -->
  <DashboardMobile v-if="isMobile" />
  <DashboardDesktop v-else />
</template>
