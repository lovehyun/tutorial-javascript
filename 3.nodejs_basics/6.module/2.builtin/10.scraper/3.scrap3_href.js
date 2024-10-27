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
        let startIdx = 0;
        while (true) {
            // <a> 태그의 시작 위치 찾기
            const start = data.indexOf('<a', startIdx);
            if (start === -1) break; // <a> 태그가 더 이상 없으면 종료

            // </a> 태그의 끝 위치 찾기
            const end = data.indexOf('</a>', start);
            if (end === -1) break; // </a> 태그가 없으면 종료

            // <a>...</a> 태그 전체 추출
            const aTag = data.substring(start, end + 4); // </a> 포함해서 추출
            console.log(`찾은 링크 태그: ${aTag}`);

            // 다음 검색을 위해 인덱스 이동
            startIdx = end + 4;
        }
    });
}).on('error', (error) => {
    console.error('요청 중 오류 발생:', error);
});
