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
    db.run("CREATE TABLE IF NOT EXISTS conversation (id INTEGER PRIMARY KEY AUTOINCREMENT, role TEXT, content TEXT)");
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
    const userInput = req.body.userInput;

    // 대화 내용 DB에 추가
    await dbRunAsync("INSERT INTO conversation (role, content) VALUES (?, ?)", ['user', userInput]);

    // 최근 10개 대화 내용 가져오기
    const recentConversation = await getRecentConversation();
    
    // ChatGPT에 대화 내용 전송
    const chatGPTResponse = await getChatGPTResponse(recentConversation);

    // 대화 내용 DB에 추가
    await dbRunAsync("INSERT INTO conversation (role, content) VALUES (?, ?)", ['assistant', chatGPTResponse]);

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
async function getRecentConversation() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM conversation ORDER BY id DESC LIMIT 10", (err, rows) => {
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
        // 최근 10개의 대화 내용 가져오기
        const recentConversation = await getRecentConversation();
        res.json({ conversationHistory: recentConversation });
    } catch (error) {
        console.error('Error getting recent conversation:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
