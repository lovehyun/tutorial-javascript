// curl -L http://localhost:3000 -i --cookie-jar cookie.txt 
// express-flash 구버전 (express 3.x), connect-flash 신버전 (express 4.x)

const express = require('express');
const session = require('express-session');
const flash = require('express-flash');

const app = express();
const port = 3000;

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
    // Flash 메시지 표시 (info 유형 가져오기)
    res.send(req.flash('info'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
