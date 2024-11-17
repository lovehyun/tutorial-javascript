const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const morgan = require('morgan');

const app = express();
const port = 3000;
const db = new sqlite3.Database('users.db');

// morgan 미들웨어 추가 (dev 모드)
app.use(morgan('dev'));

// 정적 파일 제공
app.use(express.static('public'));

// API 엔드포인트: 사용자 목록
app.get('/api/users', (req, res) => {
    const searchName = req.query.name || '';

    const query = 'SELECT * FROM users WHERE Name LIKE ?';
    db.all(query, [`%${searchName}%`], (err, rows) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({
            data: rows,
            searchName,
        });
    });
});

// API 엔드포인트: 특정 사용자 정보
app.get('/api/user/:id', (req, res) => {
    const userId = req.params.id;

    const query = 'SELECT * FROM users WHERE Id = ?';
    db.get(query, [userId], (err, row) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (!row) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(row);
    });
});

// 사용자 목록 페이지를 위한 정적 HTML 파일 제공
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index1.html'));
});

// 사용자 상세 페이지를 위한 정적 HTML 파일 제공
app.get('/user/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'user.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
