const express = require('express');
const cors = require('cors');
const OpenAI = require('openai'); // Updated import
const path = require('path');
require('dotenv').config(); // .env 파일 로드

// OpenAI API 설정
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // .env 파일에서 API 키 읽기
});

const app = express();
app.use(cors());
app.use(express.json());

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '1d', // 캐싱 지속 시간 (1일)
}));

// 엔드포인트: 질문을 받아 OpenAI 응답 반환
app.post('/api/chat', async (req, res) => {
    const { question } = req.body;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', // 사용할 모델 선택
            messages: [{ role: 'user', content: question }],
        });

        const answer = response.choices[0].message.content;
        res.json({ answer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'OpenAI API 통신 중 오류 발생', details: error.message });
    }
});

// 스트리밍 엔드포인트
app.post('/api/chat-stream', async (req, res) => {
    const { question } = req.body;

    // 응답 헤더 설정
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-open');

    try {
        const stream = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: question }],
            stream: true, // 스트리밍 활성화
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                // 클라이언트에 데이터 전송
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
        }

        // 스트림 완료
        res.write('data: [DONE]\n\n');
        res.end();

    } catch (error) {
        console.error('Streaming error:', error);
        res.status(500).json({ error: 'Streaming failed' });
    }
});

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});