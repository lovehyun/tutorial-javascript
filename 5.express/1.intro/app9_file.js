const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// 정적 파일을 제공할 디렉터리를 정의합니다.
app.use(express.static('public'));

// 루트 경로에 대한 예제 라우트
app.get('/', (req, res) => {
    // hello.html 파일의 경로를 만듭니다.
    const htmlFilePath = path.join(__dirname, 'public', 'index.html');

    // 파일을 비동기적으로 읽습니다.
    fs.readFile(htmlFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('파일 읽기 오류:', err);
            res.status(500).send('서버 오류');
            return;
        }

        // 읽은 파일 내용을 클라이언트에게 전송합니다.
        res.send(data);
    });
});

// 서버를 시작합니다.
app.listen(port, () => {
    console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
