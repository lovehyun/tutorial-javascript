// post_server.js
const express = require('express');
const app = express();
const port = 3001;

// x-www-form-urlencoded 폼 데이터 파싱
// MIME 타입: application/x-www-form-urlencoded  (타입/서브타잆)
app.use(express.urlencoded({ extended: false }));

// 예: POST http://127.0.0.1:3001/login
// body: userid=abc&password=1234
app.post('/login', (req, res) => {
    const userid = req.body.userid;
    const password = req.body.password;

    console.log('=== Request Headers ===');
    console.log(req.headers);

    res.send(`아이디: ${userid}, 비밀번호: ${password}`);
});

app.listen(port, () => {
    console.log(`POST 서버가 포트 ${port}에서 실행 중입니다.`);
});
