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
    const page = parseInt(req.query.page) || 1;
    const searchName = req.query.name || '';
    const itemsPerPage = 10; // 페이지당 항목 수
    const offset = (page - 1) * itemsPerPage;

    // 총 사용자 수 계산
    const countQuery = 'SELECT COUNT(*) AS count FROM users WHERE Name LIKE ?';
    db.get(countQuery, [`%${searchName}%`], (err, countRow) => {
        if (err) {
            console.error('Error fetching total user count:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const totalItems = countRow.count;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        // 페이지네이션 쿼리
        const dataQuery = 'SELECT * FROM users WHERE Name LIKE ? LIMIT ? OFFSET ?';
        db.all(dataQuery, [`%${searchName}%`, itemsPerPage, offset], (err, rows) => {
            if (err) {
                console.error('Error fetching users:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            res.json({
                data: rows,
                totalPages,
                currentPage: page,
                searchName,
            });
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
    res.sendFile(path.join(__dirname, 'public', 'users2_pages.html'));
});

// 사용자 상세 페이지를 위한 정적 HTML 파일 제공
app.get('/user/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'user_detail.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
