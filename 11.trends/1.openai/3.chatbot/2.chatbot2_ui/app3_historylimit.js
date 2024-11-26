// https://platform.openai.com/docs/api-reference/chat/create?lang=node.js
// OpenAI의 ChatGPT API에서 사용되는 역할은 다음과 같습니다:
// - User (사용자): 실제 사용자의 입력을 나타냅니다. 사용자의 대화 내용이 이 역할에 속합니다.
// - Assistant (어시스턴트): 챗봇의 초기 상태를 설정하는 데 사용됩니다. 어시스턴트 역할은 챗봇의 특정 특성이나 역할을 정의합니다.
// - System (시스템): 채팅 대화를 초기화하고 제어하는 데 사용됩니다. 대화의 시작 부분에서 'system' 역할로 메시지를 추가하여 채팅의 전반적인 맥락이나 환경을 설정할 수 있습니다.
// - Function (함수): 사용자 정의 함수 또는 명령을 나타냅니다. 이 역할을 사용하여 특정 작업이나 동작을 지정할 수 있습니다.

const express = require('express');
const morgan = require('morgan');
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

// 콘솔에 사용자의 요청과 챗봇 응답 출력
app.use((req, res, next) => {
    console.log('사용자 요청:', req.body.userInput);
    next();
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// 대화 히스토리 길이 관리
const MAX_HISTORY_LENGTH = 10;

// 이전 대화 내용을 저장할 배열
const conversationHistory = [];
let conversationSeq = 0;

app.post('/api/chat', async (req, res) => {
    const start = new Date();
    const userInput = req.body.userInput;

    // 이전 대화 내용 추가
    conversationHistory.push({ role: 'user', content: userInput });
    conversationSeq += 1;
    
    // ChatGPT에 대화 내용 전송
    const chatGPTResponse = await getChatGPTResponse(conversationHistory);

    // 이전 대화 내용에 ChatGPT 응답 추가
    conversationHistory.push({ role: 'assistant', content: chatGPTResponse });
    conversationSeq += 1;

    // 대화 히스토리 길이 관리
    while (conversationHistory.length > MAX_HISTORY_LENGTH) {
        conversationHistory.shift(); // 가장 오래된 대화들 삭제
    }
    
    const end = new Date();
    console.log('요청 및 응답 시간:', end - start, 'ms');
    res.json({ chatGPTResponse });
});

// 수동으로 과거 대화내용 확인하는 API
app.get('/api/history', (req, res) => {
    // res.json({ conversationHistory });
    const numberedHistory = conversationHistory.map((item, index) => {
        return { ...item, number: conversationSeq - (conversationHistory.length - index) + 1 };
    });

    res.json({ conversationHistory: numberedHistory });
});

// ChatGPT에 전송할 대화 내용 구성
async function getChatGPTResponse(conversationHistory) {
    try {
        // 'system' 역할을 사용하여 사용자와 챗봇 간의 대화를 초기화합니다.
        const inputMessages = [
            { role: 'system', content: 'You are a helpful assistant.' },
            ...conversationHistory,
        ];

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: inputMessages,
        });

        const chatbotResponse = response.choices[0].message.content;
        console.log('ChatGPT 응답:', chatbotResponse);
        return chatbotResponse;
    } catch (error) {
        console.error('Error making ChatGPT API request:', error.message);
        return '챗봇 응답을 가져오는 도중에 오류가 발생했습니다.';
    }
}

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
