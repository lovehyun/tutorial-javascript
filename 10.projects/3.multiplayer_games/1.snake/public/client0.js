const canvas = document.getElementById('snakeCanvas');
const context = canvas.getContext('2d');
const blockSize = 20;

const socket = new WebSocket('ws://localhost:3000');
let gameData = {};

socket.addEventListener('open', (event) => {
    console.log('Connected to the WebSocket server');
    initGame();
});

socket.addEventListener('message', (event) => {
    const receivedData = JSON.parse(event.data);
    console.log('Received game data from server:', receivedData);
    gameData = receivedData;
    drawGame();
});

socket.addEventListener('close', (event) => {
    console.log('Connection to the WebSocket server closed');
});

socket.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
});

function initGame() {
    // 게임 초기화 로직 추가
    // 예: 서버에 초기 위치 등을 요청하여 초기화
    socket.send(JSON.stringify({ type: 'init' }));
}

function drawGame() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#00F';
    gameData.snake.forEach(segment => {
        context.fillRect(segment.x * blockSize, segment.y * blockSize, blockSize, blockSize);
    });

    context.fillStyle = '#F00';
    context.fillRect(gameData.food.x * blockSize, gameData.food.y * blockSize, blockSize, blockSize);
}

// 키보드 이벤트 처리 함수
document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(event) {
    // 키 입력을 서버로 전송
    socket.send(JSON.stringify({ type: 'keypress', key: event.key }));
}