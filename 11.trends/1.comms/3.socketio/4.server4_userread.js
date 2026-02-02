const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const sio = new Server(server);

const messages = []; // 메시지 저장소 (메시지 + 읽음 상태 포함)
const userMap = {};  // socket.id -> username 매핑 저장

// 클라이언트에 정적 파일 제공
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index4_read.html');
});

app.use(express.static('public'));

sio.on('connection', (socket) => {    
    const totalUsers = sio.sockets.sockets.size; // 현재 활성 소켓 수
    console.log(`✅ New user connected! Socket ID: ${socket.id}, Total users: ${totalUsers}`);
    sio.emit('user count', totalUsers);

    // 사용자 등록
    socket.on('user joined', (username) => {
        userMap[socket.id] = { username };
        console.log(`👤 User joined: ${username} (id: ${socket.id})`);
    });
    
    // 타이핑 이벤트 (디버깅 포함)
    socket.on('typing', () => {
        console.log(`✍️ ${userMap[socket.id]?.username || "Unknown user"} is typing...`);
        socket.broadcast.emit('typing', userMap[socket.id]?.username || "Unknown user");
    });
    
    // 타이핑 이벤트 (디버깅 포함)
    socket.on('stop typing', () => {
        console.log(`✋ ${userMap[socket.id]?.username || "Unknown user"} has stopped typing.`);
        socket.broadcast.emit('stop typing', userMap[socket.id]?.username || "Unknown user");
    });

    // 메시지 전송 (메시지 저장 + 읽지 않은 사용자 리스트 포함 (보낸 사람 제외))
    socket.on('chat message', ({ username, message, timestamp }) => {
        const unreadUsers = Object.keys(userMap).filter(id => id !== socket.id); // 소켓 ID 기준 unreadUsers 관리 (보낸 사람 제외)
        messages.push({ username, message, timestamp, unreadUsers });

        console.log(`💬 Message received from ${username}, content '${message}' at ${timestamp}`);
        sio.emit('chat message', { username, message, timestamp, unreadUsers });
    });

    // 읽음 처리 (특정 사용자가 특정 메시지를 읽었을 때)
    socket.on('read message', ({ timestamp }) => {
        const messageIndex = messages.findIndex(msg => msg.timestamp == timestamp);
        const message = messages[messageIndex];

        if (message) {
            message.unreadUsers = message.unreadUsers.filter(id => id !== socket.id);
            console.log(`👀 ${userMap[socket.id]?.username || "Unknown user"} read message '${message.message}' with timestamp ${timestamp}`);

            // 모든 사용자가 읽었을 경우, 읽음 수를 0으로 설정
            if (message.unreadUsers.length === 0) {
                console.log(`✅ All users have read the message '${message.message}' with timestamp ${timestamp}`);
                messages.splice(messageIndex, 1);  // 메시지 삭제
            }

            sio.emit('update read receipt', {
                timestamp,
                unreadUsers: message.unreadUsers
            });
        }
    });

    // 사용자 연결 해제 (userMap 제거 + 메시지 갱신)
    socket.on('disconnect', () => {
        const disconnectedUser = userMap[socket.id]?.username || "Unknown user";
        console.log(`❌ User disconnected: ${disconnectedUser} (ID: ${socket.id})`);

        // userMap에서 제거
        delete userMap[socket.id];

        // 모든 메시지에서 나간 사용자의 unread 상태 제거
        messages.forEach((message) => {
            message.unreadUsers = message.unreadUsers.filter(id => id !== socket.id);
        });

        // 사용자 수 업데이트 및 메시지 갱신
        sio.emit('user count', sio.sockets.sockets.size);
        sio.emit('update read receipt', {
            timestamp: null,  // 모든 메시지 갱신
            unreadCount: null
        });
    });
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
