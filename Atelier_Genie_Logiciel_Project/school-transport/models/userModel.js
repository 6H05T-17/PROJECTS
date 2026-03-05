const db = require('../config/database');

const UserModel = {
    async findByEmail(email) {
        const [rows] = await db.query(
            'SELECT id, name, email, password_hash, role FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    },

    async findById(id) {
        const [rows] = await db.query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    async create(data) {
        const { name, email, password_hash, role } = data;
        const [result] = await db.query(
            'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [name, email, password_hash, role]
        );
        return { id: result.insertId, name, email, role, created_at: new Date() };
    },

    async update(id, data) {
        const { name, email, role } = data;
        await db.query(
            'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
            [name, email, role, id]
        );
        return { id, name, email, role };
    },

    async findAll() {
        const [rows] = await db.query(
            'SELECT id, name, email, role, created_at FROM users'
        );
        return rows;
    },

    async deleteById(id) {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = UserModel;