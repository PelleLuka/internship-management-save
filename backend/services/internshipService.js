import Activity from '../models/Activity.js';
import Internship from '../models/Internship.js';

/**
 * Service: Internship
 * Handles business logic for Internship management.
 */

/* --- Helpers --- */
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidDate = (dateString) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return false;
    return date.toISOString().startsWith(dateString);
};

/* --- Methods --- */

/**
 * Get all Internship IDs
 * @returns {Promise<Array>} List of internship IDs
 */
export const getInternshipIds = async () => {
    return await Internship.getAllIds();
};

/**
 * Get Internship by ID
 * @param {number} id - Internship ID
 * @returns {Promise<Object>} Internship object
 * @throws {Error} If internship not found
 */
export const getInternshipById = async (id) => {
    const internship = await Internship.getById(id);
    if (!internship) {
        throw new Error('NOT_FOUND');
    }
    return internship;
};

/**
 * Get Activities for an Internship
 * @param {number} id - Internship ID
 * @returns {Promise<Array>} List of activities
 */
export const getInternshipActivities = async (id) => {
    return await Internship.getActivities(id);
};

/**
 * Create a new Internship
 * @param {Object} data - { firstName, lastName, email, startDate, endDate }
 * @returns {Promise<Object>} Created internship object
 * @throws {Error} If validation fails
 */
export const createInternship = async (data) => {
    const { firstName, lastName, email, startDate, endDate } = data;

    if (!firstName || !lastName || !email || !startDate || !endDate) {
        throw new Error('MISSING_FIELDS');
    }

    if (firstName.length >= 80 || lastName.length >= 80) {
        throw new Error('NAME_TOO_LONG');
    }

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
        throw new Error('INVALID_DATE_FORMAT');
    }

    if (new Date(endDate) < new Date(startDate)) {
        throw new Error('END_DATE_BEFORE_START');
    }

    if (email.length > 254) {
        throw new Error('EMAIL_TOO_LONG');
    }
    if (!isValidEmail(email)) {
        throw new Error('INVALID_EMAIL');
    }

    const newId = await Internship.create({ firstName, lastName, email, startDate, endDate });

    return {
        id: newId,
        firstName,
        lastName,
        email,
        startDate,
        endDate
    };
};

/**
 * Update an Internship
 * @param {number} id - Internship ID
 * @param {Object} data - { firstName, lastName, email, startDate, endDate }
 * @returns {Promise<Object>} Updated internship object
 * @throws {Error} If validation fails or internship not found
 */
export const updateInternship = async (id, data) => {
    const { firstName, lastName, email, startDate, endDate } = data;

    if (!firstName || !lastName || !email || !startDate || !endDate) {
        throw new Error('MISSING_FIELDS');
    }

    if (firstName.length >= 80 || lastName.length >= 80) {
        throw new Error('NAME_TOO_LONG');
    }

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
        throw new Error('INVALID_DATE_FORMAT');
    }

    if (new Date(endDate) < new Date(startDate)) {
        throw new Error('END_DATE_BEFORE_START');
    }

    if (email) {
        if (email.length > 254) {
             throw new Error('EMAIL_TOO_LONG');
        }
        if (!isValidEmail(email)) {
             throw new Error('INVALID_EMAIL');
        }
    }

    const updated = await Internship.update(id, { firstName, lastName, email, startDate, endDate });

    if (!updated) {
         throw new Error('NOT_FOUND');
    }

    return { id, firstName, lastName, email, startDate, endDate };
};

/**
 * Delete an Internship
 * @param {number} id - Internship ID
 * @returns {Promise<void>}
 * @throws {Error} If internship not found
 */
export const deleteInternship = async (id) => {
    const deleted = await Internship.delete(id);
    if (!deleted) {
        throw new Error('NOT_FOUND');
    }
};

/**
 * Add Activity to Internship
 * @param {number} internshipId
 * @param {number} activityId
 * @returns {Promise<Object>} The added activity
 * @throws {Error} If entities not found
 */
export const addActivityToInternship = async (internshipId, activityId) => {
    const internship = await Internship.getById(internshipId);
    const activity = await Activity.getById(activityId);

    if (!internship || !activity) {
        throw new Error('NOT_FOUND');
    }

    await Internship.addActivity(internshipId, activityId);
    return activity;
};

/**
 * Remove Activity from Internship
 * @param {number} internshipId
 * @param {number} activityId
 * @returns {Promise<void>}
 * @throws {Error} If association not found
 */
export const removeActivityFromInternship = async (internshipId, activityId) => {
    const removed = await Internship.removeActivity(internshipId, activityId);
    if (!removed) {
         throw new Error('NOT_FOUND');
    }
};
