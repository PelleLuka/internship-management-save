import express from 'express';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from '../controllers/categoryController.js';

const router = express.Router();
router.get('/', getCategories);
router.post('/', createCategory);
router.get('/:id', getCategoryById);
router.patch('/:id', updateCategory);
router.delete('/:id', deleteCategory);
export default router;
