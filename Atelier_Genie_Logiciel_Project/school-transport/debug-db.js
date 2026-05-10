const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('Testing database connection...');

async function testConnection() {
    try {
        console.log('Step 1: Testing basic MySQL connection without database...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'app_user',
            password: process.env.DB_PASSWORD || 'school_transport_4.0',
            connectTimeout: 5000
        });
        
        console.log('✅ Basic MySQL connection successful');
        await connection.end();
        
        console.log('Step 2: Testing connection with database...');
        const connectionWithDb = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'app_user',
            password: process.env.DB_PASSWORD || 'school_transport_4.0',
            database: process.env.DB_NAME || 'school_transport',
            connectTimeout: 5000
        });
        
        console.log('✅ Connection with database successful');
        await connectionWithDb.end();
        
        console.log('Step 3: Testing pool connection...');
        const pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'app_user',
            password: process.env.DB_PASSWORD || 'school_transport_4.0',
            database: process.env.DB_NAME || 'school_transport',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            acquireTimeout: 5000,
            timeout: 5000,
            reconnect: true,
            connectTimeout: 5000
        });
        
        const poolConnection = await pool.getConnection();
        console.log('✅ Pool connection successful');
        poolConnection.release();
        await pool.end();
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.error('Error code:', error.code);
        console.error('Error number:', error.errno);
        process.exit(1);
    }
}

testConnection();
