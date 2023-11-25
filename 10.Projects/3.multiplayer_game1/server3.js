// 3. 두개 혹은 그 이상의 메세지 송수신을 위해 id 추가
// 3-1. 디버깅을 위한 rest-api 소켓 생성 및 클라이언트 접속 현황 확인

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
        const parsedMessage = JSON.parse(message);
        console.log(`Received message from\t[${clientIp}, clientId:\t${shortClientId}]:`, parsedMessage);

        if (parsedMessage.type === "spaceshipPosition") {
            updateSpaceshipPosition(clientId, parsedMessage);
        }
    });

    // 클라이언트와 연결 해제 시 이벤트 처리
    ws.on('close', () => {
        console.log(`Client disconnected:\t${clientIp}\tclientId:\t${clientId}`);

        // 상대방에게 연결 해제된 클라이언트의 위치 정보를 전달 (null 값)
        clients.forEach((client) => {
            if (client !== clientId && client.readyState === WebSocket.OPEN) {
                const clientIp = client._socket.remoteAddress;
                const disconnectedMessage = JSON.stringify({ type: "disconnectedClient", id: clientId});
                console.log(`Sending message to\t[${clientIp}, clientId:\t${shortClientId}]:`, disconnectedMessage);
                client.send(disconnectedMessage);
            }
        });

        // 접속 종료된 클라이언트 정보 삭제
        clients.delete(clientId);
        spaceshipPositions.delete(clientId);
    });
});

function updateSpaceshipPosition(clientId, message) {
    spaceshipPositions.set(clientId, { x: message.x, y: message.y });

    clients.forEach((client, id) => {
        if (id !== clientId && client.readyState === WebSocket.OPEN) {
            const clientIp = client._socket.remoteAddress;
            const opponentPosition = spaceshipPositions.get(clientId);
            const updatedMessage = JSON.stringify({ type: "spaceshipPosition", id: clientId, x: opponentPosition?.x, y: opponentPosition?.y });

            const shortId = id.substring(0, 8); // UUID 일부만 보기 위해 substring으로 잘라냄
            console.log(`Sending message to\t[${clientIp}, clientId:\t${shortId}]:`, updatedMessage);
            client.send(updatedMessage);
        }
    });
}


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
