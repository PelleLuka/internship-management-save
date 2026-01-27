import { computed } from 'vue';
import { useMediaQuery } from './useMediaQuery';

export function useMasonryGrid() {
  const isTabletStart = useMediaQuery('(min-width: 891px)');
  const isLgCustom = useMediaQuery('(min-width: 1022px)');
  const isXl = useMediaQuery('(min-width: 1380px)');

  const columnCount = computed(() => {
    if (isXl.value) return 3; // XL screens (3 columns)
    if (isLgCustom.value) return 2; // LG Custom screens (2 columns)
    if (isTabletStart.value) return 2; // Tablet Start screens (2 columns)
    return 1; // Mobile (< 891px) (1 column)
  });

  const getMasonryColumns = (items) => {
    const cols = Array.from({ length: columnCount.value }, () => []);
    items.forEach((item, index) => {
      const colIndex = index % columnCount.value;
      if (cols[colIndex]) {
        cols[colIndex].push(item);
      }
    });
    return cols;
  };

  return {
    columnCount,
    getMasonryColumns,
    isTabletStart,
    isLgCustom,
    isXl
  };
}
