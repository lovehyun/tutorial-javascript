const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 미들웨어 설정
app.use(cors());
// const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
// const corsOptions = {
//     origin: function (origin, callback) {
//         // origin이 없으면 (예: 서버 간 통신) 허용
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     methods: ['GET', 'POST'],
//     allowedHeaders: ['Content-Type'],
// };
// app.use(cors(corsOptions));

// app.use(express.json()); // 비스트리밍용 라우트에만 적용
app.use(express.static('public')); // index.html 등 프론트엔드 파일 제공용

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index2_stream.html'));
});

// POST /api/chat: 받은 질문을 그대로 응답
app.post('/api/chat', (req, res) => {
    const question = req.body.question;
    console.log('사용자 입력:', question);

    const echoAnswer = `Echo: ${question}`;
    res.json({ answer: echoAnswer });
});

// 스트리밍 - GET 방식 (GET /api/chat-stream) - SSE 방식 (EventSource 대응)
app.get('/api/chat-stream', (req, res) => {
    const question = req.query.question || '';
    console.log('스트리밍(GET) 질문:', question);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 간단히 문자 단위로 잘라서 스트리밍 시뮬레이션
    let index = 0;
    const interval = setInterval(() => {
        if (index < question.length) {
            const char = question[index];
            res.write(`data: ${JSON.stringify({ content: char })}\n\n`);
            index++;
        } else {
            res.write(`data: [DONE]\n\n`);
            res.end();
            clearInterval(interval);
        }
    }, 100); // 0.1초 간격으로 한 글자씩 전송
});

// 스트리밍 - POST 방식 (POST /api/chat-stream) - fetch().body.getReader() 대응
app.post('/api/chat-stream', async (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const { question } = JSON.parse(body);
            console.log('📡 POST 스트리밍 수신 질문:', question);

            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            let index = 0;
            const interval = setInterval(() => {
                if (index < question.length) {
                    const char = question[index];
                    res.write(`data: ${JSON.stringify({ content: char })}\n\n`);
                    index++;
                } else {
                    res.write(`data: [DONE]\n\n`);
                    res.end();
                    clearInterval(interval);
                }
            }, 100); // 글자당 100ms 지연
        } catch (err) {
            console.error('JSON 파싱 실패:', err.message);
            res.status(400).end();
        }
    });

    req.on('error', (err) => {
        console.error('요청 수신 중 에러:', err);
    });
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`Echo 서버가 실행 중입니다: http://localhost:${PORT}`);
});
