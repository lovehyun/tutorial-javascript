// npm install express dotenv axios cors

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require("path");
const searchRoutes = require('./routes/search');

// 환경 변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(morgan('dev'));
app.use(cors()); // React와 통신을 위한 CORS 설정
app.use(express.json()); // JSON 요청 바디 파싱

// React 정적 파일 제공
// app.use(express.static(path.join(__dirname, "../client/build")));
// app.get("*", (req, res) => { res.sendFile(path.join(__dirname, "../client/build/index.html")); });

// 라우터 설정
app.use('/api/search', searchRoutes);

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
