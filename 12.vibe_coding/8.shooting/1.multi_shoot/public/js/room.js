(function () {
    const { connect } = window.MultiShoot;
    const Nick = window.MultiShoot.nickname;

    const params = new URLSearchParams(location.search);
    const roomId = parseInt(params.get('room'), 10);
    if (!roomId) { location.href = 'index.html'; return; }

    const nick = Nick.ensure();

    // ─── Canvas setup ─────────────────────────────
    const canvas = document.getElementById('game-canvas');
    const ctx    = canvas.getContext('2d');

    // 월드 크기는 서버가 정해줌 (room:joined 에서 받음)
    let world = { width: 1600, height: 900 };
    canvas.width  = world.width;
    canvas.height = world.height;

    function resizeCanvasCSS() {
        // CSS로 가로 100vw, 세로 100vh, object-fit: contain 처럼 비율 유지
        const w = window.innerWidth;
        const h = window.innerHeight;
        const scale = Math.min(w / world.width, h / world.height);
        canvas.style.width  = `${world.width * scale}px`;
        canvas.style.height = `${world.height * scale}px`;
        canvas.style.position = 'absolute';
        canvas.style.left = `${(w - world.width * scale) / 2}px`;
        canvas.style.top  = `${(h - world.height * scale) / 2}px`;
    }
    resizeCanvasCSS();
    window.addEventListener('resize', resizeCanvasCSS);

    function clientToWorld(cx, cy) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (cx - rect.left) / rect.width  * canvas.width,
            y: (cy - rect.top)  / rect.height * canvas.height,
        };
    }

    // ─── Local state ─────────────────────────────
    let selfId = null;
    let myColor = '#ffffff';
    let snapshot = { targets: [], bullets: [], players: [], wind: 0, stage: 1, topScore: 0 };
    let lastSnapshotTime = 0;
    let floatingTexts = [];
    let clouds = [];
    let mouse = { x: world.width / 2, y: world.height / 2 };
    let isMouseDown = false, isZoomed = false, zoomTimer = null, zoomCenter = null;
    let muzzleFlashByPlayer = new Map();

    initClouds();

    // ─── Socket ──────────────────────────────────
    const socket = connect();

    socket.on('connect', () => {
        socket.emit('lobby:hello', { nickname: nick });
        socket.emit('room:join',   { roomId });
    });

    socket.on('disconnect', () => showOverlay('연결이 끊어졌습니다. 재접속 시도 중…'));
    socket.on('connect_error', (e) => showOverlay('연결 오류: ' + e.message));

    socket.on('error:msg', (m) => {
        alert(m);
        location.href = 'index.html';
    });

    socket.on('room:joined', (info) => {
        selfId = info.selfId;
        myColor = info.color;
        world = info.world;
        canvas.width  = world.width;
        canvas.height = world.height;
        resizeCanvasCSS();
        hideOverlay();
    });

    socket.on('room:state', (s) => {
        snapshot = s;
        lastSnapshotTime = performance.now();
    });

    socket.on('room:players', (list) => {
        snapshot.players = list;
    });

    socket.on('room:hit', (h) => {
        floatingTexts.push({
            x: h.x, y: h.y,
            text: h.text,
            color: h.color,
            life: 50,
            vy: -1.2,
            isMine: h.ownerId === selfId,
        });
        muzzleFlashByPlayer.set(h.ownerId, 6);
    });

    // ─── Input ───────────────────────────────────
    const ZOOM_HOLD_MS = 1000;
    const SCOPE_RADIUS = 130;
    const ZOOM_SCALE   = 2;

    canvas.addEventListener('mousemove', (e) => {
        const p = clientToWorld(e.clientX, e.clientY);
        mouse.x = p.x; mouse.y = p.y;
    });

    canvas.addEventListener('mousedown', (e) => {
        const p = clientToWorld(e.clientX, e.clientY);
        isMouseDown = true;
        zoomCenter  = { x: p.x, y: p.y };
        zoomTimer = setTimeout(() => {
            if (isMouseDown) isZoomed = true;
        }, ZOOM_HOLD_MS);
    });

    canvas.addEventListener('mouseup', (e) => {
        clearTimeout(zoomTimer);
        isMouseDown = false;
        const p = clientToWorld(e.clientX, e.clientY);
        if (isZoomed) isZoomed = false;
        socket.emit('room:fire', { x: p.x, y: p.y });
        muzzleFlashByPlayer.set(selfId, 6);
    });

    canvas.addEventListener('mouseleave', () => {
        clearTimeout(zoomTimer);
        isMouseDown = false;
        isZoomed = false;
    });

    document.getElementById('leave-btn').addEventListener('click', () => {
        socket.emit('room:leave');
        location.href = 'index.html';
    });

    document.getElementById('change-nickname-btn').addEventListener('click', () => {
        const newNick = Nick.change();
        socket.emit('lobby:nick', { nickname: newNick });
    });

    // ─── Clouds ──────────────────────────────────
    function initClouds() {
        clouds = [];
        const N = 6;
        for (let i = 0; i < N; i++) {
            clouds.push({
                x:       Math.random() * world.width,
                y:       40 + Math.random() * (world.height * 0.45),
                scale:   0.6 + Math.random() * 0.7,
                opacity: 0.06 + Math.random() * 0.10,
            });
        }
    }
    function updateClouds() {
        clouds.forEach(c => {
            c.x += (snapshot.wind * 0.6 + 0.08) * c.scale;
            const margin = 100 * c.scale;
            if (c.x > world.width  + margin) c.x = -margin;
            if (c.x < -margin)               c.x = world.width  + margin;
        });
    }
    function drawClouds() {
        clouds.forEach(c => {
            ctx.globalAlpha = c.opacity;
            ctx.fillStyle = '#ffffff';
            const r = 30 * c.scale;
            ctx.beginPath();
            ctx.arc(c.x,             c.y,            r,        0, Math.PI * 2);
            ctx.arc(c.x + r * 0.85,  c.y - r * 0.3,  r * 0.78, 0, Math.PI * 2);
            ctx.arc(c.x + r * 1.6,   c.y,            r * 0.92, 0, Math.PI * 2);
            ctx.arc(c.x + r * 0.5,   c.y + r * 0.3,  r * 0.7,  0, Math.PI * 2);
            ctx.arc(c.x - r * 0.5,   c.y + r * 0.15, r * 0.6,  0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
    }

    // ─── Drawing ─────────────────────────────────
    const ROW_YS = [0.30, 0.48, 0.65];
    const TARGET_RADIUS = 55;

    function drawBackground() {
        const g = ctx.createLinearGradient(0, 0, 0, world.height);
        g.addColorStop(0, '#2a3848');
        g.addColorStop(1, '#0c1018');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, world.width, world.height);

        drawClouds();

        ROW_YS.forEach(yr => {
            const y = world.height * yr + TARGET_RADIUS + 35;
            ctx.fillStyle = '#1a2330';
            ctx.fillRect(0, y, world.width, 4);
        });
    }

    function drawTarget(t) {
        // 폴
        ctx.fillStyle = '#222';
        ctx.fillRect(t.x - 3, t.y, 6, TARGET_RADIUS + 35);

        const sx = Math.cos(t.flip * Math.PI);
        if (Math.abs(sx) >= 0.03) {
            ctx.save();
            ctx.translate(t.x, t.y);
            ctx.scale(Math.abs(sx), 1);
            if (sx > 0) drawTargetBack(t);
            else        drawTargetFront(t);
            ctx.restore();
        }

        // 명중 마커 (각 플레이어 색)
        const markSize = Math.max(4, t.radius * 0.13);
        t.hits.forEach(h => {
            const x = t.x + h.dx;
            const y = t.y + h.dy;
            ctx.strokeStyle = h.color;
            ctx.lineWidth = Math.max(1.5, t.radius * 0.045);
            ctx.beginPath();
            ctx.moveTo(x - markSize, y - markSize); ctx.lineTo(x + markSize, y + markSize);
            ctx.moveTo(x + markSize, y - markSize); ctx.lineTo(x - markSize, y + markSize);
            ctx.stroke();
        });
    }
    function drawTargetBack(t) {
        const r = t.radius;
        ctx.fillStyle = '#5a3a1f';
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#3a2410';
        ctx.lineWidth = 2;
        for (let i = -r + 8; i < r; i += Math.max(8, r * 0.2)) {
            ctx.beginPath();
            ctx.moveTo(-r * 0.95, i);
            ctx.lineTo( r * 0.95, i);
            ctx.stroke();
        }

        ctx.strokeStyle = '#2a1808';
        ctx.lineWidth = Math.max(3, r * 0.11);
        ctx.beginPath();
        ctx.moveTo(-r * 0.7, -r * 0.7); ctx.lineTo( r * 0.7,  r * 0.7);
        ctx.moveTo( r * 0.7, -r * 0.7); ctx.lineTo(-r * 0.7,  r * 0.7);
        ctx.stroke();

        ctx.strokeStyle = '#1a0a00';
        ctx.lineWidth = Math.max(2, r * 0.05);
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
    }
    function drawTargetFront(t) {
        const r = t.radius;
        if (t.isReal) {
            const colors = ['#ffffff', '#ffcccc', '#ff5555', '#cc0000', '#660000'];
            for (let i = 5; i > 0; i--) {
                ctx.beginPath();
                ctx.arc(0, 0, r * (i / 5), 0, Math.PI * 2);
                ctx.fillStyle = colors[i - 1];
                ctx.fill();
            }
            ctx.strokeStyle = '#222';
            ctx.lineWidth = Math.max(1, r * 0.04);
            ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
        } else {
            ctx.fillStyle = '#3a8a3a';
            ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();

            const eyeR = Math.max(2, r * 0.09);
            ctx.fillStyle = '#ffeb3b';
            ctx.beginPath(); ctx.arc(-r * 0.32, -r * 0.18, eyeR, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc( r * 0.32, -r * 0.18, eyeR, 0, Math.PI * 2); ctx.fill();

            ctx.strokeStyle = '#ffeb3b';
            ctx.lineWidth = Math.max(2, r * 0.08);
            ctx.beginPath(); ctx.arc(0, r * 0.05, r * 0.4, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();

            ctx.strokeStyle = '#1a4a1a';
            ctx.lineWidth = Math.max(1, r * 0.04);
            ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
        }
    }

    function drawBullets(bullets) {
        bullets.forEach(b => {
            const isMine = b.ownerId === selfId;
            ctx.globalAlpha = isMine ? 1 : 0.45;

            // 잔상
            ctx.strokeStyle = b.color;
            ctx.lineWidth = isMine ? 4 : 3;
            ctx.beginPath();
            ctx.moveTo(b.x - b.vx * 2.5, b.y - b.vy * 2.5);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();

            // 탄두
            ctx.fillStyle   = b.color;
            ctx.shadowColor = b.color;
            ctx.shadowBlur  = isMine ? 12 : 6;
            ctx.beginPath();
            ctx.arc(b.x, b.y, isMine ? 5 : 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        });
        ctx.globalAlpha = 1;
    }

    function drawCannon(p) {
        const isMine = p.id === selfId;
        ctx.globalAlpha = isMine ? 1 : 0.55;

        const baseY = p.cannonY + 30;
        // 모래주머니
        ctx.fillStyle = isMine ? '#5a4a3a' : '#3a2a1a';
        ctx.fillRect(p.cannonX - 50, baseY - 30, 100, 30);
        ctx.strokeStyle = '#1a1208';
        ctx.lineWidth = 2;
        ctx.strokeRect(p.cannonX - 50, baseY - 30, 100, 30);

        ctx.save();
        ctx.translate(p.cannonX, p.cannonY);
        ctx.rotate(p.cannonAngle + Math.PI / 2);

        // 본체 (플레이어 색)
        ctx.fillStyle = p.color;
        ctx.fillRect(-6, -45, 12, 45);
        // 머즐
        ctx.fillStyle = isMine ? '#fff' : '#888';
        ctx.fillRect(-9, -51, 18, 8);
        // 피벗
        ctx.fillStyle = '#333';
        ctx.beginPath(); ctx.arc(0, 0, 11, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = p.color; ctx.lineWidth = 2; ctx.stroke();

        // 머즐 플래시
        const flash = muzzleFlashByPlayer.get(p.id) || 0;
        if (flash > 0) {
            const a = flash / 6;
            ctx.fillStyle = `rgba(255, 220, 100, ${a})`;
            ctx.beginPath();
            ctx.arc(0, -49, 13 * a + 4, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
        ctx.globalAlpha = 1;

        // 닉네임 + 점수 (캐논 아래쪽)
        ctx.textAlign = 'center';
        ctx.font = isMine ? "bold 16px 'Courier New', monospace" : "13px 'Courier New', monospace";
        ctx.fillStyle = isMine ? p.color : 'rgba(255,255,255,0.55)';
        ctx.fillText(p.nickname, p.cannonX, baseY + 18);

        ctx.font = isMine ? "bold 18px 'Courier New', monospace" : "12px 'Courier New', monospace";
        ctx.fillStyle = isMine ? '#ffd700' : 'rgba(255, 215, 0, 0.55)';
        ctx.fillText(`${p.score}`, p.cannonX, baseY + 36);
        ctx.textAlign = 'left';
    }

    function drawCrosshair() {
        ctx.strokeStyle = isZoomed ? '#ff3333' : myColor;
        ctx.lineWidth = 1.5;
        const out = isZoomed ? 28 : 18;
        const inn = 5;
        ctx.beginPath();
        ctx.moveTo(mouse.x - out, mouse.y); ctx.lineTo(mouse.x - inn, mouse.y);
        ctx.moveTo(mouse.x + inn, mouse.y); ctx.lineTo(mouse.x + out, mouse.y);
        ctx.moveTo(mouse.x, mouse.y - out); ctx.lineTo(mouse.x, mouse.y - inn);
        ctx.moveTo(mouse.x, mouse.y + inn); ctx.lineTo(mouse.x, mouse.y + out);
        ctx.stroke();
        ctx.fillStyle = ctx.strokeStyle;
        ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 1.5, 0, Math.PI * 2); ctx.fill();
    }

    function drawFloatingTexts() {
        ctx.font = "bold 18px 'Courier New', monospace";
        ctx.textAlign = 'center';
        floatingTexts.forEach(f => {
            ctx.globalAlpha = Math.min(1, f.life / 25) * (f.isMine ? 1 : 0.65);
            ctx.fillStyle = f.color;
            ctx.fillText(f.text, f.x, f.y);
        });
        ctx.globalAlpha = 1;
        ctx.textAlign = 'left';
        floatingTexts.forEach(f => { f.y += f.vy; f.life--; });
        floatingTexts = floatingTexts.filter(f => f.life > 0);
    }

    function drawWindIndicator() {
        const cx = world.width / 2;
        const cy = 130;   // 상단 HUD/topbar 와 겹치지 않게 아래로
        const max = Math.max(0, snapshot.stage - 1);

        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.strokeStyle = 'rgba(255,255,255,0.25)';
        ctx.lineWidth = 1;
        ctx.fillRect(cx - 110, cy - 26, 220, 52);
        ctx.strokeRect(cx - 110, cy - 26, 220, 52);

        const w = snapshot.wind || 0;
        ctx.fillStyle = w === 0 ? '#888' : Math.abs(w) < max * 0.5 ? '#aaccff' : '#ff8855';
        ctx.font = "bold 12px 'Courier New', monospace";
        ctx.textAlign = 'center';
        ctx.fillText(`WIND  ${w >= 0 ? '+' : ''}${w.toFixed(1)} m/s`, cx, cy - 9);

        const ay = cy + 9;
        ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cx, ay - 8); ctx.lineTo(cx, ay + 8); ctx.stroke();

        const arrowLen = max > 0 ? (w / max) * 95 : 0;
        if (Math.abs(arrowLen) > 2) {
            const dir = arrowLen > 0 ? 1 : -1;
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(cx, ay);
            ctx.lineTo(cx + arrowLen, ay);
            ctx.lineTo(cx + arrowLen - 9 * dir, ay - 5);
            ctx.moveTo(cx + arrowLen, ay);
            ctx.lineTo(cx + arrowLen - 9 * dir, ay + 5);
            ctx.stroke();
        }
        ctx.textAlign = 'left';
    }

    function drawScopeOverlay() {
        if (!isZoomed || !zoomCenter) return;
        // 캔버스 좌표로 줌 효과 시뮬레이트 — 화면을 클립해서 그리는 것 까진 안 가고
        // 스코프 원 외부를 어둡게 칠하는 것만 처리 (실제 확대는 CSS scale 로 처리)
        const cx = zoomCenter.x;
        const cy = zoomCenter.y;
        const R  = SCOPE_RADIUS;

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, world.width, world.height);
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.clip('evenodd');
        ctx.fillStyle = 'rgba(0,0,0,0.88)';
        ctx.fillRect(0, 0, world.width, world.height);
        ctx.restore();

        ctx.strokeStyle = '#0a0a0a';
        ctx.lineWidth = 10;
        ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();

        ctx.strokeStyle = 'rgba(255,255,255,0.35)';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(cx, cy, R - 5, 0, Math.PI * 2); ctx.stroke();
    }

    function applyZoomCSS() {
        if (isZoomed && zoomCenter) {
            // transform-origin 은 element 내부 % 기준이 가장 안전함
            const ox = (zoomCenter.x / world.width)  * 100;
            const oy = (zoomCenter.y / world.height) * 100;
            canvas.style.transformOrigin = `${ox}% ${oy}%`;
            canvas.style.transform       = `scale(${ZOOM_SCALE})`;
        } else {
            canvas.style.transform = 'scale(1)';
        }
    }

    // ─── Top 3 leaderboard (HTML overlay) ─────────
    function renderLeaderboard() {
        const sorted = [...snapshot.players].sort((a, b) => b.score - a.score).slice(0, 3);
        const lb = document.getElementById('leaderboard');
        const rows = sorted.map((p, i) => `
            <div class="lb-row r${i}">
                <span class="rank">${['🥇', '🥈', '🥉'][i]}</span>
                <span class="nick" style="color:${p.color}">${escapeHTML(p.nickname)}</span>
                <span class="score">${p.score}</span>
            </div>
        `).join('');
        lb.innerHTML = `<div class="lb-title">TOP 3</div>${rows || '<div class="muted">— 플레이어 대기 중 —</div>'}`;
    }

    function renderHUDInfo() {
        const me = snapshot.players.find(p => p.id === selfId);
        document.getElementById('info-stage').textContent = snapshot.stage || 1;
        document.getElementById('info-topscore').textContent = snapshot.topScore || 0;
        document.getElementById('info-room').textContent = `ROOM ${roomId}`;
        if (me) {
            const acc = me.shotsFired ? Math.round(me.shotsHit * 100 / me.shotsFired) : 0;
            document.getElementById('info-stats').textContent = `HIT ${me.shotsHit}/${me.shotsFired} (${acc}%)`;
            updateScoreTable(acc);
        }
    }

    function updateScoreTable(acc) {
        const tier = acc >= 80 ? 0 : acc >= 60 ? 1 : acc >= 40 ? 2 : acc >= 30 ? 3 : acc >= 20 ? 4 : 5;
        document.querySelectorAll('#scoreTable .row').forEach((r, i) => {
            r.classList.toggle('active', i === tier);
        });
    }

    // ─── Loop ───────────────────────────────────
    const SERVER_TICK_RATE = 30;  // server/config.js 의 TICK_RATE 와 일치

    function loop() {
        // 마지막 스냅샷 이후 경과시간만큼 extrapolation (서버 brodcast 사이를 부드럽게)
        const dtSec      = (performance.now() - lastSnapshotTime) / 1000;
        const ticksAhead = Math.min(dtSec * SERVER_TICK_RATE, 5);  // 5틱 이상 보간 안 함 (네트워크 끊김 방어)

        const renderTargets = snapshot.targets.map(t =>
            t.vx ? { ...t, x: t.x + t.vx * ticksAhead } : t);
        const renderBullets = snapshot.bullets.map(b =>
            ({ ...b, x: b.x + b.vx * ticksAhead, y: b.y + b.vy * ticksAhead }));

        ctx.clearRect(0, 0, world.width, world.height);
        drawBackground();

        renderTargets.forEach(drawTarget);
        drawBullets(renderBullets);
        snapshot.players.forEach(drawCannon);

        // 머즐 플래시 감쇠
        for (const [id, v] of muzzleFlashByPlayer) {
            if (v > 0) muzzleFlashByPlayer.set(id, v - 1);
        }

        drawFloatingTexts();
        drawWindIndicator();
        drawScopeOverlay();
        drawCrosshair();

        applyZoomCSS();
        updateClouds();
        renderLeaderboard();
        renderHUDInfo();

        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    // ─── Helpers ────────────────────────────────
    function showOverlay(text) {
        const el = document.getElementById('overlay');
        el.querySelector('.msg').textContent = text;
        el.classList.add('show');
    }
    function hideOverlay() {
        document.getElementById('overlay').classList.remove('show');
    }
    function escapeHTML(s) {
        return String(s).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[c]);
    }
})();
