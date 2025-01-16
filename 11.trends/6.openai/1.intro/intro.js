// 크레딧이 없을 경우: 
// Error making ChatGPT API request: Request failed with status code 429

// 일반 챗봇: gpt-3.5-turbo (빠르고 저렴)
// 고급 생성 및 복잡한 작업: gpt-4-turbo 또는 gpt-4
// 긴 문서 처리: gpt-4-32k 또는 gpt-3.5-turbo-16k
// 문서 검색, 임베딩: text-embedding-ada-002

const axios = require('axios');
require('dotenv').config(); // dotenv를 사용하여 .env 파일을 읽어옵니다.

const openaiApiKey = process.env.OPENAI_API_KEY;
const url = 'https://api.openai.com/v1/chat/completions';

async function getChatGPTResponse(userInput) {
    try {
        const response = await axios.post(
            // 이자 순서 주의 (url, data, headers)
            url,
            {
                model: 'gpt-3.5-turbo', // gpt-4o-mini
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: userInput },
                ],
                // temperature: 0.7, // 창의성 설정 (0 ~ 1 범위, 0.2 ~ 0.3은 사실 중심, 0.7은 일반 대화, 1.0은 매우 창의적(기본값))
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${openaiApiKey}`,
                },
            },
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
