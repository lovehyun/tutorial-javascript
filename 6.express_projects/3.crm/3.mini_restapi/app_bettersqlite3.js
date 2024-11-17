const express = require('express');
const sqlite = require('better-sqlite3');
const path = require('path');
const morgan = require('morgan');

const app = express();
const port = 3000;
const db = new sqlite('users.db');

// morgan 미들웨어 추가 (dev 모드)
app.use(morgan('dev'));

// 정적 파일 제공
app.use(express.static('public'));

// API 엔드포인트: 사용자 목록
app.get('/api/users', (req, res) => {
    const searchName = req.query.name || '';

    // 사용자 쿼리
    const dataStmt = db.prepare('SELECT * FROM users WHERE Name LIKE ?');
    const data = dataStmt.all(`%${searchName}%`);

    res.json({
        data,
        searchName,
    });
});

// API 엔드포인트: 특정 사용자 정보
app.get('/api/user/:id', (req, res) => {
    const userId = req.params.id;

    const stmt = db.prepare('SELECT * FROM users WHERE Id = ?');
    const user = stmt.get(userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
});

// 사용자 상세 페이지를 위한 정적 HTML 파일 제공
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
