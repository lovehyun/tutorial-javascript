require('dotenv').config();
const express = require('express');
const session = require('express-session');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const CLIENT_ID = process.env.NAVER_CLIENT_ID;
const CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

// 캡차 이미지 보관 폴더
const CAPTCHA_DIR = path.join(__dirname, 'public');

// 사용자 계정 리스트
const users = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' },
    { username: 'admin', password: 'admin123' },
];

// Middleware 설정
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'secret-key', // 환경 변수로 관리 권장
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // HTTPS 환경에서는 secure: true로 설정
}));
app.use(express.static(CAPTCHA_DIR));

// 캡차 키 발급
async function getCaptchaKey() {
    const url = 'https://openapi.naver.com/v1/captcha/nkey?code=0';
    const headers = {
        'X-Naver-Client-Id': CLIENT_ID,
        'X-Naver-Client-Secret': CLIENT_SECRET,
    };

    const response = await axios.get(url, { headers });
    return response.data.key;
}

// 캡차 이미지 발급
async function getCaptchaImage(key, fileName) {
    const url = `https://openapi.naver.com/v1/captcha/ncaptcha.bin?key=${key}`;
    const headers = {
        'X-Naver-Client-Id': CLIENT_ID,
        'X-Naver-Client-Secret': CLIENT_SECRET,
    };

    const response = await axios.get(url, { headers, responseType: 'stream' });
    const filePath = path.join(CAPTCHA_DIR, fileName);
    response.data.pipe(fs.createWriteStream(filePath));
    return fileName;
}

// 오래된 캡차 파일 삭제
function cleanOldCaptchas() {
    const expirationTime = 1000 * 60 * 10; // 10분
    fs.readdir(CAPTCHA_DIR, (err, files) => {
        if (err) return console.error('캡차 파일 읽기 실패:', err);

        files.forEach((file) => {
            if (file.startsWith('captcha_') && file.endsWith('.jpg')) {
                const filePath = path.join(CAPTCHA_DIR, file);
                fs.stat(filePath, (err, stats) => {
                    if (err) return console.error('캡차 파일 상태 확인 실패:', err);

                    const now = Date.now();
                    if (now - stats.mtimeMs > expirationTime) {
                        fs.unlink(filePath, (err) => {
                            if (err) return console.error('캡차 파일 삭제 실패:', err);
                            console.log(`오래된 캡차 파일 삭제: ${file}`);
                        });
                    }
                });
            }
        });
    });
}

// 로그인 페이지 렌더링
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// 캡차 새로고침 API
app.get('/refresh-captcha', async (req, res) => {
    try {
        const captchaKey = await getCaptchaKey();
        const fileName = `captcha_${uuidv4()}.jpg`;
        const captchaImage = await getCaptchaImage(captchaKey, fileName);

        req.session.captchaKey = captchaKey;
        req.session.captchaImage = captchaImage;

        res.json({ captchaImage });
    } catch (error) {
        console.error('Captcha 생성 실패:', error.message);
        res.status(500).json({ message: 'Failed to refresh captcha.' });
    }
});

// 로그인 처리
app.post('/login', async (req, res) => {
    const { username, password, captcha } = req.body;

    // 오래된 캡차 파일 삭제
    cleanOldCaptchas();

    if (!req.session.captchaKey) {
        return res.status(400).json({ message: 'Captcha is required. Please refresh and try again.' });
    }

    try {
        // 캡차 검증
        const isValidCaptcha = await verifyCaptcha(req.session.captchaKey, captcha);
        if (!isValidCaptcha) {
            return res.status(400).json({ message: 'Invalid Captcha' });
        }

        // 로그인 검증
        const user = users.find((user) => user.username === username && user.password === password);
        if (user) {
            req.session.captchaKey = null; // 성공 시 캡차 초기화
            req.session.captchaImage = null;
            return res.json({ message: 'Login successful' });
        } else {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }
    } catch (error) {
        console.error('로그인 처리 중 오류 발생:', error.message);
        res.status(500).json({ message: 'An unexpected error occurred.' });
    }
});

// 캡차 검증
async function verifyCaptcha(key, userInput) {
    const url = `https://openapi.naver.com/v1/captcha/nkey?code=1&key=${key}&value=${userInput}`;
    const headers = {
        'X-Naver-Client-Id': CLIENT_ID,
        'X-Naver-Client-Secret': CLIENT_SECRET,
    };

    const response = await axios.get(url, { headers });
    return response.data.result;
}

// 서버 실행
app.listen(3000, () => {
    console.log('Server running at http://127.0.0.1:3000');
});
