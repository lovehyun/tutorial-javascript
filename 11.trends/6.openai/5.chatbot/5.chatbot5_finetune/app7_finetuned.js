// https://platform.openai.com/docs/guides/fine-tuning/common-use-cases
// Some common use cases where fine-tuning can improve results:
// - Setting the style, tone, format, or other qualitative aspects
// - Improving reliability at producing a desired output
// - Correcting failures to follow complex prompts
// - Handling many edge cases in specific ways
// - Performing a new skill or task that’s hard to articulate in a prompt

const express = require('express');
const morgan = require('morgan');
const Database = require('better-sqlite3');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// OpenAI 셋업
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// SQLite DB 설정
const db = new Database('history.db');

// 테이블 초기화
db.exec(`
  CREATE TABLE IF NOT EXISTS session (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    start_time DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS conversation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER,
    role TEXT,
    content TEXT
  );
`);

// 요청 로그
app.use((req, res, next) => {
    if (req.method === 'POST' && req.body.userInput) {
        console.log('사용자 요청:', req.body.userInput);
    }
    next();
});

// 홈 페이지
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// 새로운 세션 시작
app.post('/api/new-session', (req, res) => {
    const result = db.prepare("INSERT INTO session DEFAULT VALUES").run();
    res.json({ success: true, sessionId: result.lastInsertRowid });
});

// 현재 세션 정보 조회
function getCurrentSession() {
    const session = db.prepare("SELECT id, start_time FROM session ORDER BY start_time DESC LIMIT 1").get();
    if (!session) {
        const insert = db.prepare("INSERT INTO session DEFAULT VALUES").run();
        return db.prepare("SELECT id, start_time FROM session WHERE id = ?").get(insert.lastInsertRowid);
    }
    return session;
}

// 특정 세션 대화 기록 조회
function getConversationBySession(sessionId) {
    return db.prepare("SELECT * FROM conversation WHERE session_id = ? ORDER BY id").all(sessionId);
}

// 최근 10개 대화 조회
function getRecentConversation(sessionId) {
    return db.prepare("SELECT * FROM conversation WHERE session_id = ? ORDER BY id DESC LIMIT 10").all(sessionId).reverse();
}

// 메시지 저장
function saveMessage(sessionId, role, content) {
    db.prepare("INSERT INTO conversation (session_id, role, content) VALUES (?, ?, ?)").run(sessionId, role, content);
}

// ChatGPT 응답 생성
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

// 현재 세션 정보 및 대화 내역
app.get('/api/current-session', (req, res) => {
    const session = getCurrentSession();
    const conversationHistory = getConversationBySession(session.id);
    res.json({ id: session.id, start_time: session.start_time, conversationHistory });
});

// 특정 세션 대화 조회
app.get('/api/session/:sessionId', (req, res) => {
    const sessionId = req.params.sessionId;
    const session = db.prepare("SELECT id, start_time FROM session WHERE id = ?").get(sessionId);
    const conversationHistory = getConversationBySession(sessionId);
    res.json({ id: session.id, start_time: session.start_time, conversationHistory });
});

// 전체 세션 목록
app.get('/api/all-sessions', (req, res) => {
    const allSessions = db.prepare("SELECT id, start_time FROM session ORDER BY start_time DESC").all();
    res.json({ allSessions });
});

// 전체 대화 히스토리
app.get('/api/history', (req, res) => {
    const history = db.prepare("SELECT * FROM conversation ORDER BY id").all();
    res.json({ conversationHistory: history });
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
