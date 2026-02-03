// public/app.js
// - username 관리(localStorage)
// - 방 목록 렌더링 / 입장
// - WebSocket 채팅
// - Toss 결제 요청 (프런트 SDK) + 서버에서 승인(기존 외부 API 호출 유지)

let username = null;
let socket = null;
let currentRoom = null;

let clientKey = null;
let tossPayments = null;

const DEFAULT_ROOM_NAME = '기본채팅방';

// ----------------------------------------
// 초기 진입: username / Toss / 방 목록 세팅
// ----------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
    initUsername();
    await initToss();
    await fetchRooms();
    await updateCreditDisplay();

    // 버튼 이벤트 연결
    document.getElementById('chargeButton').onclick = requestCharge;
    document.getElementById('createRoomButton').onclick = createRoom;
    document.getElementById('sendButton').onclick = sendMessage;
    document.getElementById('leaveButton').onclick = leaveRoom;
    document.getElementById('messageInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});

// ----------------------------------------
// username 초기화 (localStorage 사용)
// ----------------------------------------
function initUsername() {
    const saved = localStorage.getItem('chatUsername');
    if (saved && saved.trim()) {
        username = saved.trim();
    } else {
        const input = prompt('사용자 이름을 입력하세요:');
        if (!input || !input.trim()) {
            alert('사용자 이름이 필요합니다. 새로고침 후 다시 시도하세요.');
            return;
        }
        username = input.trim();
        localStorage.setItem('chatUsername', username);
    }
    document.getElementById('userNameDisplay').textContent = `사용자: ${username}`;
}

// ----------------------------------------
// Toss SDK 초기화 (clientKey만 받아서 TossPayments 인스턴스 생성)
// ----------------------------------------
async function initToss() {
    const res = await fetch('/config');
    const data = await res.json();
    clientKey = data.clientKey;

    // TossPayments 생성자 호출 (v1 SDK)
    tossPayments = TossPayments(clientKey);
}

// ----------------------------------------
// 내 크레딧 조회 후 상단 표시
// ----------------------------------------
async function updateCreditDisplay() {
    if (!username) return;
    const res = await fetch(`/me/${encodeURIComponent(username)}`);
    if (!res.ok) return;
    const data = await res.json();
    document.getElementById('creditDisplay').textContent = `크레딧: ${data.credits}`;
}

// ----------------------------------------
// 방 목록 불러와서 리스트 렌더링
// ----------------------------------------
async function fetchRooms() {
    const res = await fetch('/rooms/detail');
    if (!res.ok) return;
    const roomList = await res.json();
    const container = document.getElementById('rooms');
    container.innerHTML = '';

    if (!roomList.length) {
        container.textContent = '생성된 방이 없습니다.';
        return;
    }

    roomList.forEach((room) => {
        const row = document.createElement('div');
        row.className = 'room-row';

        const left = document.createElement('div');
        const nameDiv = document.createElement('div');
        nameDiv.className = 'room-name';
        nameDiv.textContent = room.roomName;

        const subDiv = document.createElement('div');
        subDiv.className = 'room-sub';
        const userText = room.users.length
            ? `참여자 ${room.userCount}명 · ${room.users.join(', ')}`
            : `참여자 ${room.userCount}명`;
        subDiv.textContent = userText;

        left.appendChild(nameDiv);
        left.appendChild(subDiv);

        const btn = document.createElement('button');
        btn.className = 'btn btn-primary';
        // 기본방이면 무료, 아니면 5 크레딧
        btn.textContent =
        room.roomName === DEFAULT_ROOM_NAME
            ? '입장 (무료)'
            : '입장 (5 크레딧)';
        btn.onclick = () => joinRoom(room.roomName);

        row.appendChild(left);
        row.appendChild(btn);
        container.appendChild(row);
    });
}

// ----------------------------------------
// 방 생성 요청 (10 크레딧 차감)
// ----------------------------------------
async function createRoom() {
    if (!username) return;
    const roomName = prompt('새 방 이름을 입력하세요:');
    if (!roomName || !roomName.trim()) return;

    const res = await fetch('/create-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName, username }),
    });
    const data = await res.json();

    if (!res.ok) {
        alert(data.error || '방 생성 실패');
        return;
    }

    alert(data.message);
    await updateCreditDisplay();
    await fetchRooms();
}

