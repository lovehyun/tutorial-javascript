// npm install ejs
const express = require('express');
const app = express();

// EJS를 뷰 엔진으로 설정
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    // 뷰엔진 등록 후 render 함수 사용 가능
    res.render('index', { title: 'Express 앱', message: 'EJS를 사용 중입니다.' });
});

const port = 3000;
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
