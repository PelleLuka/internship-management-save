import { computed, onMounted, ref } from 'vue';
import {
  deleteActivity,
  deleteActivityDocument,
  getActivities,
  getActivityById,
  getCategories,
  uploadActivityDocument,
} from '../services/activityService';

export function useActivityList() {
  const activities = ref([]);
  const allCategories = ref([]);
  const searchQuery = ref('');
  const isModalOpen = ref(false);
  const editingId = ref(null);
  const isSearchOpen = ref(false);
  const expandedId = ref(null);

  const loadActivities = async () => {
    try {
      const idList = await getActivities();
      activities.value = await Promise.all(
        idList.map((item) => getActivityById(item.id)),
      );
    } catch (error) {
      console.error('Failed to load activities', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) return;
    try {
      await deleteActivity(id);
      await loadActivities();
    } catch (error) {
      if (error.response?.status === 409) {
        alert(
          'Impossible de supprimer cet atelier : il est lié à des stagiaires.',
        );
      } else {
        console.error('Failed to delete activity', error);
        alert("Erreur lors de la suppression de l'activité.");
      }
    }
  };

  const handleUploadDocument = async (activityId, event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      await uploadActivityDocument(activityId, file);
      await loadActivities();
    } catch (error) {
      console.error('Failed to upload document', error);
      alert(
        "Erreur lors de l'upload du document. Vérifiez le format et la taille (max 10 MB).",
      );
    }
  };

  const handleDeleteDocument = async (activityId) => {
    if (!confirm('Supprimer ce document ?')) return;
    try {
      await deleteActivityDocument(activityId);
      await loadActivities();
    } catch (error) {
      console.error('Failed to delete document', error);
      alert('Erreur lors de la suppression du document.');
    }
  };

  const filteredActivities = computed(() => {
    if (!searchQuery.value) return activities.value;
    const query = searchQuery.value.toLowerCase();
    return activities.value.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        (a.description ?? '').toLowerCase().includes(query),
    );
  });

  onMounted(async () => {
    await loadActivities();
    allCategories.value = await getCategories();
  });

  return {
    activities,
    allCategories,
    searchQuery,
    isModalOpen,
    editingId,
    isSearchOpen,
    expandedId,
    filteredActivities,
    loadActivities,
    handleDelete,
    handleUploadDocument,
    handleDeleteDocument,
  };
}
