// wsServer.js
// -------------------------------------------
// WebSocket 전용 라우트 등록 모듈
// - server.js에서 생성한 app, rooms, getUser, DEFAULT_ROOM을 인자로 받아 사용
// - /chat/:roomName WebSocket 엔드포인트 정의
// -------------------------------------------

/**
 * WebSocket 라우트를 초기화하는 진입 함수
 * @param {import('express').Express} app
 * @param {{ rooms: Map<string, {users: Map<string, any>}>,
 *           getUser: (username: string) => { credits: number },
 *           DEFAULT_ROOM: string
 *        }} shared
 */
function initWsRoutes(app, shared) {
    const { rooms } = shared;

    // WebSocket 엔드포인트: /chat/:roomName
    app.ws('/chat/:roomName', (ws, req) => {
        const { roomName } = req.params;
        const clientIp = req.socket.remoteAddress;

        console.log(`Client connected to room '${roomName}' from: ${clientIp}`);

        // 존재하지 않는 방이면 에러 메시지 전송 후 연결 종료
        if (!rooms.has(roomName)) {
            ws.send(JSON.stringify({ type: 'error', content: '존재하지 않는 방입니다.' }));
            ws.close();
            return;
        }

        // 이 연결에 대한 상세 처리 로직을 별도 함수로 분리
        setupRoomWebSocket(ws, req, shared);
    });
}

/**
 * 하나의 방(room)에 대한 WebSocket 연결 처리 세팅
 * @param {import('ws')} ws
 * @param {import('express').Request} req
 * @param {{ rooms: Map<string, {users: Map<string, any>}>,
 *           getUser: (username: string) => { credits: number },
 *           DEFAULT_ROOM: string
 *        }} shared
 */
function setupRoomWebSocket(ws, req, shared) {
    const { rooms, getUser, DEFAULT_ROOM } = shared;
    const { roomName } = req.params;

    // 클라이언트에서 넘어오는 메시지 처리
    ws.on('message', (message) => {
        let parsed;
        try {
            parsed = JSON.parse(message);
        } catch (e) {
            console.error('Invalid JSON from client:', message);
            return;
        }

        const { type } = parsed;

        if (type === 'session') {
            // 세션(입장) 메시지 처리
            handleSessionMessage(ws, roomName, parsed, shared);
        } else if (type === 'message') {
            // 일반 채팅 메시지 처리
            handleChatMessage(ws, roomName, parsed, shared);
        }
    });

    // WebSocket 연결 종료 시 처리
    ws.on('close', () => {
        if (!ws.username) return;

        const roomInfo = rooms.get(roomName);
        if (!roomInfo) return;

        roomInfo.users.delete(ws.username);
        console.log(
            `[LEAVE ROOM] ${ws.username} left "${roomName}" (remain: ${roomInfo.users.size})`
        );

        // 퇴장 브로드캐스트 및 인원 수 갱신
        broadcastMessage(rooms, roomName, `${ws.username}님이 퇴장했습니다.`, 'broadcast');
        sendUserCount(rooms, roomName);
    });
}

/**
 * 세션 설정(방 입장) 메시지 처리
 * @param {import('ws')} ws
 * @param {string} roomName
 * @param {{ username: string, content?: string, type: string }} payload
 * @param {{ rooms: Map<string, {users: Map<string, any>}>,
 *           getUser: (username: string) => { credits: number },
 *           DEFAULT_ROOM: string
 *        }} shared
 */
