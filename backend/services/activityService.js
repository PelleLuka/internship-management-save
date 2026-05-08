import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import logger from '../config/logger.js';
import Activity from '../models/Activity.js';

const UPLOADS_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../uploads/activities',
);

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
 * Get all visible activities, fully enriched (categories + internshipCount).
 * Replaces the N+1 pattern of getActivityIds() + getActivityById(id) per id.
 *
 * @returns {Promise<Array<Object>>}
 */
export const getActivityDetails = async () => {
  return await Activity.getAllDetails();
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
 * @param {Object} data - { title, description, categoryIds, visible }
 * @returns {Promise<Object>} Full enriched activity object (id, title, description, documentUrl, visible, categories, internshipCount).
 * @throws {Error} If validation fails
 */
export const createActivity = async (data) => {
  const { title } = data;

  if (!title) {
    throw new Error('MISSING_TITLE');
  }

  if (title.length > 255) {
    throw new Error('TITLE_TOO_LONG');
  }

  const newId = await Activity.create({
    title: data.title.trim(),
    description: data.description?.trim() ?? null,
    categoryIds: data.categoryIds ?? [],
    visible: true,
  });

  return await Activity.getById(newId);
};

/**
 * Update an existing Activity
 * @param {number} id - Activity ID
 * @param {Object} data - { title, description, categoryIds, documentUrl, visible } (all optional)
 * @returns {Promise<Object>} Updated activity object
 * @throws {Error} If validation fails or activity not found
 */
export const updateActivity = async (id, data) => {
  const { title } = data;

  const existing = await Activity.getById(id);
  if (!existing) {
    throw new Error('NOT_FOUND');
  }

  if (
    title === undefined &&
    visible === undefined &&
    data.description === undefined &&
    data.categoryIds === undefined &&
    data.documentUrl === undefined
  ) {
    throw new Error('INVALID_INPUT');
  }

  if (title && title.length > 255) {
    throw new Error('TITLE_TOO_LONG');
  }

  await Activity.update(id, {
    title,
    visible,
    description:
      data.description !== undefined
        ? (data.description?.trim() ?? null)
        : undefined,
    documentUrl: data.documentUrl,
    categoryIds: data.categoryIds,
  });

  return await Activity.getById(id);
};

/**
 * Delete an Activity
 * CdC §2.1: only activities with no linked internships can be deleted.
 * @param {number} id - Activity ID
 * @returns {Promise<void>}
 * @throws {Error} NOT_FOUND | HAS_LINKED_INTERNSHIPS
 */
export const deleteActivity = async (id) => {
  const existing = await Activity.getById(id);
  if (!existing) throw new Error('NOT_FOUND');

  if (existing.internshipCount > 0) throw new Error('HAS_LINKED_INTERNSHIPS');

  await Activity.delete(id);
};

export const uploadActivityDocument = async (id, filename) => {
  const activity = await Activity.getById(id);
  if (!activity) throw new Error('NOT_FOUND');
  if (activity.documentUrl) {
    const oldPath = path.join(UPLOADS_DIR, activity.documentUrl);
    if (fs.existsSync(oldPath)) {
      try {
        fs.unlinkSync(oldPath);
      } catch (err) {
        logger.warn(`Failed to unlink ${oldPath}: ${err.message}`);
      }
    }
  }
  await Activity.update(id, { documentUrl: filename });
  return filename;
};

export const getActivityDocumentPath = async (id) => {
  const activity = await Activity.getById(id);
  if (!activity?.documentUrl) throw new Error('NO_DOCUMENT');
  const filePath = path.join(UPLOADS_DIR, activity.documentUrl);
  if (!fs.existsSync(filePath)) throw new Error('FILE_NOT_FOUND');
  return filePath;
};

export const deleteActivityDocument = async (id) => {
  const activity = await Activity.getById(id);
  if (!activity?.documentUrl) throw new Error('NO_DOCUMENT');
  const filePath = path.join(UPLOADS_DIR, activity.documentUrl);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      logger.warn(`Failed to unlink ${filePath}: ${err.message}`);
    }
  }
  await Activity.update(id, { documentUrl: null });
};
