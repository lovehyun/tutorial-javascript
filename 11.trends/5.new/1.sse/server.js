const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// CORS 설정
// app.use(cors()); // 모든 origin 허용
// CORS 옵션 설정

const sseCorsOptions = {
    origin: 'http://127.0.0.1:3000', // 허용할 클라이언트 도메인
    methods: 'GET',                 // GET 요청만 허용
    allowedHeaders: ['Content-Type'], // 허용할 헤더
    optionsSuccessStatus: 200        // CORS 프리플라이트 요청에 대한 응답 코드
};

// 정적 파일 제공 경로 설정 (public 폴더)
app.use(express.static(path.join(__dirname, 'public')));

// SSE 엔드포인트
app.get('/events', cors(sseCorsOptions), (req, res) => {
    // 헤더 설정
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 클라이언트 연결 시 현재 시간 전송
    const sendTime = () => {
        res.write(`data: ${new Date().toISOString()}\n\n`);
    };

    // 주기적으로 데이터 전송 (1초마다)
    const interval = setInterval(sendTime, 1000);

    // 연결 종료 시 정리
    req.on('close', () => {
        clearInterval(interval);
        console.log('Client disconnected');
    });
});

app.listen(3000, () => {
    console.log('SSE server running on http://localhost:3000');
});
