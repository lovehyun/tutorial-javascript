// 2. 두개 혹은 그 이상의 사용자 메세지 송수신

const WebSocket = require('ws');
const uuid = require('uuid');

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
        clients.delete(clientId);
        spaceshipPositions.delete(clientId);

        // 상대방에게 연결 해제된 클라이언트의 위치 정보를 전달 (null 값)
        clients.forEach((client, id) => {
            if (id !== clientId && client.readyState === WebSocket.OPEN) {
                const clientIp = client._socket.remoteAddress;
                const nullPositionMessage = JSON.stringify({ type: "spaceshipPosition", x: null, y: null });
                console.log(`Sending message to\t[${clientIp}, clientId:\t${shortClientId}]:`, nullPositionMessage);
                client.send(nullPositionMessage);
            }
        });
    });
});

function updateSpaceshipPosition(clientId, message) {
    spaceshipPositions.set(clientId, { x: message.x, y: message.y });

    clients.forEach((client, id) => {
        if (id !== clientId && client.readyState === WebSocket.OPEN) {
            const clientIp = client._socket.remoteAddress;
            const opponentPosition = spaceshipPositions.get(clientId);
            const updatedMessage = JSON.stringify({ type: "spaceshipPosition", x: opponentPosition?.x, y: opponentPosition?.y });
            console.log(`Sending message to\t[${clientIp}, clientId:\t${id.substring(0, 8)}]:`, updatedMessage);
            client.send(updatedMessage);
        }
    });
}

// 서버 시작
console.log(`WebSocket server is starting...`);
