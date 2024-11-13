require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const nunjucks = require('nunjucks');
const path = require('path');

const app = express();
const dbPath = process.env.DB_PATH;
const db = new sqlite3.Database(path.resolve(__dirname, dbPath));

// Configure Nunjucks for templating
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.set('view engine', 'html');

app.use(express.urlencoded({ extended: true }));

// Serve the main search page
app.get('/', (req, res) => {
    res.render('index', { results: [] });
});

// Handle search form submissions
app.post('/search', (req, res) => {
    const { searchQuery } = req.body;
    
    const sql = `SELECT * FROM artists WHERE name LIKE ?`;
    db.all(sql, [`%${searchQuery}%`], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Database error.");
            return;
        }
        res.render('index.njk', { results: rows });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
