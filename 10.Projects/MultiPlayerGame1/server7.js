// 5. 적군 생성
// 7. HTML 파일 서빙 (익스프레스 통해서)

const WebSocket = require('ws');
const uuid = require('uuid');
const express = require('express');
const app = express();
const path = require('path');

const port = 8080;

// 웹소켓 서버 생성
const wss = new WebSocket.Server({ port: port });

// 클라이언트 관리
const clients = new Map(); // 클라이언트 관리를 위해 Map 사용

// 상대방 비행기 위치 정보 저장
const spaceshipPositions = new Map();

// ========================================================
// 웹소켓 서버 엔드포인트
// ========================================================

// 서버 시작 시 이벤트 처리
wss.on('listening', () => {
    console.log(`WebSocket server started and listening on port ${port}`);
});

// 클라이언트 연결 시 이벤트 처리
wss.on('connection', (ws, req) => {
    const clientId = uuid.v4(); // 고유 ID 생성
    clients.set(clientId, ws); // 클라이언트를 Map에 추가

    const clientIp = req.socket.remoteAddress;
    const shortClientId = clientId.substring(0, 8); // uuid 일부만 보기 위해 substring으로 잘라냄
    console.log(`Client connected from:\t${clientIp}\tclientId:\t${clientId}`);

    // 클라이언트로부터 메시지 수신 시 이벤트 처리
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log(`Received message from\t[${clientIp}, clientId:\t${shortClientId}]:`, data);

        // 메시지 타입에 따라 처리
        if (data.type === "spaceshipPosition") {
            // 클라이언트의 비행기 위치 정보를 다른 클라이언트에게 전달
            broadcast(JSON.stringify({ type: "spaceshipPosition", id: clientId, x: data.x, y: data.y }), ws);
        } else if (data.type === "bulletPosition") {
            // 클라이언트의 총알 위치 정보를 다른 클라이언트에게 전달
            broadcast(JSON.stringify({ type: "bulletPosition", id: clientId, x: data.x, y: data.y }), ws);
        } else if (data.type === "createEnemy") {
            // 서버에서 적군 생성 로직을 수행하고 생성된 적군 정보를 해당 클라이언트에게 전달
            const startX = data.start;
            const endX = data.end;

            enemyManager.createEnemy(startX, endX);
            
            const enemy = enemyManager.enemyList[enemyManager.enemyList.length - 1]; // 마지막으로 생성된 적군 정보 가져오기
            const enemyMessage = JSON.stringify({
                type: "createEnemy",
                x: enemy.x,
                y: enemy.y
            });

            // 클라이언트로부터 받은 적군 생성 메시지를 다른 클라이언트에게 모두 전달
            sendCreateEnemyMessage(enemyMessage);
        }
    });

// 클라이언트와 연결 해제 시 이벤트 처리
ws.on('close', () => {
    console.log(`Client disconnected:\t${clientIp}\tclientId:\t${clientId}`);

    // 접속 종료된 클라이언트 정보 삭제
    clients.delete(clientId);
    spaceshipPositions.delete(clientId);

    // 다른 클라이언트에게 연결 종료 메시지 전달
    broadcast(JSON.stringify({ type: "disconnectedClient", id: clientId }), ws);
});
});

// 클라이언트에게 메시지 전송
function broadcast(message, sender) {
    clients.forEach((client, id) => {
        if (client !== sender) {
            const clientIp = client._socket.remoteAddress;
            const shortId = id.substring(0, 8); // UUID 일부만 보기 위해 substring으로 잘라냄
            console.log(`Sending message to\t[${clientIp}, clientId:\t${shortId}]:`, message);
            client.send(message);
        }
    });
}

// 클라이언트에게 적군 생성 메시지를 전송합니다.
function sendCreateEnemyMessage(message) {
    broadcast(message, null); // null을 통해 모든 클라이언트에게 메시지 전달
}

// ========================================================
// 적군 생성 및 관리 서버
// ========================================================
class Enemy {
    constructor() {
        this.x = 0;
        this.y = 0;
    }

    init(startX, endX) {
        // 적 초기 위치를 설정합니다.
        this.y = 0;
        this.x = randomInt(startX, endX - 48); // 적군 이미지 사이즈
    }

    update() {
        // 적을 아래로 이동시킵니다.
        this.y += 3;

        // if (this.y >= canvas.height - 64) {
        //     // 적이 화면 아래로 벗어나면 게임 오버 처리합니다.
        //     gameOver = true;
        //     console.log("gameover!");
        // }
    }
}

class EnemyManager {
    constructor() {
        this.enemyList = [];
    }

    createEnemy(startX, endX) {
        const enemy = new Enemy();
        enemy.init(startX, endX);
        this.enemyList.push(enemy);
    }

    updateEnemies() {
        this.enemyList.forEach((enemy) => {
            enemy.update();
        });
    }
}

const enemyManager = new EnemyManager();

function randomInt(min, max) {
    // 주어진 범위에서 임의의 정수를 반환합니다.
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ========================================================
// 익스프레스 서버 엔드포인트
// ========================================================

const webSocketAddress = process.env.WEBSOCKET_ADDRESS;
if (!webSocketAddress) {
    console.error('WEBSOCKET_ADDRESS 환경 변수가 설정되지 않았습니다.');
}

// 메인 클라이언트 게임 접속 페이지
app.use(express.static('.'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'game.html'));
});

// 클라이언트에게 WebSocket 주소를 전달
app.get('/config', (req, res) => {
    res.json({ webSocketAddress });
    console.log(`Successfully configured the websocket address to client ${webSocketAddress}`)
});

// 클라이언트 정보 조회 엔드포인트
app.get('/clients', (req, res) => {
    const clientList = Array.from(clients).map(([clientId, client]) => ({
        id: clientId.substring(0, 8),
        ip: client._socket.remoteAddress,
        position: spaceshipPositions.get(clientId),
    }));

    const formattedOutput = clientList.map(({ id, ip, position }) => `ID: ${id}\tIP: ${ip}\tPOSITION: (${position ? position.x : '-'}, ${position ? position.y : '-'})`);
    const output = formattedOutput.join('\n');

    // res.json(clientList);
    res.send(output);
});

// 서버 시작
app.listen(3000, () => {
    console.log('REST API server started on port 3000');
});

// 서버 시작
console.log(`WebSocket server is starting...`);
