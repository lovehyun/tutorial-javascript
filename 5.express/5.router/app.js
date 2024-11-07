const express = require('express');
const app = express();

// 라우터 모듈 불러오기
const userRouter = require('./userRouter');
const productRouter = require('./productRouter');
const cartRouter = require('./cartRouter');

// JSON 데이터와 URL-encoded 데이터를 파싱하는 미들웨어 추가
app.use(express.json()); // JSON 형식의 요청 본문을 파싱
app.use(express.urlencoded({ extended: true })); // URL-encoded 형식의 요청 본문을 파싱

// 각 라우터를 애플리케이션에 연결
app.use('/user', userRouter);
app.use('/product', productRouter);
app.use('/cart', cartRouter);

// 기본 루트에 대한 라우트
app.get('/', (req, res) => {
    res.send('Welcome to the main page!');
});

// 서버를 3000번 포트에서 실행
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
