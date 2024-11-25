const express = require('express');
const path = require('path');
const router = express.Router();
const nodemailer = require('nodemailer');

// 데이터 저장소
let userCodes = {}; // 이메일 인증 코드 저장 { email: { code: '123456', timestamp: Date.now() } }
let registeredUsers = []; // 회원가입된 사용자 저장

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

// 미들웨어: 사용자 인증 확인
function isAuthenticated(req, res, next) {
    const email = req.cookies.userEmail; // 쿠키에서 이메일 가져오기
    if (email) {
        next(); // 인증 성공
    } else {
        res.redirect('/failure'); // 인증 실패 시 실패 페이지로 리다이렉트
    }
}

// API: 이메일 인증 코드 전송
router.post('/api/auth/email-code', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: '이메일을 입력해주세요.' });
    }

    const code = generateCode();
    userCodes[email] = { code, timestamp: Date.now() };
    setTimeout(() => delete userCodes[email], 10 * 60 * 1000); // 10분 후 코드 삭제

    console.log(`인증코드 발송: ${email} -> ${code}`);

    const emailEnabled = process.env.EMAIL_ENABLED === 'true'; // 이메일 발송 여부 확인
    if (emailEnabled) {
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
    } else {
        console.log('이메일 발송 비활성화: 코드가 전송되지 않았습니다.');
        res.json({ success: true, message: `이메일 발송이 비활성화되어 있습니다. Code: ${code}` });
    }
});

// API: 이메일 인증 코드 검증
router.post('/api/auth/verify-code', (req, res) => {
    const { email, code } = req.body;
    const userCode = userCodes[email];

    if (!userCode) {
        return res.status(400).json({ error: '인증 코드가 존재하지 않습니다.' });
    }
    if (userCode.code === code) {
        return res.json({ success: true, message: '이메일 인증 성공' });
    }
    res.status(400).json({ error: '인증 코드가 잘못되었습니다.' });
});

// API: 회원가입
router.post('/api/users', (req, res) => {
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

    console.log('회원가입 후 사용자 목록:', registeredUsers);
    res.json({ success: true, message: '회원가입 성공' });
});

// API: 로그인
router.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    const user = registeredUsers.find((user) => user.email === email && user.password === password);
    if (user) {
        res.cookie('userEmail', email, { httpOnly: true, secure: false });
        res.json({ success: true, message: '로그인 성공', dashboard: '/dashboard' });
    } else {
        res.status(400).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }
});

// API: 로그아웃
router.post('/api/auth/logout', (req, res) => {
    const email = req.cookies.userEmail;

    if (email) {
        res.clearCookie('userEmail');
        res.json({ success: true, message: '로그아웃 성공' });
    } else {
        res.status(400).json({ error: '사용자가 로그인 상태가 아닙니다.' });
    }
});

// 페이지 라우트
router.get('/', (req, res) => {
    res.redirect('/login');
});

router.get('/dashboard', isAuthenticated, (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.sendFile(path.resolve('public/dashboard.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.resolve('public/login.html'));
});

router.get('/register', (req, res) => {
    res.sendFile(path.resolve('public/register.html'));
});

router.get('/success', (req, res) => {
    res.sendFile(path.resolve('public/success.html'));
});

router.get('/failure', (req, res) => {
    res.sendFile(path.resolve('public/failure.html'));
});

module.exports = router;
