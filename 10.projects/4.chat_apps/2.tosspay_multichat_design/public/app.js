/**
 * 앱 페이지(채팅·크레딧) 클라이언트
 * - 로그인 세션 기반, JSON API는 모두 /api 로 시작 (GET /api/me 등)
 */
let userId = null;
let username = null;
let credits = 0;
let socket = null;
let currentRoom = null;
let payment = null;
let customerKey = null;
const DEFAULT_ROOM = '기본채팅방';

/** 크레딧 사용 내역 표시용 한글 라벨 */
const REASON_LABEL = {
    signup_bonus: '가입 보너스',
    payment: '결제 충전',
    payment_refund: '결제 취소',
    coupon: '쿠폰',
    room_create: '방 생성',
    room_join: '방 입장',
    chat: '채팅',
};

/** 채팅 / 크레딧 뷰 전환 (크레딧 뷰로 갈 때 결제·사용내역 새로고침) */
function showView(name) {
    const chatView = document.getElementById('chatView');
    const creditView = document.getElementById('creditView');
    const navChat = document.getElementById('navChat');
    const navCredit = document.getElementById('navCredit');
    if (name === 'chat') {
        chatView.classList.remove('hidden');
        creditView.classList.add('hidden');
        navChat.classList.add('bg-white', 'text-blue-600', 'border-b-0', 'shadow-sm');
        navChat.classList.remove('bg-slate-100', 'text-slate-600');
        navCredit.classList.remove('bg-white', 'text-blue-600', 'border-b-0', 'shadow-sm');
        navCredit.classList.add('bg-slate-100', 'text-slate-600');
    } else {
        creditView.classList.remove('hidden');
        chatView.classList.add('hidden');
        navCredit.classList.add('bg-white', 'text-blue-600', 'border-b-0', 'shadow-sm');
        navCredit.classList.remove('bg-slate-100', 'text-slate-600');
        navChat.classList.remove('bg-white', 'text-blue-600', 'border-b-0', 'shadow-sm');
        navChat.classList.add('bg-slate-100', 'text-slate-600');
        fetchPaymentHistory();
        fetchCreditLog();
    }
}

/** 페이지 로드: 이벤트 바인딩 → /api/me 로 로그인 확인 → Toss·데이터 로드 → 채팅 뷰 표시 */
document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('refreshPaymentsBtn').addEventListener('click', fetchPaymentHistory);
    document.getElementById('refreshCreditLogBtn').addEventListener('click', fetchCreditLog);
    document.getElementById('chargeBtn').addEventListener('click', requestCharge);
    document.getElementById('applyCouponBtn').addEventListener('click', applyCoupon);
    document.getElementById('createRoomBtn').addEventListener('click', createRoom);
    document.getElementById('sendMessageBtn').addEventListener('click', sendMessage);
    document.getElementById('messageInput').addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

    document.getElementById('navChat').addEventListener('click', () => showView('chat'));
    document.getElementById('navCredit').addEventListener('click', () => showView('credit'));
    document.getElementById('creditLink').addEventListener('click', (e) => { e.preventDefault(); showView('credit'); });

    const meRes = await fetch('/api/me', { credentials: 'include' });
    if (!meRes.ok) {
        window.location.href = '/login';
        return;
    }
    const me = await meRes.json();
    userId = me.userId;
    username = me.username;
    credits = me.credits;
    document.getElementById('usernameDisplay').textContent = username;
    document.getElementById('creditDisplay').textContent = credits;

    await initToss();
    await fetchPaymentHistory();
    await fetchCreditLog();
    await fetchRooms();
    showView('chat');
});

/** 상단 크레딧 숫자 갱신 */
async function refreshCredits() {
    const res = await fetch('/api/me', { credentials: 'include' });
    if (!res.ok) return;
    const data = await res.json();
    credits = data.credits;
    document.getElementById('creditDisplay').textContent = credits;
}

