const config = require('./config');
const { clamp } = require('./utils');
const log    = require('./logger');

const ROW_CONFIGS = [
    { yRatio: 0.30, speed: 3.2, direction:  1, spawnInterval: 5000 },
    { yRatio: 0.48, speed: 4.5, direction: -1, spawnInterval: 4500 },
    { yRatio: 0.65, speed: 3.6, direction:  1, spawnInterval: 5500 },
];

const TARGET_RADIUS         = 55;
const BULLET_SPEED          = 18;
const FLIP_DURATION         = 450;
const WIND_ACCEL            = 0.03;
const STAGE_THRESHOLD       = 100;
const CANNON_LENGTH         = 45;
const FAKE_PROBABILITY_BASE = 0.35;
const FIRE_COOLDOWN_MS      = 120;  // 연사 방지 (서버단 검증)

const SLOT_COLORS = ['#ff5566', '#5599ff', '#55cc66', '#ffcc33', '#cc66ff'];

const SCORE_TABLE = [
    [10, 7, 5, 3, 1],  // ≥80%
    [ 8, 6, 5, 3, 1],  // ≥60%
    [ 6, 5, 3, 2, 1],  // ≥40%
    [ 4, 3, 1, 1, 1],  // ≥30%
    [ 3, 1, 1, 1, 1],  // ≥20%
    [ 1, 1, 1, 1, 1],  // <20%
];

function accuracyTier(shotsHit, shotsFired) {
    if (shotsFired === 0) return 0;
    const acc = (shotsHit / shotsFired) * 100;
    if (acc >= 80) return 0;
    if (acc >= 60) return 1;
    if (acc >= 40) return 2;
    if (acc >= 30) return 3;
    if (acc >= 20) return 4;
    return 5;
}

class Room {
    constructor(id, io, db) {
        this.id = id;
        this.io = io;
        this.db = db;

        this.players       = new Map();
        this.targets       = [];
        this.bullets       = [];
        this.nextTargetId  = 1;
        this.nextBulletId  = 1;
        this.lastSpawnAt   = ROW_CONFIGS.map(() => 0);

        this.wind         = 0;
        this.startTime    = Date.now();
        this.tickHandle   = null;
        this.lastBroadcast = 0;
        this.lastLoggedStage = 1;
    }

    isFull() {
        return this.players.size >= config.MAX_PER_ROOM;
    }

    summary() {
        return {
            id:       this.id,
            count:    this.players.size,
            max:      config.MAX_PER_ROOM,
            stage:    this.stage,
            topScore: this.topScore,
            players:  Array.from(this.players.values()).map(p => ({
                nickname: p.nickname,
                score:    p.score,
            })),
        };
    }

    get topScore() {
        let m = 0;
        for (const p of this.players.values()) if (p.score > m) m = p.score;
        return m;
    }

    get stage() {
        return 1 + Math.floor(this.topScore / STAGE_THRESHOLD);
    }

    getMaxWind()         { return Math.max(0, this.stage - 1); }
    getSpeedMultiplier() { return 1 + (this.stage - 1) * 0.15; }
    getFakeProbability() { return Math.min(0.7, FAKE_PROBABILITY_BASE + (this.stage - 1) * 0.04); }
    getTargetRadius() {
        if (this.stage >= 10) return TARGET_RADIUS / 4;
        if (this.stage >= 5)  return TARGET_RADIUS / 2;
        return TARGET_RADIUS;
    }

    // ─── Players ─────────────────────────────────────────────
    addPlayer(socket) {
        // 빈 슬롯 중 무작위 선택
        const used = new Set(Array.from(this.players.values()).map(p => p.slot));
        const free = [];
        for (let i = 0; i < config.MAX_PER_ROOM; i++) if (!used.has(i)) free.push(i);
        const slot = free[Math.floor(Math.random() * free.length)];

        const cannonX = config.WORLD.width  * (slot + 1) / (config.MAX_PER_ROOM + 1);
        // 캐논 아래에 닉네임/점수 텍스트 그릴 공간(약 70px) 확보
        const cannonY = config.WORLD.height - 100;

        const player = {
            id:           socket.id,
            nickname:     socket.data.nickname,
            ip:           socket.data.ip,
            slot,
            color:        SLOT_COLORS[slot],
            cannonX, cannonY,
            cannonAngle:  -Math.PI / 2,
            score:        0,
            shotsFired:   0,
            shotsHit:     0,
            maxStage:     1,
            startedAt:    Date.now(),
            lastFireAt:   0,
        };

        this.players.set(socket.id, player);
        socket.join(`room:${this.id}`);

        socket.emit('room:joined', {
            roomId: this.id,
            selfId: socket.id,
            world:  config.WORLD,
            slot,
            color:  player.color,
        });

        this.broadcastPlayers();

        if (!this.tickHandle) this.start();
    }

