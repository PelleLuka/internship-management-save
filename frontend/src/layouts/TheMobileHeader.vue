<script setup>
import { Menu } from "lucide-vue-next";

const emit = defineEmits(['open-menu']);
</script>

<template>
  <header 
    class="fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white z-50 flex items-center px-4 border-b border-slate-800"
  >
    <button 
      @click="emit('open-menu')"
      class="p-2 hover:bg-slate-800 rounded-md transition-colors mr-4"
      aria-label="Ouvrir le menu"
    >
      <Menu class="w-6 h-6" />
    </button>
    <span class="font-bold text-lg tracking-tight">Gestion Stages</span>
    
    <!-- Teleport Target for Mobile Actions -->
    <div id="header-actions" class="ml-auto flex items-center gap-2"></div>
  </header>
</template>
