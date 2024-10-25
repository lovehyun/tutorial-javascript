const http = require('http');
const cheerio = require('cheerio'); // cheerio 모듈을 가져옴

const url = 'http://www.example.com'; // 크롤링할 HTTP 웹페이지의 URL

// HTTP GET 요청을 보내고 응답을 받아 데이터를 처리합니다.
http.get(url, (response) => {
    let data = '';

    // 데이터를 받는 동안 발생하는 이벤트
    response.on('data', (chunk) => {
        data += chunk; // 받은 데이터를 저장
    });

    // 데이터를 모두 받은 후 발생하는 이벤트
    response.on('end', () => {
        // HTML 데이터를 cheerio로 로드하여 파싱
        const $ = cheerio.load(data);

        // 모든 <a> 태그의 href 속성을 가져와 출력
        $('a').each((index, element) => {
            const href = $(element).attr('href');
            if (href) {
                console.log(`링크 ${index + 1}: ${href}`);
            }
        });
    });
}).on('error', (error) => {
    console.error('요청 중 오류 발생:', error);
});