    removePlayer(socketId) {
        const p = this.players.get(socketId);
        if (!p) return;

        // 의미있는 플레이만 DB 저장
        if (p.shotsFired > 0 || p.score > 0) {
            const now = Date.now();
            const acc = p.shotsFired ? Math.round(p.shotsHit * 100 / p.shotsFired) : 0;
            try {
                this.db.insertPlay({
                    nickname:    p.nickname,
                    ip:          p.ip,
                    final_score: p.score,
                    max_stage:   p.maxStage,
                    shots_fired: p.shotsFired,
                    shots_hit:   p.shotsHit,
                    started_at:  p.startedAt,
                    ended_at:    now,
                    duration_ms: now - p.startedAt,
                });
                log.log('STAT', `saved  nick="${p.nickname}"  score=${p.score}  stage=${p.maxStage}  acc=${acc}%  duration=${Math.round((now-p.startedAt)/1000)}s`);
            } catch (e) {
                log.error('DB', 'insertPlay failed:', e.message);
            }
        }

        this.players.delete(socketId);

        const sock = this.io.sockets.sockets.get(socketId);
        if (sock) sock.leave(`room:${this.id}`);

        // 떠난 플레이어의 잔여 탄알 제거
        this.bullets = this.bullets.filter(b => b.ownerId !== socketId);

        this.broadcastPlayers();

        if (this.players.size === 0) this.stop();
    }

    updatePlayerNickname(socketId, nickname) {
        const p = this.players.get(socketId);
        if (!p) return;
        p.nickname = nickname;
        this.broadcastPlayers();
    }

    broadcastPlayers() {
        const list = Array.from(this.players.values()).map(p => ({
            id:          p.id,
            nickname:    p.nickname,
            slot:        p.slot,
            color:       p.color,
            cannonX:     p.cannonX,
            cannonY:     p.cannonY,
            cannonAngle: p.cannonAngle,
            score:       p.score,
            shotsFired:  p.shotsFired,
            shotsHit:    p.shotsHit,
        }));
        this.io.to(`room:${this.id}`).emit('room:players', list);
    }

    // ─── Input ───────────────────────────────────────────────
    handleFire(socketId, data) {
        const p = this.players.get(socketId);
        if (!p) return;

        const now = Date.now();
        if (now - p.lastFireAt < FIRE_COOLDOWN_MS) return;
        p.lastFireAt = now;

        const W = config.WORLD.width;
        const H = config.WORLD.height;
        const tx = clamp(data.x, 0, W);
        const ty = clamp(data.y, 0, H);

        const dx = tx - p.cannonX;
        const dy = ty - p.cannonY;
        const dist = Math.sqrt(dx*dx + dy*dy) || 1;

        // 위쪽으로만 발사 가능 (캐논 각 클램프)
        const dyClamped = Math.min(-1, dy);
        p.cannonAngle = Math.atan2(dyClamped, dx);

        const sx = p.cannonX + (dx / dist) * CANNON_LENGTH;
        const sy = p.cannonY + (dy / dist) * CANNON_LENGTH;

        this.bullets.push({
            id:         this.nextBulletId++,
            ownerId:    socketId,
            ownerColor: p.color,
            x:          sx,
            y:          sy,
            vx:         (dx / dist) * BULLET_SPEED,
            vy:         (dy / dist) * BULLET_SPEED,
            aimX:       tx,
            aimY:       ty,
            maxLife:    Math.ceil((dist - CANNON_LENGTH) / BULLET_SPEED) + 4,
            life:       0,
        });
        p.shotsFired++;
    }

