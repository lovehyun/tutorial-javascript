const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const nunjucks = require('nunjucks');

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

// Nunjucks를 템플릿 엔진으로 설정
nunjucks.configure('views', {
    express: app,
    autoescape: true,
});

// app.set('view engine', 'njk');
app.set('view engine', 'html');

// --> 예제1/2/3
app.get('/', (req, res) => {
    // Flash 메시지 설정
    req.flash('info', 'Welcome to the homepage!');
    res.redirect('/message');
});

app.get('/message', (req, res) => {
    // Flash 메시지를 템플릿에 전달
    res.render('message', { messages: req.flash() });
    // res.render('message2', { messages: req.flash() });
    // res.render('message3', { messages: req.flash() });
});
// <-- 예제1/2/3

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
