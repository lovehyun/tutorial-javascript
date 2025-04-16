const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config(); // .env 파일 로드

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // index.html 등 프론트 제공용

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index1.html'));
});

// POST /api/chat → OpenAI와 연동
app.post('/api/chat', async (req, res) => {
    const question = req.body.question;
    console.log('사용자 입력:', question);

    try {
        const openaiRes = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: question }
                ],
                temperature: 0.7,
                max_tokens: 1000
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
                }
            }
        );

        const gptAnswer = openaiRes.data.choices[0].message.content.trim();
        console.log('OpenAI 응답:', gptAnswer);
        res.json({ answer: gptAnswer });

    } catch (err) {
        console.error('OpenAI 요청 실패:', err.message);
        res.status(500).json({ answer: 'OpenAI 응답 실패' });
    }
});

app.listen(PORT, () => {
    console.log(`🟢 챗봇 서버 실행 중: http://localhost:${PORT}`);
});
