// server.js

const { wss, port, clients, getClientStats } = require('./server/modules/websocket');
const { announcement } = require('./server/modules/clientinfo.js')
const { logger } = require('./server/util/logger.js');
const { defaultGameRoom } = require('./server/modules/gamemanager');

const express = require('express');
const app = express();
const path = require('path');


// ========================================================
// 내부 서버 관리 코드
// ========================================================

// WebSocket 주소 설정을 함수로 변경
function getWebSocketAddress(req) {
    // 호스트:포트 정보 (프로토콜 없이)
    const webSocketHost = process.env.WEBSOCKET_ADDRESS || 
                         req.get('host') || 
                         `localhost:${port}`;
    
    // HTTPS 여부에 따라 프로토콜 결정
    const isHTTPS = req.secure || req.headers['x-forwarded-proto'] === 'https';
    const protocol = isHTTPS ? 'wss' : 'ws';
    
    return `${protocol}://${webSocketHost}`;
}

// 환경변수 체크 및 로깅
if (!process.env.WEBSOCKET_ADDRESS) {
    logger.info('WEBSOCKET_ADDRESS 환경 변수가 설정되지 않았습니다. 동적으로 프로토콜을 판단합니다.');
} else {
    logger.info(`고정 WebSocket 주소 사용: ${process.env.WEBSOCKET_ADDRESS}`);
}

// ========================================================
// 익스프레스 서버 엔드포인트
// ========================================================

// 정적 컨텐츠 제공 폴더 (html/css/js)
app.use(express.static('./client'));

// 메인 클라이언트 게임 접속 페이지
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './client/game.html'));
});

// 클라이언트에게 WebSocket 주소를 전달
app.get('/config', (req, res) => {
    const webSocketAddress = getWebSocketAddress(req);
    res.json({ webSocketAddress });
    logger.info(`Successfully configured the websocket address to client ${webSocketAddress}`)
});

// 사용자 접속 통계 조회 페이지
app.get('/stats', (req, res) => {
    res.sendFile(path.join(__dirname, './client/stat.html'));
});

// 클라이언트 정보 조회 엔드포인트
app.get('/api/clients', (req, res) => {
    const clientList = Array.from(clients).map(([clientId, client]) => ({
        id: clientId,
        ip: client.ws._socket.remoteAddress,
        position: client.spaceshipPosition,
        score: client.score,
        gameover: client.gameover,
        isPaused: client.isPaused,
    }));

    const output = {
        highScore: defaultGameRoom.getHighScore(),
        stage: defaultGameRoom.getStage(),
        wssClientsSize: wss.clients.size,
        clients: clientList,
    }

    const formattedOutput = JSON.stringify(output, null, 4);
    res.setHeader('Content-Type', 'application/json');
    res.send(formattedOutput);

    // res.json(clientList);
});

// 클라이언트 접속자 통계 엔드포인트
app.get('/api/clients/stats', (req, res) => {
    const stats = getClientStats();

    const formattedOutput = JSON.stringify(stats, null, 4);
    res.setHeader('Content-Type', 'application/json');
    res.send(formattedOutput);

    // res.json(stats);
});

// 클라이언트 접속자 공지 엔드포인트
app.get('/api/clients/announce', (req, res) => {
    // announcement 배열의 내용을 스트링 형태로 반환
    res.send(announcement.join('\n'));
});


// 익스프레스 서버 시작
app.listen(3000, () => {
    logger.info('REST API server started on port 3000');
});

// 게임 서버 시작 완료
logger.info(`WebSocket server is now starting...`);
