const express = require('express');
const morgan = require('morgan');
const cors = require('cors'); // cors 모듈 추가

const app = express();
const port = 5000;

// 예시로 반환할 데이터
const data = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
];

app.use(morgan('dev'));

// CORS 허용 설정
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });

// CORS 설정 (위 동일한 내용을 cors 모듈을 통해서 설정)
app.use(cors({
    origin: 'http://localhost:3000', // 허용할 도메인
    methods: 'GET', // 허용할 HTTP 메소드
    optionsSuccessStatus: 204, // No Content 상태로 응답
}));

// API 엔드포인트
app.get('/api/data', (req, res) => {
    res.json(data);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
