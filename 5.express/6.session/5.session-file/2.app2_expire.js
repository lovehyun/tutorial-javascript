// npm install express-session session-file-store
const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const path = require('path');

const app = express();
const port = 3000;

// 세션 설정
app.use(
    // ttl과 reapInterval 옵션을 설정하지 않으면 session-file-store에 저장된 세션 파일은 자동으로 삭제되지 않고 계속 남아 있게 됩니다. 
    // 기본적으로 session-file-store는 만료된 세션 파일을 관리하는 메커니즘을 제공하지 않으므로, 만료된 세션 파일을 수동으로 정리하거나 ttl과 reapInterval 옵션을 설정해야 합니다.

    session({
        store: new FileStore({
            path: path.join(__dirname, '/my-sessions'), // 세션 파일이 저장될 경로
            ttl: 3600, // 세션 파일의 유효 기간 (초 단위, 여기서는 1시간)
            reapInterval: 3600 // 만료된 세션 파일을 정리하는 간격 (초 단위, 여기서는 1시간)
        }),
        secret: 'mySecretKey', // 세션 암호화를 위한 비밀 키
        resave: false, // 세션 데이터가 변경되지 않아도 다시 저장할지 여부
        saveUninitialized: true, // 초기화되지 않은 세션을 저장할지 여부
        cookie: { maxAge: 60 * 60 * 1000 } // 쿠키 유효 기간: 1시간
    })
);

// 방문 횟수 확인 예제
app.get('/', (req, res) => {
    req.session.visitCount = (req.session.visitCount || 0) + 1;
    res.send(`방문 횟수: ${req.session.visitCount}`);
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
