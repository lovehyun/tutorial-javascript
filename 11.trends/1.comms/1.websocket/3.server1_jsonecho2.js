// npm install ws
const WebSocket = require('ws');
const port = 8080;
const wss = new WebSocket.Server({ port });

// 메시지 타입 상수
const MESSAGE_TYPES = {
    CHAT: 'chat',
    PING: 'ping',
    PONG: 'pong',
    SYSTEM: 'system',
};

// 공통 전송 함수
function sendJSON(ws, type, payload = {}) {
    if (ws.readyState !== WebSocket.OPEN) return;
    const packet = { type, ...payload }; // { type: 'chat', content: '...' } 같은 형태
    ws.send(JSON.stringify(packet));
}

// 서버 시작 시
wss.on('listening', () => {
    console.log(`WebSocket server started and listening on port ${port}`);
});

// 타입별 핸들러 모음
const handlers = {
    [MESSAGE_TYPES.CHAT]: (ws, clientIp, msgObj) => {
        const modifiedMessage = {
            type: MESSAGE_TYPES.CHAT,
            content: `Echo: ${msgObj.content}`,
            from: clientIp,
        };

        // 전체 브로드캐스트
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(modifiedMessage));
            }
        });
    },

    [MESSAGE_TYPES.PING]: (ws, clientIp, msgObj) => {
        console.log(`PING from [${clientIp}] at ${new Date().toISOString()}`);
        // 해당 클라이언트에게만 PONG
        sendJSON(ws, MESSAGE_TYPES.PONG, { content: 'pong', ts: Date.now() });
    },

    // 필요하면 PONG도 로깅용으로 처리 가능
    [MESSAGE_TYPES.PONG]: (ws, clientIp, msgObj) => {
        console.log(`PONG from [${clientIp}] at ${msgObj.ts || 'no ts'}`);
    },
};

// 클라이언트 연결 시
wss.on('connection', (ws, req) => {
    const clientIp = req.socket.remoteAddress;
    console.log('Client connected from:', clientIp);

    // 처음 접속한 클라이언트에게 시스템 메시지
    sendJSON(ws, MESSAGE_TYPES.SYSTEM, { content: '서버에 연결되었습니다!' });

    ws.on('message', (message) => {
        let msgObj;

        try {
            msgObj = JSON.parse(message);
        } catch (e) {
            console.log(`Invalid JSON from [${clientIp}]:`, message.toString());
            return;
        }

        console.log(`Received from [${clientIp}]:`, msgObj);

        const handler = handlers[msgObj.type];
        if (handler) {
            handler(ws, clientIp, msgObj);
        } else {
            console.log(`Unknown message type from [${clientIp}]:`, msgObj.type);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// (선택) 서버가 주기적으로 ping 보내고 싶으면:
setInterval(() => {
    wss.clients.forEach((client) => {
        sendJSON(client, MESSAGE_TYPES.PING, { content: 'ping', ts: Date.now() });
    });
}, 30000); // 30초마다 핑

console.log(`WebSocket server is starting...`);
