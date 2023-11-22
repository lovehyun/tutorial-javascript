// strategies/google.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const users = require('../users'); // users 모듈 불러오기
const dotenv = require('dotenv');

dotenv.config();


const googleStrategyCallback = (accessToken, refreshToken, profile, done) => {
    // Google 로그인 전략 구현 - 바로 프로필 반환 또는 계정 생성
    // return done(null, profile);

    // 유저 정보를 찾습니다.
    const user = users.find((u) => u.email === profile.email);

    // 유저가 존재하지 않으면 새로 생성합니다.
    if (!user) {
        user = {
            email: profile.email,
            name: profile.name,
            picture: profile.picture,
        };
        users.push(user);
    }

    // 유저 정보를 세션에 저장합니다.
    req.session.user = user;

    // 로그인 성공 응답을 반환합니다.
    return done(null, user);
};

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID, // 'YOUR_GOOGLE_CLIENT_ID',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET, // 'YOUR_GOOGLE_CLIENT_SECRET',
            callbackURL: 'http://localhost:3000/auth/google/callback',
        },
        googleStrategyCallback
    )
);

// Google 로그인 콜백 라우터 설정
module.exports = (app) => {
    app.get('/auth/google', passport.authenticate('google', { scope: ['openid', 'profile', 'email'] }));

    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
        req.flash('success', 'Google 로그인에 성공했습니다.');
        res.redirect('/dashboard');
    });
};
