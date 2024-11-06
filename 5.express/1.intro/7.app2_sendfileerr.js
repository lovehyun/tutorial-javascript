const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// 정적 파일을 제공할 디렉터리를 정의합니다.
app.use(express.static('public'));

// 루트 경로에 대한 예제 라우트
app.get('/', (req, res, next) => {
    // hello.html 파일의 경로를 만듭니다.
    const htmlFilePath = path.join(__dirname, 'public', 'index.html');

    // 파일을 클라이언트에게 전송합니다.
    // res.sendFile(htmlFilePath);

    // 파일 오류 시 오류 메세지 커스터마이징
    res.sendFile(htmlFilePath, (err) => {
        if (err) {
            console.error('파일 전송 오류:', err);
            // 에러를 생성하고, 다음 미들웨어로 전달
            next(new Error('파일을 찾을 수 없습니다.'));
        }
    });
});

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
    console.error('에러 발생:', err.message); // 콘솔에 에러 로그
    res.status(500).json({ message: '서버 내부 오류가 발생했습니다.' }); // 클라이언트에 응답
});

// 서버를 시작합니다.
app.listen(port, () => {
    console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
