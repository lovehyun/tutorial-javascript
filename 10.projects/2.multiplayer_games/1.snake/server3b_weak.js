// 서버 코드 (Node.js 환경)
const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const os = require('os');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, reuseAddr: true });

let canvasSize = 500; // 캔버스 크기
let blockSize = 20; // 블록 크기

// 초기화 여부를 확인하는 변수
let isServerInitialized = false;

// 클라이언트 데이터 및 소켓과 클라이언트 ID를 저장하는 맵
let clients = new Map();

let snakeSpeed = 200; // 뱀 이동 속도 (밀리초)
let gameLoopInterval; // 타이머ID

// 서버 메세지 통계
let sentMessages = 0;
let receivedMessages = 0;

// 정적 파일 디렉토리 셋업
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'snake3b_grayout.html'));
});

wss.on('connection', (ws) => {
    // 클라이언트에게 고유한 clientId 부여
    const clientId = generateClientId();
    console.log('Client connected, id: ', clientId);

    // 클라이언트 소켓 저장과 동시에 data 초기화
    clients.set(clientId, {
        socket: ws,
        data: {
            snake: [{ x: 0, y: 0 }],
            direction: 'right',
            snakeColor: generateRandomColor(),
            score: 0,
            gameover: false
        }
    });

    // ✅ 접속한 클라이언트에게 자신의 clientId 알려주기
    ws.send(JSON.stringify({
        type: 'welcome',
        clientId,
    }));

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log(`${clientId}: ${message}`);
        receivedMessages++;

        // 키보드 입력 처리
        if (data.type === 'keypress') {
            handleKeyPress(clientId, data.key);
        }

        // 초기화 요청 처리
        if (data.type === 'init') {
            // 초기화 로직 추가
            resetGame(clientId);
            broadcastGameData();
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected, id: ', clientId);
        // 클라이언트 연결이 종료되면 해당 클라이언트 데이터 삭제
        clients.delete(clientId);
    });
});

// 게임 로직: 키 입력 처리
const arrows = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
const directionOpposites = { up: 'down', down: 'up', left: 'right', right: 'left' };

function handleKeyPress(clientId, key) { 
    const client = clients.get(clientId);

    // 방향키 외 입력은 무시
    if (!arrows[key]) return;
    const newDirection = arrows[key];

    // 역방향 입력 방지
    if (directionOpposites[newDirection] !== client.data.direction) {
        client.data.direction = newDirection;
    }
}


// 게임 로직: 게임 상태 초기화
function resetGame(clientId) {
    const client = clients.get(clientId);

    client.data = {
        snake: [{ x: 0, y: 0 }],
        direction: 'right', // 초기 이동 방향
        snakeColor: generateRandomColor(), // 랜덤 색상 생성
        score: 0, // 클라이언트 점수
        gameover: false,
    }

    // 최초 서버 초기화 시에만 호출
    if (!isServerInitialized) {
        resetCommonData();
        isServerInitialized = true;
    }
}

// 최초 서버 초기화 시에만 호출되는 함수
function resetCommonData() {
    clients.common = {
        canvasSize,
        blockSize,
        food: generateFood(),
        foodColor: '#F00', // red
    };
}

// 랜덤 색상을 생성하는 함수
function generateRandomColor() {
    // R을 제외하고 #00GGBB 색상으로 생성 - RR은 사과와 비슷
    const green = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    const blue = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    return `#00${green}${blue}`;}

// 게임 로직: 뱀 이동 함수
function moveSnake(clientId) {
    const client = clients.get(clientId);
    const head = { ...client.data.snake[0] };
    
    // 방향에 따라 뱀의 머리 위치 업데이트
    switch (client.data.direction) {
        case 'up':
            head.y -= 1;
            break;
        case 'down':
            head.y += 1;
            break;
        case 'left':
            head.x -= 1;
            break;
        case 'right':
            head.x += 1;
            break;
    }

    // 화면을 벗어나면 반대편으로 나오게 처리
    const canvasSize = clients.common.canvasSize;
    const blockSize = clients.common.blockSize;

    if (head.x < 0) {
        head.x = Math.floor(canvasSize / blockSize) - 1;
    } else if (head.x >= canvasSize / blockSize) {
        head.x = 0;
    }

    if (head.y < 0) {
        head.y = Math.floor(canvasSize / blockSize) - 1;
    } else if (head.y >= canvasSize / blockSize) {
        head.y = 0;
    }

    client.data.snake.unshift(head); // 뱀의 머리 추가
}

