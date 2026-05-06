import Activity from '../models/Activity.js';
import Internship from '../models/Internship.js';
import Person from '../models/Person.js';

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
 * Get all Internships with pagination and optional search
 * @param {number} page - Current page number (1-based)
 * @param {number} limit - Items per page
 * @param {string} [search] - Optional search term
 * @returns {Promise<Object>} { data: Array, total: Number }
 */
export const getInternships = async (page = 1, limit = 20, search = '') => {
    const offset = (page - 1) * limit;
    const [data, total] = await Promise.all([
        Internship.getAll(limit, offset, search),
        Internship.count(search)
    ]);
    
    return { data, total };
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

const validateFields = (data, { partial = false } = {}) => {
  const fn = data.firstName?.trim();
  const ln = data.lastName?.trim();
  const em = data.email?.trim();

  if (!partial) {
    if (!fn || !ln || !em || !data.startDate || !data.endDate) throw new Error('MISSING_FIELDS');
  }
  if ((fn && fn.length > 80) || (ln && ln.length > 80)) throw new Error('NAME_TOO_LONG');
  if (em && em.length > 254) throw new Error('EMAIL_TOO_LONG');
  if (em && !isValidEmail(em)) throw new Error('INVALID_EMAIL');
  if (data.startDate && !isValidDate(data.startDate)) throw new Error('INVALID_DATE_FORMAT');
  if (data.endDate && !isValidDate(data.endDate)) throw new Error('INVALID_DATE_FORMAT');
};

/**
 * Create a new Internship
 * @param {Object} data - { firstName, lastName, email, startDate, endDate }
 * @returns {Promise<Object>} Created internship object
 * @throws {Error} MISSING_FIELDS | NAME_TOO_LONG | EMAIL_TOO_LONG | INVALID_EMAIL | INVALID_DATE_FORMAT | END_DATE_BEFORE_START
 */
export const createInternship = async (data) => {
  validateFields(data);
  if (data.startDate > data.endDate) throw new Error('END_DATE_BEFORE_START');

  const personId = await Person.create({
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim(),
  });
  const internshipId = await Internship.create({
    personId,
    startDate: data.startDate,
    endDate: data.endDate,
  });
  return await Internship.getById(internshipId);
};

/**
 * Update an Internship
 * @param {number} id - Internship ID
 * @param {Object} data - { firstName, lastName, email, startDate, endDate }
 * @returns {Promise<Object>} Updated internship object
 * @throws {Error} NOT_FOUND | NAME_TOO_LONG | EMAIL_TOO_LONG | INVALID_EMAIL | INVALID_DATE_FORMAT | END_DATE_BEFORE_START
 */
export const updateInternship = async (id, data) => {
  const internship = await Internship.getById(id);
  if (!internship) throw new Error('NOT_FOUND');

  validateFields(data, { partial: true });
  const start = data.startDate ?? internship.startDate;
  const end = data.endDate ?? internship.endDate;
  if (start > end) throw new Error('END_DATE_BEFORE_START');

  await Person.update(internship.personId, {
    firstName: data.firstName?.trim(),
    lastName: data.lastName?.trim(),
    email: data.email?.trim(),
  });
  await Internship.update(id, {
    startDate: data.startDate,
    endDate: data.endDate,
  });

  return await Internship.getById(id);
};

/**
 * Delete an Internship
 * @param {number} id - Internship ID
 * @returns {Promise<void>}
 * @throws {Error} If internship not found
 */
export const deleteInternship = async (id) => {
  const deleted = await Internship.delete(id);
  if (!deleted) throw new Error('NOT_FOUND');
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
