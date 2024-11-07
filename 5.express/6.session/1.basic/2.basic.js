// # 세션을 시작하고 세션 ID를 쿠키로 받아오기
// curl --cookie-jar cookie.txt http://localhost:3000/

// # 이전에 받은 쿠키를 사용하여 서버에 요청하기
// curl --cookie cookie.txt http://localhost:3000/readcookie

const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

app.use(cookieParser());

app.get('/', (req, res) => {
    // 클라이언트에게 쿠키 설정 - 1분 (60000ms = 60초) 동안 유효한 쿠키
    res.cookie('mycookie', 'test', { maxAge: 60000 });
    // res.cookie('username', 'user1', { maxAge: 90000 });
    // res.cookie('cart', ['사과우유', '딸기우유', '바나나우유'], {maxAge: 120000});

    // 응답 전송
    res.send('Cookie has been set for 1 minute!');
});

app.get('/readcookie', (req, res) => {
    // 클라이언트로부터 쿠키 읽기 - 미들웨어를 통해 cookies에 셋업
    const myCookie = req.cookies.mycookie;
    // const {mycookie, username, cart } = req.cookies;

    // 응답 전송
    res.send(`Value of mycookie: ${myCookie}`);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
