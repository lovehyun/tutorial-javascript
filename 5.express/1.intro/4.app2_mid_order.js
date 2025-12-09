const express = require('express');
const app = express();

// 첫 번째 미들웨어
app.use((req, res, next) => {
    console.log('1. 미들웨어 실행');
    next();
});

// 두 번째 미들웨어
app.use((req, res, next) => {
    console.log('2. 미들웨어 실행');
    next();
});

// 세 번째 미들웨어
app.use((_, _, next) => {
    console.log('3. 미들웨어 실행')
    console.log('This middleware does not use req, res.');
    next();
});

// 라우터
app.get('/', (req, res) => {
    console.log('4. 라우트 실행');
    res.send('Hello, World!');
});

app.use((req, res, next) => {
    console.log('5. 오류1');
    res.status(404).send('404 Not Found');
});

// 에러 처리 미들웨어 (5xx 에러, 서버 크래시 등)
app.use((err, req, res, next) => {
    console.error('6. 에러 처리 미들웨어 실행:', err);
    res.status(500).send('서버 오류');
});

app.listen(3000, () => {
    console.log('서버가 http://localhost:3000 에서 실행 중입니다.');
});
