const express = require('express');
const app = express();
const port = 3000;

// Express에서 에러 처리 미들웨어는 다른 미들웨어와 유사하지만, 함수의 인자가 4개(err, req, res, next)인 점에서 차이가 있습니다. 
// 이 에러 처리 미들웨어는 주로 app.use()를 사용해 정의하고, 모든 라우트 정의 마지막에 추가합니다.

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// 예제 라우트에서 오류를 발생시키는 코드
app.get('/error', (req, res) => {
    throw new Error('이 페이지에서 오류가 발생했습니다!');
});

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
    console.error('에러 발생:', err.message); // 콘솔에 에러 로그
    res.status(500).json({ message: '서버 내부 오류가 발생했습니다.' }); // 클라이언트에 응답
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
