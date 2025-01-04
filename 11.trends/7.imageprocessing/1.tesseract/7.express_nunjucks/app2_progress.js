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
    res.render('index2'); // 업로드 폼
});

let currentProgress = 0;
let ocrResultText = "";
let isProcessing = false;

// SSE 진행률 전송 (GET 요청)
app.get('/progress', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const interval = setInterval(() => {
        res.write(`data: ${JSON.stringify({ progress: currentProgress, text: ocrResultText })}\n\n`);
        if (currentProgress === 1 && !isProcessing) {
            clearInterval(interval);
            res.end(); // 스트리밍 종료
        }
    }, 200); // 200 ms
});

app.post('/upload', upload.single('image'), async (req, res) => {
    const { file } = req;

    if (!file) {
        return res.status(400).send('No image file uploaded.');
    }

    const filePath = path.join(__dirname, file.path);

    // 상태 초기화
    currentProgress = 0;
    ocrResultText = "";
    isProcessing = true;

    try {
        await Tesseract.recognize(filePath, 'kor+eng', {
            logger: (info) => {
                if (info.status === 'recognizing text') {
                    console.log(`Progress: ${info.progress}`);
                    currentProgress = info.progress;
                }
            },
        }).then(({ data: { text } }) => {
            ocrResultText = text;
            currentProgress = 1;
        });
    } catch (error) {
        console.error('OCR Error:', error);
        ocrResultText = "Error processing image.";
        currentProgress = 1;
    } finally {
        fs.unlink(filePath, (err) => {
            if (err) console.error('Failed to delete temporary file:', err);
        });
        isProcessing = false;
    }
    res.redirect('/');  // OCR 완료 후 메인 페이지로 이동
});

// 서버 실행
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
