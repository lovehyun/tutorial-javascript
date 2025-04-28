// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import db from './database.js';
import chatbot from './services/chatbot.js';

import { fileURLToPath } from 'url';
import path from 'path';

// __filename, __dirname 계산
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = 3000;
const publicPath = path.join(__dirname, 'public');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 챗봇용 라우터 등록
app.use(chatbot);

// 메인 페이지
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index3_calendar_fullcrud.html'));
});

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

// 일정 수정 (업데이트)
app.put('/events/:id', (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    db.run(
        'UPDATE schedule SET title = ?, description = ? WHERE id = ?',
        [title, description, id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ updated: this.changes });
        }
    );
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
