const axios = require('axios');

// 요청 예제
axios
    .get('https://jsonplaceholder.typicode.com/posts', {
        headers: { Authorization: 'Bearer TOKEN' },
        timeout: 5000, // 타임아웃 설정
    })
    .then((response) => {
        console.log(response.data); // 자동 JSON 파싱
    })
    .catch((error) => {
        console.error(error.message);
    });

// 타임아웃 처리
axios.get('https://example.com', { timeout: 5000 });
