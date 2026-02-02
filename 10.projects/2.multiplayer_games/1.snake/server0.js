// 서버 코드 (Node.js 환경)
const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

// Express 앱을 만든다 → 
//   HTTP 서버로 감싼다 → 
//   그 HTTP 서버 위에 WebSocket을 붙인다 → 
//   정적 파일을 제공한다 → 
//   소켓 연결 시 게임데이터를 주고 받는다

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let gameData = {
    snake: [{ x: 0, y: 0 }],
    food: { x: 5, y: 5 },
};

// 정적 파일 디렉토리 셋업
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'snake0.html'));
});

wss.on('connection', (ws) => {
    console.log('Client connected');

    // 클라이언트로 초기 게임 데이터 전송
    ws.send(JSON.stringify(gameData));

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log(data);

        // 키보드 입력 처리
        if (data.type === 'keypress') {
            handleKeyPress(data.key);
        }

        // 초기화 요청 처리
        if (data.type === 'init') {
            // 초기화 로직 추가
            resetGame();
            broadcastGameData();
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// 게임 로직: 키 입력 처리
function handleKeyPress(key) {
    switch (key) {
        case 'ArrowUp':
            // 처리 로직 추가: 위쪽으로 이동
            break;
        case 'ArrowDown':
            // 처리 로직 추가: 아래쪽으로 이동
            break;
        case 'ArrowLeft':
            // 처리 로직 추가: 왼쪽으로 이동
            break;
        case 'ArrowRight':
            // 처리 로직 추가: 오른쪽으로 이동
            break;
    }

    // 게임 상태 업데이트 후 클라이언트에 전파
    broadcastGameData();
}

// 게임 로직: 게임 상태 초기화
function resetGame() {
    gameData = {
        snake: [{ x: 0, y: 0 }],
        food: { x: 5, y: 5 },
    };
}

// 게임 로직: 게임 상태를 모든 클라이언트에 전파
function broadcastGameData() {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(gameData));
        }
    });
}

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
