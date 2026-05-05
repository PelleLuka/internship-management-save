import { onMounted, onUnmounted, ref } from 'vue';
import { updateActivity } from '../services/activityService';

export function useCategoryMenu(loadActivities, allCategories) {
  const categoryMenuActivityId = ref(null);
  const tempCategoryIds = ref(new Set());

  const availableCategories = (activity) => {
    const assigned = new Set((activity.categories ?? []).map((c) => c.id));
    return allCategories.value.filter((c) => !assigned.has(c.id));
  };

  const openCategoryMenu = (activity) => {
    categoryMenuActivityId.value = activity.id;
    tempCategoryIds.value = new Set();
  };

  const closeCategoryMenu = () => {
    categoryMenuActivityId.value = null;
    tempCategoryIds.value = new Set();
  };

  const handleEscape = (e) => {
    if (e.key === 'Escape') closeCategoryMenu();
  };

  const toggleCategorySelection = (catId) => {
    const s = new Set(tempCategoryIds.value);
    if (s.has(catId)) s.delete(catId);
    else s.add(catId);
    tempCategoryIds.value = s;
  };

  const saveCategories = async (activity) => {
    try {
      const existing = (activity.categories ?? []).map((c) => c.id);
      await updateActivity(activity.id, {
        categoryIds: [...existing, ...tempCategoryIds.value],
      });
      closeCategoryMenu();
      await loadActivities();
    } catch (error) {
      console.error('Failed to save categories', error);
      alert('Erreur lors de la mise à jour des catégories.');
    }
  };

  const removeCategoryFromActivity = async (activity, catId) => {
    try {
      const remaining = (activity.categories ?? [])
        .filter((c) => c.id !== catId)
        .map((c) => c.id);
      await updateActivity(activity.id, { categoryIds: remaining });
      await loadActivities();
    } catch (error) {
      console.error('Failed to remove category', error);
      alert('Erreur lors du retrait de la catégorie.');
    }
  };

  onMounted(() => window.addEventListener('keydown', handleEscape));
  onUnmounted(() => window.removeEventListener('keydown', handleEscape));

  return {
    categoryMenuActivityId,
    tempCategoryIds,
    availableCategories,
    openCategoryMenu,
    closeCategoryMenu,
    toggleCategorySelection,
    saveCategories,
    removeCategoryFromActivity,
  };
}
