const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let posts = [];

const upload = multer({
    dest: 'public/uploads/',
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('이미지 파일만 업로드할 수 있습니다.'), false);
        }
        cb(null, true);
    }
});

// 저장 파일명 유지/수정
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/uploads/');
//     },
//     filename: (req, file, cb) => {
//         // 원래 파일명 유지 (위험: 같은 이름 덮어쓰기 주의)
//         cb(null, file.originalname);

//         const filename = `${Date.now()}_${file.originalname}`;
//         cb(null, filename);
//     }
// });

// const upload = multer({ storage });

// 메인 라우트
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index2.html'));
});

// 모든 게시글 조회
app.get('/api/posts', (req, res) => {
    res.json(posts.map((post, index) => ({ id: index + 1, ...post })));
});

// 새 글 작성
app.post('/api/posts', upload.single('photo'), (req, res) => {
    const { title, content } = req.body;
    const date = new Date();
    const filePath = req.file ? req.file.path : null;
    const filename = filePath ? req.file.filename : null;

    posts.push({ title, content, date, filePath, filename });
    res.json({ success: true });
});

// 글 삭제
app.delete('/api/posts/:id', (req, res) => {
    const index = parseInt(req.params.id) - 1;
    const post = posts[index];

    if (post?.filePath) {
        const fullPath = path.join(__dirname, post.filePath);
        fs.unlink(fullPath, () => {});
    }

    posts.splice(index, 1);
    res.json({ success: true });
});

// 이미지 원본 제공
app.get('/images/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, 'public', 'uploads', filename);
    
    res.setHeader('Content-Type', 'image/jpeg');
    res.sendFile(filepath);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
