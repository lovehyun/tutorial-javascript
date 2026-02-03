// wsServer.js
// - /chat/:roomName WebSocket 처리
// - 입장 시(SESSION) 크레딧 차감, 채팅 시 메시지당 1 크레딧 차감

function initWsRoutes(app, shared) {
    const { rooms } = shared;

    app.ws('/chat/:roomName', (ws, req) => {
        const { roomName } = req.params;
        const clientIp = req.socket.remoteAddress;
        console.log(`Client connected to room '${roomName}' from: ${clientIp}`);

        if (!rooms.has(roomName)) {
            ws.send(JSON.stringify({ type: 'error', content: '존재하지 않는 방입니다.' }));
            ws.close();
            return;
        }

        setupRoomWebSocket(ws, req, shared);
    });
}

// 방 하나에 대한 WebSocket 처리
function setupRoomWebSocket(ws, req, shared) {
    const { rooms, getUser, DEFAULT_ROOM } = shared;
    const { roomName } = req.params;

    ws.on('message', (message) => {
        let data;
        try {
            data = JSON.parse(message);
        } catch {
            console.error('Invalid JSON:', message);
            return;
        }

        if (data.type === 'session') {
            handleSession(ws, roomName, data, rooms, getUser, DEFAULT_ROOM);
        } else if (data.type === 'message') {
            handleChat(ws, roomName, data, rooms, getUser);
        }
    });

    ws.on('close', () => {
        if (!ws.username) return;
        const roomInfo = rooms.get(roomName);
        if (!roomInfo) return;

        roomInfo.users.delete(ws.username);
        console.log(`[LEAVE ROOM] ${ws.username} left "${roomName}" (remain: ${roomInfo.users.size})`);

        broadcast(rooms, roomName, `${ws.username}님이 퇴장했습니다.`, 'broadcast');
        sendUserCount(rooms, roomName);
    });
}

// 방 입장 처리 (SESSION)
function handleSession(ws, roomName, data, rooms, getUser, DEFAULT_ROOM) {
    const username = (data.username || '').trim();
    if (!username) {
        ws.send(JSON.stringify({ type: 'error', content: 'username은 필수입니다.' }));
        return;
    }

    const roomInfo = rooms.get(roomName);
    if (roomInfo.users.has(username)) {
        ws.send(JSON.stringify({ type: 'error', content: '이미 사용 중인 이름입니다.' }));
        return;
    }

    const user = getUser(username);

    // 기본방이 아니면 입장 시 5 크레딧 차감
    if (roomName !== DEFAULT_ROOM) {
        if (user.credits < 5) {
            ws.send(JSON.stringify({ type: 'error', content: '입장: 크레딧 5 필요' }));
            ws.close();
            return;
        }
        user.credits -= 5;
    }

    ws.username = username;
    roomInfo.users.set(username, ws);

    console.log(`[JOIN ROOM] ${username} joined "${roomName}" (credits: ${user.credits})`);

    // 본인에게 크레딧 전송
    ws.send(JSON.stringify({ type: 'credit', credits: user.credits }));

    broadcast(rooms, roomName, `${username}님이 입장했습니다.`, 'broadcast');
    sendUserCount(rooms, roomName);
}

// 채팅 처리 (MESSAGE)
function handleChat(ws, roomName, data, rooms, getUser) {
    if (!ws.username) {
        ws.send(JSON.stringify({ type: 'error', content: '세션이 없습니다.' }));
        return;
    }

    const content = (data.content || '').trim();
    if (!content) return;

    const user = getUser(ws.username);
    if (user.credits < 1) {
        ws.send(JSON.stringify({ type: 'error', content: '메시지: 크레딧 1 필요' }));
        return;
    }

    user.credits -= 1;
    ws.send(JSON.stringify({ type: 'credit', credits: user.credits }));

    console.log(`[CHAT] ${ws.username}@${roomName}: "${content}" (credits: ${user.credits})`);
    broadcast(rooms, roomName, content, 'chat', ws.username);
}

// 방 내 브로드캐스트
function broadcast(rooms, roomName, message, type = 'broadcast', sender = 'server') {
    const roomInfo = rooms.get(roomName);
    if (!roomInfo) return;

    roomInfo.users.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify({ type, content: message, sender }));
        }
    });
}

// 방 인원 수 전송
function sendUserCount(rooms, roomName) {
    const roomInfo = rooms.get(roomName);
    if (!roomInfo) return;

    const payload = JSON.stringify({ type: 'userCount', count: roomInfo.users.size });
    roomInfo.users.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(payload);
        }
    });
}

module.exports = initWsRoutes;
