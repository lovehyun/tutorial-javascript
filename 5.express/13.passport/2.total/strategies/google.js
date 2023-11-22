// strategies/google.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const users = require('../users'); // users 모듈 불러오기
const dotenv = require('dotenv');

dotenv.config();


const googleStrategyCallback = (req, accessToken, refreshToken, profile, done) => {
    // Google 로그인 전략 구현 - 바로 프로필 반환 또는 계정 생성
    // return done(null, profile);

    // 유저 정보를 찾습니다.
    let user = users.find((u) => u.email === profile.emails[0].value);
    // console.log(profile);

    // 유저가 존재하지 않으면 새로 생성합니다.
    if (!user) {
        user = {
            id: profile.id,
            username: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            picture: profile.photos[0].value,
            provider: 'google',
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
            passReqToCallback: true,
            clientID: process.env.GOOGLE_CLIENT_ID, // 'YOUR_GOOGLE_CLIENT_ID',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET, // 'YOUR_GOOGLE_CLIENT_SECRET',
            callbackURL: 'http://localhost:3000/auth/google/callback',
        },
        googleStrategyCallback
    )
);

// SerializeUser 함수 수정 (필요시)
passport.serializeUser((user, done) => {
    done(null, user.id); // 여기서는 사용자 식별자(id)를 전달
});

// DeserializeUser 함수는 기존과 동일하게 유지

// Google 로그인 콜백 라우터 설정
module.exports = (app) => {
    app.get('/auth/google', passport.authenticate('google', { scope: ['openid', 'profile', 'email'] }));

    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
        req.flash('success', 'Google 로그인에 성공했습니다.');
        res.redirect('/dashboard');
    });
};
