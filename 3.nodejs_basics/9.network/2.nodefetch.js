const fetch = require('node-fetch');

// 요청 예제

fetch('https://jsonplaceholder.typicode.com/posts', {
    headers: { Authorization: 'Bearer TOKEN' },
})
    .then((response) => response.json()) // JSON 파싱 수동 처리
    .then((data) => console.log(data))
    .catch((error) => console.error(error.message))
    .finally(() => clearTimeout(timeout));


// 타임아웃 처리
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 5000); // 타임아웃 설정
fetch('https://example.com', { signal: controller.signal });
