const express = require('express');
const session = require('express-session');
const flash = require('express-flash');

const app = express();

// 세션 설정
app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true,
    })
);

// Flash 미들웨어 사용
app.use(flash());

app.get('/', (req, res) => {
    // Flash 메시지 설정
    req.flash('info', 'Welcome to the homepage!');
    res.redirect('/message');
});

app.get('/message', (req, res) => {
    // Flash 메시지 표시
    res.send(req.flash('info'));
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