// ----------------------------------------
// WebSocket으로 방 입장
// ----------------------------------------
function joinRoom(roomName) {
    if (!username) {
        alert('username이 없습니다.');
        return;
    }

    // 기존 연결이 있으면 종료
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
    }

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    socket = new WebSocket(`${protocol}://${window.location.host}/chat/${encodeURIComponent(roomName)}`);
    currentRoom = roomName;
    document.getElementById('currentRoomTitle').textContent = `현재 방: ${roomName}`;
    document.getElementById('messages').innerHTML = '';

    socket.onopen = () => {
        // 세션 설정 (입장)
        socket.send(JSON.stringify({ type: 'session', username }));
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'chat') {
            addMessage(data.sender, data.content);
        } else if (data.type === 'broadcast') {
            addSystemMessage(data.content);
        } else if (data.type === 'credit') {
            document.getElementById('creditDisplay').textContent = `크레딧: ${data.credits}`;
        } else if (data.type === 'userCount') {
            // 방 인원 변동 시 방 목록 갱신
            fetchRooms();
        } else if (data.type === 'error') {
            alert(data.content);
        }
    };

    socket.onclose = () => {
        addSystemMessage('서버와의 연결이 종료되었습니다.');
    };

    socket.onerror = () => {
        addSystemMessage('WebSocket 오류가 발생했습니다.');
    };
}

// ----------------------------------------
// 메시지 전송
// ----------------------------------------
function sendMessage() {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        alert('먼저 방에 입장하세요.');
        return;
    }
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (!text) return;

    socket.send(JSON.stringify({ type: 'message', username, content: text }));
    input.value = '';
}

// ----------------------------------------
// 방 나가기
// ----------------------------------------
function leaveRoom() {
    if (socket) {
        socket.close();
    }
    currentRoom = null;
    document.getElementById('currentRoomTitle').textContent = '현재 방: -';
    document.getElementById('messages').innerHTML = '';
}

// ----------------------------------------
// 채팅 메시지 DOM 추가
// ----------------------------------------
function addMessage(sender, content) {
    const box = document.getElementById('messages');
    const div = document.createElement('div');
    div.className = sender === username ? 'msg-me' : 'msg-other';
    div.textContent = `${sender}: ${content}`;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

// ----------------------------------------
// 시스템 메시지 DOM 추가
// ----------------------------------------
function addSystemMessage(content) {
    const box = document.getElementById('messages');
    const div = document.createElement('div');
    div.className = 'msg-system';
    div.textContent = content;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

// ----------------------------------------
// Toss 결제 요청 (1,000원 -> 10 크레딧 충전)
// -> 프런트에서 SDK 호출, 승인/크레딧 적립은 server.js에서 처리
// ----------------------------------------
async function requestCharge() {
    if (!tossPayments) {
        alert('결제 모듈 초기화 실패');
        return;
    }

    const amount = 1000; // 데모용 고정 금액 (100원당 1 크레딧 → 10 크레딧)
    const orderId = `order-${Math.random().toString(36).slice(2, 10)}`;
    const orderName = '채팅 크레딧 충전 (10크레딧)';

    try {
        // ✅ v1 SDK: requestPayment(결제수단, 옵션)
        await tossPayments.requestPayment('CARD', {
            amount,
            orderId,
            orderName,
            // amount는 Toss가 쿼리에 자동 포함해주므로 우리가 직접 붙일 필요 없음
            successUrl: `${window.location.origin}/payment/success?username=${encodeURIComponent(username)}`,
            failUrl: `${window.location.origin}/payment/fail`,
        });
    } catch (error) {
        console.error('결제 오류:', error);
        alert('결제 요청 중 오류가 발생했습니다.');
    }
}
