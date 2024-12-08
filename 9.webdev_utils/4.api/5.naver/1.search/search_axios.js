const axios = require('axios');
require('dotenv').config(); // dotenv를 사용하여 환경 변수 로드

const client_id = process.env.CLIENT_ID; // dotenv로부터 클라이언트 ID 가져오기
const client_secret = process.env.CLIENT_SECRET; // dotenv로부터 클라이언트 시크릿 가져오기

const text = '반갑습니다';
const encText = encodeURIComponent(text);
const url = `https://openapi.naver.com/v1/search/blog?query=${encText}`;

axios({
    method: 'get',
    url: url,
    headers: {
        'X-Naver-Client-Id': client_id,
        'X-Naver-Client-Secret': client_secret,
    },
})
    .then((response) => {
        const data = response.data;
        console.log(data);
    })
    .catch((error) => {
        console.error('Error:', error.response.status, error.response.statusText);
    });
