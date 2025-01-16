const axios = require('axios');
require('dotenv').config(); // .env 파일을 로드합니다.

const openaiApiKey = process.env.OPENAI_API_KEY;
const url = 'https://api.openai.com/v1/chat/completions';

// API 키 유효성 검사
if (!openaiApiKey) {
    console.error("API 키가 설정되지 않았습니다. .env 파일을 확인하세요.");
    process.exit(1); // 프로그램 종료
}

// ChatGPT API 호출 함수
async function getChatGPTResponse(userInput) {
    try {
        const response = await axios.post(
            url,
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: userInput },
                ],
                temperature: 0.7, // 창의성 설정 (기본값 0.7)
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
        // HTTP 에러 핸들링
        if (error.response) {
            const status = error.response.status;
            if (status === 429) {
                console.error("Error: 요청 한도가 초과되었습니다. (크레딧 부족)");
            } else if (status === 401) {
                console.error("Error: API 키가 잘못되었습니다.");
            } else {
                console.error(`Error: HTTP ${status} - ${error.response.data.error.message}`);
            }
        } else {
            console.error("네트워크 오류 발생:", error.message);
        }
        return '챗봇 응답을 가져오는 도중에 오류가 발생했습니다.';
    }
}

// 사용자와 대화 시작
async function chatWithUser() {
    const userInput = '안녕, 챗봇!';
    const chatGPTResponse = await getChatGPTResponse(userInput);
    console.log('챗봇 응답:', chatGPTResponse);
}

// 2초 간격으로 요청 보내기 (활성화하려면 주석 해제)
// setInterval(chatWithUser, 2000);

// 챗봇 실행
chatWithUser();
