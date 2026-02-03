// server.js
// - Express 서버 + Toss 결제 + 정적 파일 + REST API + WebSocket 초기화

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const expressWs = require('express-ws');

const app = express();
expressWs(app); // app.ws() 추가
const port = process.env.PORT || 3000;

// ---- 인메모리 유저/방 상태 ----
const users = new Map(); // username -> { credits }
const rooms = new Map(); // roomName -> { users: Map(username, ws) }

const DEFAULT_ROOM = '기본채팅방'; // 기본 방 이름
rooms.set(DEFAULT_ROOM, { users: new Map() }); // 기본 방 하나 생성

// 새 유저면 기본 10 크레딧 지급
function getUser(username) {
    if (!users.has(username)) {
        users.set(username, { credits: 10 });
    }
    return users.get(username);
}

// ---- Toss 결제 설정 ----
const secretKey = process.env.TOSS_SECRET_KEY;
const clientKey = process.env.TOSS_CLIENT_KEY;
if (!secretKey || !clientKey) {
    throw new Error('TOSS_SECRET_KEY, TOSS_CLIENT_KEY를 .env에 설정하세요.');
}
const basicAuthHeader = 'Basic ' + Buffer.from(secretKey + ':').toString('base64');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 메인 화면
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Toss 클라이언트 키 전달
app.get('/config', (req, res) => {
    res.json({ clientKey });
});

// 내 크레딧 조회
app.get('/me/:username', (req, res) => {
    const username = req.params.username;
    if (!username) return res.status(400).json({ error: 'username 필요' });
    const user = getUser(username);
    res.json({ username, credits: user.credits });
});

// 방 목록 상세 조회
app.get('/rooms/detail', (req, res) => {
    const data = Array.from(rooms.entries()).map(([roomName, info]) => ({
        roomName,
        userCount: info.users.size,
        users: Array.from(info.users.keys()),
    }));
    res.json(data);
});

// 방 생성 (10 크레딧 차감)
app.post('/create-room', (req, res) => {
    const { roomName, username } = req.body;
    if (!roomName || !roomName.trim()) {
        return res.status(400).json({ error: '방 이름을 입력하세요.' });
    }
    if (!username || !username.trim()) {
        return res.status(400).json({ error: 'username이 필요합니다.' });
    }
    if (rooms.has(roomName)) {
        return res.status(400).json({ error: '이미 존재하는 방입니다.' });
    }
    const user = getUser(username);
    if (user.credits < 10) {
        return res.status(400).json({ error: '방 생성: 크레딧 10 필요' });
    }

    user.credits -= 10;
    rooms.set(roomName, { users: new Map() });
    console.log(`[ROOM CREATE] ${username} -> "${roomName}" (credits: ${user.credits})`);

    res.status(201).json({ message: '방 생성 완료', credits: user.credits });
});

// 결제 성공 콜백 (Toss → 우리 서버)
app.get('/payment/success', async (req, res) => {
    console.log('[SUCCESS QUERY]', req.query);
    let { paymentKey, orderId, amount, username } = req.query;

    // amount가 배열로 올 경우 방어
    if (Array.isArray(amount)) amount = amount[0];

    if (!paymentKey || !orderId || !amount || !username) {
        console.error('필수 파라미터 누락', req.query);
        return res.status(400).send('필수 결제 정보가 누락되었습니다.');
    }

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount)) {
        console.error('amount 파싱 실패', amount);
        return res.status(400).send('amount 값이 올바르지 않습니다.');
    }

    try {
        // Toss 결제 승인/검증
        const response = await axios.post(
            'https://api.tosspayments.com/v1/payments/confirm',
            { paymentKey, orderId, amount: parsedAmount },
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

        res.sendFile(path.join(__dirname, 'public', 'payment_success.html'));
    } catch (error) {
        console.error('[PAYMENT CONFIRM ERROR]', error.response?.data || error.message);
        res.redirect('/payment/fail');
    }
});

// 결제 실패 화면
app.get('/payment/fail', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'payment_fail.html'));
});

// WebSocket 라우트 등록 (wsServer.js에 위임)
const shared = { rooms, getUser, DEFAULT_ROOM };
require('./wsServer')(app, shared);

// 서버 시작
app.listen(port, () => {
    console.log(`HTTP + WebSocket server running at http://localhost:${port}`);
});
