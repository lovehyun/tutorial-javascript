// npm install express express-session connect-sqlite3 sqlite3
const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

const app = express();
const port = 3000;

// 세션 설정
app.use(
    session({
        // 폴더는 수동으로 생성해야 함
        store: new SQLiteStore({ db: 'sessions.sqlite', dir: './db' }), // 세션 저장소 설정
        secret: 'mySecretKey', // 세션 암호화를 위한 비밀 키
        resave: false, // 세션 데이터가 변경되지 않아도 다시 저장할지 여부
        saveUninitialized: true, // 초기화되지 않은 세션을 저장할지 여부
        cookie: { maxAge: 60 * 60 * 1000 } // 쿠키 유효 기간: 1시간
    })
);

app.get('/', (req, res) => {
    req.session.visitCount = (req.session.visitCount || 0) + 1;
    res.send(`방문 횟수: ${req.session.visitCount}`);
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
