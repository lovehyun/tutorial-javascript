const axios = require('axios');
require('dotenv').config();

async function translateText(text, source = 'ko', target = 'en') {
    // const client_id = 'YOUR_CLIENT_ID';  // 네이버 개발자 센터에서 발급받은 클라이언트 ID를 입력하세요.
    // const client_secret = 'YOUR_CLIENT_SECRET';  // 네이버 개발자 센터에서 발급받은 클라이언트 시크릿을 입력하세요.
    const client_id = process.env.CLIENT_ID;  // dotenv로부터 클라이언트 ID 가져오기
    const client_secret = process.env.CLIENT_SECRET;  // dotenv로부터 클라이언트 시크릿 가져오기

    const api_url = 'https://openapi.naver.com/v1/papago/n2mt';
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Naver-Client-Id': client_id,
        'X-Naver-Client-Secret': client_secret,
    };
    const data = {
        source: source,
        target: target,
        text: text,
    };

    try {
        const response = await axios.post(api_url, data, { headers });

        if (response.status === 200) {
            const result = response.data;
            const translatedText = result.message.result.translatedText;
            console.log(`번역 결과: ${translatedText}`);
        } else {
            console.log('번역에 실패하였습니다.');
        }
    } catch (error) {
        console.error('에러 발생:', error.message);
    }
}

// 예제 실행
const sourceText = '안녕하세요, 파파고 API 사용 방법을 알려주세요.';
translateText(sourceText, source = 'ko', target = 'en');
