import pool from '../config/db.js';

const Internship = {
  /**
   * Retrieves all internship IDs from the database.
   * Useful for list views where only IDs are needed initially (lazy loading).
   * 
   * @returns {Promise<Array<{id: number}>>} Array of objects containing internship IDs.
   */
  /**
   * Retrieves all internships with pagination.
   * 
   * @param {number} limit - Number of items per page.
   * @param {number} offset - Number of items to skip.
   * @returns {Promise<Array<Object>>} Array of internship objects.
   */
  getAll: async (limit, offset) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query(
        'SELECT * FROM internship ORDER BY start_date DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );
      
      // Map snake_case to camelCase
      return rows.map(row => ({
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.email,
        startDate: row.start_date,
        endDate: row.end_date
      }));
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.end();
    }
  },

  /**
   * Counts total number of internships.
   * @returns {Promise<number>} Total count.
   */
  count: async () => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query('SELECT COUNT(*) as total FROM internship');
      return Number(rows[0].total);
    } catch (err) {
      throw err;
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
      const rows = await conn.query('SELECT * FROM internship WHERE id = ?', [id]);
      if (rows.length > 0) {
        const row = rows[0];
        // Map snake_case to camelCase
        return {
          id: row.id,
          firstName: row.first_name,
          lastName: row.last_name,
          email: row.email,
          startDate: row.start_date,
          endDate: row.end_date
        };
      }
      return null;
    } catch (err) {
      throw err;
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
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.end();
    }
  },

  /**
   * Creates a new internship record.
   * 
   * @param {Object} data - The internship data.
   * @param {string} data.firstName - First name of the intern.
   * @param {string} data.lastName - Last name of the intern.
   * @param {string} data.email - Email address.
   * @param {string} data.startDate - Start date (YYYY-MM-DD).
   * @param {string} data.endDate - End date (YYYY-MM-DD).
   * @returns {Promise<number>} The ID of the newly created internship.
   */
  create: async (data) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query(
        'INSERT INTO internship (first_name, last_name, email, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
        [data.firstName, data.lastName, data.email, data.startDate, data.endDate]
      );
      // Return the new ID (convert BigInt to Number)
      return Number(res.insertId);
    } catch (err) {
      throw err;
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
        [internshipId, activityId]
      );
      return res.affectedRows >= 0; // Return true if successful (even if already existed)
    } catch (err) {
      throw err;
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
      // Assuming ON DELETE CASCADE is set up in DB for relations
      const res = await conn.query('DELETE FROM internship WHERE id = ?', [id]);
      return res.affectedRows > 0;
    } catch (err) {
      throw err;
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
        [internshipId, activityId]
      );
      return res.affectedRows > 0;
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.end();
    }
  },

  /**
   * Updates an existing internship's details.
   * 
   * @param {number} id - The ID of the internship to update.
   * @param {Object} data - Object containing fields to update.
   * @returns {Promise<boolean>} True if the update was successful (row found).
   */
  update: async (id, data) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query(
        'UPDATE internship SET first_name = ?, last_name = ?, email = ?, start_date = ?, end_date = ? WHERE id = ?',
        [data.firstName, data.lastName, data.email, data.startDate, data.endDate, id]
      );
      // res.affectedRows gives the number of rows changed
      return res.affectedRows > 0;
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.end();
    }
  }
};

export default Internship;
