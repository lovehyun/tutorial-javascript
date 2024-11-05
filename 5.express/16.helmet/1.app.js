const express = require('express');
const helmet = require('helmet');
const app = express();
const port = 3000;

// Helmet 사용
app.use(helmet());

// 기본 경로
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});
