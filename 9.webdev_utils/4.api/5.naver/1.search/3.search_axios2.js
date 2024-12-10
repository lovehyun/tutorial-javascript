require('dotenv').config(); // dotenv를 사용하여 환경 변수 로드
const axios = require('axios');

// 환경 변수에서 클라이언트 ID와 시크릿 가져오기
const client_id = process.env.NAVER_CLIENT_ID;
const client_secret = process.env.NAVER_CLIENT_SECRET;

// 검색할 텍스트와 API URL
const text = '반갑습니다';
const url = 'https://openapi.naver.com/v1/search/blog';

// 요청 헤더 설정
const headers = {
    'X-Naver-Client-Id': client_id,
    'X-Naver-Client-Secret': client_secret,
};

// 요청 파라미터 설정
const params = {
    query: text, // 검색어
};

// API 요청
axios.get(url, { headers, params })
    .then((response) => {
        console.log('Response Data:', response.data);
    })
    .catch((error) => {
        if (error.response) {
            console.error('Error:', error.response.status, error.response.statusText);
        } else {
            console.error('Error:', error.message);
        }
    });