function handleSessionMessage(ws, roomName, payload, shared) {
    const { rooms, getUser, DEFAULT_ROOM } = shared;
    const { username } = payload;

    if (!username || username.trim() === '') {
        ws.send(JSON.stringify({ type: 'error', content: 'username은 필수입니다.' }));
        return;
    }

    const roomInfo = rooms.get(roomName);

    // 이미 같은 이름이 방에 존재하는 경우
    if (roomInfo.users.has(username)) {
        ws.send(
            JSON.stringify({
                type: 'error',
                content: '이미 사용 중인 이름입니다.',
            }),
        );
        return;
    }

    const user = getUser(username);

    // 기본 채팅방이 아닐 경우, 입장 시 5 크레딧 차감
    if (roomName !== DEFAULT_ROOM) {
        if (user.credits < 5) {
            ws.send(
                JSON.stringify({
                    type: 'error',
                    content: '크레딧이 부족합니다. (입장 5 크레딧 필요)',
                }),
            );
            ws.close();
            return;
        }
        user.credits -= 5;
    }

    // WebSocket에 username 저장, 방의 users 맵에 등록
    ws.username = username;
    roomInfo.users.set(username, ws);

    console.log(`[JOIN ROOM] ${username} joined "${roomName}" (credits: ${user.credits})`);

    // 본인에게 최신 크레딧 전송
    ws.send(
        JSON.stringify({
            type: 'credit',
            credits: user.credits,
        }),
    );

    // 방 전체에 입장 브로드캐스트
    broadcastMessage(rooms, roomName, `${username}님이 입장했습니다.`, 'broadcast');

    // 방 인원 수 갱신 알림
    sendUserCount(rooms, roomName);
}

/**
 * 일반 채팅 메시지 처리
 * @param {import('ws')} ws
 * @param {string} roomName
 * @param {{ username: string, content: string, type: string }} payload
 * @param {{ rooms: Map<string, {users: Map<string, any>}>,
 *           getUser: (username: string) => { credits: number }
 *        }} shared
 */
function handleChatMessage(ws, roomName, payload, shared) {
    const { rooms, getUser } = shared;
    const { content } = payload;

    if (!ws.username) {
        ws.send(
            JSON.stringify({
                type: 'error',
                content: '세션이 설정되지 않았습니다.',
            }),
        );
        return;
    }

    const user = getUser(ws.username);

    // 채팅 한 마디당 1 크레딧 차감
    if (user.credits < 1) {
        ws.send(
            JSON.stringify({
                type: 'error',
                content: '크레딧이 부족합니다. (메시지 1 크레딧 필요)',
            }),
        );
        return;
    }

    user.credits -= 1;

    // 본인에게 최신 크레딧 전송
    ws.send(
        JSON.stringify({
            type: 'credit',
            credits: user.credits,
        }),
    );

    console.log(
        `[CHAT] ${ws.username}@${roomName}: "${content}" (credits: ${user.credits})`
    );

    // 방 전체에 채팅 브로드캐스트
    broadcastMessage(rooms, roomName, content, 'chat', ws.username);
}

/**
 * 방 내 브로드캐스트 헬퍼 함수
 * @param {Map<string, {users: Map<string, any>}>} rooms
 * @param {string} roomName
 * @param {string} message
 * @param {string} [type='broadcast']
 * @param {string} [sender='server']
 */
function broadcastMessage(rooms, roomName, message, type = 'broadcast', sender = 'server') {
    const roomInfo = rooms.get(roomName);
    if (!roomInfo) return;

    roomInfo.users.forEach((client) => {
        // client.OPEN: ws 인스턴스가 가지고 있는 OPEN 상수 사용
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify({ type, content: message, sender }));
        }
    });
}

/**
 * 방 인원 수 갱신 알림 헬퍼 함수
 * @param {Map<string, {users: Map<string, any>}>} rooms
 * @param {string} roomName
 */
function sendUserCount(rooms, roomName) {
    const roomInfo = rooms.get(roomName);
    if (!roomInfo) return;

    const userCount = roomInfo.users.size;
    const payload = JSON.stringify({
        type: 'userCount',
        count: userCount,
    });

    roomInfo.users.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(payload);
        }
    });
}

// initWsRoutes 함수 하나만 export (named function DI 스타일)
module.exports = initWsRoutes;
