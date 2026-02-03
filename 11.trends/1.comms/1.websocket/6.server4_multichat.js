const express = require('express');
const expressWs = require('express-ws');
const path = require('path');

const port = 3000;

const app = express();
expressWs(app);

app.use(express.json());

// 방과 클라이언트 데이터 구조
const rooms = new Map(); // 각 방을 { 방이름: { users: Map(username, ws) } } 형태로 저장

app.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname, 'public', 'chat4_rooms.html'));
    res.sendFile(path.join(__dirname, 'public', 'chat4_rooms2_design.html'));
});

// 방 목록 제공 (프론트엔드에서 방 조회 가능)
app.get('/rooms', (req, res) => {
    res.json(Array.from(rooms.keys())); // 방 목록 배열 전송
});

app.get('/rooms/detail', (req, res) => {
    const roomData = Array.from(rooms.entries()).map(([roomName, roomInfo]) => {
        return {
            roomName,
            userCount: roomInfo.users.size,
            users: Array.from(roomInfo.users.keys())
        };
    });
    res.json(roomData);
});

// 방 생성 API
app.post('/create-room', (req, res) => {
    const { roomName } = req.body;

    // 빈 방 이름 방지
    if (!roomName || roomName.trim() === "") {
        return res.status(400).json({ error: 'Room name cannot be empty.' });
    }

    // 중복 방 체크
    if (rooms.has(roomName)) {
        return res.status(400).json({ error: 'Room already exists' });
    }

    // 방 생성
    rooms.set(roomName, { users: new Map() });
    res.status(201).json({ message: `Room ${roomName} created successfully!` });
});

// WebSocket handling
app.ws('/chat/:roomName', (ws, req) => {
    const { roomName } = req.params;
    const clientIp = req.socket.remoteAddress;

    console.log(`Client connected to room '${roomName}' from: ${clientIp}`);
    
    if (!rooms.has(roomName)) {
        ws.send(JSON.stringify({ type: 'error', content: 'Room does not exist.' }));
        ws.close();
        return;
    }
    
    // 클라이언트로부터 메시지 수신 시 이벤트 처리
    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);
        const { username, content, type } = parsedMessage;
        console.log(`Received message from [${clientIp}]: ${JSON.stringify(parsedMessage)}`);

        // 세션 메시지 접수
        if (type === 'session') {
            // 이미 존재하는 세션 검사
            if (!username || username.trim() === "") {
                ws.send(JSON.stringify({ type: 'error', content: 'Username cannot be empty.' }));
                return;
            }

            if (rooms.get(roomName).users.has(username)) {
                ws.send(JSON.stringify({ type: 'error', content: 'Username already taken.' }));
                return;
            }

            ws.username = username; // 웹소켓에 사용자 유저네임 추가
            rooms.get(roomName).users.set(username, ws);
            broadcastMessage(roomName, `${username} joined the room.`);
            sendUserCount(roomName);
        } else if (type === 'message') {
            broadcastMessage(roomName, `${content}`, 'chat', username);
        }
    });

    // 클라이언트와 연결 해제 시 이벤트 처리
    ws.on('close', () => {
        console.log(`Client [${ws.username}] disconnected.`);
        if (ws.username) {
            rooms.get(roomName).users.delete(ws.username);
            broadcastMessage(roomName, `${ws.username} left the room.`);
            sendUserCount(roomName);
        }
    });

    // 방 내 브로드캐스트 함수
    function broadcastMessage(room, message, type='broadcast', sender='server') {
        rooms.get(room).users.forEach((client) => {
            if (client.readyState === ws.OPEN) {
                client.send(JSON.stringify({ type, content: message, sender }));
            }
        });
    }

    // 현재 방 사용자 수 전송
    function sendUserCount(room) {
        const userCount = rooms.get(room).users.size;
        broadcastMessage(room, `Users connected: ${userCount}`, 'userCount');
    }
});

// 서버 시작
console.log(`WebSocket server is starting...`);

// Start the HTTP server
app.listen(port, () => {
    console.log(`WebSocket server is running on http://localhost:${port}`);
});
