import { computed, nextTick, ref, watch } from 'vue';
import { createInternship, getInternshipById, updateInternship } from '../services/internshipService';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emptyForm = () => ({ firstName: '', lastName: '', email: '', startDate: '', endDate: '' });

export function useInternshipForm(props, emit, firstInputRef) {
  const formData = ref(emptyForm());
  const errors = ref({});
  const isLoading = ref(false);
  const isEditing = computed(() => !!props.internshipId);

  watch(
    () => props.isOpen,
    async (isOpen) => {
      if (!isOpen) return;
      errors.value = {};
      if (props.internshipId) {
        isLoading.value = true;
        try {
          const data = await getInternshipById(props.internshipId);
          formData.value = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            startDate: data.startDate?.split('T')[0] || '',
            endDate: data.endDate?.split('T')[0] || '',
          };
        } catch (error) {
          console.error('Failed to fetch internship', error);
        } finally {
          isLoading.value = false;
        }
      } else {
        formData.value = emptyForm();
      }
      nextTick(() => {
        const el = firstInputRef.value;
        if (el?.$el) el.$el.focus();
        else if (typeof el?.focus === 'function') el.focus();
      });
    },
    { immediate: true },
  );

  const validate = () => {
    errors.value = {};
    let ok = true;
    const f = formData.value;

    if (!f.firstName || f.firstName.length < 1 || f.firstName.length > 50) {
      errors.value.firstName = 'Le prénom doit avoir entre 1 et 50 caractères.';
      ok = false;
    }
    if (!f.lastName || f.lastName.length < 1 || f.lastName.length > 50) {
      errors.value.lastName = 'Le nom doit avoir entre 1 et 50 caractères.';
      ok = false;
    }
    if (!f.email || !EMAIL_RE.test(f.email)) {
      errors.value.email = 'Veuillez entrer une adresse email valide.';
      ok = false;
    }
    if (!f.startDate) {
      errors.value.startDate = 'La date de début est requise.';
      ok = false;
    }
    if (!f.endDate) {
      errors.value.endDate = 'La date de fin est requise.';
      ok = false;
    }
    if (f.startDate && f.endDate && new Date(f.startDate) > new Date(f.endDate)) {
      errors.value.endDate = 'La date de fin doit être égale ou postérieure à la date de début.';
      ok = false;
    }
    return ok;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      if (isEditing.value) {
        await updateInternship(props.internshipId, { ...formData.value });
      } else {
        await createInternship({ ...formData.value, activityIds: [] });
      }
      emit('success');
      emit('close');
    } catch (error) {
      console.error('Failed to save internship', error);
      const message = error.response?.data?.error || "Une erreur est survenue lors de l'enregistrement.";
      alert(message);
    }
  };

  return { formData, errors, isLoading, isEditing, handleSubmit };
}