    // ─── Loop ───────────────────────────────────────────────
    start() {
        this.startTime   = Date.now();
        this.lastSpawnAt = ROW_CONFIGS.map((cfg, i) => Date.now() - cfg.spawnInterval + i * 1200);
        const tickMs = 1000 / config.TICK_RATE;
        this.tickHandle = setInterval(() => this.tick(), tickMs);
        log.log('ROOM', `room ${this.id} game loop started`);
    }

    stop() {
        if (this.tickHandle) clearInterval(this.tickHandle);
        this.tickHandle = null;
        this.targets = [];
        this.bullets = [];
        log.log('ROOM', `room ${this.id} game loop stopped (empty)`);
    }

    tick() {
        const now = Date.now();
        this.updateWind(now);
        this.maybeSpawn(now);
        this.updateTargets(now);
        this.updateBullets();

        // 각 플레이어의 max_stage 갱신
        for (const p of this.players.values()) {
            const st = 1 + Math.floor(p.score / STAGE_THRESHOLD);
            if (st > p.maxStage) p.maxStage = st;
        }

        // 룸 단위 스테이지 변화 로깅
        if (this.stage !== this.lastLoggedStage) {
            log.log('STAGE', `room=${this.id}  ${this.lastLoggedStage} → ${this.stage}  (top=${this.topScore})`);
            this.lastLoggedStage = this.stage;
        }

        if (now - this.lastBroadcast >= 1000 / config.BROADCAST_RATE) {
            this.broadcastState();
            this.lastBroadcast = now;
        }
    }

    updateWind(now) {
        const max = this.getMaxWind();
        if (max === 0) { this.wind = 0; return; }
        const speedFactor = 0.4 + (this.stage - 1) * 0.08;
        const t = (now - this.startTime) / 1000 * speedFactor;
        const w = Math.sin(t)             * 0.5
                + Math.sin(t * 2.3 + 1.3) * 0.3
                + Math.sin(t * 3.7 + 2.5) * 0.2;
        this.wind = w * max;
    }

    maybeSpawn(now) {
        ROW_CONFIGS.forEach((cfg, i) => {
            const interval = cfg.spawnInterval / this.getSpeedMultiplier();
            if (now - this.lastSpawnAt[i] < interval) return;
            if (this.targets.filter(t => t.row === i).length >= 2) return;
            this.spawnTarget(i);
            this.lastSpawnAt[i] = now;
        });
    }

    spawnTarget(rowIndex) {
        const cfg = ROW_CONFIGS[rowIndex];
        const W = config.WORLD.width;
        const H = config.WORLD.height;
        const startX  = cfg.direction > 0 ? -120 : W + 120;
        const revealX = W * (0.25 + Math.random() * 0.5);

        this.targets.push({
            id:              this.nextTargetId++,
            row:             rowIndex,
            x:               startX,
            y:               H * cfg.yRatio,
            speed:           cfg.speed * this.getSpeedMultiplier(),
            direction:       cfg.direction,
            revealX,
            revealDuration:  2500 + Math.random() * 1800,
            radius:          this.getTargetRadius(),
            isReal:          Math.random() > this.getFakeProbability(),
            phase:           'incoming',
            flip:            0,
            phaseStartTime:  0,
            hits:            [],
        });
    }

    updateTargets(now) {
        const W = config.WORLD.width;
        for (const t of this.targets) {
            switch (t.phase) {
                case 'incoming':
                    t.x += t.speed * t.direction;
                    if ((t.direction > 0 && t.x >= t.revealX) ||
                        (t.direction < 0 && t.x <= t.revealX)) {
                        t.x = t.revealX;
                        t.phase = 'turning';
                        t.phaseStartTime = now;
                    }
                    break;
                case 'turning': {
                    const e = (now - t.phaseStartTime) / FLIP_DURATION;
                    t.flip = Math.min(1, e);
                    if (e >= 1) { t.phase = 'revealed'; t.phaseStartTime = now; t.flip = 1; }
                    break;
                }
                case 'revealed':
                    if (now - t.phaseStartTime >= t.revealDuration) {
                        t.phase = 'turning_back';
                        t.phaseStartTime = now;
                    }
                    break;
                case 'turning_back': {
                    const e = (now - t.phaseStartTime) / FLIP_DURATION;
                    t.flip = Math.max(0, 1 - e);
                    if (e >= 1) { t.phase = 'leaving'; t.flip = 0; }
                    break;
                }
                case 'leaving':
                    t.x += t.speed * t.direction;
                    break;
            }
        }
        this.targets = this.targets.filter(t => {
            if (t.direction > 0 && t.x > W + 150) return false;
            if (t.direction < 0 && t.x < -150)    return false;
            return true;
        });
    }

