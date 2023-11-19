// # 세션을 시작하고 세션 ID를 쿠키로 받아오기
// curl -c cookie.txt http://localhost:3000

// # 이전에 받은 쿠키를 사용하여 서버에 요청하기
// curl -b cookie.txt http://localhost:3000

const express = require('express');
const session = require('express-session');

const app = express();
const port = 3000;

// 세션 설정
app.use(
    session({
        secret: 'mySecretKey', // 세션 데이터를 암호화하기 위한 비밀 키
        resave: false, // 세션 데이터가 변경되지 않아도 다시 저장할지 여부
        saveUninitialized: true, // 초기화되지 않은 세션을 저장소에 저장할지 여부
    })
);

// 미들웨어: 세션을 이용하여 사용자 방문 횟수 추적
app.use((req, res, next) => {
    // 세션에 visitCount가 없으면 0으로 초기화
    req.session.visitCount = req.session.visitCount || 0;

    // 방문 횟수 증가
    req.session.visitCount++;

    // 세션 정보 출력
    console.log('Session ID:', req.sessionID);
    console.log('Session Info: ', req.session);

    next();
});

// 라우트: 세션을 사용하여 방문 횟수 표시
app.get('/', (req, res) => {
    res.send(`방문 횟수: ${req.session.visitCount}`);
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
