require('dotenv').config(); // .env 파일 로드
const express = require('express');
const path = require('path');
const cors = require('cors');
const discordBot = require('./discord'); // Discord 봇 모듈 추가

const app = express();

// 메모리에 메시지 저장
const messages = [];

app.use(cors()); // CORS 설정 허용
app.use(express.json()); // JSON 형식의 요청 본문 처리
app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일 제공

// 메시지 POST 요청 처리
app.post('/api/messages', async (req, res) => {
    const { userId, message, author, timestamp, fromAdmin } = req.body;

    if (message) {
        // 메시지를 메모리에 추가
        const newMessage = {
            id: messages.length + 1,
            userId, // 사용자 ID
            text: message,
            author, // 작성자 이름
            timestamp,
            fromAdmin: fromAdmin || false,
        };
        messages.push(newMessage);

        // Discord로 메시지 전달 (fromAdmin이 아닌 경우에만)
        if (!fromAdmin) {
            try {
                await discordBot.sendMessageToThread(userId, message);
            } catch (error) {
                console.error('Error sending message to Discord:', error.message);
            }
        } else if (author === 'WebAdmin') {
            // WebAdmin 메시지 처리
            const discordMessage = `Admin (${author}): ${message}`;
            try {
                await discordBot.sendMessageToThread(userId, discordMessage);
                console.log(`Sent to Discord: ${discordMessage}`);
            } catch (error) {
                console.error('Error sending WebAdmin message to Discord:', error.message);
            }
        }

        res.status(201).send({ status: 'Message received' });
    } else {
        res.status(400).send({ status: 'Invalid message' });
    }
});

app.post('/api/help', async (req, res) => {
    const { userId, message } = req.body;

    // .env에서 사용자 ID 읽어오기
    const adminId = process.env.DISCORD_USER_ID;

    if (!adminId || !message) {
        return res.status(400).json({ success: false, error: 'Missing userId or message' });
    }

    try {
        // 사용자 ID를 Discord 멘션 형식으로 변환
        const userMention = `<@${adminId}>`;
        const fullMessage = `${userMention} 웹사용자 ${userId}: ${message}`; // 멘션과 메시지를 합침

        // Discord.js 모듈의 sendMessageToThread 호출
        await discordBot.sendMessageToThread(userId, fullMessage);

        res.json({ success: true, message: 'Help request sent to Discord' });
    } catch (error) {
        console.error('Error sending help request to Discord:', error.message);
        res.status(500).json({ success: false, error: 'Failed to send help request' });
    }
});

// 관리자 페이지 제공
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin', 'admin.html'));
});

// 관리자 페이지에서 메시지 조회
app.get('/api/admin/messages', (req, res) => {
    const userId = req.query.userId;

    if (userId) {
        const userMessages = messages.filter((msg) => msg.userId === userId);
        res.json(userMessages);
    } else {
        res.json(messages);
    }
});

// 서버 시작
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
