const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, 'todos.db');
const db = new Database(DB_PATH);

const query = `
    CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        completed INTEGER DEFAULT 0
    )
`;
db.prepare(query).run();

module.exports = db;
