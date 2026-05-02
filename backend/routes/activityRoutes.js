import express from 'express';
import { getActivityIds, getActivityById, updateActivity, createActivity, deleteActivity, uploadDocument, downloadDocument, deleteDocument } from '../controllers/activityController.js';
import { uploadActivityDocument } from '../middleware/upload.js';

const router = express.Router();

// GET /activities (mapped to /)
router.get('/', getActivityIds);

// POST /activities
router.post('/', createActivity);

// GET /activities/:id
router.get('/:id', getActivityById);

// PATCH /activities/:id
router.patch('/:id', updateActivity);

// DELETE /activities/:id
router.delete('/:id', deleteActivity);

// Document endpoints
router.post('/:id/document', (req, res, next) => {
  uploadActivityDocument(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}, uploadDocument);
router.get('/:id/document', downloadDocument);
router.delete('/:id/document', deleteDocument);

export default router;