async function fetchPaymentHistory() {
    const container = document.getElementById('paymentHistoryList');
    if (!container) return;
    try {
        const res = await fetch('/api/me/payments', { credentials: 'include' });
        if (!res.ok) throw new Error();
        const data = await res.json();
        const payments = data.payments || [];
        container.innerHTML = '';
        if (payments.length === 0) {
            container.innerHTML = '<div class="px-3 py-4 text-sm text-slate-500 text-center">결제 내역이 없습니다.</div>';
            return;
        }
        payments.forEach((p) => {
            const row = document.createElement('div');
            row.className = 'flex items-center justify-between px-3 py-2 border-b border-slate-200 last:border-b-0 hover:bg-slate-100/80';
            const dateStr = p.approvedAt ? new Date(p.approvedAt).toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' }) : '-';
            const isCancelled = p.status === 'cancelled';
            row.innerHTML = `
        <div>
          <div class="font-medium text-slate-800">${p.orderId}</div>
          <div class="text-xs text-slate-500 mt-0.5">
            ${p.amount.toLocaleString()}원 · +${p.addedCredits} 크레딧 · ${dateStr}
            ${isCancelled ? ' <span class="text-amber-600">(취소됨)</span>' : ''}
          </div>
        </div>
        ${!isCancelled ? '<button type="button" class="payment-cancel-btn px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100" data-key="' + p.paymentKey + '">취소</button>' : ''}
      `;
            container.appendChild(row);
        });
        container.querySelectorAll('.payment-cancel-btn').forEach((btn) => {
            btn.onclick = () => cancelPayment(btn.dataset.key);
        });
    } catch (err) {
        container.innerHTML = '<div class="px-3 py-4 text-sm text-red-500 text-center">결제 내역을 불러오지 못했습니다.</div>';
    }
}

/** 크레딧 사용 내역 렌더 (날짜 yyyy-mm-dd hh:mm:ss 먼저) */
async function fetchCreditLog() {
    const container = document.getElementById('creditLogList');
    if (!container) return;
    try {
        const res = await fetch('/api/me/credit-log', { credentials: 'include' });
        if (!res.ok) throw new Error();
        const data = await res.json();
        const log = data.log || [];
        container.innerHTML = '';
        if (log.length === 0) {
            container.innerHTML = '<div class="px-3 py-4 text-sm text-slate-500 text-center">내역이 없습니다.</div>';
            return;
        }
        function formatDateTime(isoStr) {
            if (!isoStr) return '';
            const d = new Date(isoStr);
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const h = String(d.getHours()).padStart(2, '0');
            const min = String(d.getMinutes()).padStart(2, '0');
            const s = String(d.getSeconds()).padStart(2, '0');
            return `${y}-${m}-${day} ${h}:${min}:${s}`;
        }
        log.forEach((e) => {
            const div = document.createElement('div');
            div.className = 'px-3 py-2 border-b border-slate-200 last:border-b-0 text-sm';
            const label = REASON_LABEL[e.reason] || e.reason;
            const sign = e.amount >= 0 ? '+' : '';
            const dateStr = formatDateTime(e.created_at);
            const rest = `${label} ${sign}${e.amount}${e.ref_id ? ' · ' + e.ref_id : ''}`;
            div.textContent = dateStr ? `${dateStr} · ${rest}` : rest;
            container.appendChild(div);
        });
    } catch (err) {
        container.innerHTML = '<div class="px-3 py-4 text-sm text-red-500 text-center">내역을 불러오지 못했습니다.</div>';
    }
}

/** 결제 취소 API 호출 후 크레딧·목록 갱신 */
async function cancelPayment(paymentKey) {
    if (!confirm('이 결제를 취소하면 해당 금액만큼 크레딧이 차감됩니다. 계속할까요?')) return;
    try {
        const res = await fetch('/api/payments/' + encodeURIComponent(paymentKey) + '/cancel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
            credits = data.credits;
            document.getElementById('creditDisplay').textContent = credits;
            await fetchPaymentHistory();
            await fetchCreditLog();
            alert(data.message || '결제가 취소되었습니다.');
        } else {
            alert(data.error || '취소 처리에 실패했습니다.');
        }
    } catch (err) {
        alert('취소 요청 중 오류가 발생했습니다.');
    }
}

/** Toss 결제창 SDK 초기화 */
async function initToss() {
    const res = await fetch('/api/config');
    const data = await res.json();
    customerKey = 'user-' + userId + '-' + Math.random().toString(36).slice(2, 10);
    const tossPayments = TossPayments(data.clientKey);
    payment = tossPayments.payment({ customerKey });
}

/** 토스 결제창 띄우기 (성공 시 /payment/success로 리다이렉트) */
async function requestCharge() {
    if (!payment) return;
    const amount = Number(document.getElementById('chargeAmount').value);
    if (!amount || amount <= 0) {
        alert('유효한 금액을 입력해주세요.');
        return;
    }
    const orderId = 'order-' + Math.random().toString(36).slice(2, 10);
    try {
        await payment.requestPayment({
            method: 'CARD',
            amount: { currency: 'KRW', value: amount },
            orderId,
            orderName: amount + '원 크레딧 충전',
            successUrl: window.location.origin + '/payment/success',
            failUrl: window.location.origin + '/payment/fail',
        });
    } catch (err) {
        alert('결제 요청 중 오류: ' + (err.message || '알 수 없음'));
    }
}

