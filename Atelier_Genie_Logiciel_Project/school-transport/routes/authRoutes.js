const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router();

// Database connection - TODO: Replace with actual database connection
// const db = require('../config/database');

// Mock database - Replace with actual database query
// const users = await db.query('SELECT id, email, password_hash, role FROM users');

// User structure based on database schema:
// - id: INT UNSIGNED PRIMARY KEY AUTO_INCREMENT
// - email: VARCHAR(150) NOT NULL UNIQUE
//   Format: {firstname_lowercase}@{role}.com (e.g., john@ONG.com)
// - password_hash: VARCHAR(255) NOT NULL (bcrypt hashed)
// - role: ENUM('ONG','MAIRIE','ADMIN') NOT NULL DEFAULT 'ONG'

// TODO: Create users in database with structure:
// INSERT INTO users (name, email, password_hash, role) VALUES
// ('John Doe', 'john@ong.com', bcrypt_hash_here, 'ONG'),
// ('Jane Smith', 'jane@mairie.com', bcrypt_hash_here, 'MAIRIE'),
// ('Admin User', 'admin@admin.com', bcrypt_hash_here, 'ADMIN');

const users = [
    { 
        id: 1, 
        email: 'john@ong.com', 
        password_hash: '$2b$10$...', 
        role: 'ONG' 
    },
    { 
        id: 2, 
        email: 'jane@mairie.com', 
        password_hash: '$2b$10$...', 
        role: 'MAIRIE' 
    },
    { 
        id: 3, 
        email: 'admin@admin.com', 
        password_hash: '$2b$10$...', 
        role: 'ADMIN' 
    }
];

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

router.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Parent authentication
router.post('/api/parents/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        // Query database for parent
        // const query = 'SELECT id, fullname, email, password_hash FROM parents WHERE email = ?';
        // const [rows] = await db.execute(query, [email]);
        
        // if (rows.length === 0) {
        //     return res.status(401).json({ error: 'Invalid credentials' });
        // }

        // const parent = rows[0];
        // const isValid = await bcrypt.compare(password, parent.password_hash);
        
        // if (!isValid) {
        //     return res.status(401).json({ error: 'Invalid credentials' });
        // }

        // Generate JWT
        const token = jwt.sign(
            { id: parent.id, email: parent.email, role: 'PARENT' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, parent: { id: parent.id, fullname: parent.fullname, email: parent.email } });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/parents/me/students
router.get('/api/parents/me/students', async (req, res) => {
    try {
        const parentId = req.user?.id; // From JWT middleware in production

        // const query = `
        //     SELECT s.id, s.fullname, s.school_id, s.stop_id, s.active, sc.name as school_name
        //     FROM students s
        //     JOIN parent_students ps ON s.id = ps.student_id
        //     JOIN schools sc ON s.school_id = sc.id
        //     WHERE ps.parent_id = ?
        // `;
        // const [rows] = await db.execute(query, [parentId]);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/parents/me/students/:id/trips
router.get('/api/parents/me/students/:id/trips', async (req, res) => {
    try {
        const { id } = req.params;
        const parentId = req.user?.id;

        // const query = `
        //     SELECT td.id, td.date, r.name as route_name, a.present, td.status
        //     FROM attendances a
        //     JOIN trip_days td ON a.trip_day_id = td.id
        //     JOIN routes r ON td.route_id = r.id
        //     JOIN students s ON a.student_id = s.id
        //     JOIN parent_students ps ON s.id = ps.student_id
        //     WHERE s.id = ? AND ps.parent_id = ?
        //     ORDER BY td.date DESC
        // `;
        // const [rows] = await db.execute(query, [id, parentId]);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;