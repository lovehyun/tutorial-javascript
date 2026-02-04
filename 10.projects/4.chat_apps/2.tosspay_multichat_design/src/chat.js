/**
 * Express 앱: 채팅 + 결제 + 로그인
 * - 세션/쿠키, 정적파일, 라우트, WebSocket 등록
 */
const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const expressWs = require('express-ws');
const morgan = require('morgan');

const config = require('./config');
require('./database/index').getDb(); // DB 연결 및 스키마 초기화

const app = express();
expressWs(app); // WebSocket 사용 가능하도록 확장

// 미들웨어: 요청 로그, 쿠키, 세션(로그인), JSON body
app.use(morgan('dev'));
app.use(cookieParser());
app.use(
    session({
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }, // 24시간
    })
);
app.use(express.json());

// 로그인·페이지 라우트를 static보다 먼저 → GET / 시 index가 아닌 로그인 리다이렉트
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/pages'));

app.use(express.static(path.join(__dirname, '../public')));

// 결제 성공/실패 페이지 (Toss 리다이렉트 URL 유지)
const { router: paymentsRouter, routerApi: paymentsRouterApi } = require('./routes/payments');
app.use('/', paymentsRouter);

// JSON API: /api 로 시작 (me, rooms, config, 결제 취소)
app.use('/api', require('./routes/me'));
app.use('/api', require('./routes/rooms'));
app.use('/api', require('./routes/config'));
app.use('/api', paymentsRouterApi);

// WebSocket: /chat/:roomName
const { initWsRoutes } = require('./wsServer');
initWsRoutes(app);

module.exports = app;
