const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

const clients = [];  // 연결된 모든 클라이언트 저장
const messages = []; // 채팅 메시지 저장

// SSE 연결 설정 (사용자가 연결할 때)
app.get('/chat', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 새로운 클라이언트 연결 추가
    clients.push(res);
    console.log('새로운 클라이언트 연결됨');

    // 기존 메시지 전송 (연결 직후)
    messages.forEach(msg => {
        res.write(`data: ${JSON.stringify(msg)}\n\n`);
    });

    // 연결 종료 시
    req.on('close', () => {
        clients.splice(clients.indexOf(res), 1);
        console.log('클라이언트 연결 종료');
    });
});

// 메시지 수신 및 브로드캐스트 (클라이언트가 POST로 보낼 때)
app.post('/send-message', (req, res) => {
    const { username, message } = req.body;
    const newMessage = { username, message, timestamp: new Date().toISOString() };
    messages.push(newMessage); // 메시지 저장

    // 모든 클라이언트에게 브로드캐스트
    clients.forEach(client => {
        client.write(`data: ${JSON.stringify(newMessage)}\n\n`);
    });
    
    res.status(200).send({ success: true });
});

// 정적 파일 제공
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

// 서버 실행
app.listen(3000, () => {
    console.log('SSE Chat server running on http://localhost:3000');
});
