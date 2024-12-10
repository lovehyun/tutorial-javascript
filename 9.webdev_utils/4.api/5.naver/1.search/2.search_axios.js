require('dotenv').config();
const axios = require('axios');

const client_id = process.env.NAVER_CLIENT_ID;
const client_secret = process.env.NAVER_CLIENT_SECRET;

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
