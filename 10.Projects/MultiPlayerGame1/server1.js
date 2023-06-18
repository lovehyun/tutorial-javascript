// 1. 단일 사용자 메세지 송수신

const WebSocket = require('ws');

const port = 8080;

// 웹소켓 서버 생성
const wss = new WebSocket.Server({ port: port });

// 클라이언트 관리
const clients = new Set();

// 서버 시작 시 이벤트 처리
wss.on('listening', () => {
    console.log(`WebSocket server started and listening on port ${port}`);
});

// 클라이언트 연결 시 이벤트 처리
wss.on('connection', (ws, req) => {
    clients.add(ws);
    const clientIp = req.socket.remoteAddress;
    console.log('Client connected from:', clientIp);

    // 클라이언트로부터 메시지 수신 시 이벤트 처리
    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);
        console.log(`Received message from [${clientIp}]: `, parsedMessage);

        if (parsedMessage.type === "spaceshipPosition") {
            updateSpaceshipPosition(ws, parsedMessage);
        }
    });


    // 클라이언트와 연결 해제 시 이벤트 처리
    ws.on('close', () => {
        console.log('Client disconnected:', clientIp);
        // 연결 해제 시 필요한 로직을 추가하세요.
    });
});

function updateSpaceshipPosition(sender, message) {
    const updatedMessage = JSON.stringify(message);

    clients.forEach((client) => {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
            const clientIp = client._socket.remoteAddress;
            console.log(`Sending message to [${clientIp}]: `, updatedMessage);
            client.send(updatedMessage);
        }
    });
}

// 서버 시작
console.log(`WebSocket server is starting...`);
