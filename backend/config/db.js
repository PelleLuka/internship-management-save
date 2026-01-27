import mariadb from 'mariadb';
import dotenv from 'dotenv';

// Adjust path to find .env file in parent directory if needed, or default/current
// The original index.js just did dotenv.config(), but migrate.js had a relative path.
// Given index.js was in backend/, simple dotenv.config() works if run from backend/.
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root directory (grandparent of config)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = mariadb.createPool({
    host: process.env.DB_HOST || 'database',
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'internship_management',
    connectionLimit: 5
});

export default pool;
