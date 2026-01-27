import logger from '../config/logger.js';

/**
 * Middleware: Request Logger
 * Captures HTTP request details and logs them using Winston.
 * Replacing Morgan dependencies with a custom implementation.
 */
const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    // Capture basic info immediately
    const method = req.method;
    const url = req.originalUrl || req.url;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
    const userAgent = req.headers['user-agent'] || null;

    // Listen for the response to finish
    res.on('finish', () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        const contentLength = res.get('Content-Length') || 0;

        const logObject = {
            method,
            url,
            status,
            duration: `${duration}ms`,
            contentLength,
            ip,
            userAgent
        };

        // Log based on status code (Error if 500+, Info otherwise)
        if (status >= 500) {
            logger.error(JSON.stringify(logObject));
        } else {
            logger.info(JSON.stringify(logObject));
        }
    });

    next();
};

export default requestLogger;
