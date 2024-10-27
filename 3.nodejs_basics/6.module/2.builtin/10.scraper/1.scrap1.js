const http = require('http'); // http 모듈을 가져옴
const fs = require('fs');

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
        console.log('데이터: ', data);
    });
}).on('error', (error) => {
    console.error('요청 중 오류 발생:', error);
});
