(function () {
    const { connect, basePath } = window.MultiShoot;
    const Nick = window.MultiShoot.nickname;

    const nick = Nick.ensure();
    document.getElementById('nickname-label').textContent = nick;

    document.getElementById('change-nickname').addEventListener('click', () => {
        const newNick = Nick.change();
        document.getElementById('nickname-label').textContent = newNick;
        socket.emit('lobby:nick', { nickname: newNick });
    });

    // Solo 모드 버튼 — 단순 페이지 이동
    document.getElementById('solo-btn').addEventListener('click', () => {
        location.href = 'solo.html';
    });

    document.getElementById('stats-btn').addEventListener('click', () => {
        location.href = 'stats.html';
    });

    // ─── Socket ───────────────────────────────────────
    const socket = connect();

    socket.on('connect', () => {
        socket.emit('lobby:hello', { nickname: nick });
        appendSysMsg('서버 연결됨');
    });
    socket.on('disconnect', () => appendSysMsg('연결이 끊어졌습니다…'));
    socket.on('connect_error', (e) => appendSysMsg('연결 오류: ' + e.message));

    socket.on('lobby:state', (state) => {
        renderRooms(state.rooms);
        renderHallOfFame(state.hallOfFame, state.byStage);
        document.getElementById('chat-log').innerHTML = '';
        state.chat.forEach(appendChat);
        document.getElementById('lobby-count').textContent = `(${state.lobbyCount}명 대기)`;
    });

    socket.on('lobby:update', (u) => {
        renderRooms(u.rooms);
        document.getElementById('lobby-count').textContent = `(${u.lobbyCount}명 대기)`;
    });

    socket.on('lobby:chat', (msg) => appendChat(msg));

    socket.on('error:msg', (m) => alert(m));

    // ─── Render rooms ─────────────────────────────────
    function renderRooms(rooms) {
        const grid = document.getElementById('room-list');
        grid.innerHTML = '';
        rooms.forEach(r => {
            const isFull = r.count >= r.max;
            const card = document.createElement('div');
            card.className = 'room-card' + (isFull ? ' full' : '');

            const playerRows = (r.players || [])
                .sort((a, b) => b.score - a.score)
                .map(p => `<div class="row"><span>${escapeHTML(p.nickname)}</span><span>${p.score}</span></div>`)
                .join('') || '<div class="empty">— 대기 중인 플레이어 없음 —</div>';

            card.innerHTML = `
                <div class="head">
                    <div class="name">ROOM ${r.id}</div>
                    <div class="count">${r.count}/${r.max}</div>
                </div>
                <div class="info">
                    <span>STAGE <strong>${r.stage}</strong></span>
                    <span>TOP <strong style="color:#ffd700">${r.topScore}</strong></span>
                </div>
                <div class="players">${playerRows}</div>
                <div class="actions">
                    <button data-room="${r.id}" ${isFull ? 'disabled' : ''}>
                        ${isFull ? '가득참' : '입장'}
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });

        grid.querySelectorAll('button[data-room]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.room, 10);
                location.href = `room.html?room=${id}`;
            });
        });
    }

    // ─── Hall of Fame ─────────────────────────────────
    let hofMode = 'score'; // 'score' | 'stage'
    let cachedHOF = { byScore: [], byStage: [] };

    function renderHallOfFame(byScore, byStage) {
        cachedHOF = { byScore: byScore || [], byStage: byStage || [] };
        renderHOFList();
    }

    function renderHOFList() {
        const list = document.getElementById('hof-list');
        const items = hofMode === 'score' ? cachedHOF.byScore : cachedHOF.byStage;
        list.innerHTML = items.map(p => `
            <li>
                <span class="nick">${escapeHTML(p.nickname)}</span> ·
                <span class="score">${p.final_score}점</span>
                <span class="stage">(stage ${p.max_stage})</span>
                <div class="when">${formatTime(p.ended_at)}</div>
            </li>
        `).join('') || '<li class="muted">기록 없음</li>';
    }

    document.querySelectorAll('.hof-tabs button').forEach(b => {
        b.addEventListener('click', () => {
            document.querySelectorAll('.hof-tabs button').forEach(x => x.classList.remove('active'));
            b.classList.add('active');
            hofMode = b.dataset.mode;
            renderHOFList();
        });
    });

    // ─── Chat ─────────────────────────────────────────
    const chatLog = document.getElementById('chat-log');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;
        socket.emit('lobby:chat', { text });
        chatInput.value = '';
    });

    function appendChat(msg) {
        const isSelf = msg.from === Nick.get();
        const div = document.createElement('div');
        div.className = 'msg';
        div.innerHTML = `
            <span class="from ${isSelf ? 'self' : ''}">${escapeHTML(msg.from)}</span>:
            ${escapeHTML(msg.text)}
            <span class="time">${formatTime(msg.time)}</span>
        `;
        chatLog.appendChild(div);
        chatLog.scrollTop = chatLog.scrollHeight;
    }
    function appendSysMsg(text) {
        const div = document.createElement('div');
        div.className = 'sys';
        div.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
        chatLog.appendChild(div);
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    // ─── Utils ────────────────────────────────────────
    function escapeHTML(s) {
        return String(s).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[c]);
    }
    function formatTime(ms) {
        if (!ms) return '';
        const d = new Date(ms);
        return d.toLocaleString();
    }
})();
