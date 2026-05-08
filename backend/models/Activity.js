import { withConnection } from '../config/db.js';

const Activity = {
  /**
   * Retrieves all IDs of ACTIVE activities (visible = 1).
   * Soft-deleted activities (visible = 0) are excluded from this specific query
   * to hide them from the global catalogue.
   *
   * @returns {Promise<Array<{id: number}>>} Array of activity IDs.
   */
  getAllIds: async () => {
    return withConnection(async (conn) => {
      // Only return visible activites
      const rows = await conn.query(
        'SELECT id FROM activity WHERE visible = 1',
      );
      return rows;
    });
  },

  /**
   * Retrieves full details of an activity by its ID.
   * Can return soft-deleted activities if queried directly by ID.
   *
   * @param {number} id - The ID of the activity.
   * @returns {Promise<Object|null>} The activity object or null.
   */
  getById: async (id) => {
    return withConnection(async (conn) => {
      const rows = await conn.query(
        `SELECT
          a.id,
          a.title,
          a.description,
          a.document_url,
          a.visible,
          GROUP_CONCAT(DISTINCT c.id ORDER BY c.id) AS category_ids,
          GROUP_CONCAT(DISTINCT c.name ORDER BY c.id SEPARATOR '||') AS category_names,
          (SELECT COUNT(*) FROM internship_activity ia WHERE ia.activity_id = a.id) AS internship_count
        FROM activity a
        LEFT JOIN activity_category ac ON ac.activity_id = a.id
        LEFT JOIN category c ON c.id = ac.category_id
        WHERE a.id = ?
        GROUP BY a.id`,
        [id],
      );
      if (!rows[0]) return null;
      const row = rows[0];
      const ids = row.category_ids
        ? row.category_ids.split(',').map(Number)
        : [];
      const names = row.category_names ? row.category_names.split('||') : [];
      const categories = ids.map((cid, i) => ({ id: cid, name: names[i] }));
      return {
        id: row.id,
        title: row.title,
        description: row.description,
        documentUrl: row.document_url,
        visible: row.visible,
        categories,
        internshipCount: Number(row.internship_count),
      };
    });
  },

  /**
   * Creates a new activity.
   *
   * @param {Object} data - The activity data.
   * @param {string} data.title - The title of the activity.
   * @param {boolean} [data.visible=true] - Visibility status.
   * @returns {Promise<number>} The ID of the newly created activity.
   */
  create: async (data) => {
    return withConnection(async (conn) => {
      const res = await conn.query(
        'INSERT INTO activity (title, description, visible) VALUES (?, ?, ?)',
        [
          data.title,
          data.description ?? null,
          data.visible !== undefined ? data.visible : true,
        ],
      );
      const id = Number(res.insertId);
      if (data.categoryIds?.length) {
        for (const cid of data.categoryIds) {
          await conn.query(
            'INSERT INTO activity_category (activity_id, category_id) VALUES (?, ?)',
            [id, cid],
          );
        }
      }
      return id;
    });
  },

  /**
   * Updates an activity (Partial Update).
   * Only updates the fields provided in the 'data' object.
   *
   * @param {number} id - The ID of the activity.
   * @param {Object} data - Fields to update (title, visible).
   * @returns {Promise<boolean>} True if successful.
   */
  update: async (id, data) => {
    return withConnection(async (conn) => {
      const fields = [];
      const values = [];
      if (data.title !== undefined) {
        fields.push('title = ?');
        values.push(data.title);
      }
      if (data.description !== undefined) {
        fields.push('description = ?');
        values.push(data.description);
      }
      if (data.documentUrl !== undefined) {
        fields.push('document_url = ?');
        values.push(data.documentUrl);
      }
      if (data.visible !== undefined) {
        fields.push('visible = ?');
        values.push(data.visible);
      }
      if (fields.length) {
        values.push(id);
        await conn.query(
          `UPDATE activity SET ${fields.join(', ')} WHERE id = ?`,
          values,
        );
      }
      if (data.categoryIds !== undefined) {
        await conn.query(
          'DELETE FROM activity_category WHERE activity_id = ?',
          [id],
        );
        for (const cid of data.categoryIds) {
          await conn.query(
            'INSERT INTO activity_category (activity_id, category_id) VALUES (?, ?)',
            [id, cid],
          );
        }
      }
      return true;
    });
  },

  /**
   * Performs a Soft Delete on the activity.
   * Sets `visible` to 0 instead of removing the row.
   *
   * @param {number} id - The ID of the activity.
   * @returns {Promise<boolean>} True if successful.
   */
  delete: async (id) => {
    return withConnection(async (conn) => {
      const res = await conn.query(
        'UPDATE activity SET visible = 0 WHERE id = ?',
        [id],
      );
      return res.affectedRows > 0;
    });
  },
};

export default Activity;
