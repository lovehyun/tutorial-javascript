require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const routes = require('./routes/routes');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(morgan('dev'));

// 라우트 설정
app.use(routes);

// 서버 실행
app.listen(PORT, () => {
    console.log(`서버 실행 중: http://localhost:${PORT}`);
});
