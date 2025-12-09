// get_server.js
const express = require('express');
const app = express();
const port = 3000;

// const path = require('path');
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

// 예: http://127.0.0.1:3000/submit?name=홍길동&age=30
app.get('/submit', (req, res) => {
    const name = req.query.name;
    const age = req.query.age;

    res.send(`이름: ${name}, 나이: ${age}`);
});

app.listen(port, () => {
    console.log(`GET 서버가 포트 ${port}에서 실행 중입니다.`);
});
