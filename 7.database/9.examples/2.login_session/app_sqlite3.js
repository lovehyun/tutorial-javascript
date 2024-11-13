// npm install express express-session sqlite3 connect-sqlite3

const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();
const port = 3000;

// SQLite3 데이터베이스 연결
const db = new sqlite3.Database('users.db');

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

    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
        if (row) {
            req.session.user = row;
            res.redirect('/profile');
        } else {
            res.send('로그인 실패. 아이디 또는 비밀번호를 확인하세요.');
        }
    });
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
    const user = req.session.user;

    if (!user) {
        return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    db.get('SELECT email, created_at FROM users WHERE id = ?', [user.id], (err, row) => {
        if (err) {
            console.error('DB 조회 오류:', err);
            return res.status(500).json({ error: '서버 오류' });
        }

        if (row) {
            res.json({
                username: user.username,
                email: row.email,
                created_at: row.created_at,
            });
        } else {
            res.status(404).json({ error: '프로필 정보를 찾을 수 없습니다.' });
        }
    });
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
