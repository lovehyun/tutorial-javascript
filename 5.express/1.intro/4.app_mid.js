const express = require('express');
const app = express();
const port = 3000;

// Express의 미들웨어 처리 방식
// 1. 순서대로 실행: app.use()로 추가된 미들웨어는 작성된 순서대로 실행됩니다. 
//    이는 미들웨어가 요청을 가로채고 next()를 호출하기 전까지 요청이 다음 단계로 넘어가지 않는 구조이기 때문입니다.
// 2. next() 호출: 미들웨어에서 next() 함수를 호출하면 다음 미들웨어로 요청이 넘어갑니다. 
//    만약 next()를 호출하지 않으면 요청이 그 지점에서 멈추고, 이후의 미들웨어나 라우터로 전달되지 않습니다.
// 3. 에러 처리 미들웨어: 에러 처리 미들웨어는 일반적으로 모든 라우트와 미들웨어 정의 마지막에 위치하며, 앞의 모든 미들웨어와 라우트가 실행된 후에 호출됩니다.


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
