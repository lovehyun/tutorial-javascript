const canvas = document.getElementById('snakeCanvas');
const context = canvas.getContext('2d');
const playerInfoCanvas = document.getElementById('playerInfoCanvas');
const playerInfoContext = playerInfoCanvas.getContext('2d');

let myClientId = null;   // ✅ 내가 누구인지 저장할 변수

const currentHostname = window.location.hostname;
const currentPort = window.location.port;
const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const currentPathname = window.location.pathname;

const socket = new WebSocket(`${wsProtocol}://${currentHostname}:${currentPort}${currentPathname}`);

socket.addEventListener('open', (event) => {
    console.log('Connected to the WebSocket server');
    initGame();
});

// 게임오버 처리 함수
function handleGameOver() {
    // 여기에 게임오버 화면을 표시하고, retry 여부를 물어보고 처리하는 로직을 추가

    // 예시: 간단한 게임오버 화면을 alert로 표시하고 retry 여부 물어보기
    const retry = window.confirm('Game Over! Retry?');
    
    if (retry) {
        // 클라이언트가 retry를 선택한 경우, 다시 초기화하고 게임을 재시작
        initGame();
    }
}

socket.addEventListener('message', (event) => {
    const receivedData = JSON.parse(event.data);
    // console.log('Received game data from server:', receivedData);

    // ✅ 서버가 처음에 보내주는 welcome 메시지 처리
    if (receivedData.type === 'welcome') {
        myClientId = receivedData.clientId;
        console.log('My clientId:', myClientId);
        return; // 여기서 끝
    }

    if (receivedData.type === 'gameover') {
        // 게임오버 메시지를 받았을 때의 처리
        handleGameOver();
        return;
    }
 
    // 게임 중
    drawGame(receivedData);
    updateScore(receivedData.clients);
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
    const commonData = clientsData.common;

    // 캔버스 기본 설정
    canvas.width = clientsData.common.canvasSize;
    canvas.height = clientsData.common.canvasSize;
    const blockSize = clientsData.common.blockSize;

    context.clearRect(0, 0, canvas.width, canvas.height);

    // 내 데이터 찾기
    const me = clientsData.clients.find(c => c.clientId === myClientId);
    if (!me || !me.data || !me.data.snake || me.data.snake.length === 0) {
        return;
    }

    const head = me.data.snake[0]; // 내 머리 좌표 (grid)
    const viewRadiusBlocks = 10;   // 반경 10칸
    const radiusPx = viewRadiusBlocks * blockSize;

    // 내 머리의 픽셀 좌표(중심점)
    const centerX = head.x * blockSize + blockSize / 2;
    const centerY = head.y * blockSize + blockSize / 2;

    // 1) 전체를 회색으로 덮기
    context.fillStyle = 'rgba(128, 128, 128, 0.9)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // 2) 원형 시야 클리핑 설정
    context.save();
    context.beginPath();
    context.arc(centerX, centerY, radiusPx, 0, Math.PI * 2);
    context.clip();

    // 3) 원 안 배경을 한 번 깔고 (원 안의 "바닥색" 역할)
    context.clearRect(
        centerX - radiusPx,
        centerY - radiusPx,
        radiusPx * 2,
        radiusPx * 2
    );

    // === 이 아래부터는 "원 안"에서만 그림 ===

    // 3-1) 음식이 시야 안에 있으면 그리기
    const food = commonData.food;
    if (food) { // 서버가 시야 밖이면 food를 null로 보내므로 체크 필요
        const foodDx = food.x - head.x;
        const foodDy = food.y - head.y;
        if ((foodDx * foodDx + foodDy * foodDy) <= viewRadiusBlocks * viewRadiusBlocks) {
            context.fillStyle = commonData.foodColor;
            context.fillRect(
                food.x * blockSize,
                food.y * blockSize,
                blockSize,
                blockSize
            );
        }
    }

    // 3-2) 각 뱀도 시야 안의 segment만 그리기
    clientsData.clients.forEach(clientData => {
        const client = clientData.data;
        if (!client || !client.snake || !Array.isArray(client.snake)) return;

        context.fillStyle = client.snakeColor;

        client.snake.forEach(segment => {
            const dx = segment.x - head.x;
            const dy = segment.y - head.y;
            // 내 머리 기준 반경 10칸 안에 있는 segment만 표시
            if ((dx * dx + dy * dy) <= viewRadiusBlocks * viewRadiusBlocks) {
                context.fillRect(
                    segment.x * blockSize,
                    segment.y * blockSize,
                    blockSize,
                    blockSize
                );
            }
        });
    });

    // clip 해제
    context.restore();
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

/* 맵핵 인젝션 코드

window.mapHack = true;

window._origDrawGame = window.drawGame;
window.drawGame = function (data) {
    if (window.mapHack) {
        // 맵핵 렌더링
        const common = data.common;
        const blockSize = common.blockSize;
        const canvas = document.getElementById('snakeCanvas');
        const ctx = canvas.getContext('2d');

        canvas.width = common.canvasSize;
        canvas.height = common.canvasSize;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 음식
        const food = common.food;
        if (food) {
            ctx.fillStyle = common.foodColor;
            ctx.fillRect(food.x * blockSize, food.y * blockSize, blockSize, blockSize);
        }

        // 모든 뱀
        data.clients.forEach(({ data: client }) => {
            if (!client || !client.snake) return;
            ctx.fillStyle = client.snakeColor;
            client.snake.forEach(seg => {
                ctx.fillRect(seg.x * blockSize, seg.y * blockSize, blockSize, blockSize);
            });
        });
    } else {
        // 원래 파티클/안개 있는 버전 사용
        window._origDrawGame(data);
    }
};

mapHack = true;  // 맵핵 ON
mapHack = false; // 맵핵 OFF

*/
