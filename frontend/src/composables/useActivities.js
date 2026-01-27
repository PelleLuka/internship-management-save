import { ref } from 'vue';
import { getActivities, getActivityById } from '../services/activityService';
import { addActivityToInternship } from '../services/internshipService';

/**
 * Composable for managing activity references and selection UI.
 * Handles the "Add Activity" menu within Internship Cards.
 */
export function useActivities() {
  const activities = ref([]);
  
  // State for the Activity Selection Menu (Popover/Modal)
  const activityMenuOpenId = ref(null); // ID of the internship whose menu is currently open
  const tempSelectedActivityIds = ref(new Set()); // Staging area for selections before saving

  const loadActivities = async () => {
    try {
      const idList = await getActivities();
      const promises = idList.map((item) =>
        getActivityById(item.id).catch((e) => {
          console.warn(`Failed to load activity ${item.id}`, e);
          return null;
        })
      );
      const results = await Promise.all(promises);
      activities.value = results.filter((a) => a !== null);
    } catch (error) {
      console.error('Failed to load activities', error);
    }
  };

  const getActivityTitle = (id) => {
    return (
      activities.value?.find((a) => a && a.id === id)?.title ||
      'Activité inconnue'
    );
  };

  // === MENU MANAGEMENT ===
  const openActivityMenu = (internship) => {
    activityMenuOpenId.value = internship.id;
    tempSelectedActivityIds.value = new Set(); 
  };

  const closeActivityMenu = () => {
    activityMenuOpenId.value = null;
    tempSelectedActivityIds.value = new Set();
  };

  const toggleActivitySelection = (activityId) => {
    const newSet = new Set(tempSelectedActivityIds.value);
    if (newSet.has(activityId)) {
      newSet.delete(activityId);
    } else {
      newSet.add(activityId);
    }
    tempSelectedActivityIds.value = newSet;
  };

  const saveActivities = async (internshipId, internshipsRef, updateCallback) => {
    try {
      const internship = internshipsRef.value.find((i) => i.id === internshipId);
      if (!internship) return;

      const promises = Array.from(tempSelectedActivityIds.value).map(
        (activityId) => addActivityToInternship(internshipId, activityId),
      );

      await Promise.all(promises);
      await updateCallback(internshipId);
      closeActivityMenu();
    } catch (error) {
      console.error('Failed to update activities', error);
    }
  };

  return {
    activities,
    activityMenuOpenId,
    tempSelectedActivityIds,
    loadActivities,
    getActivityTitle,
    openActivityMenu,
    closeActivityMenu,
    toggleActivitySelection,
    saveActivities
  };
}
