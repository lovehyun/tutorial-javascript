// public/app.js

let username = null;
let credits = 0;
let socket = null;
let currentRoom = null;
let payment = null; // Toss payment 인스턴스
let customerKey = null; // Toss용 고객 키 (username과는 별개로 안전 문자열)

const DEFAULT_ROOM = '기본채팅방';

document.addEventListener('DOMContentLoaded', async () => {
    // URL 쿼리에서 username이 있으면 사용
    const params = new URLSearchParams(window.location.search);
    username = params.get('username') || prompt('사용자 이름을 입력하세요:');

    if (!username) {
        alert('사용자 이름은 필수입니다.');
        return;
    }

    document.getElementById('usernameDisplay').textContent = username;

    // 버튼 이벤트 바인딩
    document.getElementById('changeUserBtn').addEventListener('click', handleChangeUser);
    document.getElementById('chargeBtn').addEventListener('click', requestCharge);
    document.getElementById('createRoomBtn').addEventListener('click', createRoom);
    document.getElementById('sendMessageBtn').addEventListener('click', sendMessage);

    document.getElementById('messageInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    await initToss();
    await refreshCredits();
    await fetchRooms();
});

// ====== 사용자 변경 ======
async function handleChangeUser() {
    const newName = prompt('새 사용자 이름을 입력하세요:');
    if (!newName) return;
    username = newName;
    document.getElementById('usernameDisplay').textContent = username;

    // 기존 소켓 정리
    if (socket) {
        socket.close();
        socket = null;
        currentRoom = null;
        document.getElementById('currentRoom').textContent = '-';
        document.getElementById('messages').innerHTML = '';
    }

    await initToss();
    await refreshCredits();
    await fetchRooms();
}

// ====== Toss 초기화 ======
async function initToss() {
    const res = await fetch('/config');
    const data = await res.json();
    const clientKey = data.clientKey;

    // username을 Toss 규칙에 맞게 변환
    customerKey = sanitizeUsernameForToss(username);
    // 2자 미만이면 랜덤 키로 대체
    if (!customerKey || customerKey.length < 2) {
        customerKey = 'user-' + Math.random().toString(36).slice(2, 12);
    }

    const tossPayments = TossPayments(clientKey);
    payment = tossPayments.payment({ customerKey });

    console.log('TossPayments initialized. username =', username, 'customerKey =', customerKey);
}

// Toss 고객키 규칙에 맞게 정제
// 허용: A-Z, a-z, 0-9, -, _, =, ., @
function sanitizeUsernameForToss(str) {
    if (!str) return '';
    return str.replace(/[^A-Za-z0-9\-\_\=\.\@]/g, '');
}

// ====== 크레딧 조회 ======
async function refreshCredits() {
    const res = await fetch('/me/' + encodeURIComponent(username));
    const data = await res.json();
    credits = data.credits;
    document.getElementById('creditDisplay').textContent = credits;
}

// ====== 크레딧 충전 (토스 결제창 띄우기) ======
async function requestCharge() {
    if (!payment) {
        alert('결제 시스템 초기화 중입니다.');
        return;
    }

    const amountInput = document.getElementById('chargeAmount');
    const amount = Number(amountInput.value);

    if (!amount || amount <= 0) {
        alert('유효한 금액을 입력해주세요.');
        return;
    }

    const orderId = 'order-' + Math.random().toString(36).slice(2, 10);
    const orderName = `${amount}원 크레딧 충전`;

    try {
        await payment.requestPayment({
            method: 'CARD',
            amount: {
                currency: 'KRW',
                value: amount,
            },
            orderId,
            orderName,
            successUrl: window.location.origin + '/payment/success?username=' + encodeURIComponent(username),
            failUrl: window.location.origin + '/payment/fail?username=' + encodeURIComponent(username),
        });
    } catch (error) {
        console.error('결제 오류:', error);
        alert('결제 요청 중 오류: ' + (error.message || '알 수 없는 오류'));
    }
}

// ====== 방 목록 조회 ======
// ✅ 방 목록을 서버에서 가져와서 깔끔한 리스트 + 입장 버튼으로 렌더링
async function fetchRooms() {
    try {
        const res = await fetch('/rooms/detail');
        if (!res.ok) {
            throw new Error('방 목록을 불러오지 못했습니다.');
        }

        const roomList = await res.json();
        const container = document.getElementById('rooms');
        container.innerHTML = '';

        // 방이 하나도 없을 때 안내 문구
        if (!roomList.length) {
            const empty = document.createElement('div');
            empty.className = 'px-3 py-4 text-sm text-slate-500 text-center';
            empty.textContent = '생성된 방이 없습니다. 위에서 새 방을 만들어보세요.';
            container.appendChild(empty);
            return;
        }

        // 각 방을 한 줄(row)로 렌더링
        roomList.forEach((room) => {
            const { roomName, userCount, users } = room;

            // 🔹 한 줄(row): 방 정보 + 입장 버튼을 좌우로 배치
            const row = document.createElement('div');
            row.className = 'flex items-center justify-between px-3 py-2 border-b last:border-b-0 hover:bg-slate-100';

            // 🔹 왼쪽 영역: 방 이름 + 참여자 정보
            const leftBox = document.createElement('div');

            // 방 이름 (조금 진하게)
            const title = document.createElement('div');
            title.className = 'text-sm font-medium text-slate-800';
            title.textContent = roomName;

            // 참여자 정보 (작은 회색 글씨)
            const sub = document.createElement('div');
            sub.className = 'mt-0.5 text-xs text-slate-500';
            const userText =
                users && users.length ? `참여자 ${userCount}명 · ${users.join(', ')}` : `참여자 ${userCount}명`;
            sub.textContent = userText;

            leftBox.appendChild(title);
            leftBox.appendChild(sub);

            // 🔹 오른쪽 영역: 입장 버튼 (완전 버튼처럼 보이게)
            const joinBtn = document.createElement('button');
            joinBtn.className =
                'px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs md:text-sm ' +
                'font-medium shadow-sm hover:bg-emerald-600 active:bg-emerald-700 transition';
            // 기본방이면 무료, 아니면 5 크레딧
            joinBtn.textContent = room.roomName === DEFAULT_ROOM ? '입장 (무료)' : '입장 (5 크레딧)';

            joinBtn.onclick = () => joinRoom(roomName);

            // row 구성: [왼쪽 정보] [오른쪽 버튼]
            row.appendChild(leftBox);
            row.appendChild(joinBtn);

            container.appendChild(row);
        });
    } catch (err) {
        console.error(err);
        const container = document.getElementById('rooms');
        container.innerHTML = `<div class="px-3 py-4 text-sm text-red-500 text-center">
      방 목록을 불러오는 중 오류가 발생했습니다.
    </div>`;
    }
}

// ====== 방 생성 (10 크레딧) ======
async function createRoom() {
    const roomName = document.getElementById('newRoomName').value.trim();
    if (!roomName) {
        alert('방 이름을 입력해주세요.');
        return;
    }

    const res = await fetch('/create-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName, username }),
    });

    if (res.ok) {
        const data = await res.json();
        credits = data.credits;
        document.getElementById('creditDisplay').textContent = credits;
        alert(data.message);
        document.getElementById('newRoomName').value = '';
        fetchRooms();
    } else {
        const err = await res.json();
        alert(err.error || '방 생성 실패');
    }
}

