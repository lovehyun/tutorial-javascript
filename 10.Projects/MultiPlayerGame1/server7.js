// 5. 적군 생성
// 7. HTML 파일 서빙 (익스프레스 통해서)
// 7-1. 로그파일 생성

const WebSocket = require('ws');
const uuid = require('uuid');

const express = require('express');
const app = express();
const path = require('path');

const { createLogger, format, transports } = require('winston');
const moment = require('moment-timezone');


// 웹소켓 서버 생성
const port = 8080;
const wss = new WebSocket.Server({ port: port });

// 클라이언트 관리
const clients = new Map(); // 클라이언트 관리를 위해 Map 사용

const clientInfo = {
    ws: null, // WebSocket 연결 정보 (클라이언트 IP 등 관리)
    spaceshipPosition: { x: null, y: null }, // 우주선 위치
    score: null, // 점수
};


// ========================================================
// 로깅 등 기본 서버 관리
// ========================================================

// 로그 레벨 설정
let logLevel = process.env.LOG_LEVEL;
if (!logLevel) {
    if (process.env.NODE_ENV === 'PRODUCTION') {
        logLevel = 'info';
    } else {
        logLevel = 'debug';
    }
}

// 로그 포맷팅 설정
const logger = createLogger({
    level: logLevel, // 로그 레벨 설정
    format: format.combine(
        format.timestamp({ // 타임스탬프 타임존 추가
            format: () => moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss.SSS')
        }),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new transports.Console() // 콘솔 출력 설정
    ]
});

// ========================================================
// 웹소켓 서버 엔드포인트
// ========================================================

// 서버 시작 시 이벤트 처리
wss.on('listening', () => {
    logger.info(`WebSocket server started and listening on port ${port}`)
});

// 클라이언트 연결 시 이벤트 처리
wss.on('connection', (ws, req) => {
    const clientId = uuid.v4(); // 고유 ID 생성
    const client = { ...clientInfo, 
        ws: ws, 
        spaceshipPosition: { ...clientInfo.spaceshipPosition },
        score: null,
    }; // 객체 병합을 통해 클라이언트 정보와 WebSocket 연결 추가
    clients.set(clientId, client); // 클라이언트를 Map에 추가

    const clientIp = req.socket.remoteAddress;
    const shortClientId = clientId.substring(0, 8); // uuid 일부만 보기 위해 substring으로 잘라냄
    logger.info(`Client connected: (ClientIP: ${clientIp}, ClientID: ${clientId})`);

    // 다른 클라이언트에게 연결 시작 메시지 전달
    broadcast(JSON.stringify({ type: "connectedClient", id: clientId }), ws);

    // 클라이언트로부터 메시지 수신 시 이벤트 처리
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        logger.debug(`Received from IP: ${clientIp}, ClientID: ${shortClientId}, MSG: ${JSON.stringify(data)}`);

        // 메시지 타입에 따라 처리
        if (data.type === "spaceshipPosition") {
            // 클라이언트의 우주선 위치 정보를 저장 (디버그용)
            client.spaceshipPosition = { x: data.x, y: data.y };
            // 클라이언트의 비행기 위치 정보를 다른 클라이언트에게 전달
            broadcast(JSON.stringify({ type: "spaceshipPosition", id: clientId, x: data.x, y: data.y }), ws);
        } else if (data.type === "bulletPosition") {
            // 클라이언트의 총알 위치 정보를 다른 클라이언트에게 전달
            broadcast(JSON.stringify({ type: "bulletPosition", id: clientId, x: data.x, y: data.y }), ws);
        } else if (data.type === "createEnemyRequest") {
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
        } else if (data.type === "scoreUpdated") {
            client.score = data.score;
            broadcast(JSON.stringify({ type: "scoreUpdated", id: clientId, score: data.score }), ws);
        }
    });

    // 클라이언트와 연결 해제 시 이벤트 처리
    ws.on('close', () => {
        logger.info(`Client disconnected: (ClientIP: ${clientIp}, ClientID: ${clientId})`);

        // 접속 종료된 클라이언트 정보 삭제
        clients.delete(clientId);

        // 다른 클라이언트에게 연결 종료 메시지 전달
        broadcast(JSON.stringify({ type: "disconnectedClient", id: clientId }), ws);
    });
});