/** 쿠폰 적용: /api/me/coupon 호출 후 크레딧·사용내역 갱신 */
async function applyCoupon() {
    const input = document.getElementById('couponCode');
    const code = (input?.value || '').trim();
    if (!code) {
        alert('쿠폰 번호를 입력해주세요.');
        return;
    }
    try {
        const res = await fetch('/api/me/coupon', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ code }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
            credits = data.credits;
            document.getElementById('creditDisplay').textContent = credits;
            input.value = '';
            await fetchCreditLog();
            alert(data.message || '쿠폰이 적용되었습니다.');
        } else {
            alert(data.error || '쿠폰 적용에 실패했습니다.');
        }
    } catch (err) {
        alert('쿠폰 적용 중 오류가 발생했습니다.');
    }
}

/** 방 목록 조회 후 입장 버튼으로 렌더 */
async function fetchRooms() {
    const container = document.getElementById('rooms');
    if (!container) return;
    try {
        const res = await fetch('/api/rooms/detail', { credentials: 'include' });
        if (!res.ok) throw new Error();
        const roomList = await res.json();
        container.innerHTML = '';
        if (roomList.length === 0) {
            container.innerHTML = '<div class="px-3 py-4 text-sm text-slate-500 text-center">생성된 방이 없습니다.</div>';
            return;
        }
        roomList.forEach((room) => {
            const row = document.createElement('div');
            row.className = 'flex items-center justify-between px-3 py-2 border-b last:border-b-0 hover:bg-slate-100';
            const userText = room.users && room.users.length ? `참여자 ${room.userCount}명 · ${room.users.join(', ')}` : `참여자 ${room.userCount}명`;
            row.innerHTML = `
        <div>
          <div class="text-sm font-medium text-slate-800">${room.roomName}</div>
          <div class="mt-0.5 text-xs text-slate-500">${userText}</div>
        </div>
        <button type="button" class="join-room-btn px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600" data-room="${room.roomName}">${room.roomName === DEFAULT_ROOM ? '입장 (무료)' : '입장 (5 크레딧)'}</button>
      `;
            container.appendChild(row);
        });
        container.querySelectorAll('.join-room-btn').forEach((btn) => {
            btn.onclick = () => joinRoom(btn.dataset.room);
        });
    } catch (err) {
        container.innerHTML = '<div class="px-3 py-4 text-sm text-red-500 text-center">방 목록을 불러오지 못했습니다.</div>';
    }
}

/** 방 생성 (10 크레딧) API 호출 후 목록·크레딧 갱신 */
async function createRoom() {
    const roomName = document.getElementById('newRoomName').value.trim();
    if (!roomName) {
        alert('방 이름을 입력해주세요.');
        return;
    }
    const res = await fetch('/api/create-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ roomName }),
    });
    if (res.ok) {
        const data = await res.json();
        credits = data.credits;
        document.getElementById('creditDisplay').textContent = credits;
        document.getElementById('newRoomName').value = '';
        alert(data.message);
        await fetchCreditLog();
        await fetchRooms();
    } else {
        const err = await res.json();
        alert(err.error || '방 생성 실패');
    }
}

/** WebSocket으로 방 입장, 연결 후 session 메시지 전송 */
function joinRoom(roomName) {
    if (socket) socket.close();
    currentRoom = roomName;
    document.getElementById('currentRoom').textContent = currentRoom;
    document.getElementById('messages').innerHTML = '';
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    socket = new WebSocket(protocol + '://' + window.location.host + '/chat/' + encodeURIComponent(roomName));
    socket.onopen = () => { socket.send(JSON.stringify({ type: 'session' })); };
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const box = document.getElementById('messages');
        if (data.type === 'chat') {
            const div = document.createElement('div');
            div.className = data.sender === username ? 'message-me' : 'message-other';
            const bubble = document.createElement('span');
            bubble.className = 'bubble';
            bubble.textContent = data.sender + ': ' + data.content;
            div.appendChild(bubble);
            box.appendChild(div);
        } else if (data.type === 'broadcast') {
            const div = document.createElement('div');
            div.className = 'message-system';
            div.textContent = data.content;
            box.appendChild(div);
        } else if (data.type === 'userCount') fetchRooms();
        else if (data.type === 'credit') {
            credits = data.credits;
            document.getElementById('creditDisplay').textContent = credits;
        } else if (data.type === 'error') alert(data.content);
        box.scrollTop = box.scrollHeight;
    };
    socket.onclose = () => {};
}

/** 채팅 전송 (1크레딧, 서버에서 차감) */
function sendMessage() {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        alert('먼저 방에 입장하세요.');
        return;
    }
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (!text) return;
    socket.send(JSON.stringify({ type: 'message', content: text }));
    input.value = '';
}