// ====== 방 입장 (WebSocket 연결) ======
function joinRoom(roomName) {
    if (socket) {
        socket.close();
    }

    currentRoom = roomName;
    document.getElementById('currentRoom').textContent = currentRoom;
    document.getElementById('messages').innerHTML = '';

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    socket = new WebSocket(`${protocol}://${window.location.host}/chat/${roomName}`);

    socket.onopen = () => {
        socket.send(JSON.stringify({ type: 'session', username }));
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const box = document.getElementById('messages');

        if (data.type === 'chat') {
            const div = document.createElement('div');
            div.className = data.sender === username ? 'message-me' : 'message-other';
            div.textContent = `${data.sender}: ${data.content}`;
            box.appendChild(div);
        } else if (data.type === 'broadcast') {
            const div = document.createElement('div');
            div.className = 'message-system';
            div.textContent = data.content;
            box.appendChild(div);
        } else if (data.type === 'userCount') {
            // 방 목록 갱신
            fetchRooms();
        } else if (data.type === 'credit') {
            credits = data.credits;
            document.getElementById('creditDisplay').textContent = credits;
        } else if (data.type === 'error') {
            alert(data.content);
        }

        box.scrollTop = box.scrollHeight;
    };

    socket.onerror = (err) => {
        console.error('WebSocket error:', err);
        alert('웹소켓 오류가 발생했습니다.');
    };

    socket.onclose = () => {
        console.log('WebSocket closed');
    };
}

// ====== 메시지 전송 (1 크레딧) ======
function sendMessage() {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        alert('먼저 방에 입장하세요.');
        return;
    }

    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (!text) return;

    socket.send(
        JSON.stringify({
            type: 'message',
            username,
            content: text,
        }),
    );
    input.value = '';
}
