const express = require('express');
const morgan = require('morgan');

const app = express();
const PORT = 3000;

// 가상의 데이터 배열
// const data = Array.from({ length: 200 }, (_, i) => `Item ${i + 1}`);
const data = Array.from({ length: 200 }, (_, i) => `Item ${(i + 1).toString().padStart(3, '0')}`);

// 무한스크롤에 필요한 데이터 반환
function getItems(start, end) {
    return data.slice(start, end);
}

// filter
// function getItems(start, end) {
//     return data.filter((_, index) => index >= start && index < end);
// }

// legacy for style
// function getItems(start, end) {
//     const items = [];
//     for (let i = start; i < end && i < data.length; i++) {
//         items.push(data[i]);
//     }
//     return items;
// }


// app.use(morgan('dev'));

// legacy mylogger
/*
function mylogger(req, res, next) {
    const now = new Date().toISOString();   // 현재 시간 (ISO 형식)
        const method = req.method;              // GET, POST, ...
        const path = req.originalUrl;           // 요청 URL 경로
        console.log(`[${now}] ${method} ${path}`);
        next(); // 다음 미들웨어/라우터로 넘기기
}
app.use(mylogger);
*/

// function mylogger() {
function mylogger(option) {
    // 여기서 필요한 설정 처리 가능 (예: 로그 레벨 등)
    // 이 입력받은 인자와 아래 함수가 합쳐서 클로저(Closure)가 됨.
    return function (req, res, next) {
        const now = new Date().toISOString();
        console.log(`[${now}] ${option} [${req.method}] [${req.originalUrl}]`);
        next(); // 여기서 직접 호출
    };
}
app.use(mylogger('dev'));


app.use(express.static('public'));

app.get('/get-items', (req, res) => {
    const { start, end } = req.query;

    // start와 end를 받아 해당 범위의 데이터를 반환
    const items = getItems(parseInt(start), parseInt(end));

    // 클라이언트로 데이터 전송
    res.json(items);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
