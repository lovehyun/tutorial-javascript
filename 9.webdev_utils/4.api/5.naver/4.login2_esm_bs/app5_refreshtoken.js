import 'dotenv/config';

import express from 'express';
import session from 'express-session';
import path from 'path';
import morgan from 'morgan';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

// ===== __dirname 대체 =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== 환경 변수 =====
const CLIENT_ID = process.env.NAVER_CLIENT_ID;
const CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
const REDIRECT_URI = process.env.NAVER_REDIRECT_URI;

const NAVER_AUTH_URL = 'https://nid.naver.com/oauth2.0/authorize';
const NAVER_TOKEN_URL = 'https://nid.naver.com/oauth2.0/token';
const NAVER_ME_URL = 'https://openapi.naver.com/v1/nid/me';

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
    res.status(403).sendFile(path.join(__dirname, 'public', 'error.html'));
}

// ===== (핵심) 네이버 토큰 갱신 함수 =====
async function refreshNaverAccessToken(refreshToken) {
    const url =
        `${NAVER_TOKEN_URL}` +
        `?grant_type=refresh_token` +
        `&client_id=${CLIENT_ID}` +
        `&client_secret=${CLIENT_SECRET}` +
        `&refresh_token=${encodeURIComponent(refreshToken)}`;

    const r = await fetch(url);
    if (!r.ok) {
        const t = await r.text().catch(() => '');
        throw new Error(`refresh failed: ${r.status} ${t}`);
    }
    return await r.json();
}

// ===== (핵심) 네이버 API 호출 전 토큰 보장 미들웨어 =====
// - accessToken 없으면/만료 임박이면 refresh
async function ensureNaverAccessToken(req, res, next) {
    try {
        const naver = req.session.naver;
        if (!naver?.refreshToken) {
            // 네이버 연동 토큰이 없다면(처음부터 토큰 저장 안한 경우 등)
            return res.status(401).send('Naver token missing');
        }

        const now = Date.now();
        const expiresAt = naver.accessTokenExpiresAt || 0;

        // 만료 30초 전부터 갱신(임박 갱신)
        const needRefresh = !naver.accessToken || now > expiresAt - 30_000;

        if (needRefresh) {
            const refreshed = await refreshNaverAccessToken(naver.refreshToken);

            // refresh 응답은 보통 access_token + expires_in만 줍니다.
            naver.accessToken = refreshed.access_token;
            naver.accessTokenExpiresAt = Date.now() + (Number(refreshed.expires_in) || 0) * 1000;

            req.session.naver = naver;
        }

        next();
    } catch (err) {
        console.error('Token refresh error:', err.message);

        // 강의용: refresh 실패하면 세션을 지우고 "로그인이 필요" 안내
        req.session.user = null;
        req.session.naver = null;

        res.status(403).sendFile(path.join(__dirname, 'public', 'error.html'));
    }
}

// ===== 홈 =====
app.get('/', (req, res) => {
    if (req.session.user) return res.redirect('/dashboard');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== 대시보드 =====
app.get('/dashboard', ensureLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// ===== 유저 페이지 =====
app.get('/user', ensureLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'user.html'));
});

// ===== 우리 서비스 유저(세션) =====
app.get('/api/user', ensureLoggedIn, (req, res) => {
    res.json(req.session.user);
});

// ===== (중요) 네이버 최신 사용자정보 API =====
// 여기서 refresh 로직이 실제로 의미가 생김
app.get('/api/naver/me', ensureLoggedIn, ensureNaverAccessToken, async (req, res) => {
    const accessToken = req.session.naver.accessToken;

    const r = await fetch(NAVER_ME_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!r.ok) {
        const t = await r.text().catch(() => '');
        return res.status(502).json({ message: 'naver me failed', detail: t });
    }

    const data = await r.json();
    res.json(data);
});

// ===== 로그인 =====
app.get('/login', (req, res) => {
    const state = Math.random().toString(36).substring(7);

    // (권장) state 검증을 위해 저장
    req.session.oauthState = state;

    const authUrl =
        `${NAVER_AUTH_URL}` +
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
        // (권장) state 검증
        if (!state || state !== req.session.oauthState) {
            return res.status(400).send('Invalid state');
        }

        // 1) 토큰 요청
        const tokenUrl =
            `${NAVER_TOKEN_URL}` +
            `?grant_type=authorization_code` +
            `&client_id=${CLIENT_ID}` +
            `&client_secret=${CLIENT_SECRET}` +
            `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
            `&code=${code}` +
            `&state=${state}`;

        const tokenRes = await fetch(tokenUrl);
        if (!tokenRes.ok) {
            const t = await tokenRes.text().catch(() => '');
            throw new Error(`Token request failed: ${tokenRes.status} ${t}`);
        }

        const tokenData = await tokenRes.json();

        const accessToken = tokenData.access_token;
        const refreshToken = tokenData.refresh_token; // 최초 응답에 포함
        const expiresIn = tokenData.expires_in; // 초 단위

        // 2) 사용자 정보 요청(최초 1회)
        const userRes = await fetch(NAVER_ME_URL, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!userRes.ok) {
            const t = await userRes.text().catch(() => '');
            throw new Error(`User info request failed: ${userRes.status} ${t}`);
        }

        const userData = await userRes.json();
        const userInfo = userData.response || {};

        // 3) 세션 저장 (우리 서비스 로그인)
        req.session.user = {
            id: userInfo.id || 'N/A',
            name: userInfo.name || 'Unknown',
            nickname: userInfo.nickname || 'N/A',
            email: userInfo.email || 'N/A',
            profileImage: userInfo.profile_image || null,
            age: userInfo.age || 'N/A',
            gender: userInfo.gender === 'M' ? 'Male' : userInfo.gender === 'F' ? 'Female' : 'N/A',
            birthday: userInfo.birthday || 'N/A',
            mobile: userInfo.mobile || 'N/A',
        };

        // 4) 네이버 토큰 저장 (refresh 포함)
        req.session.naver = {
            accessToken,
            refreshToken,
            accessTokenExpiresAt: Date.now() + (Number(expiresIn) || 0) * 1000,
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
