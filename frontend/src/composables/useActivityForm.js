import { onMounted, ref, watch } from 'vue';
import { createActivity, getActivityById, getCategories, updateActivity } from '../services/activityService';

const emptyForm = () => ({ title: '', visible: true });

export function useActivityForm(props, emit) {
  const formData = ref(emptyForm());
  const description = ref('');
  const selectedCategoryIds = ref([]);
  const categories = ref([]);
  const errors = ref({});
  const loading = ref(false);

  onMounted(async () => {
    categories.value = await getCategories();
  });

  const toggleCategory = (id) => {
    const idx = selectedCategoryIds.value.indexOf(id);
    if (idx === -1) selectedCategoryIds.value.push(id);
    else selectedCategoryIds.value.splice(idx, 1);
  };

  watch(
    () => props.activityId,
    async (newId) => {
      errors.value = {};
      if (newId && props.isOpen) {
        try {
          const data = await getActivityById(newId);
          formData.value = {
            title: data.title,
            visible: data.visible !== undefined ? data.visible : true,
          };
          description.value = data.description ?? '';
          selectedCategoryIds.value = data.categories?.map((c) => c.id) ?? [];
        } catch (error) {
          console.error('Failed to load activity', error);
        }
      } else {
        formData.value = emptyForm();
        description.value = '';
        selectedCategoryIds.value = [];
      }
    },
    { immediate: true },
  );

  const validate = () => {
    errors.value = {};
    const title = formData.value.title;
    if (!title || title.length < 3 || title.length > 100) {
      errors.value.title = 'Le titre doit avoir entre 3 et 100 caractères.';
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    loading.value = true;
    try {
      const payload = {
        ...formData.value,
        description: description.value,
        categoryIds: selectedCategoryIds.value,
      };
      if (props.activityId) {
        await updateActivity(props.activityId, payload);
      } else {
        await createActivity({ ...payload, id: crypto.randomUUID() });
      }
      emit('success');
      emit('close');
    } catch (error) {
      console.error('Failed to save activity', error);
      const message = error.response?.data?.error || "Une erreur est survenue lors de l'enregistrement.";
      alert(message);
    } finally {
      loading.value = false;
    }
  };

  return {
    formData,
    description,
    selectedCategoryIds,
    categories,
    errors,
    loading,
    toggleCategory,
    handleSubmit,
  };
}