    updateBullets() {
        const W = config.WORLD.width;
        const H = config.WORLD.height;

        for (const b of this.bullets) {
            b.vx += this.wind * WIND_ACCEL;
            b.x  += b.vx;
            b.y  += b.vy;
            b.life++;
        }

        this.bullets = this.bullets.filter(b => {
            if (b.x < -50 || b.x > W + 50 || b.y < -50 || b.y > H + 50) return false;
            if (b.life >= b.maxLife) return false;

            const aDx = b.aimX - b.x;
            const aDy = b.aimY - b.y;
            if (aDx*aDx + aDy*aDy < BULLET_SPEED * BULLET_SPEED) return false;

            for (const t of this.targets) {
                if (Math.abs(t.y - b.aimY) > TARGET_RADIUS * 1.5) continue;

                const dx = b.x - t.x;
                const dy = b.y - t.y;
                const d  = Math.sqrt(dx*dx + dy*dy);
                if (d <= t.radius) {
                    const aDx2 = b.aimX - t.x;
                    const aDy2 = b.aimY - t.y;
                    const aD2  = Math.sqrt(aDx2*aDx2 + aDy2*aDy2);
                    if (aD2 <= t.radius) this.handleHit(b, t, aDx2, aDy2, aD2);
                    else                  this.handleHit(b, t,  dx,  dy, d);
                    return false;
                }
            }
            return true;
        });
    }

    handleHit(bullet, target, dx, dy, dist) {
        const p = this.players.get(bullet.ownerId);
        if (!p) return;

        const isFront = target.flip > 0.5;
        let pts = 0, color = '#888888', label = '방어됨';

        if (isFront) {
            if (target.isReal) {
                p.shotsHit++;
                const tier = accuracyTier(p.shotsHit, p.shotsFired);
                const tbl  = SCORE_TABLE[tier];
                const step = target.radius / 5;
                if      (dist <= step)     pts = tbl[0];
                else if (dist <= step * 2) pts = tbl[1];
                else if (dist <= step * 3) pts = tbl[2];
                else if (dist <= step * 4) pts = tbl[3];
                else if (dist <= step * 5) pts = tbl[4];

                color = pts >= 8 ? '#ffd700' : pts >= 4 ? '#aaffaa' : '#ffaa66';
                label = `+${pts}`;
            } else {
                pts   = -5;
                color = '#ff3344';
                label = '-5 가짜!';
            }
        }

        p.score = Math.max(0, p.score + pts);
        target.hits.push({ dx, dy, color: bullet.ownerColor });

        this.io.to(`room:${this.id}`).emit('room:hit', {
            x:        target.x + dx,
            y:        target.y + dy,
            text:     label,
            color,
            ownerId:  bullet.ownerId,
        });
    }

    broadcastState() {
        const players = Array.from(this.players.values()).map(p => ({
            id: p.id, nickname: p.nickname, slot: p.slot, color: p.color,
            cannonX: p.cannonX, cannonY: p.cannonY, cannonAngle: p.cannonAngle,
            score: p.score, shotsFired: p.shotsFired, shotsHit: p.shotsHit,
        }));

        const targets = this.targets.map(t => ({
            id: t.id, x: t.x, y: t.y, radius: t.radius, isReal: t.isReal,
            flip: t.flip, phase: t.phase, hits: t.hits,
            // 정지 중인 phase 에선 vx=0, 이동 중에만 클라이언트 보간용으로 속도 전달
            vx: (t.phase === 'incoming' || t.phase === 'leaving') ? t.speed * t.direction : 0,
        }));

        const bullets = this.bullets.map(b => ({
            id: b.id, x: b.x, y: b.y, vx: b.vx, vy: b.vy,
            ownerId: b.ownerId, color: b.ownerColor,
        }));

        this.io.to(`room:${this.id}`).emit('room:state', {
            t:       Date.now(),
            wind:    this.wind,
            stage:   this.stage,
            topScore: this.topScore,
            world:   config.WORLD,
            targets, bullets, players,
        });
    }
}

module.exports = Room;
