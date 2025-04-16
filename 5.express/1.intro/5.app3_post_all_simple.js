const express = require('express');
const path = require('path');
const multer = require('multer');

const app = express();
const port = 3000;

// 정적 파일 서비스 (test.html 같은 프론트엔드 테스트용 파일 포함 가능)
app.use(express.static(path.join(__dirname, 'public')));

// Content-Type 기반 동적 파서 적용 미들웨어
app.use((req, res, next) => {
    const type = req.headers['content-type'];

    if (!type) return next();

    if (type.includes('application/json')) {
        express.json()(req, res, next);
    } else if (type.includes('application/x-www-form-urlencoded')) {
        express.urlencoded({ extended: true })(req, res, next);
    } else if (type.includes('text/plain')) {
        express.text()(req, res, next);
    } else if (type.includes('application/octet-stream')) {
        express.raw({ type: 'application/octet-stream' })(req, res, next);
    } else {
        next(); // multipart/form-data 같은 경우는 개별 route에서 multer 사용
    }
});

// RAW 데이터 처리 (Buffer)
app.post('/submit-raw', express.raw({ type: 'application/octet-stream' }), (req, res) => res.json({ type: 'RAW', buffer: req.body, bufferString: req.body.toString('utf8') }));

// JSON
app.post('/submit-json', (req, res) => res.json({ type: 'JSON', body: req.body }));

// Form-urlencoded
app.post('/submit-form', (req, res) => res.json({ type: 'FORM', body: req.body }));

// Plain text
app.post('/submit-text', (req, res) => res.json({ type: 'TEXT', body: req.body }));

// Multipart/form-data (파일 업로드)
const upload = multer({ dest: 'uploads/' });
app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ type: 'MULTIPART', file: req.file, fields: req.body });
});

// 테스트용 HTML 페이지 경로
app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'test.html'));
});

// 서버 실행
app.listen(port, () => {
    console.log(`🚀 서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
