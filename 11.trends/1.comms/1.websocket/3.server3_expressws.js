const express = require('express');
const expressWs = require('express-ws');
const path = require('path');

const port = 3000;

const app = express();
expressWs(app);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chat3_clients.html'));
});

// 웹소켓 클라이언트 저장할 자료구조 Map(username, ws)
const wsClients = new Map();

// WebSocket handling
app.ws('/chat', (ws, req) => {
    const clientIp = req.socket.remoteAddress;

    console.log('Client connected from:', clientIp);
    
    // 클라이언트로부터 메시지 수신 시 이벤트 처리
    ws.on('message', (message) => {
        const messageString = message.toString('utf8');

        // 받은 메시지를 그대로 클라이언트에게 다시 전송 (Echo)
        // ws.send(messageString);

        // 파싱하여 content와 세션 ID 추출
        const parsedMessage = JSON.parse(messageString);
        const username = parsedMessage.username;
        const content = parsedMessage.content;

        // 세션 ID 설정 (한 번만 설정하면 됨)
        if (username && !wsClients.has(username)) {
            wsClients.set(username, ws);
            // ws.username = username;  // 필요시 ws 객체에 username 저장
            broadcastMessage(`[${username}] entered the chat.`);
        }
        
        console.log(`Received message from [${clientIp}]: `, username);

        // 모든 클라이언트에게 메시지 전송
        if (parsedMessage.type !== 'session') {
            const messageObj = {
                type: 'received',
                content: content,
                sender: username,
            };

            wsClients.forEach((client) => {
                if (client.readyState === ws.OPEN) {
                    // 보낸 클라이언트에게만 'sent' 타입으로 변경
                    messageObj.type = client === ws ? 'sent' : 'received';
                    messageObj.sender = client === ws ? 'me' : username;
                    client.send(JSON.stringify(messageObj));
                }
            });
        }
    });

    // 클라이언트와 연결 해제 시 이벤트 처리
    ws.on('close', () => {
        console.log('Client disconnected');
        // console.log(`Client [${ws.username}] disconnected.`);

        // if (ws.username) {  // 이전에 저장한 ws.username을 사용하여 직접 삭제
        //     wsClients.delete(ws.username);
        //     broadcastMessage(`[${ws.username}] left the chat.`);
        // }

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
            if (client.readyState === ws.OPEN) {
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
