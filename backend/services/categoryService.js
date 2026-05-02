import Category from '../models/Category.js';

export const getCategories = async () => Category.getAll();

export const getCategoryById = async (id) => {
  const cat = await Category.getById(id);
  if (!cat) throw new Error('NOT_FOUND');
  return cat;
};

export const createCategory = async (data) => {
  if (!data.name?.trim()) throw new Error('VALIDATION_ERROR:name required');
  return Category.create({ name: data.name.trim(), description: data.description?.trim() ?? null });
};

export const updateCategory = async (id, data) => {
  const cat = await Category.getById(id);
  if (!cat) throw new Error('NOT_FOUND');
  if (data.name !== undefined && !data.name.trim()) throw new Error('VALIDATION_ERROR:name required');
  await Category.update(id, {
    name: data.name?.trim(),
    description: data.description?.trim(),
  });
};

export const deleteCategory = async (id) => {
  const cat = await Category.getById(id);
  if (!cat) throw new Error('NOT_FOUND');
  try {
    await Category.delete(id);
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.errno === 1451) {
      throw new Error('CONFLICT:category has linked activities');
    }
    throw err;
  }
};
