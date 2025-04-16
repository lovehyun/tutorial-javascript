const express = require('express');
const axios = require('axios');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // npm install uuid
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const MAX_CONCURRENT = 5;
let processingCount = 0; // 현재 Flask에 처리 중인 작업 수

const taskStore = {}; // taskId → { status, result }
const pendingQueue = []; // taskId를 담는 대기 큐
let taskIdCounter = 1; // uuid 미사용시 순차적으로 증가

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index4_waitqueue.html'));
});

// 메시지 요청 → 비동기 작업 생성
app.post('/api/message', async (req, res) => {
    const { message } = req.body;
    // const taskId = uuidv4();
    const taskId = String(taskIdCounter++);

    console.log('[E1] 메시지 요청 수신:', message);

    taskStore[taskId] = {
        status: 'pending',
        result: null,
        message,
    };

    if (processingCount < MAX_CONCURRENT) {
        processTask(taskId); // 바로 실행
    } else {
        pendingQueue.push(taskId); // 대기 등록
        console.log(`[E2] [대기열] ${taskId} 추가됨, 작업 ID: ${taskId}, (처리 순번 ${pendingQueue.length})`);
    }

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

    if (!task) {
        return res.status(404).json({ status: 'not_found' });
    }
    
    console.log(`[E4] Flask 처리 상태 (TaskId: ${taskId}) 확인중: ${task.status}`);

    if (task.status === 'pending') {
        const position = pendingQueue.indexOf(taskId);
        res.json({ status: 'pending', queuePosition: position + 1 });
    } else {
        res.json(task);
    }
});

// 실제 작업 처리 함수
function processTask(taskId) {
    const task = taskStore[taskId];
    if (!task) return;

    task.status = 'processing';
    processingCount++;
    console.log(`[E3] [처리시작] ${taskId}, 현재 처리중: ${processingCount}`);

    axios.post('http://localhost:5000/process', { message: task.message, taskId })
        .then(response => {
            taskStore[taskId] = {
                status: 'done',
                result: response.data.response
            };
        })
        .catch(err => {
            taskStore[taskId] = {
                status: 'error',
                result: 'Flask 처리 실패'
            };
        })
        .finally(() => {
            processingCount--;
            checkAndProcessQueue(); // 다음 대기 작업 처리
        });
}

// 대기열에서 처리 가능한 항목 처리
function checkAndProcessQueue() {
    while (processingCount < MAX_CONCURRENT && pendingQueue.length > 0) {
        const nextTaskId = pendingQueue.shift();
        processTask(nextTaskId);
    }
}

// 3초마다 한 번씩 대기열 체크 (백업)
// setInterval(() => {
//     checkAndProcessQueue();
// }, 3000);

app.listen(port, () => {
    console.log(`🟢 Express 서버 실행: http://localhost:${port}`);
});
