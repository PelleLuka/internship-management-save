import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
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

  const newId = await Activity.create({
    title: data.title.trim(),
    description: data.description?.trim() ?? null,
    categoryIds: data.categoryIds ?? [],
    visible: true,
  });

  return {
    id: newId,
    title,
    visible: visible !== undefined ? visible : true,
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

  const success = await Activity.update(id, {
    title,
    visible,
    description:
      data.description !== undefined
        ? (data.description?.trim() ?? null)
        : undefined,
    documentUrl: data.documentUrl,
    categoryIds: data.categoryIds,
  });

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
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
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
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  await Activity.update(id, { documentUrl: null });
};
