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
    res.redirect('/message');
});

// flash 메시지를 전달할 정적 HTML 파일
app.get('/message', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'message.html'));
});

// 메시지를 JSON으로 전달하는 API
app.get('/flash-data', (req, res) => {
    // info 하나만 전달
    const msg = req.flash('info')[0] || '';
    res.json({ message: msg });
});

const port = 3000;
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
