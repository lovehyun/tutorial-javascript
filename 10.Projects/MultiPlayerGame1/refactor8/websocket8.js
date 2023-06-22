// websocket.js

const WebSocket = require('ws');
const uuid = require('uuid');

const { logger } = require('./logger8')
const { enemyManager, defaultGameRoom } = require('./gamemanager8');


// 클라이언트 관리
const clients = new Map(); // 클라이언트 관리를 위해 Map 사용

const clientInfo = {
    ws: null, // WebSocket 연결 정보 (클라이언트 IP 등 관리)
    spaceshipPosition: { x: null, y: null }, // 우주선 위치
    score: 0, // 점수
    stage: 1, // 현재 스테이지
    gameover: 0, // 게임 종료 상태
};


// 웹소켓 서버 생성
const port = 8080;
const wss = new WebSocket.Server({ port: port });

// ========================================================
// 사용자 전달 메세지 관리
// ========================================================

// 사용자 공지 사항
const announcement = [];

// 클라이언트 공지사항 메세지 추가 및 삭제
function addAndDestroyAnnounce(message) {
    const default_remove_second = 5;
    announcement.push(message);
    setTimeout(() => {
        const index = announcement.indexOf(message);
        if (index !== -1) {
            announcement.splice(index, 1);
        }
    }, default_remove_second * 1000);
}


// ========================================================
// 웹소켓 서버 접속 관리
// ========================================================

// 서버 시작 시 이벤트 처리
wss.on('listening', () => {
    logger.info(`WebSocket server started and listening on port ${port}`)
});

// 클라이언트 연결 시 이벤트 처리
wss.on('connection', (ws, req) => {
    handleConnection(ws, req);
});

// 웹소켓 에러 시 이벤트 처리
wss.on('error', (error) => {
    // 웹소켓 에러 발생
    logger.error(`WebSocket error: ${error}`);
    addAndDestroyAnnounce(`웹소켓에 오류가 발생하여 현재 서비스가 불가능합니다.`);
});


// ========================================================
// 웹소켓 서버 접속 메세지 처리
// ========================================================

function handleConnection(ws, req) {
    const clientId = uuid.v4();
    const client = {
        ...clientInfo,
        ws: ws,
        spaceshipPosition: { ...clientInfo.spaceshipPosition },
        score: null,
    };

    clients.set(clientId, client);
    handleClientConnection(req, clientId);

    ws.on('message', (message) => {
        handleClientMessage(req, clientId, message);
    });

    ws.on('close', () => {
        handleClientDisconnection(req, clientId);
    });
}

function handleClientConnection(req, clientId) {
    const client = clients.get(clientId);
    const clientIp = req.socket.remoteAddress;
    const shortClientId = clientId.substring(0, 8);
    const stage = defaultGameRoom.getStage();
    const highScore = defaultGameRoom.getHighScore();

    logger.info(`Client connected: (ClientIP: ${clientIp}, ClientID: ${clientId})`);
    addAndDestroyAnnounce(`새로운 사용자가 서버에 접속하였습니다. IP: ${clientIp}, ID: ${shortClientId}`);

    unicast(JSON.stringify({ type: "scoreUpdated", stage: stage, highScore: highScore }), client.ws);
    broadcast(JSON.stringify({ type: "connectedClient", id: clientId }), client.ws);
}

function handleClientMessage(req, clientId, message) {
    const client = clients.get(clientId);
    const data = JSON.parse(message);
    const clientIp = req.socket.remoteAddress;
    const shortClientId = clientId.substring(0, 8);

    logger.debug(`Received from IP: ${clientIp}, ClientID: ${shortClientId}, MSG: ${JSON.stringify(data)}`);

    if (data.type === "spaceshipPosition") {
        client.spaceshipPosition = { x: data.x, y: data.y };
        broadcast(JSON.stringify({ type: "spaceshipPosition", id: clientId, x: data.x, y: data.y }), client.ws);
    } else if (data.type === "bulletPosition") {
        broadcast(JSON.stringify({ type: "bulletPosition", id: clientId, x: data.x, y: data.y }), client.ws);
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
        sendCreateEnemyMessage(enemyMessage);
    } else if (data.type === "scoreUpdated") {
        const score = data.score;
        const gameover = data.gameover;
        const stage = data.stage;
        let highScore = defaultGameRoom.getHighScore();

        // 업데이트 score
        client.score = score;
        client.gameover = gameover;

        // 업데이트 highscore
        if (score > highScore) {
            highScore = score
            defaultGameRoom.setHighScore(highScore);
        }

        // 업데이트 stage
        if (defaultGameRoom.getStage() != stage) {
            defaultGameRoom.setStage(stage)
        }

        // 메세지 전달
        broadcast(JSON.stringify({ type: "scoreUpdated", id: clientId, score: score, stage: stage, highScore: highScore }), null);
    }
}

function handleClientDisconnection(req, clientId) {
    const client = clients.get(clientId);
    const clientIp = req.socket.remoteAddress;
    const shortClientId = clientId.substring(0, 8);

    logger.info(`Client disconnected: (ClientIP: ${clientIp}, ClientID: ${clientId})`);
    addAndDestroyAnnounce(`사용자가 접속을 종료하였습니다. IP: ${clientIp}, ID: ${shortClientId}`);

    clients.delete(clientId);
    if (clients.size === 0) {
        // 클라이언트 수가 0이 되었을 때 stage를 1로 초기화
        defaultGameRoom.setStage(1);
    } else {
        // 접속한 클라이언트가 모두 gameover인지 확인
        let allClientsGameOver = true;
        for (const [id, client] of clients) {
            if (!client.gameover) {
                allClientsGameOver = false;
                break;
            }
        }
        // 위의 코드를 한줄로 변경...
        // const allClientsGameOver = Array.from(clients.values()).every((client) => client.gameover);

        if (allClientsGameOver) {
            // 접속한 모든 클라이언트가 gameover이면 stage를 1로 초기화
            defaultGameRoom.setStage(1);
        }
    }
    
    broadcast(JSON.stringify({ type: "disconnectedClient", id: clientId }), client.ws);
}

// 클라이언트에게 적군 생성 메시지를 전송합니다.
function sendCreateEnemyMessage(message) {
    broadcast(message, null); // null을 통해 모든 클라이언트에게 메시지 전달
}

// 모든 클라이언트에게 메시지 전송
function broadcast(message, sender) {
    clients.forEach((client, id) => {
        const ws = client.ws;
        if (ws !== sender) { // 발신자를 제외하고 모든 사용자에게
            const clientIp = ws._socket.remoteAddress;
            const shortId = id.substring(0, 8); // UUID 일부만 보기 위해 substring으로 잘라냄
            logger.debug(`Sending to IP: ${clientIp}, ClientID: ${shortId}, ${message}`);
            ws.send(message);
        }
    });
}

// 단일 클라이언트에게 메세지 전송
function unicast(message, target) {
    clients.forEach((client, id) => {
        const ws = client.ws;
        if (ws === target) {
            const clientIp = ws._socket.remoteAddress;
            const shortId = id.substring(0, 8); // UUID 일부만 보기 위해 substring으로 잘라냄
            logger.debug(`Sending to IP: ${clientIp}, ClientID: ${shortId}, ${message}`);
            ws.send(message);
        }
    });
}

module.exports = { wss, port, clients, announcement };
