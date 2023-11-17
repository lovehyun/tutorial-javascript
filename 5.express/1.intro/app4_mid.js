const express = require('express');
const app = express();
const port = 3000;

// requestTime 미들웨어 함수
var requestTime = function (req, res, next) {
    req.requestTime = Date.now();
    next();
};

// myLogger 미들웨어 함수
var myLogger = function (req, res, next) {
    // console.log('LOGGED: ', req.requestTime);
    const date = new Date(req.requestTime);
    const formattedTime = date.toLocaleString();
    console.log("LOGGED: ", formattedTime);
    next();
};

// 미들웨어 체이닝
app.use(requestTime);
app.use(myLogger);

// 루트 경로에 대한 요청 처리
app.get('/', (req, res) => {
    var responseText = 'Hello, World! ';
    responseText += 'Requested at: ' + req.requestTime;
    res.send(responseText);
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
