// server.js
// -------------------------------------------
// - Express HTTP 서버
// - Toss 결제 처리
// - 정적 파일 제공 (public/)
// - 크레딧/방 관련 REST API
// - express-ws로 WebSocket 기능 붙인 뒤
//   wsServer.js 에게 app을 넘겨 WebSocket 라우트 등록
// -------------------------------------------

require('dotenv').config();

const express = require('express');
const axios = require('axios');
const path = require('path');
const expressWs = require('express-ws');

const app = express();
const port = process.env.PORT || 3000;

// express-ws 초기화: app에 app.ws 메서드를 붙여줌
expressWs(app);

// ========================
// 1. 인메모리 유저/방 데이터
// ========================

// users: username -> { credits: number } 형태로 저장
const users = new Map();

// rooms: roomName -> { users: Map(username, ws) } 형태로 저장
const rooms = new Map();

// 기본 입장용 채팅방 이름
const DEFAULT_ROOM = '기본채팅방';

// 서버 시작 시 기본 채팅방 하나 생성
rooms.set(DEFAULT_ROOM, { users: new Map() });

// 새 유저일 경우 기본 크레딧 10을 지급하고, 기존이면 그대로 반환
function getUser(username) {
    if (!users.has(username)) {
        users.set(username, { credits: 10 });
    }
    return users.get(username);
}

// ========================
// 2. Toss API 키 설정
// ========================

const secretKey = process.env.TOSS_SECRET_KEY;
const clientKey = process.env.TOSS_CLIENT_KEY;

if (!secretKey || !clientKey) {
    throw new Error('TOSS_SECRET_KEY, TOSS_CLIENT_KEY를 .env에 설정해주세요.');
}

// Toss 결제 API용 Basic 인증 헤더
const basicAuthHeader = 'Basic ' + Buffer.from(secretKey + ':').toString('base64');

// ========================
// 3. 공통 미들웨어 / 정적 파일
// ========================

app.use(express.json());

// public 디렉토리에 있는 정적 파일 제공 (index.html, app.js, styles.css 등)
app.use(express.static(path.join(__dirname, 'public')));

// 메인 화면: index.html 반환
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Toss 클라이언트 키를 프론트에 전달 (결제창 초기화용)
app.get('/config', (req, res) => {
    res.json({ clientKey });
});

// ========================
// 4. 크레딧 / 방 관련 REST API
// ========================

// 내 크레딧 조회: GET /me/:username
app.get('/me/:username', (req, res) => {
    const username = req.params.username;
    if (!username) {
        return res.status(400).json({ error: 'username 필요' });
    }
    const user = getUser(username);
    res.json({ username, credits: user.credits });
});

// 방 상세 목록 조회: GET /rooms/detail
app.get('/rooms/detail', (req, res) => {
    const data = Array.from(rooms.entries()).map(([roomName, roomInfo]) => ({
        roomName,
        userCount: roomInfo.users.size,
        users: Array.from(roomInfo.users.keys()),
    }));
    res.json(data);
});

// 방 생성: POST /create-room
// - body: { roomName, username }
// - 10 크레딧 차감 후 방 생성
app.post('/create-room', (req, res) => {
    const { roomName, username } = req.body;

    if (!roomName || roomName.trim() === '') {
        return res.status(400).json({ error: '방 이름을 입력해주세요.' });
    }
    if (!username || username.trim() === '') {
        return res.status(400).json({ error: 'username이 필요합니다.' });
    }
    if (rooms.has(roomName)) {
        return res.status(400).json({ error: '이미 존재하는 방입니다.' });
    }

    const user = getUser(username);
    if (user.credits < 10) {
        return res.status(400).json({ error: '크레딧이 부족합니다. (방 생성 10 크레딧 필요)' });
    }

    user.credits -= 10;
    rooms.set(roomName, { users: new Map() });

    console.log(`[ROOM CREATE] ${username} created room "${roomName}" (credits: ${user.credits})`);

    res.status(201).json({
        message: `방 "${roomName}" 생성 완료!`,
        credits: user.credits,
    });
});

// ========================
// 5. 결제 성공/실패 라우트 (Toss confirm)
// ========================

// 결제 성공 후 Toss에서 돌아오는 URL:
// GET /payment/success?paymentKey=...&orderId=...&amount=...&username=...
app.get('/payment/success', async (req, res) => {
    console.log('[SUCCESS QUERY]', req.query);

    const { paymentKey, orderId, amount, username } = req.query;

    // 필수 파라미터 확인
    if (!paymentKey || !orderId || !amount || !username) {
        console.error('필수 파라미터 누락:', { paymentKey, orderId, amount, username });
        return res.status(400).send('필수 결제 정보가 누락되었습니다.');
    }

    const parsedAmount = Number(amount);

    try {
        // Toss 결제 승인/검증 API 호출
        const response = await axios.post(
            'https://api.tosspayments.com/v1/payments/confirm',
            {
                paymentKey,
                orderId,
                amount: parsedAmount,
            },
            {
                headers: {
                    Authorization: basicAuthHeader,
                    'Content-Type': 'application/json',
                },
            },
        );

        console.log('[PAYMENT CONFIRMED]', response.data);

        // 100원당 1 크레딧 적립
        const addedCredits = Math.floor(parsedAmount / 100);
        const user = getUser(username);
        user.credits += addedCredits;

        console.log(`[CREDITS] ${username} +${addedCredits} (total: ${user.credits})`);

        // 성공 화면 HTML 반환
        res.sendFile(path.join(__dirname, 'public', 'payment_success.html'));
    } catch (error) {
        console.error('[PAYMENT CONFIRM ERROR]', error.response?.data || error.message);
        // 실패 시 실패 화면으로 리다이렉트
        res.redirect('/payment/fail');
    }
});

// 결제 실패 화면: 간단한 실패 안내 HTML 반환
app.get('/payment/fail', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'payment_fail.html'));
});

// ========================
// 6. WebSocket 라우트 등록
// ========================

// WebSocket 라우트에 필요한 공유 데이터 묶음
const shared = { rooms, getUser, DEFAULT_ROOM };

// wsServer.js 에게 app과 공유 상태를 넘겨서 /chat/:roomName 라우트 등록
require('./wsServer')(app, shared);

// ========================
// 7. 서버 시작
// ========================

app.listen(port, () => {
    console.log(`HTTP + WebSocket server running at http://localhost:${port}`);
});
