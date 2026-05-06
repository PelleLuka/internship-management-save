import axios from 'axios';

export const getCategories = () =>
  axios.get('/api/categories').then((r) => r.data);
export const createCategory = (data) =>
  axios.post('/api/categories', data).then((r) => r.data);
export const updateCategory = (id, data) =>
  axios.patch(`/api/categories/${id}`, data).then((r) => r.data);
export const deleteCategory = (id) =>
  axios.delete(`/api/categories/${id}`).then((r) => r.data);
