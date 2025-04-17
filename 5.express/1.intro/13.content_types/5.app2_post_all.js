const express = require('express');
const path = require('path');

const xmlparser = require('express-xml-bodyparser');
const js2xmlparser = require('js2xmlparser');

const app = express();
const port = 3000;

// 정적 파일 서비스 (test.html 같은 프론트엔드 테스트용 파일 포함 가능)
app.use(express.static(path.join(__dirname, 'public')));

// JSON 데이터 파싱 미들웨어 추가: Content-Type: application/json
// 예시: { "name": "John", "age": 30 }
app.use(express.json());

// 폼데이터 파싱 미들웨어 추가: Content-Type: application/x-www-form-urlencoded
// 예시: name=John&age=30, (extended: true = qs모듈 사용 (중첩된 구조 지원), false = querystring 모듈 사용 (단순한 key-value만))
app.use(express.urlencoded({ extended: true }));

// 일반 문자열 파싱 미들웨어 추가: Content-Type: text/plain
// 예시: Just a plain text
app.use(express.text());

// 지정한 특정 포멧 파싱 미들웨어 추가: Content-Type: application/octet-stream
// req.body 는 Buffer 형태
app.use(express.raw({ type: 'application/octet-stream'}));

// XML 요청 본문 파싱 미들웨어 추가: Content-Type: application/xml
app.use(xmlparser());

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

// bash: curl -X POST http://localhost:3000/submit-json -H "Content-Type: application/json" -d '{"name": "John", "age": 30}'
// cmd: curl -X POST http://localhost:3000/submit-json -H "Content-Type: application/json" -d "{\"name\": \"John\", \"age\": 30}"
app.post('/submit-json', (req, res) => {
    const jsonData = req.body; // req.body에 파싱된 JSON 데이터가 들어 있음
    console.log(jsonData);
    
    // res.status(201).end(); // 헤더만 보내고 바디 없음
    // res.status(201).send(); // 헤더와 빈 바디를 보냄 (Content-length: 0)
    // res.status(201).send('Created'); // 헤더를 보내고 바디에 "Created" 를 글자로 담아서 보냄
    // res.sendStatus(201); // 상동 (축약함수)
    // res.status(201).json({ message: "Resource created successfully" }); // 헤더와 메세지

    res.json({ type: 'JSON', body: jsonData }); // 200 헤더와 바디
});

// bash/cmd: curl -X POST http://localhost:3000/submit-form -H "Content-Type: application/x-www-form-urlencoded" -d "name=John&age=30"
app.post('/submit-form', (req, res) => {
    const formData = req.body; // req.body에 파싱된 formData (key-value) 데이터가 들어 있음
    console.log(formData);
    res.json({ type: 'URL-ENCODED', body: formData });
});

// bash/cmd: curl -X POST http://localhost:3000/submit-text -H "Content-Type: text/plain" -d "Just a plain text message."
app.post('/submit-text', (req, res) => {
    const textData = req.body; // req.body에 파싱된 textData 데이터가 들어 있음
    console.log(textData);
    res.json({ type: 'TEXT', body: textData });
});

// bash/cmd: curl -X POST http://localhost:3000/submit-raw -H "Content-Type: application/octet-stream" --data-binary @yourfile.bin
// bash/cmd: echo "raw binary" | curl -X POST http://localhost:3000/submit-raw -H "Content-Type: application/octet-stream" --data-binary @-
app.post('/submit-raw', express.raw({ type: 'application/octet-stream' }), (req, res) => {
    const rawData = req.body;
    console.log(rawData);

    res.json({
        type: 'RAW',
        length: req.body.length,
        buffer: req.body,
        bufferString: req.body.toString('utf8')
    });
});

// bash/cmd: curl -X POST http://localhost:3000/upload -F "file=@test.jpg" -F "name=John"
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
    res.json({
        type: 'MULTIPART',
        file: req.file,
        fields: req.body
    });
});

// bash: curl -X POST http://localhost:3000/submit-xml -H "Content-Type: application/xml" -d '<user><name>홍길동</name><age>30</age></user>'
//      curl -X POST http://localhost:3000/submit-xml -H "Content-Type: application/xml; charset=utf-8" --data-binary '<user><name>홍길동</name><age>30</age></user>'
// cmd: curl -X POST http://localhost:3000/submit-xml -H "Content-Type: application/xml; charset=utf-8" -d "<user><name>홍길동</name><age>30</age></user>"
//      xml 데이터를 utf-8로 payload.xml 에 저장
//      curl -X POST http://localhost:3000/submit-xml -H "Content-Type: application/xml; charset=utf-8" --data-binary "@payload.xml"

// XML 요청 처리 예시
app.post('/submit-xml', (req, res) => {
    const xmlData = req.body;
    console.log('받은 XML 데이터 (의 JS객체(JSON형태)):', xmlData);

    // JSON → XML로 응답하기
    const responseData = {
        message: 'XML 처리 완료',
        received: xmlData
    };

    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.send(js2xmlparser.parse('response', responseData));
});

// 테스트용 HTML 페이지 경로
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index5_posts.html'));
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
