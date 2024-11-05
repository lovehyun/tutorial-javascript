// 조건에 따라 일부 로그 skip

const express = require('express');
const morgan = require('morgan');

const app = express();
const port = 3000;

// 예제: 상태 코드가 404인 경우 로깅을 스킵
app.use(morgan('combined', {
    skip: (req, res) => res.statusCode === 404,
}));

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