// 클라이언트에게 메시지 전송
function broadcast(message, sender) {
    clients.forEach((client, id) => {
        ws = client.ws;
        if (ws !== sender) { // 발신자를 제외하고 모든 사용자에게
            const clientIp = ws._socket.remoteAddress;
            const shortId = id.substring(0, 8); // UUID 일부만 보기 위해 substring으로 잘라냄
            logger.debug(`Sending to IP: ${clientIp}, ClientID: ${shortId}, ${message}`);
            ws.send(message);
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
    constructor(manager) {
        this.x = 0;
        this.y = 0;
        this.manager = manager;
    }

    init(startX, endX) {
        // 적 초기 위치를 설정합니다.
        this.y = 0;
        this.x = randomInt(startX, endX - 48); // 적군 이미지 사이즈
    }

    update() {
        // 적을 아래로 이동시킵니다.
        this.y += 3;

        if (this.y >= canvas.height - 64) {
            // TODO: 현재는 서버사이드에서 적군의 liveness 를 관리하지 않음.
            //     // 적이 화면 아래로 벗어나면 게임 오버 처리합니다.
            //     gameOver = true;
            //     console.log("gameover!");
            this.destroy();
        }
    }

    destroy() {
        this.manager.removeEnemy(this);

        // 해당 객체의 참조를 제거하여 메모리에서 해제합니다.
        this.x = null;
        this.y = null;
    }
}

class EnemyManager {
    constructor() {
        this.enemyList = [];
    }

    createEnemy(startX, endX) {
        const enemy = new Enemy();
        enemy.init(startX, endX, this);
        this.enemyList.push(enemy);
    }

    removeEnemy(enemy) {
        // 적군을 목록에서 제거합니다.
        const index = this.enemyList.indexOf(enemy);
        if (index !== -1) {
            this.enemyList.splice(index, 1);
        }
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

let webSocketAddress = process.env.WEBSOCKET_ADDRESS;
if (!webSocketAddress) {
    logger.error('WEBSOCKET_ADDRESS 환경 변수가 설정되지 않았습니다.');
    if (process.env.NODE_ENV === 'PRODUCTION') {
        process.exit(1); // 프로세스 종료
    } else {
        const defaultWebSocketAddress = 'ws://127.0.0.1:8080';
        logger.info(`WEBSOCKET_ADDRESS를 기본값으로 사용합니다. ${defaultWebSocketAddress}`);
        webSocketAddress = defaultWebSocketAddress; // 기본값을 webSocketAddress에 할당
    }
}

// 메인 클라이언트 게임 접속 페이지
app.use(express.static('.'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'game.html'));
});

// 클라이언트에게 WebSocket 주소를 전달
app.get('/config', (req, res) => {
    res.json({ webSocketAddress });
    logger.info(`Successfully configured the websocket address to client ${webSocketAddress}`)
});

// 클라이언트 정보 조회 엔드포인트
app.get('/clients', (req, res) => {
    const clientList = Array.from(clients).map(([clientId, client]) => ({
        id: clientId,
        ip: client.ws._socket.remoteAddress,
        position: client.spaceshipPosition,
        score: client.score,
    }));

    const formattedOutput = clientList.map(({ id, ip, position, score }) => `ID: ${id}, IP: ${ip}, SCORE: ${score}, POSITION: (${position.x}, ${position.y})`);
    const output = formattedOutput.join('\n');

    // res.json(clientList);
    res.send(output);
});

// 익스프레스 서버 시작
app.listen(3000, () => {
    logger.info('REST API server started on port 3000');
});

// 게임 서버 시작 완료
logger.info(`WebSocket server is now starting...`);
