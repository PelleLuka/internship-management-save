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
      return rows[0] || null;
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
      // visible defaults to true if not provided (though DB likely defaults it too, safe to be explicit or let DB handle)
      const visible = data.visible !== undefined ? data.visible : true;
      const res = await conn.query(
        'INSERT INTO activity (title, visible) VALUES (?, ?)',
        [data.title, visible]
      );
      return Number(res.insertId);
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

      if (data.title !== undefined) {
        fields.push('title = ?');
        values.push(data.title);
      }

      if (data.visible !== undefined) {
        fields.push('visible = ?');
        values.push(data.visible);
      }

      if (fields.length === 0) {
        return false; // No fields to update
      }

      values.push(id);

      const query = `UPDATE activity SET ${fields.join(', ')} WHERE id = ?`;
      const res = await conn.query(query, values);

      return res.affectedRows > 0;
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
