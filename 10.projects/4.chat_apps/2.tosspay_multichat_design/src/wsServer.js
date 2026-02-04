/**
 * WebSocket: /chat/:roomName
 * - 방별로 소켓 묶음(rooms Map), 연결 시 바로 입장 처리 후 채팅/퇴장 처리
 */
const users = require('./database/users');

const DEFAULT_ROOM = '기본채팅방';
const rooms = new Map(); // roomName → { users: Map<username, ws> }

function getRooms() {
    return rooms;
}

function initWsRoutes(app) {
    if (!rooms.has(DEFAULT_ROOM)) {
        rooms.set(DEFAULT_ROOM, { users: new Map() });
    }

    const shared = {
        rooms,
        getUserById: users.findById.bind(users),
        subtractCredits: users.subtractCredits.bind(users),
        DEFAULT_ROOM,
    };

    app.ws('/chat/:roomName', (ws, req) => {
        // 세션으로 로그인 여부 확인
        if (!req.session || !req.session.userId) {
            ws.send(JSON.stringify({ type: 'error', content: '로그인이 필요합니다.' }));
            ws.close();
            return;
        }
        const user = users.findById(req.session.userId);
        if (!user) {
            ws.close();
            return;
        }
        ws.userId = user.id;
        ws.username = user.username;

        const { roomName } = req.params;
        if (!rooms.has(roomName)) {
            ws.send(JSON.stringify({ type: 'error', content: '존재하지 않는 방입니다.' }));
            ws.close();
            return;
        }
        const roomInfo = rooms.get(roomName);
        // 연결 직후 서버에서 바로 입장 처리 (클라이언트 session 메시지 도착 전에 리스너가 없어 빠지는 문제 방지)
        if (!doJoinRoom(ws, roomName, shared)) {
            return;
        }
        setupRoomWebSocket(ws, roomName, shared);
    });
}

/** 메시지 수신: session(재요청 시 크레딧/인원만), message(채팅 1크레딧) */
function setupRoomWebSocket(ws, roomName, shared) {
    const { rooms } = shared;
    const roomInfo = rooms.get(roomName);

    ws.on('message', (message) => {
        let parsed;
        try {
            parsed = JSON.parse(message);
        } catch (e) {
            return;
        }
        if (parsed.type === 'session') {
            // 이미 입장 처리됨. 크레딧/인원수만 다시 보냄
            const updated = shared.getUserById(ws.userId);
            ws.send(JSON.stringify({ type: 'credit', credits: updated.credits }));
            sendUserCount(rooms, roomName);
        } else if (parsed.type === 'message') {
            handleChatMessage(ws, roomName, parsed, shared);
        }
    });

    /** 연결 끊김: 방에서 제거 후 퇴장 알림·인원수 갱신 */
    ws.on('close', () => {
        if (!ws.username) return;
        roomInfo.users.delete(ws.username);
        broadcastMessage(rooms, roomName, `${ws.username}님이 퇴장했습니다.`, 'broadcast');
        sendUserCount(rooms, roomName);
    });
}

/** 연결 시 방 입장 처리. 실패 시 false 반환(ws는 이미 close된 상태일 수 있음) */
function doJoinRoom(ws, roomName, shared) {
    const { rooms, getUserById, subtractCredits, DEFAULT_ROOM } = shared;
    const roomInfo = rooms.get(roomName);
    if (roomInfo.users.has(ws.username)) {
        ws.send(JSON.stringify({ type: 'error', content: '이미 사용 중인 이름입니다.' }));
        ws.close();
        return false;
    }
    const user = getUserById(ws.userId);
    if (roomName !== DEFAULT_ROOM) {
        if (user.credits < 5) {
            ws.send(JSON.stringify({ type: 'error', content: '크레딧이 부족합니다. (입장 5 크레딧 필요)' }));
            ws.close();
            return false;
        }
        subtractCredits(ws.userId, 5, 'room_join', roomName);
    }
    roomInfo.users.set(ws.username, ws);
    const updated = getUserById(ws.userId);
    ws.send(JSON.stringify({ type: 'credit', credits: updated.credits }));
    broadcastMessage(rooms, roomName, `${ws.username}님이 입장했습니다.`, 'broadcast');
    sendUserCount(rooms, roomName);
    return true;
}

/** 채팅 메시지: 1 크레딧 차감 후 방 전체에 브로드캐스트 */
function handleChatMessage(ws, roomName, payload, shared) {
    const { rooms, getUserById, subtractCredits } = shared;
    const user = getUserById(ws.userId);
    if (user.credits < 1) {
        ws.send(JSON.stringify({ type: 'error', content: '크레딧이 부족합니다. (메시지 1 크레딧 필요)' }));
        return;
    }
    subtractCredits(ws.userId, 1, 'chat', roomName);
    const updated = getUserById(ws.userId);
    ws.send(JSON.stringify({ type: 'credit', credits: updated.credits }));
    broadcastMessage(rooms, roomName, payload.content || '', 'chat', ws.username);
}

/** 방 안 모든 클라이언트에게 메시지 전송 */
function broadcastMessage(rooms, roomName, message, type = 'broadcast', sender = 'server') {
    const roomInfo = rooms.get(roomName);
    if (!roomInfo) return;
    roomInfo.users.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify({ type, content: message, sender }));
        }
    });
}

/** 방 인원수(userCount) 전체에 알림 */
function sendUserCount(rooms, roomName) {
    const roomInfo = rooms.get(roomName);
    if (!roomInfo) return;
    const payload = JSON.stringify({ type: 'userCount', count: roomInfo.users.size });
    roomInfo.users.forEach((client) => {
        if (client.readyState === client.OPEN) client.send(payload);
    });
}

module.exports = { initWsRoutes, getRooms };
