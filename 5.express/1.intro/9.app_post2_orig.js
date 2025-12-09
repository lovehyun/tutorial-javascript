const express = require('express');
// const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// JSON / x-www-form-urlencoded 미들웨어 (submit2에서 사용)
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// POST 라우트 - 수동 바디 파싱 (JSON X, urlencoded 수동 처리만)
app.post('/submit', (req, res) => {
    let data = '';

    // 데이터를 수신할 때마다 호출되는 이벤트 핸들러
    req.on('data', (chunk) => {
        data += chunk.toString();
    });

    // 데이터 수신이 완료되었을 때 호출되는 이벤트 핸들러
    req.on('end', () => {
        // 여기서는 JSON.parse 같은 거 안 쓰고,
        // body 전체 문자열을 직접 urlencoded 형식으로 파싱만 함
        const params = new URLSearchParams(data);        // name=홍길동&age=30
        const obj = Object.fromEntries(params.entries()); // { name: '홍길동', age: '30' }

        res.json({
            receivedData: obj,
            raw: data,
            via: 'manual_urlencoded_parse'
        });
    });
});

// POST 라우트 - 미들웨어를 통한 처리
app.post('/submit2', (req, res) => {
    const jsonData = req.body; // express.json / express.urlencoded 에 의해 파싱된 데이터
    console.log(jsonData);
    res.json({ receivedData: jsonData, via: 'middleware_req.body' });
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
