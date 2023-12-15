const WebSocket = require('ws');

const port = 8080;

// 웹소켓 서버 생성
const wss = new WebSocket.Server({ port: port });

// 서버 시작 시 이벤트 처리
wss.on('listening', () => {
    console.log(`WebSocket server started and listening on port ${port}`);
});

// 클라이언트 연결 시 이벤트 처리
wss.on('connection', (ws, req) => {
    const clientIp = req.socket.remoteAddress;
    console.log('Client connected from:', clientIp);

    // 클라이언트로부터 메시지 수신 시 이벤트 처리
    ws.on('message', (message) => {
        const messageString = message.toString('utf8');
        console.log(`Received message from [${clientIp}]: `, messageString);

        // 모든 클라이언트에게 메시지 전송
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                const messageType = client === ws ? 'sent' : 'received';
                const messageObj = { type: messageType, content: messageString };
                client.send(JSON.stringify(messageObj));
            }
        });
    });

    // 클라이언트와 연결 해제 시 이벤트 처리
    ws.on('close', () => {
        console.log('Client disconnected');
        // 연결 해제 시 필요한 로직을 추가하세요.
    });
});

// 서버 시작
console.log(`WebSocket server is starting...`);
