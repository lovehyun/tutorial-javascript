const express = require('express');
const app = express();

// 라우터 모듈 불러오기
const userRouter = require('./userRouter');
const productRouter = require('./productRouter');
const cartRouter = require('./cartRouter');

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
