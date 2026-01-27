<script setup>
import { useMediaQuery } from '../../composables/useMediaQuery';
import InternshipCardDesktop from './card/InternshipCardDesktop.vue';
import InternshipCardMobile from './card/InternshipCardMobile.vue';

const props = defineProps({
  internship: Object,
  expanded: Boolean,
  activities: Array,
  activityMenuOpen: Boolean,
  tempSelectedActivityIds: Set
});

const emit = defineEmits([
  'toggle', 'edit', 'delete', 'remove-activity', 
  'open-activity-menu', 'close-activity-menu', 
  'toggle-activity-selection', 'save-activities'
]);

const isMobile = useMediaQuery('(max-width: 890px)');
</script>

<template>
  <InternshipCardMobile
    v-if="isMobile"
    v-bind="props"
    @toggle="emit('toggle', $event)"
    @edit="emit('edit', $event)"
    @delete="emit('delete', $event)"
    @remove-activity="(iid, aid) => emit('remove-activity', iid, aid)"
    @open-activity-menu="emit('open-activity-menu', $event)"
    @close-activity-menu="emit('close-activity-menu')"
    @toggle-activity-selection="emit('toggle-activity-selection', $event)"
    @save-activities="emit('save-activities', $event)"
  />
  <InternshipCardDesktop
    v-else
    v-bind="props"
    @toggle="emit('toggle', $event)"
    @edit="emit('edit', $event)"
    @delete="emit('delete', $event)"
    @remove-activity="(iid, aid) => emit('remove-activity', iid, aid)"
    @open-activity-menu="emit('open-activity-menu', $event)"
    @close-activity-menu="emit('close-activity-menu')"
    @toggle-activity-selection="emit('toggle-activity-selection', $event)"
    @save-activities="emit('save-activities', $event)"
  />
</template>
