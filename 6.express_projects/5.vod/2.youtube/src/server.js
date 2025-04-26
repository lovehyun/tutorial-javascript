// src/server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const videoRoutes = require('./routes/videoRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// 업로드 폴더 생성 확인
const uploadDir = path.join(__dirname, '../public/uploads/videos');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 라우트 설정
app.use('/api/videos', videoRoutes);
app.use('/api/users', userRoutes);

// HTML 파일 서빙을 위한 라우트
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/home.html'));
});

app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/upload.html'));
});

app.get('/video/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/video.html'));
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
