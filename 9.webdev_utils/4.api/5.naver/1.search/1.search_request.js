require('dotenv').config();
const request = require('request');

const client_id = process.env.NAVER_CLIENT_ID;
const client_secret = process.env.NAVER_CLIENT_SECRET;

const text = '반갑습니다';
const encText = encodeURIComponent(text);
const url = `https://openapi.naver.com/v1/search/blog?query=${encText}`;

const headers = {
    'X-Naver-Client-Id': client_id,
    'X-Naver-Client-Secret': client_secret,
};

request.get({
    url: url,
    headers: headers,
}, (error, response, body) => {
    if (error) {
        console.error('Error:', response.statusCode, error);
    } else {
        const data = JSON.parse(body);
        console.log(data);
    }
});
