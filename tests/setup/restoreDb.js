import mariadb from 'mariadb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables (same as backend config)
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const restoreDb = async () => {
    let conn;
    try {
        console.log('🔄 Connecting to database...');
        conn = await mariadb.createConnection({
            host: process.env.DB_HOST || 'localhost', // Default to localhost for local execution if not in Docker
            user: process.env.DB_USER || 'user',
            password: process.env.DB_PASSWORD || 'password',
            database: process.env.DB_NAME || 'internship_management',
            multipleStatements: true // Allow executing multiple SQL statements at once
        });

        console.log('✅ Connected.');

        const sqlFilePath = path.join(__dirname, 'restore_db.sql');
        console.log(`📖 Reading SQL file: ${sqlFilePath}`);
        
        const sql = fs.readFileSync(sqlFilePath, 'utf8');

        // Split by semicolon? No, mariadb driver supports multipleStatements: true
        // But let's check if the driver executes them all or just the first.
        // Documentation says multipleStatements allows it. However, explicit split might be safer/clearer progress.
        // But split is complex with stored procs etc. Here it's simple INSERTs.
        // Let's try direct execution first.

        console.log('🚀 Executing SQL script...');
        await conn.query(sql);

        console.log('✨ Database restored successfully!');

    } catch (err) {
        console.error('❌ Error restoring database:', err);
        process.exit(1);
    } finally {
        if (conn) conn.end();
    }
};

restoreDb();
