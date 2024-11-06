// bash: curl -X POST -H "Content-Type: application/json" -d '{"name": "John", "age": 30}' http://127.0.0.1:3000/submit
// cmd: curl -X POST -H "Content-Type: application/json" -d "{\"name\": \"John\", \"age\": 30}" http://127.0.0.1:3000/submit

const express = require('express');
// const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// JSON 데이터 파싱 미들웨어 추가
// app.use(bodyParser.json());
app.use(express.json());

// POST 라우트
app.post('/submit', (req, res) => {
    let data = '';

    // 데이터를 수신할 때마다 호출되는 이벤트 핸들러
    req.on('data', (chunk) => {
        data += chunk.toString();
    });

    // 데이터 수신이 완료되었을 때 호출되는 이벤트 핸들러
    req.on('end', () => {
        try {
            const jsonData = JSON.parse(data);
            res.json({ receivedData: jsonData });
            // res.status(201).end();
        } catch (error) {
            res.status(400).json({ error: '잘못된 JSON 형식' });
        }
    });
});

// POST 라우트 - 미들웨어를 통한 처리
app.post('/submit2', (req, res) => {
    const jsonData = req.body; // req.body에 파싱된 JSON 데이터가 들어 있습니다.
    console.log(jsonData);
    res.json({ receivedData: jsonData });
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
