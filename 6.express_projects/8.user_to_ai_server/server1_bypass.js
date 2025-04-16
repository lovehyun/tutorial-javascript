const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index1.html'));
});

// 메시지 수신 → Flask로 전달 → 응답 반환
app.post('/api/message', async (req, res) => {
    const { message } = req.body;

    console.log('[E1] 프론트엔드로부터 받은 메시지:', message);

    try {
        const flaskUrl = 'http://localhost:5000/process';
        const payload = { message };

        console.log('[E2] Flask로 보낼 메시지:', payload);

        const flaskRes = await axios.post(flaskUrl, payload);

        console.log('[E3] Flask에서 받은 응답:', flaskRes.data);

        res.json(flaskRes.data);
    } catch (err) {
        console.error('Flask 요청 중 오류:', err.message);
        res.status(500).json({ error: 'Flask 서버와 통신 실패' });
    }
});

app.listen(port, () => {
    console.log(`🟢 Express 서버 실행: http://localhost:${port}`);
});
