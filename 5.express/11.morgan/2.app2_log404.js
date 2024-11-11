// 조건에 따라 일부 로그 skip

const express = require('express');
const morgan = require('morgan');

const app = express();
const port = 3000;

// 예제: 상태 코드가 404인 경우 로깅을 스킵 or 404인 경우에만 로깅 (즉 404가 아닌 경우 skip)
app.use(morgan('combined', {
    skip: (req, res) => res.statusCode === 404, // 404만 제외
    // skip: (req, res) => res.statusCode !== 404, // 404만 로깅
    // skip: (req, res) => res.statusCode < 200 || res.statusCode >= 300, // 200번대만 로깅
}));

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
