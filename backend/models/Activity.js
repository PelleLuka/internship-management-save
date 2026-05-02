import pool from '../config/db.js';

const Activity = {
  /**
   * Retrieves all IDs of ACTIVE activities (visible = 1).
   * Soft-deleted activities (visible = 0) are excluded from this specific query
   * to hide them from the global catalogue.
   * 
   * @returns {Promise<Array<{id: number}>>} Array of activity IDs.
   */
  getAllIds: async () => {
    let conn;
    try {
      conn = await pool.getConnection();
      // Only return visible activites
      const rows = await conn.query('SELECT id FROM activity WHERE visible = 1');
      return rows;
    } finally {
      if (conn) conn.end();
    }
  },

  /**
   * Retrieves full details of an activity by its ID.
   * Can return soft-deleted activities if queried directly by ID.
   * 
   * @param {number} id - The ID of the activity.
   * @returns {Promise<Object|null>} The activity object or null.
   */
  getById: async (id) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM activity WHERE id = ?', [id]);
      if (!rows[0]) return null;
      const categories = await conn.query(`
        SELECT c.id, c.name FROM category c
        JOIN activity_category ac ON ac.category_id = c.id
        WHERE ac.activity_id = ?
      `, [id]);
      return {
        id: rows[0].id,
        title: rows[0].title,
        description: rows[0].description,
        documentUrl: rows[0].document_url,
        visible: rows[0].visible,
        categories: categories.map(c => ({ id: c.id, name: c.name })),
      };
    } finally {
      if (conn) conn.end();
    }
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
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query(
        'INSERT INTO activity (title, description, visible) VALUES (?, ?, ?)',
        [data.title, data.description ?? null, data.visible !== undefined ? data.visible : true]
      );
      const id = Number(res.insertId);
      if (data.categoryIds?.length) {
        for (const cid of data.categoryIds) {
          await conn.query(
            'INSERT INTO activity_category (activity_id, category_id) VALUES (?, ?)',
            [id, cid]
          );
        }
      }
      return id;
    } finally {
      if (conn) conn.end();
    }
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
    let conn;
    try {
      conn = await pool.getConnection();
      const fields = [];
      const values = [];
      if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
      if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
      if (data.documentUrl !== undefined) { fields.push('document_url = ?'); values.push(data.documentUrl); }
      if (data.visible !== undefined) { fields.push('visible = ?'); values.push(data.visible); }
      if (fields.length) {
        values.push(id);
        await conn.query(`UPDATE activity SET ${fields.join(', ')} WHERE id = ?`, values);
      }
      if (data.categoryIds !== undefined) {
        await conn.query('DELETE FROM activity_category WHERE activity_id = ?', [id]);
        for (const cid of data.categoryIds) {
          await conn.query(
            'INSERT INTO activity_category (activity_id, category_id) VALUES (?, ?)',
            [id, cid]
          );
        }
      }
      return true;
    } finally {
      if (conn) conn.end();
    }
  },

  /**
   * Performs a Soft Delete on the activity.
   * Sets `visible` to 0 instead of removing the row.
   * 
   * @param {number} id - The ID of the activity.
   * @returns {Promise<boolean>} True if successful.
   */
  delete: async (id) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query('UPDATE activity SET visible = 0 WHERE id = ?', [id]);
      return res.affectedRows > 0;
    } finally {
        if (conn) conn.end();
    }
  },

};

export default Activity;
