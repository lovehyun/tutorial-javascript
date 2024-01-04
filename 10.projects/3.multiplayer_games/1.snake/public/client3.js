const canvas = document.getElementById('snakeCanvas');
const context = canvas.getContext('2d');
const playerInfoCanvas = document.getElementById('playerInfoCanvas');
const playerInfoContext = playerInfoCanvas.getContext('2d');

const socket = new WebSocket('ws://localhost:3000');

socket.addEventListener('open', (event) => {
    console.log('Connected to the WebSocket server');
    initGame();
});

socket.addEventListener('message', (event) => {
    const receivedData = JSON.parse(event.data);
    // console.log('Received game data from server:', receivedData);
    const clientsData = receivedData;
    drawGame(clientsData);
    updateScore(clientsData.clients);
});

// socket.addEventListener('message', (event) => {
//     let receivedData;

//     try {
//         if (typeof event.data === 'string') {
//             receivedData = JSON.parse(event.data);
//         } else if (event.data instanceof Blob) {
//             // Blob 데이터인 경우 처리
//             console.log('Received Blob data from server:', event.data);
//             return;
//         } else {
//             receivedData = event.data;
//         }

//         console.log('Received game data from server:', receivedData);
//         clientsData = receivedData;
//         drawGame();
//     } catch (error) {
//         console.error('Error parsing JSON data:', error);
//     }
// });

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
    
    // 클라이언트 데이터를 순회하면서 각각의 뱀과 음식을 그립니다.
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

function updateScore(clients) {
    // Clear playerInfoCanvas
    playerInfoContext.clearRect(0, 0, playerInfoCanvas.width, playerInfoCanvas.height);

    // Set font style
    playerInfoContext.font = '14px Arial';

    // 각 플레이어의 점수를 가져와서 표시
    clients.forEach((clientData, index) => {
        const client = clientData.data;
        const playerScore = client.score || 0;

        // Set player color
        playerInfoContext.fillStyle = client.snakeColor;

        // Draw player color rectangle
        playerInfoContext.fillRect(10, index * 50 + 10, 20, 20);

        // Set player name and score
        playerInfoContext.fillStyle = '#000';
        playerInfoContext.fillText(`Player ${clientData.clientId}`, 40, index * 50 + 25);
        playerInfoContext.fillText(`Score: ${playerScore}`, 40, index * 50 + 45);
    });
}

// 키보드 이벤트 처리 함수
document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(event) {
    // 키 입력을 서버로 전송
    socket.send(JSON.stringify({ type: 'keypress', key: event.key }));
}
