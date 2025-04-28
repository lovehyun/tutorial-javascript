// 클라이언트 → 라우터 (routes) → 컨트롤러 (controllers) → 모델 (models) → DB (sqlite3)
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const path = require('path');
const routes = require('./routes'); // 그냥 routes 폴더만 부르면 index.js 자동 인식

const app = express();

// 리버스 프록시 신뢰
app.set('trust proxy', true);

// 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));

// 라우터 연결
app.use('/api', routes);

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}번에서 실행 중입니다.`);
});
