// server.js
const express = require('express');
const app = express();
const PORT = 3000;

// JSON 바디 파싱
app.use(express.json());

/****************************************
 * 1) 데모용 인메모리 데이터
 ****************************************/
let users = [
    { id: 1, name: 'Alice', role: 'admin' },
    { id: 2, name: 'Bob', role: 'user' },
];
let nextUserId = 3;

/****************************************
 * 2) 기본 Express 메서드 체이닝 예제
 ****************************************/

// GET /basic/plain
// status → type → set → send 체이닝
app.get('/basic/plain', (req, res) => {
    res
        .status(200)
        .type('text/plain')
        .set('X-Demo', 'PlainText')
        // .set('X-Powered-By', 'GenAI Labs')
        .send('This is a plain text response.\n');
});

// GET /basic/json
// status → json 체이닝
app.get('/basic/json', (req, res) => {
    res
        .status(200)
        .json({ message: 'Hello from /basic/json', time: new Date().toISOString() });
});

// GET /basic/cookie
// status → cookie → json 체이닝
app.get('/basic/cookie', (req, res) => {
    // cookie 사용하려면 express-session 또는 cookie-parser를 쓰는게 일반적이지만
    // 여기선 단순 데모용으로만 사용 (Express의 res.cookie 사용)
    res
        .status(200)
        // .set('X-App', 'MyServer')
        // .type('json')
        .cookie('demo', '1234', { httpOnly: true })
        .json({ message: 'Cookie set!' });
});

/****************************************
 * 5) 서버 시작
 ****************************************/
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

/*
2-1. 기본 메서드 체이닝 테스트: 
1) /basic/plain
curl -i http://localhost:3000/basic/plain

2) /basic/json
curl -i http://localhost:3000/basic/json

3) /basic/cookie
curl -i http://localhost:3000/basic/cookie

*/
