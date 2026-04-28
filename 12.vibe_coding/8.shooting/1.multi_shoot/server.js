const express   = require('express');
const http      = require('http');
const path      = require('path');
const { Server: IOServer } = require('socket.io');

const config       = require('./server/config');
const db           = require('./server/db');
const Lobby        = require('./server/lobby');
const setupRoutes  = require('./server/routes');

const app = express();

// 역프록시(X-Forwarded-For/Proto) 신뢰
app.set('trust proxy', true);
app.use(express.json());

setupRoutes(app, db);

// 정적 자원 (HTML/CSS/JS) — 역프록시의 prefix 가 떼고 전달되든 아니든 동일하게 동작
app.use(express.static(path.join(__dirname, 'public'), {
    index: 'index.html',
}));

// SPA-ish fallback (없는 경로 → index.html)는 사용 안함:
// 명시된 페이지(index.html, room.html, stats.html)만 사용

const server = http.createServer(app);

// Socket.IO — path 는 server 기준 절대경로 ('/socket.io/').
// 역프록시 뒤에서 prefix 가 붙는다면, nginx 가 prefix 를 떼고 backend 의 /socket.io/ 로 전달해야 함.
// 클라이언트 측에서는 location.pathname 을 기반으로 동적 path 를 계산함.
const io = new IOServer(server, {
    path: '/socket.io/',
    cors: { origin: true, credentials: true },
});

const lobby = new Lobby(io, db);
lobby.attach();

server.listen(config.PORT, () => {
    console.log(`[multi-shoot] listening on :${config.PORT}`);
    console.log(`  rooms: ${config.MAX_ROOMS} × ${config.MAX_PER_ROOM} players  · world ${config.WORLD.width}×${config.WORLD.height}`);
    console.log(`  db:    ${path.resolve(config.DB_PATH)}`);
});

// graceful shutdown
function shutdown() {
    console.log('\n[multi-shoot] shutting down…');
    io.close();
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 5000).unref();
}
process.on('SIGINT',  shutdown);
process.on('SIGTERM', shutdown);
