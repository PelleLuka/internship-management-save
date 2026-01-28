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
        
        // Explicitly clear tables first to ensure clean state
        // Note: multipleStatements: true can be flaky depending on driver version/config
        await conn.query('SET FOREIGN_KEY_CHECKS = 0');
        await conn.query('TRUNCATE TABLE internship_activity');
        await conn.query('TRUNCATE TABLE internship');
        await conn.query('TRUNCATE TABLE activity');
        await conn.query('SET FOREIGN_KEY_CHECKS = 1');

        // Now run the inserts from the file (excluding the top SET/TRUNCATEs if they are redundant, but keeping them is fine as we just truncated)
        // Check if file content needs splitting. 
        // For robustness, we will use the file content but rely on our explicit truncates above.
        
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
