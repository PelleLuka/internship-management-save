import express from 'express';
import { getActivityIds, getActivityById, updateActivity, createActivity, deleteActivity } from '../controllers/activityController.js';

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

export default router;
