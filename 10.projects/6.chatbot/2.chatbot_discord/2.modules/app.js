require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

// Discord 클라이언트를 초기화 (이벤트 핸들러 등록 포함)
require('./discord/discord');

// 라우트 파일 가져오기
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const adminRoutes = require('./routes/admin');
const helpRoutes = require('./routes/help');

// 익스프레스 앱 설정
const app = express();

app.use(cors());
app.use(express.json());

// API 라우트 설정
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/help', helpRoutes);
app.use('/api/admin', adminRoutes);

// 사용자 페이지 제공
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 관리자 페이지 제공
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin', 'admin.html'));
});

// 정적 페이지 제공
app.use(express.static(path.join(__dirname, 'public')));

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
