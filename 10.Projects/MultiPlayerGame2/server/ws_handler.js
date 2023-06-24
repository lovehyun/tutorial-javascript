// ws_handler.js

const MessageType = require('./message_type.js');

const { logger } = require('../util/logger')
const { clients, addAndDestroyAnnounce } = require('./clientinfo')
const { enemyManager, defaultGameRoom } = require('./gamemanager');


function handleClientConnection(req, clientId) {
    const client = clients.get(clientId);
    const clientIp = req.socket.remoteAddress;
    const shortClientId = clientId.substring(0, 8);
    const stage = defaultGameRoom.getStage();
    const highScore = defaultGameRoom.getHighScore();

    logger.info(`Client connected: (ClientIP: ${clientIp}, ClientID: ${clientId})`);
    addAndDestroyAnnounce(`새로운 사용자가 서버에 접속하였습니다. IP: ${clientIp}, ID: ${shortClientId}`);

    unicast({ type: MessageType.SCORE_UPDATED, stage: stage, highScore: highScore }, client.ws);
    broadcast({ type: MessageType.CLIENT_CONNECTED, id: clientId }, client.ws);
}

function handleClientMessage(req, clientId, message) {
    const client = clients.get(clientId);
    const data = JSON.parse(message);

    const clientIp = req.socket.remoteAddress;
    const shortClientId = clientId.substring(0, 8);

    logger.debug(`Received from IP: ${clientIp}, ClientID: ${shortClientId}, MSG: ${JSON.stringify(data)}`);

    if (data.type === MessageType.SPACESHIP_POSITION) {
        client.spaceshipPosition = { x: data.x, y: data.y };
        broadcast({ type: MessageType.SPACESHIP_POSITION, id: clientId, x: data.x, y: data.y }, client.ws);
    } else if (data.type === MessageType.BULLET_POSITION) {
        broadcast({ type: MessageType.BULLET_POSITION, id: clientId, x: data.x, y: data.y }, client.ws);
    } else if (data.type === MessageType.BOMB_POSITION) {
        broadcast({ type: MessageType.BOMB_POSITION, id: clientId, x: data.x, y: data.y }, client.ws); 
    } else if (data.type === MessageType.CREATE_ENEMY) {
        sendCreateEnemyMessage(data);
    } else if (data.type === MessageType.SCORE_UPDATED) {
        sendScoreUpdateMessage(data, clientId);
    } else if (data.type === MessageType.PAUSE_STATUS) {
        client.isPaused = data.status;
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
    }
    
    broadcast({ type: MessageType.CLIENT_DISCONNECTED, id: clientId }, client.ws);
}

function sendScoreUpdateMessage(data, clientId) {
    const client = clients.get(clientId);
    const score = data.score;
    const gameover = data.gameover;
    const stage = data.stage;
    let highScore = defaultGameRoom.getHighScore();

    // 업데이트 score
    client.score = score;

    // 업데이트 highscore
    if (score > highScore) {
        highScore = score
        defaultGameRoom.setHighScore(highScore);
    }

    // 업데이트 stage
    if (defaultGameRoom.getStage() < stage) {
        defaultGameRoom.setStage(stage)
    }

    // 업데이트 gameover 및 모든 플레이어 종료 시 스테이지 초기화
    client.gameover = gameover;
    if (gameover) {
        // 접속한 클라이언트(pause제외)가 모두 gameover인지 확인
        let allClientsGameOver = true;
        for (const [id, client] of clients) {
            if (!client.isPaused && !client.gameover) {
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

    // 메세지 전달
    broadcast({ type: MessageType.SCORE_UPDATED, id: clientId, score: score, stage: stage, highScore: highScore }, null);
}

// 클라이언트에게 적군 생성 메시지를 전송합니다.
function sendCreateEnemyMessage(data) {
    // 서버에서 적군 생성 로직을 수행하고 생성된 적군 정보를 해당 클라이언트에게 전달
    const startX = data.start;
    const endX = data.end;

    enemyManager.createEnemy(startX, endX);

    const enemy = enemyManager.enemyList[enemyManager.enemyList.length - 1]; // 마지막으로 생성된 적군 정보 가져오기
    const enemyMessage = { type: MessageType.CREATE_ENEMY, x: enemy.x, y: enemy.y };
    
    broadcast(enemyMessage, null); // null을 통해 모든 클라이언트에게 메시지 전달
}

// 모든 클라이언트에게 메시지 전송
function broadcast(message, sender) {
    message_str = JSON.stringify(message);
    clients.forEach((client, id) => {
        const ws = client.ws;
        if (ws !== sender) { // 발신자를 제외하고 모든 사용자에게 메세지 전달
            // 특정 메세지 타입은 게임을 중단중인 사용자에게는 보내지 않음
            if (client.isPaused && [MessageType.BULLET_POSITION, MessageType.BOMB_POSITION, MessageType.CREATE_ENEMY].includes(message.type)) {
                return; // foreach 건너뛰기
            }

            const clientIp = ws._socket.remoteAddress;
            const shortId = id.substring(0, 8); // UUID 일부만 보기 위해 substring으로 잘라냄
            logger.debug(`Sending to IP: ${clientIp}, ClientID: ${shortId}, ${message_str}`);
            ws.send(message_str);
        }
    });
}

// 단일 클라이언트에게 메세지 전송
function unicast(message, target) {
    message_str = JSON.stringify(message)
    clients.forEach((client, id) => {
        const ws = client.ws;
        if (ws === target) {
            const clientIp = ws._socket.remoteAddress;
            const shortId = id.substring(0, 8); // UUID 일부만 보기 위해 substring으로 잘라냄
            logger.debug(`Sending to IP: ${clientIp}, ClientID: ${shortId}, ${message_str}`);
            ws.send(message_str);
        }
    });
}

module.exports = { handleClientConnection, handleClientMessage, handleClientDisconnection }
