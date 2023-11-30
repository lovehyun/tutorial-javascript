const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'your-mysql-host',
    user: 'your-mysql-username',
    password: 'your-mysql-password',
    database: 'your-database-name',
});

async function createTable() {
    try {
        const connection = await db.getConnection();
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255),
                email VARCHAR(255)
            )
        `);
        connection.release();
        console.log('Table creation successful');
    } catch (err) {
        console.error('Table creation failed', err);
    }
}

async function insertUser() {
    try {
        const newUser = { username: 'user1', email: 'user1@example.com' };
        const [rows] = await db.query('INSERT INTO users SET ?', newUser);
        console.log('Data inserted successfully. ID:', rows.insertId);
    } catch (err) {
        console.error('Data insertion failed', err);
    }
}

async function updateUser() {
    try {
        const updateUser = {
            id: 1,
            username: 'user1',
            email: 'user111@example.com'
        };
        await db.query('UPDATE users SET ? WHERE id = ?', [updateUser, updateUser.id]);
        console.log('Update successful');
    } catch (err) {
        console.error('Update failed', err);
    }
}

async function deleteUser() {
    try {
        const delUser = { id: 1 };
        await db.query('DELETE FROM users WHERE ?', delUser);
        console.log('Deletion successful');
    } catch (err) {
        console.error('Deletion failed', err);
    }
}

async function readUser() {
    try {
        const [rows] = await db.query('SELECT * FROM users');
        console.log('All Users:', rows);
    } catch (err) {
        console.error('Query failed', err);
    }
}

module.exports = {
    createTable,
    insertUser,
    updateUser,
    deleteUser,
    readUser,
    closeDatabase: async () => {
        try {
            await db.end();
            console.log('Database connection closed');
        } catch (err) {
            console.error('Error closing database connection', err);
        }
    }
};
