import { ref } from 'vue';
import * as api from '../services/categoryService.js';

export function useCategories() {
  const categories = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const load = async () => {
    loading.value = true;
    try {
      categories.value = await api.getCategories();
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  };

  const create = async (data) => {
    await api.createCategory(data);
    await load();
  };
  const update = async (id, data) => {
    await api.updateCategory(id, data);
    await load();
  };
  const remove = async (id) => {
    await api.deleteCategory(id);
    await load();
  };

  return { categories, loading, error, load, create, update, remove };
}
