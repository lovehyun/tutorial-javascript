const express = require('express');
const expressWs = require('express-ws');
const WebSocket = require('ws');
const path = require('path');

const port = 3000;

const app = express();
expressWs(app);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'chat3_clients.html'));
});

// Store WebSocket clients with their session IDs in a map
const wsClients = new Map();

// WebSocket handling
app.ws('/chat', (ws, req) => {
    const clientIp = req.socket.remoteAddress;

    console.log('Client connected from:', clientIp);
    
    // 클라이언트로부터 메시지 수신 시 이벤트 처리
    ws.on('message', (message) => {
        const messageString = message.toString('utf8');
        
        // 파싱하여 content와 세션 ID 추출
        const parsedMessage = JSON.parse(messageString);
        const content = parsedMessage.content;
        const username = parsedMessage.username;

        // 세션 ID 설정 (한 번만 설정하면 됨)
        if (username && !wsClients.has(username)) {
            wsClients.set(username, ws);
            broadcastMessage(`[${username}] entered the chat.`);
        }
        
        console.log(`Received message from [${clientIp}]: `, username);

        // 모든 클라이언트에게 메시지 전송
        if (parsedMessage.type !== 'session') {
            wsClients.forEach((client, clientId) => {
                if (client.readyState === WebSocket.OPEN) {
                    const messageType = client === ws ? 'sent' : 'received';
                    const messageObj = {
                        type: messageType,
                        content: content,
                        sender: clientId === username ? 'me' : username,
                    };
                    client.send(JSON.stringify(messageObj));
                }
            });
        }
    });

    // 클라이언트와 연결 해제 시 이벤트 처리
    ws.on('close', () => {
        console.log('Client disconnected');
        // 연결이 끊긴 클라이언트의 세션을 맵에서 제거
        wsClients.forEach((client, clientId) => {
            if (client === ws) {
                wsClients.delete(clientId);
                broadcastMessage(`[${clientId}] left the chat.`);
            }
        });
    });

    // 함수를 사용하여 메시지를 모든 클라이언트에 브로드캐스트
    function broadcastMessage(message) {
        wsClients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                const broadcastObj = {
                    type: 'broadcast',
                    content: message,
                };
                client.send(JSON.stringify(broadcastObj));
            }
        });
    }
});

// 서버 시작
console.log(`WebSocket server is starting...`);

// Start the HTTP server
app.listen(port, () => {
    console.log(`WebSocket server is running on http://localhost:${port}`);
});
