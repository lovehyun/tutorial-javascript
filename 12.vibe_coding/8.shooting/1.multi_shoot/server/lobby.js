const Room   = require('./room');
const config = require('./config');
const { getSocketIP } = require('./utils');

class Lobby {
    constructor(io, db) {
        this.io = io;
        this.db = db;

        this.rooms = new Map();
        for (let i = 1; i <= config.MAX_ROOMS; i++) {
            this.rooms.set(i, new Room(i, io, db));
        }

        this.lobbyClients = new Map();   // socket.id → { nickname, ip }
        this.chatHistory  = [];
    }

    attach() {
        this.io.on('connection', (socket) => this.onConnection(socket));
    }

    onConnection(socket) {
        const ip = getSocketIP(socket);
        socket.data.ip       = ip;
        socket.data.nickname = '익명';
        socket.data.roomId   = null;

        // 처음 접속 시 로비에 등록
        socket.join('lobby');
        this.lobbyClients.set(socket.id, { nickname: '익명', ip });

        socket.on('lobby:hello', ({ nickname }) => {
            socket.data.nickname = sanitizeNick(nickname);
            const entry = this.lobbyClients.get(socket.id);
            if (entry) entry.nickname = socket.data.nickname;
            socket.emit('lobby:state', this.snapshot());
            this.broadcastLobby();
        });

        socket.on('lobby:nick', ({ nickname }) => {
            socket.data.nickname = sanitizeNick(nickname);
            const entry = this.lobbyClients.get(socket.id);
            if (entry) entry.nickname = socket.data.nickname;
            if (socket.data.roomId) {
                const r = this.rooms.get(socket.data.roomId);
                if (r) r.updatePlayerNickname(socket.id, socket.data.nickname);
            }
            this.broadcastLobby();
        });

        socket.on('lobby:chat', ({ text }) => {
            const t = (text || '').toString().trim().slice(0, 200);
            if (!t) return;
            const msg = {
                from: socket.data.nickname,
                text: t,
                time: Date.now(),
            };
            this.chatHistory.push(msg);
            if (this.chatHistory.length > config.CHAT_HISTORY) this.chatHistory.shift();
            this.io.to('lobby').emit('lobby:chat', msg);
        });

        socket.on('room:join', ({ roomId }) => {
            const id = parseInt(roomId, 10);
            const room = this.rooms.get(id);
            if (!room) return socket.emit('error:msg', '존재하지 않는 룸');
            if (room.isFull()) return socket.emit('error:msg', '룸이 가득 찼습니다');
            if (socket.data.roomId) this.exitRoom(socket); // 다른 룸에 있으면 먼저 나감

            socket.leave('lobby');
            this.lobbyClients.delete(socket.id);

            room.addPlayer(socket);
            socket.data.roomId = room.id;

            this.broadcastLobby();
        });

        socket.on('room:leave', () => {
            this.exitRoom(socket);
        });

        socket.on('room:fire', (data) => {
            if (!socket.data.roomId) return;
            const r = this.rooms.get(socket.data.roomId);
            if (r) r.handleFire(socket.id, data || {});
        });

        socket.on('disconnect', () => {
            if (socket.data.roomId) {
                const r = this.rooms.get(socket.data.roomId);
                if (r) r.removePlayer(socket.id);
            }
            this.lobbyClients.delete(socket.id);
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
        this.io.to('lobby').emit('lobby:update', {
            rooms:      this.roomsSummary(),
            lobbyCount: this.lobbyClients.size,
        });
    }
}

function sanitizeNick(s) {
    s = (s || '').toString().trim().slice(0, 20);
    return s || '익명';
}

module.exports = Lobby;
