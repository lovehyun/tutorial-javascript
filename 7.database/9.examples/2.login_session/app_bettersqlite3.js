const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const port = 3000;

// SQLite3 데이터베이스 연결
const db = new Database('users.db');

// 세션 설정
app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true,
        store: new SQLiteStore({
            db: 'sessions.db',
            concurrentDB: true,
        }),
    })
);

// 미들웨어 설정
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // JSON 파싱을 위한 미들웨어 추가

app.use(express.static('public'));

// 라우트 - 홈 페이지
app.get('/', (req, res) => {
    res.sendFile(path.resolve('public/index.html'));
});

// 라우트 - 로그인 처리
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const row = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);

    if (row) {
        req.session.user = row;
        res.redirect('/profile');
    } else {
        res.send('로그인 실패. 아이디 또는 비밀번호를 확인하세요.');
    }
});

// 라우트 - 프로필 페이지
app.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    res.sendFile(path.resolve('public/profile.html'));
});

// 라우트 - 프로필 데이터 JSON 형식으로 반환
app.get('/profile-data', (req, res) => {
    const sessionUser = req.session.user;

    if (!sessionUser) {
        return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    const query = db.prepare('SELECT username, email, created_at, role FROM users WHERE id = ?');
    const user = query.get(sessionUser.id);

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: '사용자 정보를 찾을 수 없습니다.' });
    }
});

// 라우트 - 로그아웃 처리
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        } else {
            res.redirect('/');
        }
    });
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
