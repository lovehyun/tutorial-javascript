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

// DB 초기화
const db = new Database('history.db');
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

// 메인 페이지
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// 새로운 세션 생성
app.post('/api/new-session', (req, res) => {
    const stmt = db.prepare("INSERT INTO session DEFAULT VALUES");
    const result = stmt.run();
    res.json({ success: true, sessionId: result.lastInsertRowid });
});

// 현재 세션 가져오기
function getCurrentSession() {
    const session = db.prepare("SELECT id, start_time FROM session ORDER BY start_time DESC LIMIT 1").get();
    if (!session) {
        const insert = db.prepare("INSERT INTO session DEFAULT VALUES").run();
        return db.prepare("SELECT id, start_time FROM session WHERE id = ?").get(insert.lastInsertRowid);
    }
    return session;
}

// 특정 세션의 대화 가져오기
function getConversationBySession(sessionId) {
    const stmt = db.prepare("SELECT * FROM conversation WHERE session_id = ? ORDER BY id");
    return stmt.all(sessionId);
}

// 최근 대화 (10개)
function getRecentConversation(sessionId) {
    const stmt = db.prepare("SELECT * FROM conversation WHERE session_id = ? ORDER BY id DESC LIMIT 10");
    return stmt.all(sessionId).reverse();
}

// 대화 저장
function saveMessage(sessionId, role, content) {
    const stmt = db.prepare("INSERT INTO conversation (session_id, role, content) VALUES (?, ?, ?)");
    stmt.run(sessionId, role, content);
}

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

// 현재 세션 정보 및 대화 가져오기
app.get('/api/current-session', (req, res) => {
    const session = getCurrentSession();
    const conversationHistory = getConversationBySession(session.id);
    res.json({ id: session.id, start_time: session.start_time, conversationHistory });
});

// 모든 세션 목록
app.get('/api/all-sessions', (req, res) => {
    const sessions = db.prepare("SELECT id, start_time FROM session ORDER BY start_time DESC").all();
    res.json({ allSessions: sessions });
});

// 특정 세션 대화 내역
app.get('/api/session/:sessionId', (req, res) => {
    const sessionId = req.params.sessionId;
    const session = db.prepare("SELECT id, start_time FROM session WHERE id = ?").get(sessionId);
    const history = getConversationBySession(sessionId);
    res.json({ id: session.id, start_time: session.start_time, conversationHistory: history });
});

// 전체 대화 히스토리 (세션 구분 없이)
app.get('/api/history', (req, res) => {
    const all = db.prepare("SELECT * FROM conversation ORDER BY id").all();
    res.json({ conversationHistory: all });
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
