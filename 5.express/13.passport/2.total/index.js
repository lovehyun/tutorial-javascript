// index.js

const express = require('express');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const nunjucks = require('nunjucks');
const users = require('./users'); // users 모듈 불러오기

const app = express();

// express-session 설정
app.use(
    session({
        secret: 'your-secret-key',
        resave: true,
        saveUninitialized: true,
    })
);

app.use(express.urlencoded({extended: true}));

// Connect-Flash 설정
app.use(flash());

// Passport 초기화
app.use(passport.initialize());
app.use(passport.session());

// 뷰 엔진 설정 (Nunjucks를 사용)
app.set('view engine', 'html');
nunjucks.configure('views', {
    autoescape: true,
    express: app,
});

// 정적 파일 미들웨어 설정
app.use(express.static(path.join(__dirname, 'public')));

// 각 전략 파일 불러오기
require(path.join(__dirname, 'strategies', 'local'))(app);
require(path.join(__dirname, 'strategies', 'google'))(app);
require(path.join(__dirname, 'strategies', 'kakao'))(app);

// 사용자 정보를 세션에 저장
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = users.find((u) => u.id === id);
    done(null, user);
});

// 로그아웃 라우터 설정
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

// 대시보드 라우터 설정
app.get('/dashboard', (req, res) => {
    res.render('dashboard', { user: req.user, messages: req.flash() });
});

// 루트 라우터 설정
app.get('/', (req, res) => {
    res.render('index', { messages: req.flash() });
});

// 서버를 3000번 포트로 실행
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
