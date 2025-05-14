const express = require('express');
const morgan = require('morgan');
const { OpenAI } = require('openai');
require('dotenv').config();

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

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// OpenAI 셋업
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 메인 페이지
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// ChatGPT 응답 생성
async function getChatGPTResponse(history) {
    try {
        const messages = [
            { role: 'system', content: 'You are a helpful assistant. Try to remember previous conversation context and respond accordingly.' },
            ...history.map(msg => ({ role: msg.role, content: msg.content }))
        ];

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages
        });

        return response.choices[0].message.content;
    } catch (err) {
        console.error('GPT 오류:', err.message);
        return '챗봇 응답 중 오류가 발생했습니다.';
    }
}

// 채팅 요청 처리
app.post('/api/chat', async (req, res) => {
    const { sessionId, userInput } = req.body;
    console.log('사용자 요청:', userInput);

    saveMessage(sessionId, 'user', userInput);

    const recentHistory = getRecentConversation(sessionId);
    const reply = await getChatGPTResponse(recentHistory);

    saveMessage(sessionId, 'assistant', reply);

    res.json({ chatGPTResponse: reply });
});

// 새로운 세션 생성
app.post('/api/sessions', (req, res) => {
    const result = newSession();
    res.json({ success: true, sessionId: result.lastInsertRowid });
});

// 최신 세션 정보 및 대화 가져오기
app.get('/api/sessions/latest', (req, res) => {
    const session = getCurrentSession();
    const conversationHistory = getConversationBySession(session.id);
    res.json({ id: session.id, start_time: session.start_time, conversationHistory });
});

// 전체 세션 목록
app.get('/api/sessions', (req, res) => {
    const sessions = getAllSessions();
    res.json({ allSessions: sessions });
});

// 특정 세션 대화 내역
app.get('/api/sessions/:sessionId', (req, res) => {
    const sessionId = req.params.sessionId;
    const session = getSessionById(sessionId);
    const history = getConversationBySession(sessionId);
    res.json({ id: session.id, start_time: session.start_time, conversationHistory: history });
});

// 전체 대화 히스토리 (세션 구분 없이)
app.get('/api/history', (req, res) => {
    const all = getAllConversation();
    res.json({ conversationHistory: all });
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
