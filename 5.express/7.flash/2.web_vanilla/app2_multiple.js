// npm i express express-session connect-flash
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

const app = express();

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));

// flash 설정
app.get('/', (req, res) => {
    req.flash('info', 'Welcome to the homepage!');
    req.flash('success', 'Your profile was saved.')
    req.flash('warn', 'User has not logged-in!');
    req.flash('error', 'Login Failed!');
    res.redirect('/message');
});

// flash 메시지를 전달할 정적 HTML 파일
app.get('/message', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'message2.html'));
});

// 메시지를 JSON으로 전달하는 API
app.get('/flash-data', (req, res) => {
    // info 하나만 전달
    // const msg = req.flash('info')[0] || '';
    // res.json({ message: msg });

    // 모든 유형의 flash 메시지를 포함한 객체 반환
    const messages = req.flash(); // { info: [...], error: [...], success: [...] 등 }
    res.json(messages);
});

const port = 3000;
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
