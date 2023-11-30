// npm install cheerio

const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://example.com';

axios.get(url)
    .then((response) => {
        const $ = cheerio.load(response.data);
        // 여기서 Cheerio를 사용하여 필요한 데이터 추출
        const title = $('title').text();
        console.log('페이지 제목:', title);
    })
    .catch((error) => {
        console.error('에러 발생:', error);
    });
