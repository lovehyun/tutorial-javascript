
const express = require('express');
const expressWs = require('express-ws');
const path = require('path');

const app = express();
expressWs(app); // express에 WebSocket 기능 추가

const PORT = 3000;

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, 'public')));

// 루트 경로로 접속 시 progress.html 제공
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'progress2.html'));
});

// WebSocket 엔드포인트
app.ws('/ws', (ws, req) => {
    console.log('Client connected via express-ws');

    ws.on('message', (message) => {
        if (message.toString() === 'start') {
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                ws.send(JSON.stringify({ progress }));

                if (progress >= 100) {
                    clearInterval(interval);
                    console.log('Progress completed for client');
                }
            }, 500);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// 웹서버 실행
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
