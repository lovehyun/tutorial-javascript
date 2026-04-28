const express   = require('express');
const http      = require('http');
const path      = require('path');
const os        = require('os');
const fs        = require('fs');
const { Server: IOServer } = require('socket.io');

const log          = require('./server/logger');

// ─── 부팅 환경 체크 ─────────────────────────────────────
log.log('BOOT', `Node ${process.version}  ${process.platform}/${process.arch}  pid=${process.pid}`);
log.log('BOOT', `cwd=${process.cwd()}  NODE_ENV=${process.env.NODE_ENV || 'development'}`);

const config = require('./server/config');
log.log('CONF', `port=${config.PORT}  world=${config.WORLD.width}×${config.WORLD.height}  rooms=${config.MAX_ROOMS}×${config.MAX_PER_ROOM}`);
log.log('CONF', `tick=${config.TICK_RATE}Hz  broadcast=${config.BROADCAST_RATE}Hz  chat_history=${config.CHAT_HISTORY}`);
log.log('CONF', `db_path=${path.resolve(config.DB_PATH)}`);

// public 디렉토리 존재 확인
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    log.error('BOOT', `public directory not found: ${publicDir}`);
    process.exit(1);
}
const expectedPages = ['index.html', 'room.html', 'solo.html', 'stats.html'];
const missing = expectedPages.filter(f => !fs.existsSync(path.join(publicDir, f)));
if (missing.length) log.warn('BOOT', `missing pages in public/: ${missing.join(', ')}`);
else                log.log( 'BOOT', `public/ ok (${expectedPages.length} pages)`);

// DB 모듈 로드 (db.js 자체에서 로깅 수행)
const db = require('./server/db');

// 게임 핵심 로직 로드
const Lobby       = require('./server/lobby');
const setupRoutes = require('./server/routes');

// ─── Express ────────────────────────────────────────────
const app = express();
app.set('trust proxy', true);
app.use(express.json());

// 요청 로깅(가벼운, /api/* 만)
app.use((req, _res, next) => {
    if (req.path.startsWith('/api/')) {
        log.log('HTTP', `${req.method} ${req.path}  ip=${req.ip}`);
    }
    next();
});

setupRoutes(app, db);
app.use(express.static(publicDir, { index: 'index.html' }));

log.log('HTTP', `trust proxy = ${app.get('trust proxy') ? 'ON' : 'off'}`);
log.log('HTTP', `static root = ${publicDir}`);

// ─── Socket.IO ──────────────────────────────────────────
const server = http.createServer(app);
const io = new IOServer(server, {
    path: '/socket.io/',
    cors: { origin: true, credentials: true },
});

const lobby = new Lobby(io, db);
lobby.attach();

log.log('WS',  `socket.io path = /socket.io/  cors=enabled`);
log.log('ROOM', `${config.MAX_ROOMS} rooms initialized (capacity ${config.MAX_PER_ROOM} each = ${config.MAX_ROOMS * config.MAX_PER_ROOM} max simultaneous players)`);

// ─── 네트워크 인터페이스 ─────────────────────────────────
function logNetworkAddresses() {
    log.log('NET', `bind=0.0.0.0:${config.PORT}`);
    const ifs = os.networkInterfaces();
    let count = 0;
    for (const [name, addrs] of Object.entries(ifs || {})) {
        for (const a of (addrs || [])) {
            if (a.family === 'IPv4' && !a.internal) {
                log.log('NET', `  ${name.padEnd(8)} → http://${a.address}:${config.PORT}`);
                count++;
            }
        }
    }
    if (count === 0) log.log('NET', `  (no external IPv4 interfaces detected)`);
    log.log('NET', `  localhost → http://127.0.0.1:${config.PORT}`);
}

// ─── 에러 핸들링 ─────────────────────────────────────────
process.on('uncaughtException', (e) => {
    log.error('FATAL', 'uncaughtException:', e.stack || e);
});
process.on('unhandledRejection', (e) => {
    log.error('FATAL', 'unhandledRejection:', e);
});

// ─── 서버 시작 ──────────────────────────────────────────
server.listen(config.PORT, () => {
    log.log('READY', `=========================================`);
    log.log('READY', `Multi-Shoot is up and listening`);
    logNetworkAddresses();
    log.log('READY', `=========================================`);
});

// ─── Graceful shutdown ──────────────────────────────────
function shutdown(signal) {
    log.log('SHUT', `received ${signal}, closing…`);
    io.close(() => log.log('SHUT', 'socket.io closed'));
    server.close(() => {
        log.log('SHUT', 'http server closed, bye');
        process.exit(0);
    });
    // 강제 종료 대비
    setTimeout(() => {
        log.warn('SHUT', 'force exit after 5s');
        process.exit(1);
    }, 5000).unref();
}
process.on('SIGINT',  () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
