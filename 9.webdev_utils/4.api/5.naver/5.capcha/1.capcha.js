// https://developers.naver.com/docs/utils/captcha/overview/

require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const readline = require('readline');

const CLIENT_ID = process.env.NAVER_CLIENT_ID;
const CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

// 1. 캡차 키 발급
async function getCaptchaKey() {
    const url = 'https://openapi.naver.com/v1/captcha/nkey?code=0';
    const headers = {
        'X-Naver-Client-Id': CLIENT_ID,
        'X-Naver-Client-Secret': CLIENT_SECRET,
    };

    try {
        const response = await axios.get(url, { headers });
        return response.data.key;
    } catch (error) {
        console.error('캡차 키 발급 오류:', error.response.data);
    }
}

// 2. 캡차 이미지 발급
async function getCaptchaImage(key) {
    const url = `https://openapi.naver.com/v1/captcha/ncaptcha.bin?key=${key}`;
    const headers = {
        'X-Naver-Client-Id': CLIENT_ID,
        'X-Naver-Client-Secret': CLIENT_SECRET,
    };

    try {
        const response = await axios.get(url, { headers, responseType: 'stream' });
        const path = './captcha.jpg';
        response.data.pipe(fs.createWriteStream(path));
        console.log(`캡차 이미지가 ${path}에 저장되었습니다.`);
    } catch (error) {
        console.error('캡차 이미지 발급 오류:', error.response.data);
    }
}

// 3. 사용자 입력값 검증
async function verifyCaptcha(key, userInput) {
    const url = `https://openapi.naver.com/v1/captcha/nkey?code=1&key=${key}&value=${userInput}`;
    const headers = {
        'X-Naver-Client-Id': CLIENT_ID,
        'X-Naver-Client-Secret': CLIENT_SECRET,
    };

    try {
        const response = await axios.get(url, { headers });
        return response.data.result;
    } catch (error) {
        console.error('캡차 검증 오류:', error.response.data);
    }
}

// 사용자 입력을 기다리는 함수
async function getUserInput(prompt) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(prompt, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

// 실행 예제
(async () => {
    const key = await getCaptchaKey();
    if (key) {
        await getCaptchaImage(key);

        // 사용자로부터 입력을 받아야 합니다.
        console.log('이미지를 확인하고 캡차 텍스트를 입력하세요.');
        const userInput = await getUserInput('캡차 입력: ');
        const isValid = await verifyCaptcha(key, userInput);
        console.log(`캡차 검증 결과: ${isValid}`);
    }
})();
