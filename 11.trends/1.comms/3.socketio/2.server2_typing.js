const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const sio = new Server(server); // 여기에서 이거 제공 <script src="/socket.io/socket.io.js"></script>

// 클라이언트에 정적 파일 제공 (socketio.html)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index2.html');
});

// Socket.IO 연결 처리
sio.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('typing', () => {
        socket.broadcast.emit('typing', 'Someone is typing...');
    });

    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing');
    });

    socket.on('chat message', (msg) => {
        sio.emit('chat message', msg);
    });
});

// 서버 실행
server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
