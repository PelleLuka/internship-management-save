import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import logger from '../config/logger.js';
import Activity from '../models/Activity.js';
import * as activityService from '../services/activityService.js';

const __dirname_ctrl = path.dirname(fileURLToPath(import.meta.url));

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
        if (err.message === 'HAS_LINKED_INTERNSHIPS') {
            return res.status(409).json({ error: 'Activity cannot be deleted: it has linked internships' });
        }
        if (err.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Activity not found' });
        }
        logger.error('Error deleting activity:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Controller: Upload Activity Document
 * Uploads a document file for a specific activity.
 */
export const uploadDocument = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const id = Number(req.params.id);
        const activity = await Activity.getById(id);
        if (!activity) return res.status(404).json({ error: 'Activity not found' });

        if (activity.documentUrl) {
            const oldPath = path.join(__dirname_ctrl, '../uploads/activities', activity.documentUrl);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        await Activity.update(id, { documentUrl: req.file.filename });
        res.json({ documentUrl: req.file.filename, originalName: req.file.originalname });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * Controller: Download Activity Document
 * Streams the document file for a specific activity.
 */
export const downloadDocument = async (req, res) => {
    try {
        const activity = await Activity.getById(Number(req.params.id));
        if (!activity?.documentUrl) return res.status(404).json({ error: 'No document' });
        const filePath = path.join(__dirname_ctrl, '../uploads/activities', activity.documentUrl);
        if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found on disk' });
        res.download(filePath);
    } catch (err) {
        logger.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * Controller: Delete Activity Document
 * Removes the document file and clears the documentUrl for an activity.
 */
export const deleteDocument = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const activity = await Activity.getById(id);
        if (!activity?.documentUrl) return res.status(404).json({ error: 'No document' });
        const filePath = path.join(__dirname_ctrl, '../uploads/activities', activity.documentUrl);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        await Activity.update(id, { documentUrl: null });
        res.json({ success: true });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
