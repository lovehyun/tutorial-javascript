const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const path = require('path');

const app = express();
const PORT = 3000;

// 1. HTTP 서버를 먼저 생성
const server = http.createServer(app);

// 2. WebSocket 서버를 먼저 바인딩
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log('WebSocket Connected');
    
    ws.on('message', (message) => {
        console.log('메세지:', message, message.toString());
        if (message.toString() === 'start') {
            let progress = 0;

            const interval = setInterval(() => {
                progress += 10;
                console.log(`서버 메세지: ${progress}`);
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

// 3. Express 미들웨어 설정
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'progress.html'));
});

// 4. HTTP 서버 실행
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
