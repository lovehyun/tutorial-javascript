// bash: curl -X POST -H "Content-Type: application/json" -d '{"name": "John", "age": 30}' http://127.0.0.1:3000/submit
// cmd: curl -X POST -H "Content-Type: application/json" -d "{\"name\": \"John\", \"age\": 30}" http://127.0.0.1:3000/submit

const express = require('express');
// const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// JSON 데이터 파싱 미들웨어 추가
// app.use(bodyParser.json());
app.use(express.json());

// URL 인코딩 파싱 (express.urlencoded() / bodyParser.urlencoded()):
// 1. express.json(): JSON 형식의 요청 본문을 파싱하고, req.body에 객체 형태로 담아줍니다.
// 2. express.urlencoded(): URL-encoded 형식의 요청 본문을 파싱하고, req.body에 객체 형태로 담아줍니다.
//    application/x-www-form-urlencoded 형식의 데이터를 파싱합니다. HTML 폼에서 데이터를 전송할 때 이 형식을 사용합니다.
//    옵션 extended는 true 또는 false로 설정할 수 있습니다:
//    true: qs 라이브러리를 사용해 중첩된 객체를 지원합니다.
//    false: querystring 모듈을 사용해 단순한 키-값 쌍으로 파싱합니다.


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
