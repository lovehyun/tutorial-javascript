// npm install ws
const WebSocket = require('ws');
// 웹소켓 서버 생성
const port = 8080;
const wss = new WebSocket.Server({ port: port });

// import { WebSocketServer } from "ws";
// const wss = new WebSocketServer({ port: port });


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
        const parsedMessage = JSON.parse(message);
        console.log(`Received message from [${clientIp}]: ${JSON.stringify(parsedMessage)}`);

        // 현재 클라이언트에게 메시지 그대로 전송
        // ws.send(JSON.stringify(parsedMessage));

        // 메세지 가공
        const modifiedMessage = {
            type: 'chat',
            content: `Echo: ${parsedMessage.content}`
        };

        // 모든 클라이언트에게 메시지 전송
        wss.clients.forEach((client) => {
            // if (client !== ws && client.readyState === WebSocket.OPEN) {  // 보낸 사람 제외

            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(modifiedMessage));
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
