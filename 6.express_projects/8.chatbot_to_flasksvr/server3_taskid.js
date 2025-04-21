const express = require('express');
const axios = require('axios');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // npm install uuid
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const taskStore = {}; // taskId → { status, result }
let taskIdCounter = 1; // uuid 미사용시 순차적으로 증가

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index3_taskid.html'));
});

// 메시지 요청 → 비동기 작업 생성
app.post('/api/message', async (req, res) => {
    const { message } = req.body;
    // const taskId = uuidv4();
    const taskId = String(taskIdCounter++);

    console.log('[E1] 메시지 요청 수신:', message);
    
    taskStore[taskId] = { status: 'processing', result: null };

    console.log('[E2] 보낼 메시지:', message, ', 작업 ID:', taskId);

    // Flask 비동기 호출 (진짜 async는 아니지만 Express에서 await 안 함)
    axios.post('http://localhost:5000/process', { message, taskId })
        .then(response => {
            taskStore[taskId] = {
                status: 'done',
                result: response.data.response
            };
            console.log(`[E3] TaskId: ${taskId}, Flask 처리 완료: ${response.data.response}`);
        })
        .catch(err => {
            taskStore[taskId] = {
                status: 'error',
                result: 'Flask 처리 실패'
            };
            console.error(`[E3] TaskId: ${taskId}, Flask 오류: ${err.message}`);
        });

    res.json({ taskId });
});

// 모든 작업 상태 출력
app.get('/api/status', (req, res) => {
    res.json(taskStore);
});

// 상태 확인
app.get('/api/status/:taskId', (req, res) => {
    const taskId = req.params.taskId;
    const task = taskStore[taskId];

    console.log(`[E4] Flask 처리 상태 (TaskId: ${taskId}) 확인중: ${task.status}`);

    if (!task) {
        return res.status(404).json({ status: 'not_found' });
    }

    res.json(task);
});

app.listen(port, () => {
    console.log(`🟢 Express 서버 실행: http://localhost:${port}`);
});
