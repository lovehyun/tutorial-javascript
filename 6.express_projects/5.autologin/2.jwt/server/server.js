// curl http://localhost:3000/api/login -X POST -H "Content-Type: application/json" -d "{\"username\": \"user\", \"password\": \"pass\"}"
// curl http://localhost:3000/api/validateToken -X POST -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN_HERE" 

const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const fs = require('fs');

const app = express();
const port = 3000;
const secretKey = 'your-secret-key'; // jwt 토큰 생성용 키

// 로그를 저장할 디렉토리 생성
const logDirectory = path.join(__dirname, 'logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// Access log를 기록할 파일 설정
const accessLogStream = fs.createWriteStream(path.join(logDirectory, 'access.log'), { flags: 'a' });

// 미들웨어 설정
app.use(express.json());
app.use(cookieParser()); 
app.use('/static', express.static(path.join(__dirname, 'public', 'static')));
// app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

// 예제로 사용할 간단한 사용자 데이터베이스
const users = [{ id: 1, username: 'user', password: 'pass' }];

// secret key를 사용하여 토큰을 생성하는 함수
function generateToken(user) {
    return jwt.sign({ userId: user.id, username: user.username }, secretKey, {
        expiresIn: '1h',
    });
}

// Set-Cookie 헤더를 설정하는 함수
function setCookie(res, token) {
    res.cookie('token', token, {
        httpOnly: true, // JS 에서 쿠키 접근 불가
        secure: process.env.NODE_ENV === 'production', // https 에서만 쿠키 전송 (production 환경인 경우)
    });
}

// index.html 파일을 제공하는 라우트 추가
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Login 페이지 제공 라우트
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// 미들웨어: 로그인 여부 확인
function checkAuthentication(req, res, next) {
    const token = req.cookies && req.cookies.token; // 쿠키가 존재하는지 확인 후 토큰 추출
    console.log(token);

    if (!token) {
        // 토큰이 없으면 로그인 페이지로 리다이렉트
        return res.redirect('/login');
    }

    // 토큰이 있는 경우 다음 미들웨어로 이동
    next();
}

// 로그인된 사용자의 Main 페이지 제공 라우트
app.get('/main', checkAuthentication, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

// 로그아웃 라우트
app.post('/api/logout', (req, res) => {
    // 여기에서 로그아웃 처리를 수행합니다.
    // 세션 정보 삭제, 토큰 무효화 등의 작업을 수행할 수 있습니다.

    res.clearCookie('token'); // 브라우저에 저장된 쿠키 삭제 메시지 전달
    res.json({ success: true });
});

// 로그인 라우트
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // 사용자 인증 로직 (간단한 예제이므로 패스워드를 평문으로 저장하고 있음)
    const user = users.find((u) => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ message: '인증 실패' });
    }

    // 토큰 생성
    const token = generateToken(user);

    res.json({ token });
});

// 토큰 유효성 검사 라우트
app.post('/api/validateToken', (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ valid: false, message: '토큰이 없음' });
    }

    // 토큰 검증
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ valid: false, message: '토큰 유효성 검사 실패' });
        }

        // 유효한 토큰인 경우
        console.log(`사용자 ${decoded.username} 자동 로그인 성공`);
        // Set-Cookie 헤더를 통해 클라이언트에게 토큰 전달
        setCookie(res, token);

        res.json({ valid: true, userId: decoded.userId, username: decoded.username });
    });
});

// 메인 서버 시작
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
