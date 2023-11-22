// npm install express passport passport-google-oauth20 express-session

const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

// 세션을 사용하도록 설정
app.use(require('express-session')({
    secret: 'your-secret-key', 
    resave: true, 
    saveUninitialized: true 
}));

// Passport 초기화
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth 전략 설정
passport.use(
    new GoogleStrategy(
        {
            clientID: 'YOUR_GOOGLE_CLIENT_ID',
            clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
            callbackURL: 'http://localhost:3000/auth/google/callback',
        },
        (accessToken, refreshToken, profile, done) => {
            // 사용자 정보를 확인하고 로그인 여부를 결정하는 로직을 작성할 수 있습니다.
            return done(null, profile);
        }
    )
);

// 사용자 정보를 세션에 저장
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Google 로그인 라우터 설정
app.get('/auth/google', passport.authenticate('google', { scope: ['openid', 'profile', 'email'] }));

// Google 로그인 콜백 라우터 설정
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    // 로그인이 성공한 경우 원하는 경로로 리다이렉트합니다.
    res.redirect('/dashboard');
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

// /dashboard 경로에 대한 핸들러
app.get('/dashboard', (req, res) => {
    // 여기에서 대시보드 페이지를 렌더링하거나 필요한 동작을 수행합니다.
    res.send('Welcome to the dashboard!');
});

// 이후 라우터 및 미들웨어 설정...

// 서버를 3000번 포트로 실행
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
