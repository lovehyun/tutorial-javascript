const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();  // SQLite 모듈 추가

const app = express();
const port = 3000;

// SQLite DB 연결
const db = new sqlite3.Database('users.db', (err) => {
    if (err) {
        console.error('DB 연결 오류:', err.message);
    } else {
        console.log('SQLite DB 연결 성공!');
    }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 로그인 라우트
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;

    db.get(query, [username, password], (err, row) => {
        if (err) {
            console.error('DB 쿼리 오류:', err.message);
            res.status(500).json({ message: '서버 오류' });
        } else if (!row) {
            res.status(401).json({ message: '아이디 또는 비밀번호가 틀렸습니다' });
        } else {
            res.json({ message: '로그인 성공', user: { id: row.id, username: row.username } });
        }
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
