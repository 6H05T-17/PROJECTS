const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const planningRoutes = require('./routes/planningRoutes');
const routeRoutes = require('./routes/routeRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { authenticate } = require('./middleware/auth');

// filepath: app.js
require('dotenv').config();

// Import routes

// Import middleware

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', authenticate, studentRoutes);
app.use('/api/attendance', authenticate, attendanceRoutes);
app.use('/api/planning', authenticate, planningRoutes);
app.use('/api/routes', authenticate, routeRoutes);
app.use('/api/dashboard', authenticate, dashboardRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
});

// Start server
const PORT = process.env.PORT || 3648;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

module.exports = app;