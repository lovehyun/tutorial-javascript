const http = require('http');

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
        // 정규 표현식을 사용하여 모든 <a> 태그의 href 속성 추출
        // const regex = /<a\b[^>]*>(.*?)<\/a>/g;
        const regex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"/g;
        let matches;
        let index = 1;

        // 정규 표현식을 사용하여 반복적으로 href를 찾음
        while ((matches = regex.exec(data)) !== null) {
            console.log(`링크 ${index}: ${matches[1]}`);
            index++;
        }
    });
}).on('error', (error) => {
    console.error('요청 중 오류 발생:', error);
});
