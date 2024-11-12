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
            db: 'sessions.db', // 세션 데이터베이스 파일명
            concurrentDB: true,
        }),
    })
);

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

    // 실제로는 비밀번호를 암호화하여 저장해야 합니다.
    const row = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);

    if (row) {
        // 세션에 사용자 정보 저장
        req.session.user = row;
        res.redirect('/profile');
    } else {
        res.send('로그인 실패. 아이디 또는 비밀번호를 확인하세요.');
    }
});

// 라우트 - 프로필 페이지
app.get('/profile', (req, res) => {
    // 세션에서 사용자 정보 가져오기
    const sessionUser = req.session.user;

    // 세션에 사용자 정보가 없으면 로그인 페이지로 리다이렉트
    if (!sessionUser) {
        return res.redirect('/');
    }

    // 데이터베이스에서 사용자의 최신 정보 가져오기
    // const user = db.prepare('SELECT username, email, created_at, role FROM users WHERE id = ?').get(sessionUser.id);
    const query = db.prepare('SELECT username, email, created_at, role FROM users WHERE id = ?');
    const user = query.get(sessionUser.id);

    // 사용자 정보가 존재하는 경우 출력
    if (user) {
        res.send(`
            <h1>프로필 페이지</h1>
            <p>사용자 이름: ${user.username}</p>
            <p>이메일: ${user.email}</p>
            <p>가입 날짜: ${user.created_at}</p>
            <p>역할: ${user.role}</p>
        `);
    } else {
        res.send('사용자 정보를 찾을 수 없습니다.');
    }

});

// 라우트 - 로그아웃 처리
app.get('/logout', (req, res) => {
    // 세션 제거
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        } else {
            // 로그아웃 후 로그인 페이지로 리다이렉트
            res.redirect('/');
        }
    });
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
