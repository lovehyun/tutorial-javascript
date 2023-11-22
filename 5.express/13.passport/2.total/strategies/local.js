// strategies/local.js

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const users = require('../users'); // users 모듈 불러오기


const localStrategyCallback = (username, password, done) => {
    console.log('Local strategy callback called:', username, password);

    const user = users.find((u) => u.username === username && u.password === password);

    if (!user) {
        console.log('Incorrect username or password.');

        return done(null, false, { message: 'Incorrect username or password.' });
    }

    console.log('User found:', user);

    return done(null, user);
};

// passport.use(new LocalStrategy(localStrategyCallback));
// 패스포트 로그 추가 설정
passport.use(new LocalStrategy({
    usernameField: 'username',  // 만약 로그인 폼의 username 필드가 다르다면 해당 필드로 변경
    passwordField: 'password',  // 만약 로그인 폼의 password 필드가 다르다면 해당 필드로 변경
    passReqToCallback: false
}, localStrategyCallback));

// 로그인 라우터 설정
module.exports = (app) => {
    app.post(
        '/login',
        passport.authenticate('local', {
            successRedirect: '/dashboard',
            failureRedirect: '/',
            failureFlash: true,
        })
    );
};
