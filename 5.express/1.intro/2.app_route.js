const express = require('express');
const app = express();
const port = 3000;

// 루트 경로에 대한 요청 처리
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/', (req, res) => {
    res.send('Got a POST request');
});

app.put('/user', (req, res) => {
    res.send('Got a PUT request at /user');
});

app.delete('/user', (req, res) => {
    res.send('Got a DELETE request at /user');
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
