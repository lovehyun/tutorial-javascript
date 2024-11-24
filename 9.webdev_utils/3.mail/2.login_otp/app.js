require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 사용자 이메일 인증 데이터를 저장할 임시 저장소
let userCodes = {};
let registeredUsers = []; // 등록된 사용자 저장

// 미들웨어 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Nodemailer 설정 (네이버 SMTP 서버)
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

// 이메일 전송 함수
function sendEmail(to, code) {
    const mailOptions = {
        from: process.env.NAVER_EMAIL,
        to: to,
        subject: '네이버 메일 인증 코드',
        html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h2 style="color: #4CAF50;">서비스 가입을 환영합니다!</h2>
            <p>아래의 6자리 코드를 입력하여 인증을 완료해주세요:</p>
            <h1 style="color: #333; letter-spacing: 5px;">${code}</h1>
            <p>이 요청을 본인이 하지 않았다면, 이 메일을 무시하세요.</p>
        </div>
        `,
    };

    return transporter.sendMail(mailOptions);
}

// 이메일 인증 코드 발송 요청 처리
app.post('/send-code', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: '이메일을 입력해주세요.' });
    }

    const code = generateCode();
    userCodes[email] = code; // 이메일과 코드 매핑
    console.log(`인증코드 발송: ${email} -> ${code}`);
    sendEmail(email, code)
        .then(() => {
            res.json({ success: true, message: '인증 코드가 이메일로 전송되었습니다!' });
        })
        .catch((error) => {
            console.error('이메일 전송 오류:', error);
            res.status(500).json({ error: '이메일 전송에 실패했습니다.' });
        });
});

// 이메일 인증 코드 검증 요청 처리
app.post('/verify-code', (req, res) => {
    const { email, code } = req.body;
    if (userCodes[email] && userCodes[email] === code) {
        res.json({ success: true, message: '이메일 인증이 완료되었습니다!' });
    } else {
        res.status(400).json({ error: '코드가 올바르지 않거나 이메일이 잘못되었습니다.' });
    }
});

// 회원가입 요청 처리
app.post('/register', (req, res) => {
    const { email, password, password_check } = req.body;

    if (password !== password_check) {
        return res.status(400).json({ error: '비밀번호가 일치하지 않습니다.' });
    }

    // 이메일 인증 여부 확인
    if (!userCodes[email]) {
        return res.status(400).json({ error: '이메일 인증을 완료해주세요.' });
    }

    // 중복 가입 확인
    if (registeredUsers.some((user) => user.email === email)) {
        return res.status(400).json({ error: '이미 등록된 이메일입니다.' });
    }

    // 회원가입 완료
    registeredUsers.push({ email, password });
    delete userCodes[email]; // 인증 데이터 삭제
    res.json({ success: true, message: '회원가입이 완료되었습니다!' });
});

// 성공 메시지 페이지
app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 실행 중입니다: http://localhost:${PORT}`);
});
