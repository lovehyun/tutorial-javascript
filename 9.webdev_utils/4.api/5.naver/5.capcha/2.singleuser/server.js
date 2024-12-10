require('dotenv').config();
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const CLIENT_ID = process.env.NAVER_CLIENT_ID;
const CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

// 사용자 계정 리스트
const users = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' },
    { username: 'admin', password: 'admin123' },
];

// 비밀번호 틀린 횟수 저장
let loginAttempts = 0;
let captchaKey = null;

// Middleware 설정
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// 캡차 키 발급
async function getCaptchaKey() {
    const url = 'https://openapi.naver.com/v1/captcha/nkey?code=0';
    const headers = {
        'X-Naver-Client-Id': CLIENT_ID,
        'X-Naver-Client-Secret': CLIENT_SECRET,
    };

    try {
        const response = await axios.get(url, { headers });
        return response.data.key;
    } catch (error) {
        console.error('캡차 키 발급 실패:', error.message);
        return null; // 실패 시 null 반환
    }
}

// 캡차 이미지 발급
async function getCaptchaImage(key) {
    const url = `https://openapi.naver.com/v1/captcha/ncaptcha.bin?key=${key}`;
    const headers = {
        'X-Naver-Client-Id': CLIENT_ID,
        'X-Naver-Client-Secret': CLIENT_SECRET,
    };

    try {
        const response = await axios.get(url, { headers, responseType: 'stream' });
        const captchaPath = path.join(__dirname, 'public', 'captcha.jpg');
        response.data.pipe(fs.createWriteStream(captchaPath));
    } catch (error) {
        console.error('캡차 이미지 생성 실패:', error.message);
    }
}

// 캡차 검증
async function verifyCaptcha(key, userInput) {
    const url = `https://openapi.naver.com/v1/captcha/nkey?code=1&key=${key}&value=${userInput}`;
    const headers = {
        'X-Naver-Client-Id': CLIENT_ID,
        'X-Naver-Client-Secret': CLIENT_SECRET,
    };

    try {
        const response = await axios.get(url, { headers });
        return response.data.result;
    } catch (error) {
        console.error('캡차 검증 실패:', error.message);
        return false;
    }
}

// 로그인 페이지 렌더링
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// 로그인 상태 확인
app.get('/login-status', (req, res) => {
    res.json({ showCaptcha: loginAttempts >= 3 });
});

// 로그인 처리
app.post('/login', async (req, res) => {
    const { username, password, captcha } = req.body;

    // 캡차 검증 필요
    if (loginAttempts >= 3) {
        const isValidCaptcha = await verifyCaptcha(captchaKey, captcha);
        if (!isValidCaptcha) {
            return res.status(400).send('Invalid Captcha');
        }
    }

    // 로그인 검증
    const user = users.find((user) => user.username === username && user.password === password);
    if (user) {
        loginAttempts = 0; // 로그인 성공 시 시도 초기화
        captchaKey = null; // 캡차 초기화
        return res.send('Login successful!');
    } else {
        loginAttempts++;
        if (loginAttempts >= 3 && !captchaKey) {
            captchaKey = await getCaptchaKey();
            await getCaptchaImage(captchaKey);
        }
        return res.status(401).send('Invalid Credentials');
    }
});

// 서버 실행
app.listen(3000, () => {
    console.log('Server running at http://127.0.0.1:3000');
});
