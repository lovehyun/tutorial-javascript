const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const nunjucks = require('nunjucks');
const path = require('path');

const app = express();

// Express setup
// app.set('view engine', 'nunjucks');
app.set('view engine', 'html');

nunjucks.configure('views', {
    autoescape: true,
    express: app,
});

app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true,
    })
);

// Flash setup
app.use(flash());

// Routes
app.get('/', (req, res) => {
    // res.render('login');
    res.render('login2', { messages: req.flash('messages') });
    // res.render('login3', { messages: req.flash('messages') });
});


// --> 예제1
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'user' && password === 'pass') {
        req.flash('success', 'Login successful!');
    } else {
        req.flash('error', 'Login failed. Please check your username and password.');
    }

    res.redirect('/login');
});

app.get('/login', (req, res) => {
    const successMessages = req.flash('success');
    const errorMessages = req.flash('error');

    res.render('login', { successMessages, errorMessages });
});
// <-- 예제1


// --> 예제2/3
app.post('/login2', (req, res) => {
    // const username = req.body.username;
    // const password = req.body.password;
    const { username, password } = req.body;

    // Check login credentials (dummy check for example)
    if (username === 'user' && password === 'pass') {
        req.flash('messages', [
            { type: 'success', text: '로그인 성공! 환영합니다.' },
            { type: 'info', text: '신규 버전이 출시되었습니다.' },
            { type: 'success', text: '다른 성공 메세지도 여기에 추가할 수 있습니다.' },
        ]);
    } else {
        req.flash('messages', { type: 'danger', text: '로그인 실패. 유저명과 비밀번호를 확인하세요.' });
    }

    res.redirect('/');
});
// <-- 예제2/3


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
