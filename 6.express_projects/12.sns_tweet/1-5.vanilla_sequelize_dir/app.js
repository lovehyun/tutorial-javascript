const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const path = require('path');

// const { sequelize } = require('./models'); // models/index.js를 불러옴
const { sequelize, testConnection } = require('./config/database'); // testConnection 으로 인해 직접 불러옴

// const apiRoutes = require('./routes/api(OLD)');
const apiRoutes = require('./routes');     // routes/index.js를 불러옴

const app = express();

// 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
}));
app.use(express.static(path.join(__dirname, 'public')));

// API 경로 연결
app.use('/api', apiRoutes);

// 서버 시작
const PORT = process.env.PORT || 3000;

async function startServer() {
    await testConnection();              // <-- DB 연결 먼저 확인
    await sequelize.sync();              // <-- 모델 테이블 동기화
    app.listen(PORT, () => {
        console.log(`서버가 포트 ${PORT}번에서 실행 중입니다.`);
    });
}

startServer();
