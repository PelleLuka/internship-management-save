import { format, getYear, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { computed, ref } from 'vue';

export function useInternshipGrouping(internships) {
  const sortBy = ref('dateDesc');

  const sortedInternships = computed(() => {
    const result = [...internships.value];
    result.sort((a, b) => {
      switch (sortBy.value) {
        case 'firstName':
          return a.firstName.localeCompare(b.firstName);
        case 'lastName':
          return a.lastName.localeCompare(b.lastName);
        case 'dateAsc':
          return (
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          );
        default:
          return (
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
      }
    });
    return result;
  });

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

    return Object.entries(groups)
      .sort(([a], [b]) =>
        sortBy.value === 'dateAsc'
          ? parseInt(a, 10) - parseInt(b, 10)
          : parseInt(b, 10) - parseInt(a, 10),
      )
      .map(([year, months]) => {
        const sortedMonths = Object.entries(months).sort(
          ([, internsA], [, internsB]) => {
            if (!internsA[0]) return 1;
            if (!internsB[0]) return -1;
            const dateA = parseISO(internsA[0].startDate);
            const dateB = parseISO(internsB[0].startDate);
            return sortBy.value === 'dateAsc'
              ? dateA.getTime() - dateB.getTime()
              : dateB.getTime() - dateA.getTime();
          },
        );
        return [year, sortedMonths];
      });
  });

  return { sortBy, sortedInternships, groupedInternships };
}
