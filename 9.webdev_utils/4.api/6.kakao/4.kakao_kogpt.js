// https://developers.kakao.com/docs/latest/ko/kogpt/common
// https://developers.kakao.com/docs/latest/ko/kogpt/rest-api

require('dotenv').config(); // .env 파일 로드
const axios = require('axios');

// .env 파일에서 REST API 키 가져오기
const REST_API_KEY = process.env.KAKAO_RESTAPI_KEY;

// KoGPT API 호출 함수 정의
async function kogptApi(prompt, max_tokens = 1, temperature = 1.0, top_p = 1.0, n = 1) {
    try {
        const response = await axios.post(
            'https://api.kakaobrain.com/v1/inference/kogpt/generation',
            {
                prompt: prompt,
                max_tokens: max_tokens,
                temperature: temperature,
                top_p: top_p,
                n: n
            },
            {
                headers: {
                    Authorization: `KakaoAK ${REST_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data; // JSON 응답 데이터 반환
    } catch (error) {
        console.error(`Error: ${error.response?.status || error.message}`);
        return null;
    }
}

// KoGPT에게 전달할 명령어 구성
const prompt = `인간처럼 생각하고, 행동하는 '지능'을 통해 인류가 이제까지 풀지 못했던`;

// KoGPT API 호출
kogptApi(prompt, 32, 1.0, 1.0, 3)
    .then(response => {
        console.log(response); // API 응답 출력
    })
    .catch(error => {
        console.error('Failed to call KoGPT API:', error);
    });
