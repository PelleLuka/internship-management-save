import pool from '../config/db.js';

/**
 * Health Check Controller
 * Verifies that the API is running and that the database connection is efficient.
 * 
 * @param {Object} _req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Sends a JSON status response.
 */
export const getHealth = async (_req, res) => {
    try {
        const conn = await pool.getConnection();
        await conn.ping();
        conn.release();
        res.json({ status: 'ok', database: 'connected' });
    } catch (err) {
        console.error('Database connection failed', err);
        res.status(500).json({ status: 'error', database: 'disconnected', error: err.message });
    }
};
