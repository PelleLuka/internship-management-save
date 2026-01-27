import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
// import morgan from 'morgan'; // Removed Morgan
import logger from './config/logger.js';
import requestLogger from './middleware/requestLogger.js'; // Import Middleware
import healthRoutes from './routes/healthRoutes.js';
import internshipRoutes from './routes/internshipRoutes.js';
import activityRoutes from './routes/activityRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Entry Point: Backend Server
 * Configures Express, Middleware, and Routes.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root directory (parent of backend)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Custom Logger Middleware
app.use(requestLogger);

// Mount Routes
/**
 * @route /health - Health check endpoint
 * @route /internships - Internship management endpoints
 * @route /activities - Activity management endpoints
 */
app.use('/api/health', healthRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/activities', activityRoutes);

// Optional: Global error handler
app.use((err, _req, res, _next) => {
    logger.error(err.stack); // Use logger.error
    res.status(500).json({ status: 'error', error: 'Something went wrong!' });
});

// Start Server
app.listen(PORT, () => {
    logger.info(`Backend server listening at http://localhost:${PORT}`);
});
