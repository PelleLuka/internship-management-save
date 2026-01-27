<script setup>
import { ref } from "vue";
import Sidebar from "./Sidebar.vue";
import TheMobileHeader from "./TheMobileHeader.vue";
import { useMediaQuery } from "../composables/useMediaQuery";

const isMobile = useMediaQuery("(max-width: 890px)");
const isSidebarOpen = ref(false);
</script>

<template>
  <div class="flex min-h-screen bg-slate-50">
    <!-- Mobile Header (Visible < 891px) -->
    <!-- Contains Hamburger menu trigger and Mobile Title -->
    <TheMobileHeader 
      v-if="isMobile" 
      @open-menu="isSidebarOpen = true" 
    />

    <!-- Responsive Sidebar -->
    <!-- Drawer on Mobile, Fixed Sidebar on Desktop -->
    <Sidebar 
      :is-mobile="isMobile" 
      :is-open="isSidebarOpen" 
      @close="isSidebarOpen = false" 
    />

    <!-- Main Content Area -->
    <!-- Adapts padding based on device type to account for fixed headers/sidebars -->
    <main 
      class="flex-1 min-w-0 transition-all duration-300" 
      :class="[isMobile ? 'p-4 pt-16' : 'p-8 pl-8']"
    >
      <RouterView />
    </main>
  </div>
</template>
