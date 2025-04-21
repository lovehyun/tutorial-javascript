const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let currentStatus = 'idle'; // idle, processing, done, error
let currentResult = null;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index2_polling.html'));
});

app.post('/api/message', async (req, res) => {
    const { message } = req.body;

    console.log('[E1] 메시지 요청 수신:', message);
    currentStatus = 'processing';
    currentResult = null;

    console.log('[E2] Flask로 보낼 메시지:', message);

    axios.post('http://localhost:5000/process', { message })
        .then(response => {
            currentResult = response.data.response;
            currentStatus = 'done';
            console.log('[E3] Flask 응답 수신:', currentResult);
        })
        .catch(err => {
            currentResult = 'Flask 처리 실패';
            currentStatus = 'error';
            console.error('[E3] Flask 요청 오류:', err.message);
        });

    res.json({ status: 'started' });
});

app.get('/api/status', (req, res) => {
    console.log('[E4] Flask 처리 상태 확인중:', currentStatus);
    if (currentStatus === 'done' || currentStatus === 'error') {
        const result = currentResult;
        currentStatus = 'idle';
        currentResult = null;
        return res.json({ status: 'done', result });
    }
    res.json({ status: currentStatus });
});

app.listen(port, () => {
    console.log(`🟢 Express 서버 실행 중: http://localhost:${port}`);
});
