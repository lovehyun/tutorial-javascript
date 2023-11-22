const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const session = require('express-session');
// const flash = require('connect-flash');
const path = require('path');

const app = express();

// express-session 미들웨어 설정
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
// app.use(flash());
app.use(express.urlencoded({extended: true}));

// 디버깅: Express 에러 핸들링 설정
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Passport 초기화
app.use(passport.initialize());
app.use(passport.session());

// 가상의 사용자 데이터베이스
const users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' }
];

// 로그인에 사용할 Local Strategy 설정
passport.use(new LocalStrategy((username, password, done) => {
    // 여기에서 사용자의 정보를 데이터베이스에서 확인하고 인증을 수행합니다.
    // 성공 시 done(null, user) 호출, 실패 시 done(null, false) 호출

    // 사용자 정보를 가상의 데이터베이스에서 찾기
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return done(null, false, { message: 'Incorrect username or password' });
    }

    return done(null, user);
}));

// 정적 파일 서빙을 위한 미들웨어
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// 사용자 정보를 세션에 저장
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// 로그인 이후 검증이 필요한 페이지 방문시마다 호출
passport.deserializeUser((id, done) => {
    // 여기에서 id를 사용하여 사용자 정보를 데이터베이스에서 찾아냅니다.
    // 찾아낸 사용자 정보를 done(null, user)로 전달

    // 사용자 식별자를 사용하여 사용자 정보를 가상의 데이터베이스에서 찾기
    const user = users.find(u => u.id === id);

    if (!user) {
        console.error('User not found for id:', id);
        return done(new Error('User not found'));
    }

    console.error('User found for id:', id);
    return done(null, user);
});

// 로그인 라우터 설정
app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/',
        // failureRedirect: null, // 인증 실패시 현재 페이지 유지
        // failureFlash: true,
    })
);

// /dashboard 경로에 대한 핸들러
app.get('/dashboard', (req, res) => {
    // 여기에서 대시보드 페이지를 렌더링하거나 필요한 동작을 수행합니다.
    res.send('Welcome to the dashboard!');
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

// 메인 홈
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 이후 라우터 및 미들웨어 설정...

// /profile 경로에 대한 핸들러
app.get('/profile', isAuthenticated, (req, res) => {
    // 로그인된 사용자만이 이 페이지에 접근 가능
    res.send(`Hello, ${req.user.username}!`);
});

// 사용자가 로그인되어 있는지 확인하는 미들웨어
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    // 로그인되어 있지 않으면 401 Unauthorized 오류 출력
    res.status(401).send('Unauthorized');
}

// /profile2 경로에 대한 핸들러
app.get('/profile2', (req, res) => {
    // req.isAuthenticated()를 사용하여 사용자의 인증 상태 확인
    if (req.isAuthenticated()) {
        // 인증된 사용자의 정보는 req.user에서 사용할 수 있습니다.
        const username = req.user.username;
        res.send(`Hello, ${username}! This is your profile.`);
    } else {
        // 만약 인증되지 않은 경우 401 Unauthorized 오류 출력
        res.status(401).send('Unauthorized');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
