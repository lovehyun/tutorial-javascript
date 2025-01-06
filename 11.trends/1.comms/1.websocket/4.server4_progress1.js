const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'progress.html'));
});

// 웹서버 실행
const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// WebSocket 서버 생성 (HTTP Upgrade 메커니즘)
const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');

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
            }, 500); // 500 ms
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
