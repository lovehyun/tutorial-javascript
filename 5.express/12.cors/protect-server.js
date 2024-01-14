// 브라우저에서 http://127.0.0.1:3000 및 http://localhost:3000 으로 테스트
const express = require('express');
const path = require('path');
const app = express();

app.use((req, res, next) => {
    // 특정 도메인에서의 요청만을 허용 - 클라이언트 도메인 (https://frontend-app.com) 을 입력
    // res.header('Access-Control-Allow-Origin', 'https://allowed-domain.com');
    // res.header('Access-Control-Allow-Origin', 'https://allowed-domain-1.com, http://allowed-domain-2.com');
    res.header('Access-Control-Allow-Origin', 'http://localhost.com:3000');

    // 다른 필요한 CORS 헤더들도 설정할 수 있습니다.
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // 실제 요청을 처리하기 전에 OPTIONS 요청에 대한 응답을 보내 CORS를 활성화합니다.
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// 나머지 라우트 및 미들웨어 설정
// 예제 API 엔드포인트
app.get('/api/data', (req, res) => {
    const responseData = { message: 'This is data from the API endpoint!' };
    res.json(responseData);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'protect-client.html'));
})

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
