const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

const sseCorsOptions = {
    origin: 'http://127.0.0.1:3000',
    methods: 'GET',
    allowedHeaders: ['Content-Type'],
    optionsSuccessStatus: 200
};

let clients = new Map(); // 클라이언트별 진행 상황 추적

// SSE 엔드포인트 - 진행 상태 업데이트
app.get('/progress', cors(sseCorsOptions), (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const clientId = Date.now();  // 클라이언트 고유 ID 생성
    clients.set(clientId, { progress: 0, interval: null });
    
    // 접속을 맺을 때 로그 출력 (클라이언트 IP와 User-Agent 출력)
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    console.log(`Client connected: IP=${clientIp}, User-Agent=${userAgent}`);

    let progress = 0;

    const interval = setInterval(() => {
        progress += 10;
        res.write(`data: ${JSON.stringify({ progress })}\n\n`);

        if (progress >= 100) {
            clearInterval(interval);
            res.end();
        }
    }, 500);

    req.on('close', () => {
        clearInterval(interval);
        // console.log('Client disconnected');
        console.log(`Client disconnected: IP=${clientIp}, User-Agent=${userAgent}`);
    });
});

// 진행 중지 요청 (클라이언트가 stop 버튼 누를 때)
app.get('/stop', cors(sseCorsOptions), (req, res) => {
    for (const [clientId, client] of clients.entries()) {
        clearInterval(client.interval);
        clients.delete(clientId);
    }
    res.status(200).send('Progress stopped');
});

// '/' 접속 시 progress.html 제공
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '2.progress.html'));
});

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
    console.log('SSE server running on http://localhost:3000');
});
