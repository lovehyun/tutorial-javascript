// Username: ' OR '1'='1' --
// Password: ' OR '1'='1' --
// Username: user2' --
const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();
const PORT = 3000;

// SQLite3 데이터베이스 설정
const db = new sqlite3.Database('users.db');

// 테이블 생성
db.run('CREATE TABLE IF NOT EXISTS users (username TEXT, password TEXT)', (err) => {
    if (err) {
        console.error('Error creating table:', err);
    } else {
        // 기본 계정 추가
        const initialAccounts = [
            { username: 'user1', password: 'pass1' },
            { username: 'user2', password: 'pass2' },
        ];

        // 기본 계정이 데이터베이스에 없으면 추가
        initialAccounts.forEach(({ username, password }) => {
            db.run('INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
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

    // 주의: 이 코드는 SQL Injection에 취약합니다!
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    console.log(query);

    // 데이터베이스에서 사용자 확인
    db.get(query, (err, row) => {
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
