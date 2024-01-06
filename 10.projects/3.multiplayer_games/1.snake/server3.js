// 서버 코드 (Node.js 환경)
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let canvasSize = 500; // 캔버스 크기
let blockSize = 20; // 블록 크기

// 초기화 여부를 확인하는 변수
let isServerInitialized = false;

// 클라이언트 데이터 및 소켓과 클라이언트 ID를 저장하는 맵
let clients = new Map();

let snakeSpeed = 200; // 뱀 이동 속도 (밀리초)
let gameLoopInterval; // 타이머ID

// 정적 파일을 제공하기 위해 express.static 미들웨어를 사용합니다.
app.use(express.static(path.join(__dirname, 'public')));

// 모든 경로에 대해 / 로 리다이렉트
app.use('*', (req, res, next) => {
    res.redirect('/');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'snake2.html'));
});

wss.on('connection', (ws) => {
    // 클라이언트에게 고유한 clientId 부여
    const clientId = generateClientId();
    console.log('Client connected, id: ', clientId);

    // 클라이언트 소켓 저장
    clients.set(clientId, {
        socket: ws,
    });

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log(`${clientId}: ${message}`);

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
function handleKeyPress(clientId, key) {
    const client = clients.get(clientId);

    switch (key) {
        case 'ArrowUp':
            client.data.direction = 'up';
            break;
        case 'ArrowDown':
            client.data.direction = 'down';
            break;
        case 'ArrowLeft':
            client.data.direction = 'left';
            break;
        case 'ArrowRight':
            client.data.direction = 'right';
            break;
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
    const letters = '0123456789ABCDEF';
    let color = '#00'; // R 을 제외하고 GB로만 생성
    for (let i = 0; i < 4; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

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
function isFoodOnSnake(foodPosition) {
    for (const [clientId, client] of clients) {
        if (clients.hasOwnProperty(clientId)) {
            if (client.data.snake.some(segment => segment.x === foodPosition.x && segment.y === foodPosition.y)) {
                return true;
            }
        }
    }
    return false;
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
        if (!client.data) {
            console.log('client not initialized, ', clientId);
        } else {
            // 종료된 플레이어는 이동 중지
            if (client.data.gameover) return;

            moveSnake(clientId); // 뱀 이동
            checkFood(clientId); // 음식 체크 및 처리
            collisionCheck(clientId); // 충돌 체크
        }
    });

    broadcastGameData(); // 게임 상태 전파
}

// 게임 로직: 게임 상태를 모든 클라이언트에 전파
function broadcastGameData() {
    const gameData = [];

    clients.forEach((client, clientId) => {
        gameData.push({
            clientId: clientId,
            data: client.data
        });
    });

    const dataToSend = JSON.stringify({
        common: clients.common,
        clients: gameData
    });

    clients.forEach((client, clientId) => {
        const socket = client.socket;
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(dataToSend);
        }
    });
}

// 클라이언트에게 고유한 clientId 생성
function generateClientId() {
    return Math.random().toString(36).substr(2, 9);
}

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);

    // 게임 루프 시작 (일정 주기마다 gameLoop 함수 호출)
    gameLoopInterval = setInterval(gameLoop, snakeSpeed);
});
