import express from 'express';
import { getHealth } from '../controllers/healthController.js';

const router = express.Router();

/**
 * GET /api/health
 * Checks the status of the server and database connection.
 */
router.get('/', getHealth);

export default router;
