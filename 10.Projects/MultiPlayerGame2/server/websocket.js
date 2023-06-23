// websocket.js

const WebSocket = require('ws');
const uuid = require('uuid');

const { logger } = require('../util/logger')
const { handleClientConnection, handleClientMessage, handleClientDisconnection } = require('./ws_handler')
const { clients, clientInfo } = require('./clientinfo')


// 웹소켓 서버 생성
const port = 8080;
const wss = new WebSocket.Server({ port: port });


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


module.exports = { wss, port, clients };
