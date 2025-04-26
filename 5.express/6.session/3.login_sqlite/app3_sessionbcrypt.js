const express = require('express');
const session = require('express-session');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// SQLite DB 연결
const db = new sqlite3.Database('users.db', (err) => {
    if (err) {
        console.error('DB 연결 실패:', err.message);
    } else {
        console.log('SQLite DB 연결 성공!');
    }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

// 로그인 라우트
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = `SELECT * FROM users WHERE username = ?`;
    db.get(query, [username], async (err, row) => {
        if (err) {
            console.error('쿼리 오류:', err.message);
            return res.status(500).json({ message: '서버 오류' });
        }

        if (!row) {
            return res.status(401).json({ message: '사용자 없음' });
        }

        // $[version]$[cost]$[22자 base64 salt][31자 base64 hash]
        // $2b$10$A94T0hG9CK9SM2GLKMJj4.ZNxAZS2ZzROhZCz3UFZk7C9wP68VWtK
        // $2b$: bcrypt 알고리즘 버전
        // 10$: salt rounds (몇 번 반복했는지)
        // A94T0hG9CK9SM2GLKMJj4.: salt
        const match = await bcrypt.compare(password, row.password);
        if (match) {
            req.session.user = { id: row.id, username: row.username };
            res.json({ message: '로그인 성공!' });
        } else {
            res.status(401).json({ message: '비밀번호 불일치' });
        }
    });
});

// 프로필 확인 라우트
app.get('/profile', (req, res) => {
    const user = req.session.user;

    if (user) {
        res.json({ username: user.username, message: '프로필 정보' });
    } else {
        res.status(401).json({ message: '인증되지 않은 사용자' });
    }
});

// 로그아웃 라우트
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('세션 삭제 실패:', err);
            return res.status(500).json({ message: '로그아웃 실패' });
        }
        res.json({ message: '로그아웃 성공!' });
    });
});

// 로그인 HTML 제공
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login2.html'));
});

// 서버 실행
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
