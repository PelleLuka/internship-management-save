import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mariadb from 'mariadb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const checkDb = async () => {
  let conn;
  try {
    console.log('🔄 Connecting to database...');
    conn = await mariadb.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'user',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'internship_management',
    });

    console.log('✅ Connected.');
    const rows = await conn.query('SELECT COUNT(*) as count FROM internship');
    console.log(`📊 Internship Count: ${rows[0].count}`);
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    if (conn) conn.end();
  }
};

checkDb();
