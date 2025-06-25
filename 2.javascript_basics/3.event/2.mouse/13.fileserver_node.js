// npm install express multer

const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

// 파일 저장 경로 및 파일명 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // 업로드 폴더
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // 파일명 중복 방지
    }
});

const upload = multer({ storage: storage });

// 정적 파일 서비스 (HTML 실행을 위해)
app.use(express.static(__dirname));

// 파일 업로드 처리
app.post('/upload', upload.array('files[]'), (req, res) => {
    console.log('업로드된 파일:', req.files);
    res.send('파일 업로드 성공!');
});

app.listen(port, () => {
    console.log(`서버 실행 중: http://localhost:${port}`);
});
