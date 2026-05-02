import * as categoryService from '../services/categoryService.js';
import logger from '../config/logger.js';

export const getCategories = async (req, res) => {
  try {
    const data = await categoryService.getCategories();
    res.json(data);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const data = await categoryService.getCategoryById(Number(req.params.id));
    res.json(data);
  } catch (err) {
    if (err.message === 'NOT_FOUND') return res.status(404).json({ error: 'Category not found' });
    res.status(500).json({ error: 'Server error' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const id = await categoryService.createCategory(req.body);
    res.status(201).json({ id });
  } catch (err) {
    if (err.message?.startsWith('VALIDATION_ERROR')) return res.status(400).json({ error: err.message.split(':')[1] });
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    await categoryService.updateCategory(Number(req.params.id), req.body);
    res.json({ success: true });
  } catch (err) {
    if (err.message === 'NOT_FOUND') return res.status(404).json({ error: 'Category not found' });
    if (err.message?.startsWith('VALIDATION_ERROR')) return res.status(400).json({ error: err.message.split(':')[1] });
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await categoryService.deleteCategory(Number(req.params.id));
    res.json({ success: true });
  } catch (err) {
    if (err.message === 'NOT_FOUND') return res.status(404).json({ error: 'Category not found' });
    if (err.message?.startsWith('CONFLICT')) return res.status(409).json({ error: err.message.split(':')[1] });
    res.status(500).json({ error: 'Server error' });
  }
};
