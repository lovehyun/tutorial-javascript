const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;

// 미들웨어 설정
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 세션 설정
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

// 간단한 메모리 기반 사용자 데이터
const users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' },
];

// 로그인 라우트
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
        req.session.user = { id: user.id, username: user.username };
        res.json({ message: '로그인 성공!' });
    } else {
        res.status(401).json({ message: '로그인 실패' });
    }
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

// 로그인 페이지 제공
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// 서버 실행
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
