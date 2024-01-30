// npm install express body-parser nunjucks multer sharp

// npm install debug
// bash: DEBUG=myapp node app2
// cmd: set DEBUG=myapp && node app2
// cmd: set DEBUG=myapp:mod1,myapp:mod2,myapp:mod3 등 여러개 등록도 가능함. (prefix match 는 myapp:* 으로 가능 함.)

// new를 사용하여 내부에서 모듈을 세분화 하여 정의 할수도 있음
const debug = require("debug");
const debugS = new debug('myapp:server');
const debugU = new debug('myapp:upload');
const debugR = new debug('myapp:request');

const express = require('express');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
// const debug = require('debug')('myapp');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    // 디버그 로그 출력
    debugR(req.method, req.originalUrl);
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

// 디버그 로그 출력 설정
// debug.enabled = true;

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
    res.render('index3', { posts });
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
    
    // 원본 이미지 및 썸네일 경로
    const filename = filePath ? `${req.file.filename}` : null;
    const thumbnailPath = filePath ? `thumbnails/thumb_${req.file.filename}` : null;

    posts.push({ title, content, date, filePath, filename, thumbnailPath });
    debugU(posts);

    // 썸네일 생성
    if (filePath) {
        sharp(filePath)
            .resize(100) // 썸네일 크기 조절
            .toFile(`public/${thumbnailPath}`, (err, info) => {
                if (err) {
                    console.error(err);
                }
            });
    }
    
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

    // 업로드한 파일 및 썸네일 삭제
    if (post.filePath) {
        filePath = path.join(__dirname, post.filePath);
        fs.unlinkSync(filePath);
    }
    if (post.thumbnailPath) {
        thumbnailPath = path.join(__dirname, 'public', post.thumbnailPath);
        fs.unlinkSync(thumbnailPath);
    }
    
    posts.splice(index - 1, 1);
    res.redirect('/');
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    debugS('Server is ready...');
});
