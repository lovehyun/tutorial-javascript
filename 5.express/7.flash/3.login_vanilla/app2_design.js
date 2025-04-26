const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

app.use(flash());

// 루트 접근 시 HTML 페이지 전달
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login2.html'));
});

// Flash 메시지를 JSON으로 전달
app.get('/flash-messages', (req, res) => {
    const messages = req.flash('messages') || [];
    res.json(messages);
});

// 로그인 처리
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'user' && password === 'pass') {
        req.flash('messages', { type: 'success', text: '로그인 성공! 환영합니다.' });
        req.flash('messages', { type: 'info', text: '신규 버전이 출시되었습니다.' });
    } else {
        req.flash('messages', { type: 'danger', text: '로그인 실패. 유저명과 비밀번호를 확인하세요.' });
    }

    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
