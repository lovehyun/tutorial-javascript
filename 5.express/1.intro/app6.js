const express = require('express');
const app = express();
const port = 3000;

// 루트 경로에 대한 요청 처리
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// 라우트 파라미터
app.get('/users/:id', (req, res) => {
    res.send(`사용자 ID: ${req.params.id}`);
});

// 쿼리 파라미터
// search?keyword=programming&category=javascript
app.get('/search', (req, res) => {
    const keyword = req.query.keyword;
    const category = req.query.category;

    res.send(`키워드: ${keyword}, 카테고리: ${category}`);
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
