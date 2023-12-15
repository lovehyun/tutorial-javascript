// 크레딧이 없을 경우: 
// Error making ChatGPT API request: Request failed with status code 429

const axios = require('axios');
require('dotenv').config(); // dotenv를 사용하여 .env 파일을 읽어옵니다.

const openaiApiKey = process.env.OPENAI_API_KEY;

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
                    Authorization: `Bearer ${openaiApiKey}`,
                },
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error making ChatGPT API request:', error.message);
        return '챗봇 응답을 가져오는 도중에 오류가 발생했습니다.';
    }
}

// 사용자 입력을 받아 ChatGPT에 전달하고 응답을 출력하는 예제
async function chatWithUser() {
    const userInput = '안녕, 챗봇!';
    const chatGPTResponse = await getChatGPTResponse(userInput);
    console.log('챗봇 응답:', chatGPTResponse);
}

// 챗봇과 대화 시작
chatWithUser();

// 2초 간격으로 요청 보내기
// setInterval(chatWithUser, 2000);
