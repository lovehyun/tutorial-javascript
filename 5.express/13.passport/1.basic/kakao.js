// npm install express passport passport-kakao

const express = require('express');
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

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

// Kakao OAuth 전략 설정
passport.use(
    new KakaoStrategy(
        {
            clientID: 'YOUR_KAKAO_CLIENT_ID',
            clientSecret: 'YOUR_KAKAO_CLIENT_SECRET',
            callbackURL: 'http://localhost:3000/auth/kakao/callback',
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

// Kakao 로그인 라우터 설정
app.get('/auth/kakao', passport.authenticate('kakao'));

// Kakao 로그인 콜백 라우터 설정
app.get('/auth/kakao/callback', passport.authenticate('kakao', { failureRedirect: '/' }), (req, res) => {
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

// 이후 라우터 및 미들웨어 설정...

// 서버를 3000번 포트로 실행
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
