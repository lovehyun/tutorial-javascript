const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// 기본 파일을 index1.html로 설정합니다.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index1.html'));
});


let words = ["apple", "banana", "cat", "dog"];
let currentWord = words[Math.floor(Math.random() * words.length)];

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('newWord', currentWord);

    socket.on('drawing', (data) => {
        socket.broadcast.emit('drawing', data);
    });

    socket.on('guess', (guess) => {
        if (guess === currentWord) {
            io.emit('correctGuess', socket.id);
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
