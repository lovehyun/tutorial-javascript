const Room   = require('./room');
const config = require('./config');
const { getSocketIP } = require('./utils');
const log    = require('./logger');

class Lobby {
    constructor(io, db) {
        this.io = io;
        this.db = db;

        this.rooms = new Map();
        const onPlaySaved = () => this.broadcastHallOfFame();
        for (let i = 1; i <= config.MAX_ROOMS; i++) {
            this.rooms.set(i, new Room(i, io, db, onPlaySaved));
        }

        this.lobbyClients = new Map();   // socket.id → { nickname, ip }
        this.chatHistory  = [];

        // 로비 카드(점수/스테이지/플레이어 목록)와 명예의 전당이 게임 중에도
        // 갱신되도록 주기적으로 푸시 — 이벤트 기반만으로는 정지되어 보임
        this.lobbyTickHandle = setInterval(() => this.broadcastLobby(), 1500);
    }

    attach() {
        this.io.on('connection', (socket) => this.onConnection(socket));
    }

    onConnection(socket) {
        const ip = getSocketIP(socket);
        socket.data.ip       = ip;
        socket.data.nickname = '익명';
        socket.data.roomId   = null;

        log.log('CONN', `connect  socket=${socket.id}  ip=${ip}`);

        socket.join('lobby');
        this.lobbyClients.set(socket.id, { nickname: '익명', ip });

        socket.on('lobby:hello', ({ nickname }) => {
            const old = socket.data.nickname;
            socket.data.nickname = sanitizeNick(nickname);
            const entry = this.lobbyClients.get(socket.id);
            if (entry) entry.nickname = socket.data.nickname;
            log.log('HELLO', `socket=${socket.id}  nick="${socket.data.nickname}"  (was "${old}")`);
            socket.emit('lobby:state', this.snapshot());
            this.broadcastLobby();
        });

        socket.on('lobby:nick', ({ nickname }) => {
            const old = socket.data.nickname;
            socket.data.nickname = sanitizeNick(nickname);
            const entry = this.lobbyClients.get(socket.id);
            if (entry) entry.nickname = socket.data.nickname;
            if (socket.data.roomId) {
                const r = this.rooms.get(socket.data.roomId);
                if (r) r.updatePlayerNickname(socket.id, socket.data.nickname);
            }
            log.log('NICK',  `"${old}" → "${socket.data.nickname}"  socket=${socket.id}`);
            this.broadcastLobby();
        });

        socket.on('lobby:chat', ({ text }) => {
            const t = (text || '').toString().trim().slice(0, 200);
            if (!t) return;
            const msg = { from: socket.data.nickname, text: t, time: Date.now() };
            this.chatHistory.push(msg);
            if (this.chatHistory.length > config.CHAT_HISTORY) this.chatHistory.shift();
            log.log('CHAT',  `${msg.from}: ${msg.text}`);
            this.io.to('lobby').emit('lobby:chat', msg);
        });

        socket.on('room:join', ({ roomId }) => {
            const id = parseInt(roomId, 10);
            const room = this.rooms.get(id);
            if (!room) {
                log.warn('JOIN', `invalid room ${id}  socket=${socket.id}`);
                return socket.emit('error:msg', '존재하지 않는 룸');
            }
            if (room.isFull()) {
                log.warn('JOIN', `room ${id} full  socket=${socket.id}`);
                return socket.emit('error:msg', '룸이 가득 찼습니다');
            }
            if (socket.data.roomId) this.exitRoom(socket);

            socket.leave('lobby');
            this.lobbyClients.delete(socket.id);

            room.addPlayer(socket);
            socket.data.roomId = room.id;

            log.log('JOIN',  `room=${room.id}  nick="${socket.data.nickname}"  ip=${ip}  count=${room.players.size}/${config.MAX_PER_ROOM}`);
            this.broadcastLobby();
        });

        socket.on('room:leave', () => {
            if (socket.data.roomId) {
                log.log('LEAVE', `room=${socket.data.roomId}  nick="${socket.data.nickname}"  (manual)`);
            }
            this.exitRoom(socket);
        });

        socket.on('room:fire', (data) => {
            if (!socket.data.roomId) return;
            const r = this.rooms.get(socket.data.roomId);
            if (r) r.handleFire(socket.id, data || {});
        });

        socket.on('disconnect', (reason) => {
            if (socket.data.roomId) {
                const r = this.rooms.get(socket.data.roomId);
                if (r) {
                    log.log('LEAVE', `room=${socket.data.roomId}  nick="${socket.data.nickname}"  (disconnect: ${reason})`);
                    r.removePlayer(socket.id);
                }
            }
            this.lobbyClients.delete(socket.id);
            log.log('CONN', `disconnect  socket=${socket.id}  ip=${ip}  reason=${reason}`);
            this.broadcastLobby();
        });
    }

    exitRoom(socket) {
        if (!socket.data.roomId) return;
        const r = this.rooms.get(socket.data.roomId);
        if (r) r.removePlayer(socket.id);
        socket.data.roomId = null;
        socket.join('lobby');
        this.lobbyClients.set(socket.id, { nickname: socket.data.nickname, ip: socket.data.ip });
        socket.emit('lobby:state', this.snapshot());
        this.broadcastLobby();
    }

    snapshot() {
        return {
            rooms:       this.roomsSummary(),
            chat:        this.chatHistory,
            lobbyCount:  this.lobbyClients.size,
            hallOfFame:  this.db.topByScore(10),
            byStage:     this.db.topByStage(10),
        };
    }

    roomsSummary() {
        return Array.from(this.rooms.values()).map(r => r.summary());
    }

    broadcastLobby() {
        if (this.lobbyClients.size === 0) return; // 로비에 아무도 없으면 스킵
        this.io.to('lobby').emit('lobby:update', {
            rooms:      this.roomsSummary(),
            lobbyCount: this.lobbyClients.size,
        });
    }

    // 게임이 끝나서 DB에 기록될 때 호출 — HOF만 갱신
    broadcastHallOfFame() {
        if (this.lobbyClients.size === 0) return;
        this.io.to('lobby').emit('lobby:hof', {
            hallOfFame: this.db.topByScore(10),
            byStage:    this.db.topByStage(10),
        });
    }
}

function sanitizeNick(s) {
    s = (s || '').toString().trim().slice(0, 20);
    return s || '익명';
}

module.exports = Lobby;
