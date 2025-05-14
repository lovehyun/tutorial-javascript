// https://platform.openai.com/docs/guides/fine-tuning/common-use-cases
// Some common use cases where fine-tuning can improve results:
// - Setting the style, tone, format, or other qualitative aspects
// - Improving reliability at producing a desired output
// - Correcting failures to follow complex prompts
// - Handling many edge cases in specific ways
// - Performing a new skill or task that’s hard to articulate in a prompt

// app7_finetuned.js

const express = require('express');
const morgan = require('morgan');
const { OpenAI } = require('openai');
const {
    getCurrentSession,
    getConversationBySession,
    getRecentConversation,
    saveMessage,
    newSession,
    getAllSessions,
    getSessionById,
    getAllConversation
} = require('./utility');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// 미들웨어
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// OpenAI 셋업
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 요청 로깅
app.use((req, res, next) => {
    if (req.method === 'POST' && req.body.userInput) {
        console.log('사용자 요청:', req.body.userInput);
    }
    next();
});

// 메인 페이지
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// 새로운 세션 생성
app.post('/api/sessions', (req, res) => {
    const result = newSession();
    res.json({ success: true, sessionId: result.lastInsertRowid });
});

// 현재 세션 + 대화 내역 반환
app.get('/api/sessions/latest', (req, res) => {
    const session = getCurrentSession();
    const conversationHistory = getConversationBySession(session.id);
    res.json({ id: session.id, start_time: session.start_time, conversationHistory });
});

// 특정 세션 조회
app.get('/api/sessions/:sessionId', (req, res) => {
    const sessionId = req.params.sessionId;
    const session = getSessionById(sessionId);
    const conversationHistory = getConversationBySession(sessionId);
    res.json({ id: session.id, start_time: session.start_time, conversationHistory });
});

// 전체 세션 목록 조회
app.get('/api/sessions', (req, res) => {
    const sessions = getAllSessions();
    res.json({ allSessions: sessions });
});

// 전체 대화 히스토리 (세션 구분 없음)
app.get('/api/history', (req, res) => {
    const all = getAllConversation();
    res.json({ conversationHistory: all });
});

// GPT 응답 생성 함수
async function getChatGPTResponse(history) {
    try {
        const messages = [
            { role: 'system', content: 'You are a helpful assistant that speaks like healthcare professional.' },
            ...history.map(msg => ({ role: msg.role, content: msg.content }))
        ];

        const response = await openai.chat.completions.create({
            model: "ft:gpt-3.5-turbo-0613:personal::8S57PIzO",
            messages
        });

        return response.choices[0].message.content;
    } catch (err) {
        console.error('ChatGPT 오류:', err.message);
        return '챗봇 응답을 가져오는 도중에 오류가 발생했습니다.';
    }
}

// 채팅 처리
app.post('/api/chat', async (req, res) => {
    const { sessionId, userInput } = req.body;
    const start = new Date();

    saveMessage(sessionId, 'user', userInput);
    const history = getRecentConversation(sessionId);
    const reply = await getChatGPTResponse(history);
    saveMessage(sessionId, 'assistant', reply);

    const end = new Date();
    console.log('요청 및 응답 시간:', end - start, 'ms');

    res.json({ chatGPTResponse: reply });
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
