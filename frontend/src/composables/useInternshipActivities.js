import { ref } from 'vue';
import {
  getInternshipActivities,
  removeActivityFromInternship,
} from '../services/internshipService';

export function useInternshipActivities(internships) {
  const expandedCards = ref(new Set());

  const updateInternshipActivities = async (id) => {
    try {
      const linked = await getInternshipActivities(id);
      internships.value = internships.value.map((i) =>
        i.id === id
          ? {
              ...i,
              linkedActivities: linked,
              activityIds: linked.map((a) => a.id),
            }
          : i,
      );
    } catch (e) {
      console.error('Failed to refresh activities for internship', id, e);
    }
  };

  const toggleCard = async (id) => {
    const next = new Set(expandedCards.value);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
      await updateInternshipActivities(id);
    }
    expandedCards.value = next;
  };

  const removeActivity = async (internshipId, activityId) => {
    if (!confirm('Voulez-vous vraiment retirer cette activité ?')) return;
    try {
      await removeActivityFromInternship(internshipId, activityId);
      await updateInternshipActivities(internshipId);
    } catch (error) {
      console.error('Failed to remove activity', error);
    }
  };

  return {
    expandedCards,
    toggleCard,
    updateInternshipActivities,
    removeActivity,
  };
}
