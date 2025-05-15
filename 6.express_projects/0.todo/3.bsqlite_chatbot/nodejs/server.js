const express = require('express');
const morgan = require('morgan');
const path = require('path');

const todoRoutes = require('./routes/todoRoutes');
// const chatbot = require('./services/chatbot_external');
const chatbot = require('./services/chatbot_self');

const app = express();
const PORT = 3000;

// 미들웨어 설정
app.use(morgan('dev'));
app.use(express.json());

// 정적 파일 및 라우터 연결
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index3_axios_chatbot.html'));
});

// 라우터 연결
app.use(todoRoutes);
app.use(chatbot);

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
