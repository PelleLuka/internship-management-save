import pool from '../config/db.js';

const mapRow = (row) => ({
  id: row.id,
  personId: Number(row.person_id),
  firstName: row.first_name,
  lastName: row.last_name,
  email: row.email,
  startDate: row.start_date,
  endDate: row.end_date,
});

const Internship = {
  /**
   * Retrieves all internships with pagination and optional search.
   *
   * @param {number} limit - Number of items per page.
   * @param {number} offset - Number of items to skip.
   * @param {string} [search] - Optional search term to filter by first name, last name, or email.
   * @returns {Promise<Array<Object>>} Array of internship objects.
   */
  getAll: async (limit, offset, search = '') => {
    let conn;
    try {
      conn = await pool.getConnection();
      let query = `
      SELECT i.id, i.person_id, p.first_name, p.last_name, p.email, i.start_date, i.end_date
      FROM internship i
      JOIN person p ON i.person_id = p.id
    `;
      const params = [];
      if (search?.trim()) {
        const term = `%${search.trim()}%`;
        query +=
          ' WHERE p.first_name LIKE ? OR p.last_name LIKE ? OR p.email LIKE ?';
        params.push(term, term, term);
      }
      query += ' ORDER BY i.start_date DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);
      const rows = await conn.query(query, params);
      return rows.map(mapRow);
    } finally {
      if (conn) conn.end();
    }
  },

  /**
   * Counts total number of internships with optional search filter.
   * @param {string} [search] - Optional search term to filter by first name, last name, or email.
   * @returns {Promise<number>} Total count.
   */
  count: async (search = '') => {
    let conn;
    try {
      conn = await pool.getConnection();
      let query = `SELECT COUNT(*) as total FROM internship i JOIN person p ON i.person_id = p.id`;
      const params = [];
      if (search?.trim()) {
        const term = `%${search.trim()}%`;
        query +=
          ' WHERE p.first_name LIKE ? OR p.last_name LIKE ? OR p.email LIKE ?';
        params.push(term, term, term);
      }
      const rows = await conn.query(query, params);
      return Number(rows[0].total);
    } finally {
      if (conn) conn.end();
    }
  },

  /**
   * Retrieves full details of a specific internship by its ID.
   * Mapping snake_case DB fields to camelCase for frontend consistency.
   *
   * @param {number} id - The unique identifier of the internship.
   * @returns {Promise<Object|null>} The internship object if found, or null.
   */
  getById: async (id) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query(
        `
        SELECT i.id, i.person_id, p.first_name, p.last_name, p.email, i.start_date, i.end_date
        FROM internship i
        JOIN person p ON i.person_id = p.id
        WHERE i.id = ?
      `,
        [id],
      );
      if (!rows[0]) return null;
      return mapRow(rows[0]);
    } finally {
      if (conn) conn.end();
    }
  },

  /**
   * Retrieves all activities linked to a specific internship.
   * NOTE: This returns ALL linked activities, including those marked as "visible = 0" (soft deleted),
   * to preserve the integrity of historical data for the internship.
   *
   * @param {number} internshipId - The ID of the internship.
   * @returns {Promise<Array<Object>>} Array of activity objects.
   */
  getActivities: async (internshipId) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const query = `
        SELECT a.*
        FROM activity a
        JOIN internship_activity ia ON a.id = ia.activity_id
        WHERE ia.internship_id = ?
      `;
      const rows = await conn.query(query, [internshipId]);
      return rows;
    } finally {
      if (conn) conn.end();
    }
  },

  /**
   * Creates a new internship record.
   *
   * @param {Object} data - The internship data.
   * @param {number} data.personId - ID of the linked person.
   * @param {string} data.startDate - Start date (YYYY-MM-DD).
   * @param {string} data.endDate - End date (YYYY-MM-DD).
   * @returns {Promise<number>} The ID of the newly created internship.
   */
  create: async (data) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query(
        'INSERT INTO internship (person_id, start_date, end_date) VALUES (?, ?, ?)',
        [data.personId, data.startDate, data.endDate],
      );
      return Number(res.insertId);
    } finally {
      if (conn) conn.end();
    }
  },

  /**
   * Links an activity to an internship.
   * Uses INSERT IGNORE to safely handle duplicate link attempts.
   *
   * @param {number} internshipId - The ID of the internship.
   * @param {number} activityId - The ID of the activity to link.
   * @returns {Promise<boolean>} True if the operation was successful.
   */
  addActivity: async (internshipId, activityId) => {
    let conn;
    try {
      conn = await pool.getConnection();
      // Use IGNORE to prevent error if relationship already exists
      const res = await conn.query(
        'INSERT IGNORE INTO internship_activity (internship_id, activity_id) VALUES (?, ?)',
        [internshipId, activityId],
      );
      return res.affectedRows >= 0; // Return true if successful (even if already existed)
    } finally {
      if (conn) conn.end();
    }
  },

  /**
   * Unlinks an activity from an internship.
   *
   * @param {number} internshipId - The ID of the internship.
   * @param {number} activityId - The ID of the activity to remove.
   * @returns {Promise<boolean>} True if the link was removed.
   */
  removeActivity: async (internshipId, activityId) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query(
        'DELETE FROM internship_activity WHERE internship_id = ? AND activity_id = ?',
        [internshipId, activityId],
      );
      return res.affectedRows > 0;
    } finally {
      if (conn) conn.end();
    }
  },

  /**
   * Updates an existing internship's dates.
   *
   * @param {number} id - The ID of the internship to update.
   * @param {Object} data - Object containing fields to update (startDate, endDate).
   * @returns {Promise<boolean>} True if the update was successful (row found).
   */
  update: async (id, data) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const fields = [];
      const values = [];
      if (data.startDate !== undefined) {
        fields.push('start_date = ?');
        values.push(data.startDate);
      }
      if (data.endDate !== undefined) {
        fields.push('end_date = ?');
        values.push(data.endDate);
      }
      if (!fields.length) return false;
      values.push(id);
      const res = await conn.query(
        `UPDATE internship SET ${fields.join(', ')} WHERE id = ?`,
        values,
      );
      return res.affectedRows > 0;
    } finally {
      if (conn) conn.end();
    }
  },

  /**
   * Deletes an internship record.
   * Assuming DB constraints (ON DELETE CASCADE) handle related data cleanup.
   *
   * @param {number} id - The ID of the internship to delete.
   * @returns {Promise<boolean>} True if a row was deleted, false if not found.
   */
  delete: async (id) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query('DELETE FROM internship WHERE id = ?', [id]);
      return res.affectedRows > 0;
    } finally {
      if (conn) conn.end();
    }
  },
};

export default Internship;
