import Activity from '../models/Activity.js';

/**
 * Service: Activity
 * Handles business logic for Activity management.
 */

/**
 * Get all Activity IDs
 * @returns {Promise<Array>} List of activity IDs
 */
export const getActivityIds = async () => {
    return await Activity.getAllIds();
};

/**
 * Get Activity by ID
 * @param {number} id - Activity ID
 * @returns {Promise<Object>} Activity object
 * @throws {Error} If activity not found (message: 'NOT_FOUND')
 */
export const getActivityById = async (id) => {
    const activity = await Activity.getById(id);
    if (!activity) {
        throw new Error('NOT_FOUND');
    }
    return activity;
};

/**
 * Create a new Activity
 * @param {Object} data - { title, visible }
 * @returns {Promise<Object>} Created activity object
 * @throws {Error} If validation fails
 */
export const createActivity = async (data) => {
    const { title, visible } = data;

    if (!title) {
        throw new Error('MISSING_TITLE');
    }

    if (title.length > 255) {
        throw new Error('TITLE_TOO_LONG');
    }

    const newId = await Activity.create({ title, visible });

    return {
        id: newId,
        title,
        visible: visible !== undefined ? visible : true
    };
};

/**
 * Update an existing Activity
 * @param {number} id - Activity ID
 * @param {Object} data - { title, visible }
 * @returns {Promise<Object>} Updated activity object
 * @throws {Error} If validation fails or activity not found
 */
export const updateActivity = async (id, data) => {
    const { title, visible } = data;

    if (title === undefined && visible === undefined) {
        throw new Error('INVALID_INPUT');
    }

    if (title && title.length > 255) {
        throw new Error('TITLE_TOO_LONG');
    }

    const success = await Activity.update(id, { title, visible });

    if (!success) {
        const existing = await Activity.getById(id);
        if (!existing) {
            throw new Error('NOT_FOUND');
        }
    }

    return await Activity.getById(id);
};

/**
 * Delete an Activity
 * @param {number} id - Activity ID
 * @returns {Promise<void>}
 * @throws {Error} If activity not found
 */
export const deleteActivity = async (id) => {
    const success = await Activity.delete(id);

    if (!success) {
        const existing = await Activity.getById(id);
        if (!existing) {
             throw new Error('NOT_FOUND');
        }
    }
};
