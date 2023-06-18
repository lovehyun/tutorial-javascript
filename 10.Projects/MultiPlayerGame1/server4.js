// 4. 총알 정보 전송
// 4.1 리펙토링 (웹소켓 broadcast)

const WebSocket = require('ws');
const uuid = require('uuid');
const express = require('express');
const app = express();

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

// ========================================================
// 익스프레스 서버 엔드포인트
// ========================================================

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
