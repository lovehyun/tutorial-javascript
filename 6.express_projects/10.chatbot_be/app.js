const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

// 메모리에 메시지 저장
const messages = [];

app.use(cors()); // CORS 설정 허용
app.use(express.json()); // JSON 형식의 요청 본문 처리
app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일 제공

// 메시지 POST 요청 처리
app.post('/api/messages', (req, res) => {
    const { userId, message, timestamp, fromAdmin } = req.body;
    if (message) {
        // 메시지를 메모리에 추가
        messages.push({ id: messages.length + 1, userId, text: message, timestamp, fromAdmin: fromAdmin || false });
        res.status(201).send({ status: 'Message received' }); // 메시지 수신 응답
    } else {
        res.status(400).send({ status: 'Invalid message' }); // 유효하지 않은 메시지에 대한 응답
    }
});

// 관리자 페이지 제공
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin', 'admin.html'));
});

// 특정 사용자용 메시지 GET 요청 처리 (특정 사용자 또는 전체)
app.get('/api/admin/messages', (req, res) => {
    const userId = req.query.userId;
    if (userId) {
        // 특정 userId에 해당하는 메시지만 반환
        const userMessages = messages.filter(msg => msg.userId === userId);
        res.json(userMessages);
    } else {
        // 모든 메시지를 반환 (관리자용)
        res.json(messages);
    }
});

// 서버 시작
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
