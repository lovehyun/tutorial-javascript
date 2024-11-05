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
    console.log('LOGGED: ', formattedTime);
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

// ----------------------------------------------
// about 요청 핸들러에 미들웨어들 추가
app.get('/about', 함수1, 함수2, 함수3, 함수4, (req, res) => {
    // 라우트 핸들러에서 수행할 작업
    res.send('GET 요청이 왔어요!');
});

// 미들웨어 1
function 함수1(req, res, next) {
    console.log('미들웨어 1');
    next();
}

// 미들웨어 2
function 함수2(req, res, next) {
    console.log('미들웨어 2');
    next();
}

// 미들웨어 3
function 함수3(req, res, next) {
    console.log('미들웨어 3');
    next();
}

// 미들웨어 4
function 함수4(req, res, next) {
    console.log('미들웨어 4');
    next();
}

// ----------------------------------------------
// 서버 시작
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
