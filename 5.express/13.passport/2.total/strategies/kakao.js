// strategies/kakao.js

const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const users = require('../users'); // users 모듈 불러오기


const kakaoStrategyCallback = (accessToken, refreshToken, profile, done) => {
    // 카카오 로그인 전략 구현 - 바로 프로필 반환 또는 계정 생성
    // return done(null, profile);

    // 유저 정보를 찾습니다.
    const user = users.find((u) => u.email === profile.kakao_account.email);

    // 유저가 존재하지 않으면 새로 생성합니다.
    if (!user) {
        user = {
            email: profile.kakao_account.email,
            name: profile.kakao_account.profile.nickname,
            picture: profile.kakao_account.profile.profile_image_url,
        };
        users.push(user);
    }

    // 유저 정보를 세션에 저장합니다.
    req.session.user = user;

    return done(null, user);
};

passport.use(
    new KakaoStrategy(
        {
            clientID: process.env.KAKAO_CLIENT_ID, // 'YOUR_KAKAO_CLIENT_ID',
            clientSecret: process.env.KAKAO_CLIENT_SECRET, // 'YOUR_KAKAO_CLIENT_SECRET',
            callbackURL: 'http://localhost:3000/auth/kakao/callback',
        },
        kakaoStrategyCallback
    )
);

// Kakao 로그인 콜백 라우터 설정
module.exports = (app) => {
    app.get('/auth/kakao', passport.authenticate('kakao'));

    app.get('/auth/kakao/callback', passport.authenticate('kakao', { failureRedirect: '/' }), (req, res) => {
        req.flash('success', 'Kakao 로그인에 성공했습니다.');
        res.redirect('/dashboard');
    });
};
