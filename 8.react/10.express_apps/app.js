const express = require('express');
const path = require('path');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'build')));

// 모든 요청에 대해 index.html 제공
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
