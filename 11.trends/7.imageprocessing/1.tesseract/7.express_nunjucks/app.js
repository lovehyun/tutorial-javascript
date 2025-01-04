const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');

const app = express();

// Nunjucks 설정
const nunjucks = require('nunjucks');
nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch: true,
    noCache: true, // 캐시 비활성화
});
app.set('view engine', 'html');

// Multer 설정 (이미지 업로드용)
const upload = multer({ dest: 'uploads/' });

// 정적 파일 제공
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 라우트 설정
app.get('/', (req, res) => {
    res.render('index'); // 업로드 폼
});

app.post('/upload', upload.single('image'), async (req, res) => {
    const { file } = req;

    if (!file) {
        return res.status(400).send('No image file uploaded.');
    }

    const filePath = path.join(__dirname, file.path);

    try {
        // Tesseract.js를 사용한 OCR 처리
        const {
            data: { text },
        } = await Tesseract.recognize(filePath, 'kor+eng', {
            logger: (info) => console.log(info), // OCR 진행 상황 로깅
        });

        // 업로드된 이미지와 OCR 결과를 렌더링
        res.render('result', {
            imageUrl: `/uploads/${file.filename}`,
            extractedText: text,
        });
    } catch (error) {
        console.error('OCR Error:', error);
        res.status(500).send('Failed to process the image.');
    } finally {
        // 임시 파일 삭제
        fs.unlink(filePath, (err) => {
            if (err) console.error('Failed to delete temporary file:', err);
        });
    }
});

// 서버 실행
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
