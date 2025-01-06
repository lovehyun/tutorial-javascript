const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const sio = new Server(server);

let usersTyping = new Set();

// 클라이언트에 정적 파일 제공
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index3.html');
});

app.use(express.static('public'));

// Socket.IO 연결 처리
sio.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('typing', (username) => {
        usersTyping.add(username);
        socket.broadcast.emit('typing', username);
    });
    
    socket.on('stop typing', () => {
        usersTyping.clear();
        socket.broadcast.emit('stop typing');
    });
    
    socket.on('chat message', ({ username, message }) => {
        // sio.emit('chat message', msg);  // 모든 클라이언트에게 전송
        socket.broadcast.emit('chat message', { username, message }); // 보낸 클라이언트를 제외한 브로드캐스트
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// 서버 실행
server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
