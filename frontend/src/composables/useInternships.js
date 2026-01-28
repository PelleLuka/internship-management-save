import { ref, computed } from 'vue';
import { 
  getInternships, 
  deleteInternship,
  getInternshipActivities,
  removeActivityFromInternship
} from '../services/internshipService';
import { getYear, parseISO, format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Composable for managing internship data, sorting, filtering, and grouping.
 * Centralizes the logic for the main dashboard view.
 */
export function useInternships() {
  // State
  const internships = ref([]);
  const searchQuery = ref(''); // Bound to search input
  const sortBy = ref('dateDesc'); // Bound to sort dropdown
  const expandedCards = ref(new Set()); // Tracks which cards are expanded (desktop/mobile)

  // === DATA LOADING & PAGINATION ===
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

      const { data, total: totalCount } = await getInternships(page.value, limit.value);
      
      if (reset) {
        internships.value = data;
      } else {
        internships.value = [...internships.value, ...data];
      }
      
      total.value = totalCount;

      // Restore activities for locally expanded cards if any are visible
      if (expandedCards.value.size > 0) {
        await Promise.all(
          Array.from(expandedCards.value).map(id => updateInternshipActivities(id))
        );
      }
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
    if (confirm('Êtes-vous sûr de vouloir supprimer ce stagiaire ?')) {
      try {
        await deleteInternship(id);
        await loadInternships(); // Reload list
      } catch (error) {
        console.error('Failed to delete internship', error);
      }
    }
  };

  // === ACTIVITIES IN INTERNSHIPS ===
  const updateInternshipActivities = async (id) => {
    try {
      const internshipActivities = await getInternshipActivities(id);
      internships.value = internships.value.map((i) => {
        if (i.id === id) {
          return {
            ...i,
            linkedActivities: internshipActivities,
            activityIds: internshipActivities.map((a) => a.id),
          };
        }
        return i;
      });
    } catch (e) {
      console.error('Failed to refresh activities for internship', id, e);
    }
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

  const toggleCard = async (id) => {
    const newSet = new Set(expandedCards.value);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
      await updateInternshipActivities(id);
    }
    expandedCards.value = newSet;
  };

  // === SORTING & FILTERING ===
  const sortedInternships = computed(() => {
    let result = [...internships.value];

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(
        (i) =>
          i.firstName.toLowerCase().includes(query) ||
          i.lastName.toLowerCase().includes(query) ||
          i.email.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      switch (sortBy.value) {
        case 'firstName':
          return a.firstName.localeCompare(b.firstName);
        case 'lastName':
          return a.lastName.localeCompare(b.lastName);
        case 'dateAsc':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        default:
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }
    });

    return result;
  });

  /**
   * Computes grouping of internships by Year -> Month.
   * Used for the Sidebar (Desktop) and Horizontal Nav (Mobile).
   * 
   * Structure: [ [ "2024", [ ["Janvier", [interns...]], ... ] ], ... ]
   */
  const groupedInternships = computed(() => {
    const groups = {};
    sortedInternships.value.forEach((internship) => {
      const date = parseISO(internship.startDate);
      const year = getYear(date).toString();
      const month = format(date, 'MMMM', { locale: fr });
      const monthCap = month.charAt(0).toUpperCase() + month.slice(1);

      if (!groups[year]) groups[year] = {};
      if (!groups[year][monthCap]) groups[year][monthCap] = [];
      groups[year][monthCap].push(internship);
    });

    const sortedYears = Object.entries(groups).sort(([yearA], [yearB]) => {
      return sortBy.value === 'dateAsc'
        ? parseInt(yearA, 10) - parseInt(yearB, 10)
        : parseInt(yearB, 10) - parseInt(yearA, 10);
    });

    return sortedYears.map(([year, months]) => {
      const sortedMonths = Object.entries(months).sort(
        ([, internsA], [, internsB]) => {
          if (internsA.length === 0 || !internsA[0]) return 1;
          if (internsB.length === 0 || !internsB[0]) return -1;
          const dateA = parseISO(internsA[0].startDate);
          const dateB = parseISO(internsB[0].startDate);
          return sortBy.value === 'dateAsc'
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        }
      );
      return [year, sortedMonths];
    });
  });

  return {
    internships,
    searchQuery,
    sortBy,
    expandedCards,
    loadInternships,
    handleDelete,
    updateInternshipActivities,
    removeActivity,
    toggleCard,
    groupedInternships,
    loadNextBatch,
    isLoading,
    hasMore: computed(() => internships.value.length < total.value)
  };
}
