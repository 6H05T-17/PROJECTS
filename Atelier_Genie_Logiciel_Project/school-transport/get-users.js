require('dotenv').config();
const fs = require('fs');
const mysql = require('mysql2/promise');

(async () => {
  try {
    console.log('Connecting to database...');
    
    // Create direct connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'app_user',
      password: process.env.DB_PASSWORD || 'school_transport_4.0',
      database: process.env.DB_NAME || 'school_transport',
      connectTimeout: 5000
    });
    
    console.log('Connected! Extracting users...');
    
    let output = 'SCHOOL TRANSPORT APP - LOGIN CREDENTIALS\n';
    output += 'Generated: ' + new Date().toLocaleString() + '\n\n';
    
    // First check table structure
    try {
      const [tables] = await connection.execute('SHOW TABLES');
      output += 'Available tables: ' + tables.map(t => Object.values(t)[0]).join(', ') + '\n\n';
      
      // Check users table structure
      try {
        const [usersColumns] = await connection.execute('DESCRIBE users');
        output += 'Users table columns: ' + usersColumns.map(c => c.Field).join(', ') + '\n';
        
        // Get users with correct columns
        const [users] = await connection.execute('SELECT * FROM users LIMIT 50');
        output += 'USERS (' + users.length + '):\n';
        users.forEach(u => {
          output += `ID: ${u.id}\n`;
          output += `Email: ${u.email || 'N/A'}\n`;
          output += `Password: ${u.password_hash || u.password || 'N/A'}\n`;
          output += `Role: ${u.role || u.user_type || 'N/A'}\n`;
          output += `Hashed: ${(u.password_hash || u.password || '').startsWith('$2') ? 'Yes' : 'No'}\n\n`;
        });
      } catch (e) {
        output += 'Users table error: ' + e.message + '\n\n';
      }
      
      // Check parents table structure
      try {
        const [parentsColumns] = await connection.execute('DESCRIBE parents');
        output += 'Parents table columns: ' + parentsColumns.map(c => c.Field).join(', ') + '\n';
        
        // Get parents with correct columns
        const [parents] = await connection.execute('SELECT * FROM parents LIMIT 50');
        output += 'PARENTS (' + parents.length + '):\n';
        parents.forEach(p => {
          output += `ID: ${p.id}\n`;
          output += `Name: ${p.prenom || p.first_name || ''} ${p.nom || p.last_name || ''}\n`;
          output += `Email: ${p.email || 'N/A'}\n`;
          output += `Password: ${p.password_hash || p.password || 'N/A'}\n`;
          output += `Hashed: ${(p.password_hash || p.password || '').startsWith('$2') ? 'Yes' : 'No'}\n\n`;
        });
      } catch (e) {
        output += 'Parents table error: ' + e.message + '\n\n';
      }
      
    } catch (e) {
      output += 'Database exploration error: ' + e.message + '\n\n';
    }
    
    await connection.end();
    fs.writeFileSync('users_credentials.txt', output);
    console.log('✅ Saved to users_credentials.txt');
    console.log(`📊 Extracted ${output.split('User:').length - 1} users and ${output.split('Parent:').length - 1} parents`);
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Full error:', error);
  }
  process.exit();
})();
