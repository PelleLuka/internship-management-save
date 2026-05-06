import { computed, ref, watch } from 'vue';
import {
  deleteInternship,
  getInternships,
} from '../services/internshipService';

export function useInternships() {
  const internships = ref([]);
  const searchTerm = ref('');
  const page = ref(1);
  const limit = ref(20);
  const total = ref(0);
  const isLoading = ref(false);

  const loadInternships = async (reset = true) => {
    if (isLoading.value) return;
    isLoading.value = true;
    try {
      if (reset) {
        page.value = 1;
        internships.value = [];
      }
      const { data, total: totalCount } = await getInternships(
        page.value,
        limit.value,
        searchTerm.value,
      );
      internships.value = reset ? data : [...internships.value, ...data];
      total.value = totalCount;
    } catch (error) {
      console.error('Failed to load internships', error);
    } finally {
      isLoading.value = false;
    }
  };

  const loadNextBatch = async () => {
    if (isLoading.value || internships.value.length >= total.value) return;
    page.value++;
    await loadInternships(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce stagiaire ?')) return;
    try {
      await deleteInternship(id);
      await loadInternships();
    } catch (error) {
      console.error('Failed to delete internship', error);
    }
  };

  watch(searchTerm, () => loadInternships(true));

  return {
    internships,
    searchTerm,
    page,
    total,
    isLoading,
    hasMore: computed(() => internships.value.length < total.value),
    loadInternships,
    loadNextBatch,
    handleDelete,
  };
}
