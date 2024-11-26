const express = require('express');
const morgan = require('morgan');
const sqlite3 = require('sqlite3').verbose(); // sqlite3 모듈 추가
const { OpenAI } = require('openai/index.mjs');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// OpenAI 셋업
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// SQLite3 DB 설정
// const db = new sqlite3.Database(':memory:'); // 메모리에 DB 생성 (파일로 저장하려면 파일 경로를 지정)
const db = new sqlite3.Database('history.db');
db.serialize(() => {
    // 대화 히스토리 테이블 생성
    db.run("CREATE TABLE IF NOT EXISTS conversation (id INTEGER PRIMARY KEY AUTOINCREMENT, session_id INTEGER, role TEXT, content TEXT)");

    // 대화 세션 테이블 생성
    db.run("CREATE TABLE IF NOT EXISTS session (id INTEGER PRIMARY KEY AUTOINCREMENT, start_time DATETIME DEFAULT CURRENT_TIMESTAMP)");
});

// 콘솔에 사용자의 요청과 챗봇 응답 출력
app.use((req, res, next) => {
    console.log('사용자 요청:', req.body.userInput);
    next();
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/api/chat', async (req, res) => {
    const start = new Date();
    const { sessionId, userInput } = req.body;

    // 대화 내용 DB에 추가
    await dbRunAsync("INSERT INTO conversation (session_id, role, content) VALUES (?, ?, ?)", [sessionId, 'user', userInput]);

    // 위 질문을 포함한, 최근 10개 대화 내용 가져오기
    const recentConversation = await getRecentConversation(sessionId);

    // ChatGPT에 대화 내용 전송
    const chatGPTResponse = await getChatGPTResponse(recentConversation);

    // 응답 결과를 DB에 추가
    await dbRunAsync("INSERT INTO conversation (session_id, role, content) VALUES (?, ?, ?)", [sessionId, 'assistant', chatGPTResponse]);

    const end = new Date();
    console.log('요청 및 응답 시간:', end - start, 'ms');
    res.json({ chatGPTResponse });
});

// Promise를 반환하는 runAsync 함수 정의
function dbRunAsync(sql, params) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this);
            }
        });
    });
}

// 최근 10개의 대화 내용 가져오기
async function getRecentConversation(sessionId) {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM conversation WHERE session_id = ? ORDER BY id DESC LIMIT 10", [sessionId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows.reverse());
            }
        });
    });
}

// ChatGPT에 전송할 대화 내용 구성
async function getChatGPTResponse(conversationHistory) {
    try {
        const inputMessages = [
            // 'system' 역할을 사용하여 사용자와 챗봇 간의 대화를 초기화합니다.
            { role: 'system', content: 'You are a helpful assistant.' },
            ...conversationHistory.map(item => ({ role: item.role, content: item.content }))
        ];

        // console.log(inputMessages);
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: inputMessages,
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error making ChatGPT API request:', error.message);
        return '챗봇 응답을 가져오는 도중에 오류가 발생했습니다.';
    }
}

app.get('/api/history', async (req, res) => {
    try {
        // 모든 세션의 대화 내용을 가져오기
        const conversationHistory = await getConversationAllSessions();

        res.json({ conversationHistory });
    } catch (error) {
        console.error('Error getting recent conversation:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 세션별 대화 내용 가져오기
async function getConversationAllSessions() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM conversation ORDER BY id DESC", (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows.reverse());
            }
        });
    });
}

// 새로운 세션 시작
app.post('/api/new-session', async (req, res) => {
    try {
        const result = await dbRunAsync("INSERT INTO session (start_time) VALUES (CURRENT_TIMESTAMP)");
        const sessionId = result.lastID; // 새로 생성된 세션의 ID 가져오기
        res.json({ success: true, message: 'New session started successfully.', sessionId });
    } catch (error) {
        console.error('Error starting new session:', error.message);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

async function getCurrentSession() {
    // 현재 세션을 가져오거나 새로 생성
    let currentSession = await dbGetAsync("SELECT id, start_time FROM session ORDER BY start_time DESC LIMIT 1");

    if (!currentSession) {
        await dbRunAsync("INSERT INTO session DEFAULT VALUES");
        currentSession = await dbGetAsync("SELECT id, start_time FROM session ORDER BY start_time DESC LIMIT 1");
    }

    return currentSession;
}

// 현재 세션의 대화 내용 가져오기
app.get('/api/current-session', async (req, res) => {
    try {
        // 세션이 없으면 새로운 세션 시작
        const currentSession = await getCurrentSession();
        const conversationHistory = await getConversationBySession(currentSession.id);
        res.json({ conversationHistory, id: currentSession.id, start_time: currentSession.start_time });
    } catch (error) {
        console.error('Error getting current session:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 세션별 대화 내용 가져오기
async function getConversationBySession(sessionId) {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM conversation WHERE session_id = ? ORDER BY id DESC", [sessionId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows.reverse());
            }
        });
    });
}

// Promise를 반환하는 getAsync 함수 정의
function dbGetAsync(sql, params) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

// 모든 세션 가져오기
app.get('/api/all-sessions', async (req, res) => {
    try {
        const allSessions = await getAllSessions();
        res.json({ allSessions });
    } catch (error) {
        console.error('Error getting all sessions:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 최근 세션을 포함한 모든 세션 가져오기
async function getAllSessions() {
    return new Promise((resolve, reject) => {
        db.all("SELECT id, start_time FROM session ORDER BY start_time DESC", (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// 특정 세션의 대화 내용 가져오기
app.get('/api/session/:sessionId', async (req, res) => {
    try {
        const sessionId = req.params.sessionId;

        const currentSession = await dbGetAsync("SELECT id, start_time FROM session WHERE id = ?", [sessionId]);
        const conversationHistory = await getConversationBySession(sessionId);
        res.json({ conversationHistory, id: currentSession.id, start_time: currentSession.start_time });
    } catch (error) {
        console.error('Error getting session:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
