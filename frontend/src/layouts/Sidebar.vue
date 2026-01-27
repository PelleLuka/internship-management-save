<script setup>
import { Activity, User, X } from "lucide-vue-next";
import { computed, ref } from "vue";
import { useMediaQuery } from "../composables/useMediaQuery";

const props = defineProps({
  isMobile: Boolean,
  isOpen: Boolean
});

const emit = defineEmits(["close"]);

const isLargeScreen = useMediaQuery("(min-width: 1800px)");
const isHovered = ref(false);

// Desktop collapse logic: Collapsed if NOT large screen AND NOT hovered
// Mobile: Always expanded (not collapsed)
const isCollapsed = computed(() => {
	if (props.isMobile) return false;
	return !isLargeScreen.value && !isHovered.value;
});

const navItems = [
	{ to: "/internships", icon: User, label: "Stagiaires" },
	{ to: "/activities", icon: Activity, label: "Activités" },
];
</script>

<template>
  <!-- Mobile Backdrop -->
  <div 
    v-if="isMobile && isOpen" 
    class="fixed inset-0 bg-black/50 z-[55] backdrop-blur-sm transition-opacity"
    @click="emit('close')"
  ></div>

  <aside 
    class="bg-slate-900 text-white h-screen flex flex-col shrink-0 transition-all duration-300 z-[60]"
    :class="[
      isMobile ? 'fixed inset-y-0 left-0 shadow-xl' : 'sticky top-0',
      isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0',
      isCollapsed ? 'w-20' : 'w-64'
    ]"
    @mouseenter="!isMobile && (isHovered = true)"
    @mouseleave="!isMobile && (isHovered = false)"
  >
    <div class="p-6 border-b border-slate-800 flex justify-between items-center overflow-hidden h-[88px]">
      <h1 
        class="font-bold tracking-tight transition-all duration-300 whitespace-nowrap"
        :class="[isCollapsed ? 'text-2xl' : 'text-xl']"
      >
        {{ isCollapsed ? 'GS' : 'Gestion Stages' }}
      </h1>
      
      <!-- Mobile Close Button -->
      <button 
        v-if="isMobile"
        @click="emit('close')"
        class="p-1 hover:bg-slate-800 rounded-md transition-colors"
        aria-label="Fermer le menu"
      >
        <X class="w-5 h-5 text-slate-400" />
      </button>
    </div>

    <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        custom
        v-slot="{ href, navigate, isActive }"
      >
        <a
          :href="href"
          @click="(e) => { navigate(e); if(isMobile) emit('close'); }"
          :class="[
            'flex items-center rounded-lg transition-colors relative group',
            isCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-4 py-3',
            isActive
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          ]"
          :title="isCollapsed ? item.label : undefined"
        >
          <component :is="item.icon" class="w-5 h-5 shrink-0" />
          <span 
            class="font-medium transition-all duration-300 overflow-hidden whitespace-nowrap"
            :class="[isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100']"
          >
            {{ item.label }}
          </span>
          
          <!-- Tooltip for collapsed mode -->
          <div 
            v-if="isCollapsed && !isMobile"
            class="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50"
          >
            {{ item.label }}
          </div>
        </a>
      </RouterLink>
    </nav>
  </aside>
</template>
