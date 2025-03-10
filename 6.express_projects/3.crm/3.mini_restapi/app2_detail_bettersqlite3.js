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
    const page = parseInt(req.query.page) || 1;
    const searchName = req.query.name || '';
    const itemsPerPage = 10; // 페이지당 항목 수

    // 총 사용자 수 계산
    const countStmt = db.prepare('SELECT COUNT(*) AS count FROM users WHERE Name LIKE ?');
    const totalItems = countStmt.get(`%${searchName}%`).count;

    // 페이지네이션 쿼리
    const offset = (page - 1) * itemsPerPage;
    const dataStmt = db.prepare('SELECT * FROM users WHERE Name LIKE ? LIMIT ? OFFSET ?');
    const data = dataStmt.all(`%${searchName}%`, itemsPerPage, offset);

    // 총 페이지 수 계산
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    res.json({
        data,
        totalPages,
        currentPage: page,
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
    res.sendFile(path.join(__dirname, 'public', 'users2_pages.html'));
});

// 사용자 상세 페이지를 위한 정적 HTML 파일 제공
app.get('/user/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'user_detail.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
