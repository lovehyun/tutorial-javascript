// # 세션을 시작하고 세션 ID를 쿠키로 받아오기
// curl -c cookie.txt http://localhost:3000

// # 이전에 받은 쿠키를 사용하여 서버에 요청하기
// curl -b cookie.txt http://localhost:3000

// connect.sid
// s%3AotyQHFqoDNCN-Lmsop4IGuMG50b7Dv-B.z82XYsNQ7xlBhnagGYLm5J8ORxEaGokBM1BquBYLsr0]
// s:{세션 데이터(id)}.{서명(hmac)}

const express = require('express');
const session = require('express-session');

const app = express();
const port = 3000;

// 세션 설정 - 세션 데이터는 서버에 메모리에 암호화 되어 저장
app.use(session({
    secret: 'mySecretKey', // 세션 데이터를 암호화하기 위한 비밀 키
    resave: false, // 세션 데이터가 변경되지 않아도 다시 저장할지 여부
    saveUninitialized: true, // 초기화되지 않은 세션을 저장소에 저장할지 여부
}));


// 라우트: 세션을 사용하여 방문 횟수 표시
app.get('/', (req, res) => {
    req.session.username = 'user1';
    req.session.cart = ['사과우유', '딸기우유', '바나나우유'];

    // 자동으로 set-cookie 통해서 connect.sid 전송됨

    res.send(`방문 횟수: ${req.session.visitCount}`);

    // res.send(`세션ID: ${req.sessionID}, 세션데이터:${JSON.stringify(req.session)}`);
});

// 세션에서 사용자 정보를 읽어오는 라우트
app.get('/readsession', (req, res) => {
    const username = req.session.username;
    const cart = req.session.cart;

    if (username && cart) {
        res.send(`사용자 이름: ${username}, 장바구니: ${cart.join(', ')}`);
    } else {
        res.send('저장된 사용자 정보가 없습니다.');
    }
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
