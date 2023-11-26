const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

// CORS 미들웨어 추가 - 모든 크로스 도메인 허용
app.use(cors());

// const corsOptions = {
//     origin: 'http://127.0.0.1:3000', // 허용할 클라이언트의 주소
//     optionsSuccessStatus: 200, // CORS 요청 성공 시 상태 코드 (204가 기본값)
// };
// app.use(cors(corsOptions));

app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from the Express server!' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
