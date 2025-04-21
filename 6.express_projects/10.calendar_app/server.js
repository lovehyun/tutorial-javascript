const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;

const db = new sqlite3.Database('./calendar.db');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index3_calendar_fullcrud.html'));
})

// 일정 조회
app.get('/events/:date', (req, res) => {
    const { date } = req.params;
    db.all('SELECT * FROM schedule WHERE date = ?', [date], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 일정 등록
app.post('/events', (req, res) => {
    const { date, title, description } = req.body;
    db.run(
        'INSERT INTO schedule(date, title, description) VALUES (?, ?, ?)',
        [date, title, description],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});

// 일정 삭제
app.delete('/events/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM schedule WHERE id = ?', [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
