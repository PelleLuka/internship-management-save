import * as internshipService from '../services/internshipService.js';
import logger from '../config/logger.js';

/**
 * Controller: Get Internships (Paginated with Search)
 * Fetches internships with pagination and optional search support.
 * Query Params: ?page=1&limit=20&search=term
 */
export const getInternships = async (req, res) => {
    try {
        const page = Number.parseInt(req.query.page, 10) || 1;
        const limit = Number.parseInt(req.query.limit, 10) || 20;
        const search = req.query.search || '';

        const result = await internshipService.getInternships(page, limit, search);
        res.status(200).json(result);
    } catch (err) {
        logger.error('Error fetching internships:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Controller: Get Internship By ID
 * Fetches detailed information for a specific internship.
 */
export const getInternshipById = async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const internship = await internshipService.getInternshipById(id);
        res.status(200).json(internship);
    } catch (err) {
        if (err.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Internship not found' });
        }
        logger.error('Error fetching internship:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Controller: Get Internship Activities
 * Fetches all activities linked to a specific internship.
 */
export const getInternshipActivities = async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const activities = await internshipService.getInternshipActivities(id);
        res.status(200).json(activities);
    } catch (err) {
        logger.error('Error fetching internship activities:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Controller: Create Internship
 * Validates input and creates a new internship record.
 */
export const createInternship = async (req, res) => {
    try {
        const newInternship = await internshipService.createInternship(req.body);
        res.status(201).json(newInternship);
    } catch (err) {
        if (err.message === 'MISSING_FIELDS') {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        if (err.message === 'NAME_TOO_LONG') {
            return res.status(400).json({ error: 'First name and last name cannot exceed 80 characters' });
        }
        if (err.message === 'INVALID_DATE_FORMAT') {
            return res.status(400).json({ error: 'Dates must be in YYYY-MM-DD format and must be valid dates' });
        }
        if (err.message === 'END_DATE_BEFORE_START') {
            return res.status(400).json({ error: 'End date must be after start date' });
        }
        if (err.message === 'EMAIL_TOO_LONG') {
            return res.status(400).json({ error: 'Email cannot exceed 254 characters' });
        }
        if (err.message === 'INVALID_EMAIL') {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        logger.error('Error creating internship:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Controller: Update Internship
 * Updates details of an existing internship.
 */
export const updateInternship = async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const updatedInternship = await internshipService.updateInternship(id, req.body);
        res.status(200).json(updatedInternship);
    } catch (err) {
        if (err.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Internship not found' });
        }
        if (err.message === 'MISSING_FIELDS') {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        if (err.message === 'NAME_TOO_LONG') {
            return res.status(400).json({ error: 'First name and last name cannot exceed 80 characters' });
        }
        if (err.message === 'INVALID_DATE_FORMAT') {
             return res.status(400).json({ error: 'Dates must be in YYYY-MM-DD format and must be valid dates' });
        }
        if (err.message === 'END_DATE_BEFORE_START') {
             return res.status(400).json({ error: 'End date must be after start date' });
        }
        if (err.message === 'EMAIL_TOO_LONG') {
            return res.status(400).json({ error: 'Email cannot exceed 254 characters' });
        }
        if (err.message === 'INVALID_EMAIL') {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        logger.error('Error updating internship:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Controller: Add Activity to Internship
 * Links an activity to an internship.
 */
export const addActivityToInternship = async (req, res) => {
    try {
        const internshipId = Number.parseInt(req.params.internshipId, 10);
        const activityId = Number.parseInt(req.params.activityId, 10);

        const activity = await internshipService.addActivityToInternship(internshipId, activityId);
        res.status(200).json(activity);
    } catch (err) {
        if (err.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Internship or Activity not found' });
        }
        logger.error('Error linking activity to internship:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Controller: Delete Internship
 * Removes an internship record.
 */
export const deleteInternship = async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        await internshipService.deleteInternship(id);
        res.status(204).send();
    } catch (err) {
        if (err.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Internship not found' });
        }
        logger.error('Error deleting internship:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Controller: Remove Activity from Internship
 * Unlinks an activity from an internship.
 */
export const removeActivityFromInternship = async (req, res) => {
    try {
        const internshipId = Number.parseInt(req.params.internshipId, 10);
        const activityId = Number.parseInt(req.params.activityId, 10);

        await internshipService.removeActivityFromInternship(internshipId, activityId);
        res.status(204).send();
    } catch (err) {
        if (err.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Association not found' });
        }
        logger.error('Error removing activity from internship:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
