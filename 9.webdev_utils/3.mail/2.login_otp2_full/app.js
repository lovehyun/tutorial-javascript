require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 데이터 저장소
let userCodes = {}; // 이메일 인증 코드 저장
let registeredUsers = []; // 회원가입된 사용자 저장
let loggedInUsers = []; // 로그인된 사용자 저장

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Nodemailer 설정
const transporter = nodemailer.createTransport({
    host: 'smtp.naver.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.NAVER_EMAIL,
        pass: process.env.NAVER_PASSWORD,
    },
});

// 랜덤 6자리 코드 생성 함수
function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// API: 이메일 인증 코드 전송
app.post('/auth/email-code', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: '이메일을 입력해주세요.' });
    }

    const code = generateCode();
    userCodes[email] = code;
    console.log(`인증코드 발송: ${email} -> ${code}`);

    transporter
        .sendMail({
            from: process.env.NAVER_EMAIL,
            to: email,
            subject: '이메일 인증 코드',
            html: `<p>인증 코드: <strong>${code}</strong></p>`,
        })
        .then(() => res.json({ success: true, message: '인증 코드가 이메일로 전송되었습니다.' }))
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: '이메일 전송 실패' });
        });
});

// API: 이메일 인증 코드 검증
app.post('/auth/verify-code', (req, res) => {
    const { email, code } = req.body;
    if (userCodes[email] === code) {
        res.json({ success: true, message: '이메일 인증 성공' });
    } else {
        res.status(400).json({ error: '인증 코드가 잘못되었습니다.' });
    }
});

// API: 회원가입
app.post('/users', (req, res) => {
    const { email, password, password_check } = req.body;

    if (password !== password_check) {
        return res.status(400).json({ error: '비밀번호가 일치하지 않습니다.' });
    }
    if (!userCodes[email]) {
        return res.status(400).json({ error: '이메일 인증이 필요합니다.' });
    }
    if (registeredUsers.find((user) => user.email === email)) {
        return res.status(400).json({ error: '이미 가입된 이메일입니다.' });
    }

    registeredUsers.push({ email, password });
    delete userCodes[email];
    res.json({ success: true, message: '회원가입 성공' });
});

// API: 로그인
app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;

    const user = registeredUsers.find((user) => user.email === email && user.password === password);
    if (user) {
        loggedInUsers.push(user);
        res.json({ success: true, message: '로그인 성공', dashboard: '/dashboard' });
    } else {
        res.status(400).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }
});

// '/' 경로에 대한 리다이렉트 처리
app.get('/', (req, res) => {
    res.redirect('/login');
});
  
// API: 대시보드
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// API: 로그인 페이지
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// API: 회원가입 페이지
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// API: 회원가입 완료 페이지
app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`서버 실행 중: http://localhost:${PORT}`);
});
