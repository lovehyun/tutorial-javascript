// /your_project_directory
// ├── public
// │   └── images
// │       └── example.jpg
// ├── app.js
// └── package.json

const express = require('express');
const app = express();
const port = 3000;

// 정적 파일을 제공할 디렉터리를 정의합니다.
app.use(express.static('public'));

// 루트 경로에 대한 예제 라우트
app.get('/', (req, res) => {
    res.send(`
      <html>
        <head>
          <title>이미지 예제</title>
        </head>
        <body>
          <h1>이미지 예제</h1>
          <!-- 이미지 파일을 img 태그를 사용하여 렌더링합니다. -->
          <img src="/images/cats.jpg" alt="예제 이미지">
        </body>
      </html>
  `);
});

// 서버를 시작합니다.
app.listen(port, () => {
    console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
