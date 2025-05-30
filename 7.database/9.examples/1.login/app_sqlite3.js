const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();
const port = 3000;

// SQLite3 데이터베이스 연결
const db = new sqlite3.Database('users.db');

// 테이블 생성
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)');
    // 초기 사용자 데이터 삽입
    // const insert = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    // insert.run('user1', 'password1');
    // insert.run('user2', 'password2');
    // insert.run('user3', 'password3');
    // insert.finalize();
});

// 미들웨어 설정
app.use(express.urlencoded({ extended: true }));

// 라우트 - 홈 페이지
app.get('/', (req, res) => {
    res.sendFile(path.resolve('public/index.html'));
});

// 라우트 - 로그인 처리
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // const queryStrWeak = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`
    const queryStr = `SELECT * FROM users WHERE username = ? AND password = ?`

    // 데이터베이스에서 사용자 확인
    // db.get(queryStrWeak, (err, row) => {
    db.get(queryStr, [username, password], (err, row) => {
        if (row) {
            res.send('로그인 성공!');
        } else {
            res.send('로그인 실패. 아이디 또는 비밀번호를 확인하세요.');
        }
    });
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
