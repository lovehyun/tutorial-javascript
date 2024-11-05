// npm install express nunjucks multer sharp

const express = require('express');
const nunjucks = require('nunjucks');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    next();
});

app.set('view engine', 'html');
nunjucks.configure('views', {
    autoescape: true,
    express: app,
}).addFilter('formatPostDate', function(date) {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Date(date).toLocaleDateString('ko-KR', options); // 또는 en-US
});

let posts = [];

// 파일 업로드를 위한 설정
const upload = multer({ 
    dest: 'public/uploads/',
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB 제한 예시
    fileFilter: (req, file, cb) => {
        // 파일 형식 체크(이미지만 허용)
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
    }
});

// 루트 경로
app.get('/', (req, res) => {
    res.render('index2', { posts });
});

// 글 작성 폼
app.get('/write', (req, res) => {
    res.render('write2');
});

// 글 작성 처리, upload.single('photo') 는 input form 의 name 속성과 일치해야함.
app.post('/write', upload.single('photo'), (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const date = new Date();

    // 업로드한 파일의 경로
    const filePath = req.file ? req.file.path : null;
    const filename = filePath ? `${req.file.filename}` : null;

    posts.push({ title, content, date, filePath, filename });

    res.redirect('/');
});

// 원본 이미지 보기
app.get('/images/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, 'public', 'uploads', filename);

    res.setHeader('Content-Type', 'image/jpeg');
    res.sendFile(filepath);
});

// 글 삭제 처리
app.post('/delete/:index', (req, res) => {
    const index = req.params.index;
    const post = posts[index - 1];

    // 업로드한 파일 삭제
    if (post.filePath) {
        filePath = path.join(__dirname, post.filePath);
        fs.unlinkSync(filePath);
    }
    
    posts.splice(index - 1, 1);
    res.redirect('/');
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
