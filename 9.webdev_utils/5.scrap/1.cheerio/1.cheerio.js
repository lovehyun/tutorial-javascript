// npm install cheerio
// Cheerio는 jQuery 스타일의 문법을 사용하여 HTML 및 XML 문서를 파싱하고 조작하는 데 사용됩니다. 
// 일반적으로 서버 측에서 HTML 문서를 스크래핑하거나 분석하는 데 주로 사용됩니다.

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