// 게임 로직: 충돌 체크 함수
function collisionCheck(clientId) {
    const client = clients.get(clientId);
    const head = client.data.snake[0];

    // 자신의 몸에 부딛쳤는지 체크
    if (client.data.snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        // 자신의 몸에 부딛쳤을 때의 처리
        client.data.gameover = true;
        handleCollision(clientId);
    }

    // 다른 뱀과 부딛쳤는지 체크
    clients.forEach((otherClient, otherClientId) => {
        if (otherClientId !== clientId) {
            if (!otherClient.data) return;

            if (otherClient.data.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
                // 다른 뱀에 부딛쳤을 때의 처리
                client.data.gameover = true;
                // otherClient.data.gameover = true;
                handleCollision(clientId);
                // handleCollision(otherClientId);
            }
        }
    });
}

// 게임 로직: 충돌 처리 함수
function handleCollision(clientId) {
    const client = clients.get(clientId);

    // 클라이언트에게 gameover 메시지 전송
    const socket = client.socket;
    if (socket.readyState === WebSocket.OPEN) {
        console.log(`${clientId}: {type: 'gameover'}`);
        socket.send(JSON.stringify({ type: 'gameover' }));
    }
}

// 게임 로직: 무작위로 음식 생성 함수
function generateFood() {
    let foodPosition;
    do {
        foodPosition = {
            x: Math.floor(Math.random() * (canvasSize / blockSize)),
            y: Math.floor(Math.random() * (canvasSize / blockSize)),
        };
    } while (isFoodOnSnake(foodPosition));

    return foodPosition;
}

// 게임 로직: 음식이 뱀 위에 있는지 체크 함수
// function isFoodOnSnake(foodPosition) {
//     for (const [clientId, client] of clients) {
//         if (clients.hasOwnProperty(clientId)) {
//             if (client.data.snake.some(segment => segment.x === foodPosition.x && segment.y === foodPosition.y)) {
//                 return true;
//             }
//         }
//     }
//     return false;
// }
function isFoodOnSnake(foodPosition) {
    return [...clients.values()].some(client =>
        client.data?.snake.some(segment => 
            segment.x === foodPosition.x && segment.y === foodPosition.y
        )
    );
}


// 게임 로직: 음식 체크 및 처리
function checkFood(clientId) {
    const client = clients.get(clientId);
    const head = client.data.snake[0];

    // 뱀 머리와 음식의 위치가 일치하는지 확인
    if (head.x === clients.common.food.x && head.y === clients.common.food.y) {
        // 음식을 먹었을 때의 처리
        clients.common.food = generateFood(); // 새로운 음식 생성
        client.data.score += 10; // 클라이언트의 점수 10점 증가
    } else {
        // 먹지 않았을 때의 처리
        client.data.snake.pop(); // 뱀 꼬리 줄이기
    }
}

// 게임 루프
function gameLoop() {
    // 각 클라이언트에 대해 게임 로직 적용
    clients.forEach((client, clientId) => {
        // 초기화가 안되었거나, 종료된 플레이어는 게임 루프 중단
        if (!client.data || client.data.gameover) {
            return;
        }

        try {
            moveSnake(clientId); // 뱀 이동
            checkFood(clientId); // 음식 체크 및 처리
            collisionCheck(clientId); // 충돌 체크
        } catch (error) {
            console.error(`Error during game loop for client ${clientId}:`, error);
        }
    });

    broadcastGameData(); // 게임 상태 전파
}

function sendSafe(client, data) {
    if (client.socket.readyState === WebSocket.OPEN) {
        client.socket.send(JSON.stringify(data));
        sentMessages++;
    }
}

// 게임 로직: 게임 상태를 모든 클라이언트에 전파
function broadcastGameData() {
    const gameData = Array.from(clients.entries()).map(([clientId, client]) => ({
        clientId,
        data: client.data
    }));

    const dataToSend = {
        common: clients.common,
        clients: gameData
    };

    clients.forEach(client => sendSafe(client, dataToSend));
}

// 클라이언트에게 고유한 clientId 생성
function generateClientId() {
    return Math.random().toString(36).substr(2, 9);
}

// 주기적으로 연결 상태를 확인하고 닫힌 연결을 정리
setInterval(() => {
    wss.clients.forEach((client) => {
        if (client.readyState !== WebSocket.OPEN) {
            console.log('Closing stale connection...');
            client.terminate(); // 닫힌 연결 제거
        }
    });

    // 각종 자원 사용량 확인
    const { rss, heapTotal, heapUsed } = process.memoryUsage();

    console.log(`
--- Server Status ---
CPU Load: ${os.loadavg().join(', ')}
Memory Usage: (RSS: ${(rss / 1024 / 1024).toFixed(2)} MB, Heap Total: ${(heapTotal / 1024 / 1024).toFixed(2)} MB, Heap Used: ${(heapUsed / 1024 / 1024).toFixed(2)} MB)
Active clients: ${wss.clients.size}
Sent messages: ${sentMessages}, Received messages: ${receivedMessages}
----------------------
    `);
}, 10 * 60 * 1000); // 10분마다 확인

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);

    // 게임 루프 시작 (일정 주기마다 gameLoop 함수 호출)
    gameLoopInterval = setInterval(gameLoop, snakeSpeed);
});
