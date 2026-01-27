// import 'dotenv/config';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import path from 'path';
import morgan from 'morgan';

import { fileURLToPath } from 'url';

dotenv.config({ quiet: 'true' });
const app = express();
const PORT = 3000;

// ===== __dirname 대체 =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== 환경 변수 =====
const CLIENT_ID = process.env.NAVER_CLIENT_ID;
const CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
const REDIRECT_URI = process.env.NAVER_REDIRECT_URI;

// ===== 세션 설정 =====
app.use(
    session({
        secret: 'your_secret_key',
        resave: false,
        saveUninitialized: false,
    })
);

// ===== 로깅 =====
app.use(morgan('dev'));

// ===== 정적 파일 =====
app.use('/static', express.static(path.join(__dirname, 'public')));

// ===== 로그인 체크 미들웨어 =====
function ensureLoggedIn(req, res, next) {
    if (req.session.user) return next();

    res.status(403).sendFile(
        path.join(__dirname, 'public', 'error.html')
    );
}

// ===== 홈 =====
app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

// ===== 대시보드 =====
app.get('/dashboard', ensureLoggedIn, (req, res) => {
    res.sendFile(
        path.join(__dirname, 'public', 'dashboard.html')
    );
});

// ===== 유저 페이지 =====
app.get('/user', ensureLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'user.html'));
});

// ===== API =====
app.get('/api/user', ensureLoggedIn, (req, res) => {
    res.json(req.session.user);
});

// ===== 로그인 =====
app.get('/login', (req, res) => {
    const state = Math.random().toString(36).substring(7);

    const authUrl =
        `https://nid.naver.com/oauth2.0/authorize` +
        `?response_type=code` +
        `&client_id=${CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&state=${state}`;

    res.redirect(authUrl);
});

// ===== 로그아웃 =====
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// ===== 네이버 콜백 =====
app.get('/api/oauth2/callback', async (req, res) => {
    const { code, state } = req.query;

    try {
        // 2. 토큰 요청 (fetch)
        const tokenUrl =
            `https://nid.naver.com/oauth2.0/token` +
            `?grant_type=authorization_code` +
            `&client_id=${CLIENT_ID}` +
            `&client_secret=${CLIENT_SECRET}` +
            `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
            `&code=${code}` +
            `&state=${state}`;

        const tokenRes = await fetch(tokenUrl);
        if (!tokenRes.ok) throw new Error('Token request failed');

        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;

        // 3. 사용자 정보 요청
        const userRes = await fetch(
            'https://openapi.naver.com/v1/nid/me',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!userRes.ok) throw new Error('User info request failed');

        const userData = await userRes.json();
        const userInfo = userData.response;

        // ===== 세션 저장 =====
        req.session.user = {
            id: userInfo.id || 'N/A',
            name: userInfo.name || 'Unknown', // 또는 이름 없으면 userInfo.nickname
            nickname: userInfo.nickname || 'N/A',
            email: userInfo.email || 'N/A',
            profileImage: userInfo.profile_image || null,
            age: userInfo.age || 'N/A',
            gender:
                userInfo.gender === 'M'
                    ? 'Male'
                    : userInfo.gender === 'F'
                    ? 'Female'
                    : 'N/A',
            birthday: userInfo.birthday || 'N/A',
            mobile: userInfo.mobile || 'N/A',
        };

        res.redirect('/dashboard');
    } catch (err) {
        console.error('OAuth Error:', err.message);
        res.status(500).send('Error during OAuth process');
    }
});

// ===== 서버 시작 =====
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
