const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.post('/api/chat', async (req, res) => {
    const userInput = req.body.userInput;
    const chatGPTResponse = await getChatGPTResponse(userInput);
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

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error making ChatGPT API request:', error.message);
        return '챗봇 응답을 가져오는 도중에 오류가 발생했습니다.';
    }
}

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
