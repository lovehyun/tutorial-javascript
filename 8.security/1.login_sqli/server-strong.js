const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();
const PORT = 3000;

// SQLite3 데이터베이스 설정
const db = new sqlite3.Database('users.db');

// 테이블 생성
db.run('CREATE TABLE IF NOT EXISTS users (id INT PRIMARY KEY, username TEXT, password TEXT)', (err) => {
    if (err) {
        console.error('Error creating table:', err);
    } else {
        // 기본 계정 추가
        const initialAccounts = [
            { id: 1, username: 'admin', password: 'admin' },
            { id: 2, username: 'user1', password: 'pass1' },
            { id: 3, username: 'user2', password: 'pass2' },
            { id: 4, username: 'user3', password: 'pass3' },
        ];

        // 기본 계정이 데이터베이스에 없으면 추가
        initialAccounts.forEach(({ id, username, password }) => {
            db.run('INSERT OR IGNORE INTO users (id, username, password) VALUES (?, ?, ?)', [id, username, password], (err) => {
                if (err) {
                    console.error(`Error inserting user ${username}:`, err);
                }
            });
        });
    }
});

// JSON 및 URL-encoded 데이터를 파싱하는 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 로그인 엔드포인트
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ? AND password = ?'

    // 데이터베이스에서 사용자 확인
    db.get(query, [username, password], (err, row) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }

        if (row) {
            res.send(`Login successful! Username: ${row.username}`);
        } else {
            res.status(401).send('Invalid username or password');
        }
    });
});

// / 경로에 대한 GET 요청 처리
app.get('/', (req, res) => {
    // login.html 파일 전송
    res.sendFile(path.join(__dirname, 'login.html'));
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
