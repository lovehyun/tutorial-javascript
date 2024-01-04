// 서버 코드 (Node.js 환경)
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let canvasSize = 500; // 캔버스 크기
let blockSize = 20; // 블록 크기

let gameData = {
    snake: [{ x: 0, y: 0 }],
    food: {x: 5, y: 5},
    direction: 'right', // 초기 이동 방향
    canvasSize,
    blockSize,
};

let snakeSpeed = 200; // 뱀 이동 속도 (밀리초)
let gameLoopInterval; // 타이머ID

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
            gameData.direction = 'up';
            break;
        case 'ArrowDown':
            gameData.direction = 'down';
            break;
        case 'ArrowLeft':
            gameData.direction = 'left';
            break;
        case 'ArrowRight':
            gameData.direction = 'right';
            break;
    }
}

// 게임 로직: 게임 상태 초기화
function resetGame() {
    gameData = {
        snake: [{ x: 0, y: 0 }],
        food: generateFood(),
        direction: 'right', // 초기 이동 방향
        canvasSize,
        blockSize,
    };
}

// 게임 로직: 뱀 이동 함수
function moveSnake() {
    const head = { ...gameData.snake[0] };

    // 방향에 따라 뱀의 머리 위치 업데이트
    switch (gameData.direction) {
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
    const canvasSize = gameData.canvasSize;
    const blockSize = gameData.blockSize;

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

    gameData.snake.unshift(head); // 뱀의 머리 추가
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
    return gameData.snake.some(segment => segment.x === foodPosition.x && segment.y === foodPosition.y);
}
// 게임 로직: 음식 체크 및 처리
function checkFood() {
    const head = gameData.snake[0];

    // 뱀 머리와 음식의 위치가 일치하는지 확인
    if (head.x === gameData.food.x && head.y === gameData.food.y) {
        // 음식을 먹었을 때의 처리
        gameData.food = generateFood(); // 새로운 음식 생성
    } else {
        // 먹지 않았을 때의 처리
        gameData.snake.pop(); // 뱀 꼬리 줄이기
    }
}

// 게임 루프
function gameLoop() {
    moveSnake(); // 뱀 이동
    checkFood(); // 음식 체크 및 처리
    broadcastGameData(); // 게임 상태 전파
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

    // 게임 루프 시작 (일정 주기마다 gameLoop 함수 호출)
    gameLoopInterval = setInterval(gameLoop, snakeSpeed);
});

// 게임 중지 예시
// clearInterval(gameLoopInterval);
