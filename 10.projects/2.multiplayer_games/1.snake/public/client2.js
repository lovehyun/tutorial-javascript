const canvas = document.getElementById('snakeCanvas');
const context = canvas.getContext('2d');

// const socket = new WebSocket('ws://localhost:3000/');
const socket = new WebSocket(`ws://${window.location.host}/`);

socket.addEventListener('open', (event) => {
    console.log('Connected to the WebSocket server');
    initGame();
});

socket.addEventListener('message', (event) => {
    const receivedData = JSON.parse(event.data);
    // console.log('Received game data from server:', receivedData);
    const clientsData = receivedData;
    drawGame(clientsData);
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

function drawGame(clientsData) {
    // 서버에서 받은 설정값으로 캔버스 크기 및 블록 크기 설정
    // console.log(clientsData);
    canvas.width = clientsData.common.canvasSize;
    canvas.height = clientsData.common.canvasSize;
    const blockSize = clientsData.common.blockSize;

    context.clearRect(0, 0, canvas.width, canvas.height);

    // 음식 그리기
    const commonData = clientsData.common;
    context.fillStyle = commonData.foodColor;
    context.fillRect(commonData.food.x * blockSize, commonData.food.y * blockSize, blockSize, blockSize);
    
    // 클라이언트 데이터를 순회하면서 각각의 뱀과 음식을 그리기
    clientsData.clients.forEach(clientData => {
        const client = clientData.data;

        context.fillStyle = client.snakeColor;

        // snake가 존재하고 배열인지 확인
        if (client.snake && Array.isArray(client.snake)) {
            client.snake.forEach(segment => {
                context.fillRect(segment.x * blockSize, segment.y * blockSize, blockSize, blockSize);
            });
        }
    });
}

// 키보드 이벤트 처리 함수
document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(event) {
    // 키 입력을 서버로 전송
    socket.send(JSON.stringify({ type: 'keypress', key: event.key }));
}
