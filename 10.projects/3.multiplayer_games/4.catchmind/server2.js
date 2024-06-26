const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const moment = require('moment');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// 기존의 정적 파일 서빙 부분을 수정합니다.
app.use(express.static('public'));

// 기본 파일을 index2.html로 설정합니다.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index2.html'));
});

let words = ["apple", "banana", "cat", "dog"];
let currentWord = "";
let drawer = null;

io.on('connection', (socket) => {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] User connected: ${socket.id}`);

    // 새로운 사용자가 접속하면 드로잉 플레이어를 선택합니다.
    if (!drawer) {
        drawer = socket.id;
        selectNewWordAndNotifyDrawer();
    }

    socket.on('startDrawing', (data) => {
        console.log(`Start drawing at: (${data.x}, ${data.y})`); // 콘솔에 좌표 출력
        socket.broadcast.emit('startDrawing', data);
    });
    
    socket.on('drawing', (data) => {
        socket.broadcast.emit('drawing', data);
    });

    socket.on('guess', (guess) => {
        const sanitizedGuess = guess.replace(/(\r\n|\n|\r)/gm, ''); // 엔터 캐릭터 제거
        console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] User ${socket.id} guessed: ${sanitizedGuess}`);
        socket.broadcast.emit('guess', {
            player: socket.id,
            guess: sanitizedGuess
        });
        if (sanitizedGuess === currentWord) {
            io.emit('correctGuess', socket.id);
            // 정답을 맞춘 사용자를 새로운 drawer로 설정합니다.
            drawer = socket.id;
            selectNewWordAndNotifyDrawer();
        }
    });

    socket.on('clearCanvas', () => {
        io.emit('clearCanvas');
    });

    socket.on('disconnect', () => {
        console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] User disconnected: ${socket.id}`);
        if (socket.id === drawer) {
            // 드로잉 플레이어가 나가면 새로운 드로잉 플레이어를 선택합니다.
            const clients = Array.from(io.sockets.sockets.keys());
            if (clients.length > 0) {
                drawer = clients[0];
                selectNewWordAndNotifyDrawer();
            } else {
                drawer = null;
            }
        }
    });
});

function selectNewWordAndNotifyDrawer() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    io.emit('drawerSelected', drawer);
    io.to(drawer).emit('newWord', currentWord);
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] New turn: ${drawer} is drawing ${currentWord}`);
}

server.listen(3000, () => {
    console.log('listening on *:3000');
});
