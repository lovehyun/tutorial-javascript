const express = require('express');
const cors = require('cors');
const axios = require('axios');

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

app.use(express.json());
app.use(express.static('public')); // index.html 등 프론트엔드 파일 제공용

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index1.html'));
});

// POST /api/chat: 받은 질문을 그대로 응답
app.post('/api/chat', async (req, res) => {
    const question = req.body.question;
    console.log('사용자 입력:', question);

    try {
        // Flask 서버로 요청 전송
        const flaskRes = await axios.post('http://localhost:5000/process', {
            message: question,
            taskId: 'echo' // taskId가 필요하면 아무 값이나 전달 가능
        });

        const flaskResponse = flaskRes.data.response;
        console.log('Flask 응답:', flaskResponse);

        res.json({ answer: flaskResponse });

    } catch (err) {
        console.error('Flask 요청 실패:', err.message);
        res.status(500).json({ answer: 'Flask 서버와 통신 실패' });
    }
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`Echo 서버가 실행 중입니다: http://localhost:${PORT}`);
});
