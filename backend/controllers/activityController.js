import * as activityService from '../services/activityService.js';
import logger from '../config/logger.js';

/**
 * Controller: Get Activity IDs
 * Fetches IDs of all ACTIVE activities.
 */
export const getActivityIds = async (_req, res) => {
    try {
        const activities = await activityService.getActivityIds();
        res.status(200).json(activities);
    } catch (err) {
        logger.error('Error fetching activity IDs:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Controller: Get Activity By ID
 * Fetches full details of a specific activity.
 */
export const getActivityById = async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const activity = await activityService.getActivityById(id);
        res.status(200).json(activity);
    } catch (err) {
        if (err.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Activity not found' });
        }
        logger.error('Error fetching activity:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Controller: Update Activity
 * Partial update for activity properties (title, visible).
 */
export const updateActivity = async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const updatedActivity = await activityService.updateActivity(id, req.body);
        res.status(200).json(updatedActivity);
    } catch (err) {
        if (err.message === 'INVALID_INPUT') {
            return res.status(400).json({ error: 'Invalid input data: at least one field must be provided' });
        }
        if (err.message === 'TITLE_TOO_LONG') {
            return res.status(400).json({ error: 'Title cannot exceed 255 characters' });
        }
        if (err.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Activity not found' });
        }
        logger.error('Error updating activity:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Controller: Create Activity
 * Creates a new activity.
 */
export const createActivity = async (req, res) => {
    try {
        const newActivity = await activityService.createActivity(req.body);
        res.status(201).json(newActivity);
    } catch (err) {
        if (err.message === 'MISSING_TITLE') {
            return res.status(400).json({ error: 'Title is required' });
        }
        if (err.message === 'TITLE_TOO_LONG') {
            return res.status(400).json({ error: 'Title cannot exceed 255 characters' });
        }
        logger.error('Error creating activity:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Controller: Delete Activity
 * Performs a soft delete via the service.
 */
export const deleteActivity = async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        
        await activityService.deleteActivity(id);
        res.status(204).send();
    } catch (err) {
        if (err.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Activity not found' });
        }
        logger.error('Error deleting activity:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
