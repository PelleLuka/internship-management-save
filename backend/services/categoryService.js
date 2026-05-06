import Category from '../models/Category.js';

export const getCategories = async () => Category.getAll();

export const getCategoryById = async (id) => {
  const cat = await Category.getById(id);
  if (!cat) throw new Error('NOT_FOUND');
  return cat;
};

export const createCategory = async (data) => {
  if (!data.name?.trim()) throw new Error('VALIDATION_ERROR:name required');
  return Category.create({
    name: data.name.trim(),
    description: data.description?.trim() ?? null,
  });
};

export const updateCategory = async (id, data) => {
  const cat = await Category.getById(id);
  if (!cat) throw new Error('NOT_FOUND');
  if (data.name !== undefined && !data.name.trim())
    throw new Error('VALIDATION_ERROR:name required');
  await Category.update(id, {
    name: data.name?.trim(),
    description: data.description?.trim(),
  });
};

export const deleteCategory = async (id) => {
  const existing = await Category.getById(id);
  if (!existing) throw new Error('NOT_FOUND');
  if (existing.activityCount > 0) throw new Error('HAS_LINKED_ACTIVITIES');
  await Category.delete(id);
};
