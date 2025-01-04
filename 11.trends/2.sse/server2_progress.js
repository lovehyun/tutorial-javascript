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

// SSE 엔드포인트 - 진행 상태 업데이트
app.get('/start-process', cors(sseCorsOptions), (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

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

        // 클라이언트 IP와 User-Agent 출력
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];
    
        console.log(`Client disconnected: IP=${clientIp}, User-Agent=${userAgent}`);
    });
});

// '/' 접속 시 progress.html 제공
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'progress.html'));
});

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
    console.log('SSE server running on http://localhost:3000');
});
