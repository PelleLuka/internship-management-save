import express from 'express';
import {
    getInternships,
    getInternshipById,
    createInternship,
    updateInternship,
    deleteInternship,
    getInternshipActivities,
    addActivityToInternship,
    removeActivityFromInternship
} from '../controllers/internshipController.js';

const router = express.Router();

// Define Internship Routes

/**
 * GET /api/internships
 * Returns list of all internships (paginated).
 */
router.get('/', getInternships);

/**
 * POST /api/internships
 * Creates a new internship.
 */
router.post('/', createInternship);

/**
 * GET /api/internships/:id
 * Returns details of a specific internship.
 */
router.get('/:id', getInternshipById);

/**
 * PUT /api/internships/:id
 * Updates an internship.
 */
router.put('/:id', updateInternship);

/**
 * DELETE /api/internships/:id
 * Deletes an internship.
 */
router.delete('/:id', deleteInternship);

/**
 * GET /api/internships/:id/activities
 * Returns all activities linked to the internship.
 */
router.get('/:id/activities', getInternshipActivities);

/**
 * POST /api/internships/:internshipId/activities/:activityId
 * Links an activity to an internship.
 */
router.post('/:internshipId/activities/:activityId', addActivityToInternship);

// DELETE /internships/:internshipId/activities/:activityId
router.delete('/:internshipId/activities/:activityId', removeActivityFromInternship);

export default router;
