const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const port = 3000;

// SQLite3 데이터베이스 연결
const db = new Database('users.db');

// 테이블 생성
db.exec('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)');

// 미들웨어 설정
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 라우트 - 홈 페이지
app.get('/', (req, res) => {
    res.sendFile(path.resolve('public/index.html'));
});

// 라우트 - 로그인 처리
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // 데이터베이스에서 사용자 확인
    const row = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);

    if (row) {
        res.send('로그인 성공!');
    } else {
        res.send('로그인 실패. 아이디 또는 비밀번호를 확인하세요.');
    }
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
