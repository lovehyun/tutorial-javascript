// strategies/kakao.js
// https://developers.kakao.com/docs/latest/ko/kakaologin/common

const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const users = require('../users'); // users 모듈 불러오기


const kakaoStrategyCallback = (req, accessToken, refreshToken, profile, done) => {
    // 카카오 로그인 전략 구현 - 바로 프로필 반환 또는 계정 생성
    // return done(null, profile);

    // 유저 정보를 찾습니다.
    let user = users.find((u) => u.username === profile.id);
    // console.log(profile);

    // 유저가 존재하지 않으면 새로 생성합니다.
    if (!user) {
        user = {
            id: profile.id,
            username: profile.username,
            email: profile.account_email,
            nickname: profile.displayName,
            provider: 'kakao',
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
            passReqToCallback: true,
            clientID: process.env.KAKAO_CLIENT_ID, // 'YOUR_KAKAO_CLIENT_ID',
            clientSecret: process.env.KAKAO_CLIENT_SECRET, // 'YOUR_KAKAO_CLIENT_SECRET',
            callbackURL: 'http://localhost:3000/auth/kakao/callback',
        },
        kakaoStrategyCallback
    )
);

// SerializeUser 함수 수정 (필요시)
passport.serializeUser((user, done) => {
    done(null, user.id); // 여기서는 사용자 식별자(id)를 전달
});

// DeserializeUser 함수는 기존과 동일하게 유지

// Kakao 로그인 콜백 라우터 설정
module.exports = (app) => {
    app.get('/auth/kakao', passport.authenticate('kakao'));

    app.get('/auth/kakao/callback', passport.authenticate('kakao', { failureRedirect: '/' }), (req, res) => {
        req.flash('success', 'Kakao 로그인에 성공했습니다.');
        res.redirect('/dashboard');
    });
};
