const express = require('express');
const app = express();
const port = 3000;

// myLogger 미들웨어 함수
function myLogger(req, res, next) {
    console.log('LOGGED');
    next();
};

app.use(myLogger);

// 루트 경로에 대한 요청 처리
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
