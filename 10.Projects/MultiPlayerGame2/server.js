// server.js

const { wss, port, clients } = require('./server/modules/websocket');
const { announcement } = require('./server/modules/clientinfo.js')
const { logger } = require('./server/util/logger.js');
const { defaultGameRoom } = require('./server/modules/gamemanager');

const express = require('express');
const app = express();
const path = require('path');


// ========================================================
// 내부 서버 관리 코드
// ========================================================

let webSocketAddress = process.env.WEBSOCKET_ADDRESS;

if (!webSocketAddress) {
    logger.error('WEBSOCKET_ADDRESS 환경 변수가 설정되지 않았습니다.');
    if (process.env.NODE_ENV === 'PRODUCTION') {
        process.exit(1); // 프로세스 종료
    } else {
        const defaultWebSocketAddress = `ws://127.0.0.1:${port}`;
        logger.info(`WEBSOCKET_ADDRESS를 기본값으로 사용합니다. ${defaultWebSocketAddress}`);
        webSocketAddress = defaultWebSocketAddress; // 기본값을 webSocketAddress에 할당
    }
}

// ========================================================
// 익스프레스 서버 엔드포인트
// ========================================================

// 메인 클라이언트 게임 접속 페이지
app.use(express.static('./client'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './client/game.html'));
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
app.get('/clients/stats/country', (req, res) => {
    const sampleData = [
        { country: 'Korea', count: 100 },
    ];

    res.json(sampleData);
});

// 클라이언트 접속자 공지 엔드포인트
app.get('/clients/announce', (req, res) => {
    // announcement 배열의 내용을 스트링 형태로 반환
    res.send(announcement.join('\n'));
});


// 익스프레스 서버 시작
app.listen(3000, () => {
    logger.info('REST API server started on port 3000');
});

// 게임 서버 시작 완료
logger.info(`WebSocket server is now starting...`);
