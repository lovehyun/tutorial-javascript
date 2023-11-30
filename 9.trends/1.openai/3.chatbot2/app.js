const express = require('express');
const axios = require('axios');
const morgan = require('morgan');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// 콘솔에 사용자의 요청과 챗봇 응답 출력
app.use((req, res, next) => {
    console.log('사용자 요청:', req.body.userInput);
    next();
});

app.post('/api/chat', async (req, res) => {
    const start = new Date(); // 요청 시작 시간 기록
    const userInput = req.body.userInput;
    const chatGPTResponse = await getChatGPTResponse(userInput);
    const end = new Date(); // 응답 완료 시간 기록
    console.log('요청 및 응답 시간:', end - start, 'ms');
    res.json({ chatGPTResponse });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

async function getChatGPTResponse(userInput) {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: userInput },
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        const chatbotResponse = response.data.choices[0].message.content;
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
