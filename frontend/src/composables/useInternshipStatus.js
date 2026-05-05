import { computed } from 'vue';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const parseLocalDate = (str) => {
  const [y, m, d] = String(str).slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
};

export function useInternshipStatus(internship) {
  const status = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = parseLocalDate(internship.value.startDate);
    const end = parseLocalDate(internship.value.endDate);
    if (today < start) return 'upcoming';
    if (today > end) return 'done';
    return 'active';
  });

  const statusConfig = computed(() => ({
    upcoming: { label: 'À venir',  classes: 'bg-amber-100 text-amber-600' },
    active:   { label: 'En cours', classes: 'bg-green-100 text-green-600' },
    done:     { label: 'Terminé',  classes: 'bg-blue-100  text-blue-600'  },
  }[status.value]));

  const formatDate = (dateStr) => {
    try {
      return format(new Date(dateStr), 'dd MMM yyyy', { locale: fr });
    } catch {
      return dateStr;
    }
  };

  return { status, statusConfig, formatDate };
}
