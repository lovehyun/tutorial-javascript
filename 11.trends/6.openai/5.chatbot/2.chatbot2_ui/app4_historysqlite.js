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
const db = new Database(':memory:'); // 파일로 저장하려면 파일명 입력 (예: 'history.db')
// const db = new Database('history.db'); // 파일로 저장하려면 파일명 입력 (예: 'history.db')
db.exec(`
    CREATE TABLE IF NOT EXISTS conversation (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT,
        content TEXT
    )
`);

// POST 요청에만 사용자 입력 로깅
app.use((req, res, next) => {
    if (req.method === 'POST' && req.body.userInput) {
        console.log('사용자 요청:', req.body.userInput);
    }
    next();
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/api/chat', async (req, res) => {
    const start = new Date();
    const userInput = req.body.userInput;

    try {
        db.prepare('INSERT INTO conversation (role, content) VALUES (?, ?)').run('user', userInput);

        const recentConversation = getRecentConversation();

        const chatGPTResponse = await getChatGPTResponse(recentConversation);

        db.prepare('INSERT INTO conversation (role, content) VALUES (?, ?)').run('assistant', chatGPTResponse);

        const end = new Date();
        console.log('요청 및 응답 시간:', end - start, 'ms');
        res.json({ chatGPTResponse });
    } catch (error) {
        console.error('처리 중 오류 발생:', error.message);
        res.status(500).json({ chatGPTResponse: '처리 중 오류가 발생했습니다.' });
    }
});

// 최근 대화 내용 가져오기 (최신 6개 제한)
function getRecentConversation() {
    const stmt = db.prepare('SELECT * FROM conversation ORDER BY id DESC LIMIT 6');
    const rows = stmt.all();
    return rows.reverse(); // 오래된 순서로 정렬
}

// GPT 응답 생성
async function getChatGPTResponse(conversationHistory) {
    try {
        const inputMessages = [
            {
                role: 'system',
                content:
                    'You are a helpful assistant. Try to remember previous conversation context and respond accordingly.',
            },
            ...conversationHistory.map((item) => ({ role: item.role, content: item.content })),
        ];

        console.log('챗봇질의 프롬프트: ', inputMessages);
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: inputMessages,
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('GPT 호출 오류:', error.message);
        return '챗봇 응답을 가져오는 도중에 오류가 발생했습니다.';
    }
}

// 최근 대화 내역 조회용 API
app.get('/api/history', (req, res) => {
    try {
        const recentConversation = getRecentConversation();
        res.json({ conversationHistory: recentConversation });
    } catch (error) {
        console.error('히스토리 조회 오류:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
