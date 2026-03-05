const pool = require('../config/database');

exports.getActiveRoutesAndCreateTripDays = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        
        // Get all active routes
        const [routes] = await connection.query(
            'SELECT id FROM routes WHERE active = 1'
        );
        
        const today = new Date().toISOString().split('T')[0];
        
        // For each route, check if trip_day exists for today
        for (const route of routes) {
            const [existingTripDay] = await connection.query(
                'SELECT id FROM trip_days WHERE route_id = ? AND date = ?',
                [route.id, today]
            );
            
            // If no trip_day exists, create one
            if (existingTripDay.length === 0) {
                await connection.query(
                    'INSERT INTO trip_days (route_id, date, status) VALUES (?, ?, ?)',
                    [route.id, today, 'NON_DEMARREE']
                );
            }
        }
        
        connection.release();
        
        res.status(200).json({
            message: 'Active routes processed successfully',
            routesCount: routes.length
        });
    } catch (error) {
        console.error('Error processing routes:', error);
        res.status(500).json({ error: 'Failed to process routes' });
    }
};