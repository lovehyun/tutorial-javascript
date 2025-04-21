const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// public 폴더를 정적 파일 폴더로 설정
app.use(express.static(path.join(__dirname, 'public')));

// 루트 요청 시 index.html 반환
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Express 프론트엔드 서버 실행 중: http://localhost:${PORT}`);
});
