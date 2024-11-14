require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const dbPath = process.env.DB_PATH;
const db = new sqlite3.Database(path.resolve(__dirname, dbPath));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (including HTML, CSS, and client-side JavaScript)
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index1.html'));
});

// Handle search API request
app.get('/api/search', (req, res) => {
    const { searchQuery } = req.query;

    const sql = `SELECT * FROM artists WHERE name LIKE ?`;
    db.all(sql, [`%${searchQuery}%`], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: "Database error." });
            return;
        }
        res.json({ results: rows });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
